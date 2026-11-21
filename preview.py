"""Low-memory live-preview cache and ComfyUI HTTP endpoints.

The full-resolution node output is never routed through this module. During a
normal node execution we retain only (1) a 512 px composition proxy and (2) a
small native-resolution centre crop with enough context for the grain blur.
Interactive requests render those cached CPU tensors and return PNG data URLs.
"""

from __future__ import annotations

import asyncio
import base64
import io
import math
import threading
import time
import uuid
from collections import OrderedDict
from dataclasses import fields
from typing import Any

import torch
import torch.nn.functional as F

from .core.blending import normalize_blend_mode
from .core.grain import apply_film_grain
from .core.emulsions import normalize_emulsion_id
from .core.halation import normalize_halation_color
from .core.light_leak import LEAK_MODES, POSITIONS, normalize_hex_color
from .core.pipeline import DEFAULT_GRAIN_SEED, RetroLabSettings, process_single_image
from .core.noise_texture import NOISE_TEXTURES, apply_noise_texture, normalize_noise_texture, normalize_noise_blend_mode

_PREVIEW_CACHE: OrderedDict[str, dict[str, Any]] = OrderedDict()
_CACHE_LOCK = threading.RLock()
_CACHE_MAX_ENTRIES = 6
_CACHE_TTL_SECONDS = 30 * 60
_FULL_PREVIEW_LONG_EDGE = 512
_GRAIN_CROP_SIZE = 240
# Video previews keep only a uint8 CPU proxy of up to 240 sampled frames, so a
# 1080p clip costs roughly 240 x 384 x 216 x 3 bytes (~60 MB) regardless of length.
_VIDEO_CACHE: OrderedDict[str, dict[str, Any]] = OrderedDict()
_VIDEO_CACHE_MAX_ENTRIES = 2
_VIDEO_PREVIEW_LONG_EDGE = 384
_VIDEO_PREVIEW_MAX_FRAMES = 240
_VIDEO_FRAMES_PER_REQUEST = 8

# Public node controls and safe limits. Keeping this table here ensures the
# preview endpoint clamps values independently of frontend-side validation.
_NUMERIC_LIMITS = {
    "grain_amount": (0.0, 3.0),
    "grain_size": (0.1, 4.0),
    "color_grain": (0.0, 1.0),
    "halation_amount": (0.0, 2.0),
    "ring_radius": (3.0, 60.0),
    "bloom_amount": (0.0, 3.0),
    "bloom_threshold": (0.0, 0.98),
    "bloom_radius": (1.0, 40.0),
    "solarization": (0.0, 1.0),
    "highlight_confinement": (0.0, 1.0),
    "mackie_lines": (0.0, 1.0),
    "leak_exposure": (0.0, 10.0),
    "leak_radius": (0.25, 10.0),
    "soft_focus_amount": (0.0, 1.0),
    "soft_focus_radius": (1.0, 80.0),
    "vignette_amount": (0.0, 2.0),
    "vignette_feather": (0.0, 1.0),
    "white_balance_temperature": (-1.0, 1.0),
    "white_balance_tint": (-1.0, 1.0),
    "anti_ai": (0.0, 100.0),
    "exposure": (-100.0, 100.0),
    "noise_amount": (0.0, 2.0),
    "noise_scale": (0.0, 4.0),
    "emulsion_response": (0.5, 3.0),
}


def _as_finite_float(value: Any, default: float, low: float, high: float) -> float:
    try:
        result = float(value)
    except (TypeError, ValueError, OverflowError):
        return default
    if not math.isfinite(result):
        return default
    return min(max(result, low), high)


def normalize_preview_settings(payload: dict[str, Any] | None) -> RetroLabSettings:
    """Validate and normalize browser-supplied effect controls."""
    payload = payload if isinstance(payload, dict) else {}
    defaults = RetroLabSettings()
    values: dict[str, Any] = {}
    valid_fields = {item.name for item in fields(RetroLabSettings)}
    for name in valid_fields:
        if name in _NUMERIC_LIMITS:
            low, high = _NUMERIC_LIMITS[name]
            values[name] = _as_finite_float(payload.get(name, getattr(defaults, name)), getattr(defaults, name), low, high)
        elif name == "leak_mode":
            candidate = str(payload.get(name, defaults.leak_mode))
            values[name] = ("Holga 135" if candidate == "135 Sprocket" else candidate) if (candidate == "135 Sprocket" or candidate in LEAK_MODES) else defaults.leak_mode
        elif name == "leak_position":
            candidate = str(payload.get(name, defaults.leak_position))
            values[name] = candidate if candidate in POSITIONS else defaults.leak_position
        elif name in ("leak_color", "halation_color"):
            candidate = payload.get(name, getattr(defaults, name))
            if name == "halation_color":
                values[name] = normalize_halation_color(candidate)
            else:
                values[name] = normalize_hex_color(candidate)
        elif name == "noise_texture":
            values[name] = normalize_noise_texture(payload.get(name, defaults.noise_texture))
        elif name == "noise_blend_mode":
            values[name] = normalize_noise_blend_mode(payload.get(name, defaults.noise_blend_mode))
        elif name == "grain_blend_mode":
            values[name] = normalize_blend_mode(payload.get(name, defaults.grain_blend_mode))
        elif name == "noise_seed":
            try:
                seed = int(payload.get(name, defaults.noise_seed))
            except (TypeError, ValueError, OverflowError):
                seed = defaults.noise_seed
            values[name] = min(max(seed, 0), 999)
        elif name == "color_emulsion":
            values[name] = normalize_emulsion_id(payload.get(name, defaults.color_emulsion))
        elif name == "leak_seed":
            try:
                seed = int(payload.get(name, defaults.leak_seed))
            except (TypeError, ValueError, OverflowError):
                seed = defaults.leak_seed
            values[name] = min(max(seed, 0), 999)
    return RetroLabSettings(**values)


def _center_crop_context(image: torch.Tensor, full_height: int, full_width: int) -> dict[str, Any]:
    """Extract a native 240 px centre crop plus maximum-grain blur context.

    Only this small window is copied to CPU. The original full-resolution frame
    is never retained in the preview cache or copied wholesale to host memory.
    """
    height, width = image.shape[:2]
    crop_h = min(_GRAIN_CROP_SIZE, height)
    crop_w = min(_GRAIN_CROP_SIZE, width)
    core_y = max(0, (height - crop_h) // 2)
    core_x = max(0, (width - crop_w) // 2)

    # Grain sigma = grain_size * long_edge / 2048. The context margin covers
    # 3 sigma at the maximum supported grain_size (4.0), plus two guard pixels.
    sigma_max = 4.0 * max(full_height, full_width) / 2048.0
    halo = int(math.ceil(3.0 * sigma_max)) + 2
    context_y0 = max(0, core_y - halo)
    context_x0 = max(0, core_x - halo)
    context_y1 = min(height, core_y + crop_h + halo)
    context_x1 = min(width, core_x + crop_w + halo)
    context_image = image[context_y0:context_y1, context_x0:context_x1]
    context_image = context_image.detach().to(device="cpu", dtype=torch.float32).contiguous()

    return {
        "image": context_image,
        "origin": (context_x0, context_y0),
        "crop": (
            core_y - context_y0,
            core_y - context_y0 + crop_h,
            core_x - context_x0,
            core_x - context_x0 + crop_w,
        ),
        "size": (crop_h, crop_w),
    }


def create_preview_cache(images: torch.Tensor) -> str:
    """Cache a compact composition proxy and native-resolution grain context.

    Only the first frame is used for the interactive preview. The full batch
    still flows through the original processing pipeline unchanged.
    """
    if not isinstance(images, torch.Tensor) or images.ndim != 4 or images.shape[-1] < 3:
        raise ValueError("Live Preview requires an IMAGE tensor shaped (B,H,W,C)")
    if images.shape[0] < 1:
        raise ValueError("Live Preview cannot cache an empty image batch")

    source = images[0, ..., :3].detach()
    full_height, full_width = int(source.shape[0]), int(source.shape[1])
    scale = min(1.0, _FULL_PREVIEW_LONG_EDGE / float(max(full_height, full_width)))
    preview_h = max(1, int(round(full_height * scale)))
    preview_w = max(1, int(round(full_width * scale)))
    preview_nchw = source.to(dtype=torch.float32).permute(2, 0, 1).unsqueeze(0)
    if (preview_h, preview_w) != (full_height, full_width):
        preview_nchw = F.interpolate(preview_nchw, size=(preview_h, preview_w), mode="area")
    full_preview = preview_nchw[0].permute(1, 2, 0).clamp(0.0, 1.0).to(device="cpu").contiguous()
    grain_context = _center_crop_context(source, full_height, full_width)

    token = uuid.uuid4().hex
    now = time.monotonic()
    with _CACHE_LOCK:
        expired = [key for key, value in _PREVIEW_CACHE.items() if now - value["created"] > _CACHE_TTL_SECONDS]
        for key in expired:
            _PREVIEW_CACHE.pop(key, None)
        _PREVIEW_CACHE[token] = {
            "created": now,
            "full": full_preview,
            "grain": grain_context,
            "dimensions": (full_height, full_width),
        }
        _PREVIEW_CACHE.move_to_end(token)
        while len(_PREVIEW_CACHE) > _CACHE_MAX_ENTRIES:
            _PREVIEW_CACHE.popitem(last=False)
    return token


def discard_preview_cache(token: str) -> None:
    with _CACHE_LOCK:
        _PREVIEW_CACHE.pop(str(token), None)


def create_video_preview_cache(images: torch.Tensor) -> str:
    """Cache a small uint8 proxy of the clip for scrubbing and playback.

    Frames are downsampled one at a time, so peak extra memory is a single
    float proxy frame on the source device plus the compact uint8 CPU stack.
    """
    if not isinstance(images, torch.Tensor) or images.ndim != 4 or images.shape[-1] < 3:
        raise ValueError("Video Preview requires an IMAGE tensor shaped (B,H,W,C)")
    total = int(images.shape[0])
    if total < 1:
        raise ValueError("Video Preview cannot cache an empty image batch")

    full_height, full_width = int(images.shape[1]), int(images.shape[2])
    scale = min(1.0, _VIDEO_PREVIEW_LONG_EDGE / float(max(full_height, full_width)))
    preview_h = max(1, int(round(full_height * scale)))
    preview_w = max(1, int(round(full_width * scale)))
    stride = max(1, math.ceil(total / _VIDEO_PREVIEW_MAX_FRAMES))
    source_indices = list(range(0, total, stride))

    frames = torch.empty((len(source_indices), preview_h, preview_w, 3), dtype=torch.uint8)
    for slot, source_index in enumerate(source_indices):
        frame = images[source_index, ..., :3].detach().to(dtype=torch.float32).permute(2, 0, 1).unsqueeze(0)
        if (preview_h, preview_w) != (full_height, full_width):
            frame = F.interpolate(frame, size=(preview_h, preview_w), mode="area")
        frames[slot].copy_((frame[0].permute(1, 2, 0).clamp(0.0, 1.0) * 255.0).round().to(device="cpu", dtype=torch.uint8))

    token = uuid.uuid4().hex
    now = time.monotonic()
    with _CACHE_LOCK:
        expired = [key for key, value in _VIDEO_CACHE.items() if now - value["created"] > _CACHE_TTL_SECONDS]
        for key in expired:
            _VIDEO_CACHE.pop(key, None)
        _VIDEO_CACHE[token] = {
            "created": now,
            "frames": frames,
            "source_indices": source_indices,
            "source_frame_count": total,
            "dimensions": (full_height, full_width),
        }
        while len(_VIDEO_CACHE) > _VIDEO_CACHE_MAX_ENTRIES:
            _VIDEO_CACHE.popitem(last=False)
    return token


def discard_video_preview_cache(token: str) -> None:
    with _CACHE_LOCK:
        _VIDEO_CACHE.pop(str(token), None)


def _get_preview_entry(token: str) -> dict[str, Any] | None:
    now = time.monotonic()
    with _CACHE_LOCK:
        entry = _PREVIEW_CACHE.get(str(token))
        if entry is None:
            return None
        if now - entry["created"] > _CACHE_TTL_SECONDS:
            _PREVIEW_CACHE.pop(str(token), None)
            return None
        _PREVIEW_CACHE.move_to_end(str(token))
        return entry


def _encode_png(rgb: torch.Tensor) -> str:
    """Encode an HWC float tensor as a base64 PNG without a new dependency."""
    from PIL import Image

    tensor = rgb.detach().to(device="cpu", dtype=torch.float32).clamp(0.0, 1.0)
    array = (tensor * 255.0).round().to(torch.uint8).contiguous().numpy()
    buffer = io.BytesIO()
    Image.fromarray(array, mode="RGB").save(buffer, format="PNG", optimize=False)
    return base64.b64encode(buffer.getvalue()).decode("ascii")


def _encode_jpeg(rgb_uint8: torch.Tensor) -> str:
    from PIL import Image

    buffer = io.BytesIO()
    Image.fromarray(rgb_uint8.contiguous().numpy(), mode="RGB").save(buffer, format="JPEG", quality=88)
    return base64.b64encode(buffer.getvalue()).decode("ascii")


@torch.no_grad()
def render_video_preview_frames(
    token: str,
    payload: dict[str, Any] | None,
    frame_indices: list[Any],
    *,
    include_original: bool = False,
) -> dict[str, Any]:
    """Render a few proxy frames of a cached clip with the full finishing chain.

    Grain and texture are included so the preview shows their frame-to-frame
    motion; each frame keeps its source batch index for deterministic grain.
    """
    now = time.monotonic()
    with _CACHE_LOCK:
        entry = _VIDEO_CACHE.get(str(token))
        if entry is not None and now - entry["created"] > _CACHE_TTL_SECONDS:
            _VIDEO_CACHE.pop(str(token), None)
            entry = None
    if entry is None:
        raise KeyError("Video preview expired. Queue Zuanfilm Retrolab Video once to refresh its preview source.")

    settings = normalize_preview_settings(payload)
    frames = entry["frames"]
    count = int(frames.shape[0])
    requested = []
    for value in frame_indices if isinstance(frame_indices, list) else []:
        try:
            index = int(value)
        except (TypeError, ValueError, OverflowError):
            continue
        if 0 <= index < count and index not in requested:
            requested.append(index)
        if len(requested) >= _VIDEO_FRAMES_PER_REQUEST:
            break

    rendered = []
    for index in requested:
        source = frames[index]
        processed = process_single_image(source.to(torch.float32) / 255.0, settings, frame_index=entry["source_indices"][index])
        item = {"index": index, "jpg": _encode_jpeg((processed.clamp(0.0, 1.0) * 255.0).round().to(torch.uint8))}
        if include_original:
            item["original_jpg"] = _encode_jpeg(source)
        rendered.append(item)

    return {
        "frames": rendered,
        "frame_count": count,
        "frame_stride": entry["source_indices"][1] if count > 1 else 1,
        "source_frame_count": entry["source_frame_count"],
        "size": [int(frames.shape[2]), int(frames.shape[1])],
        "source_size": [int(entry["dimensions"][1]), int(entry["dimensions"][0])],
    }


@torch.no_grad()
def render_cached_preview(
    token: str,
    payload: dict[str, Any] | None,
    *,
    include_original: bool = True,
) -> dict[str, Any]:
    """Render processed composition and native-centre grain previews on CPU.

    ``include_original`` returns the untouched, downsampled input once for the
    frontend Before/After selector. The browser keeps that compact PNG for the
    lifetime of the current preview token, so subsequent slider updates do not
    repeatedly transfer the same source image.
    """
    entry = _get_preview_entry(token)
    if entry is None:
        raise KeyError("Preview expired. Queue Zuanfilm Retrolab once to refresh its preview source.")

    settings = normalize_preview_settings(payload)
    full = process_single_image(entry["full"], settings, frame_index=0, include_grain=False, include_texture=False)

    grain_data = entry["grain"]
    detail_base = grain_data["image"]
    if settings.noise_amount > 0.0:
        detail_base = apply_noise_texture(
            detail_base, texture=settings.noise_texture, amount=settings.noise_amount,
            seed=settings.noise_seed, scale=settings.noise_scale, blend_mode=settings.noise_blend_mode,
            reference_dimensions=entry["dimensions"],
            coordinate_origin=grain_data["origin"], frame_index=0,
        )
    crop_settings = apply_film_grain(
        detail_base,
        amount=settings.grain_amount,
        grain_size=settings.grain_size,
        color_grain=settings.color_grain,
        seed=DEFAULT_GRAIN_SEED,
        blend_mode=settings.grain_blend_mode,
        reference_dimensions=entry["dimensions"],
        coordinate_origin=grain_data["origin"],
    )
    y0, y1, x0, x1 = grain_data["crop"]
    grain_detail = crop_settings[y0:y1, x0:x1].contiguous()

    result = {
        "full_png": _encode_png(full),
        "grain_png": _encode_png(grain_detail),
        "full_size": [int(full.shape[1]), int(full.shape[0])],
        "grain_size": [int(grain_detail.shape[1]), int(grain_detail.shape[0])],
        "source_size": [int(entry["dimensions"][1]), int(entry["dimensions"][0])],
    }
    if include_original:
        result["original_png"] = _encode_png(entry["full"])
    return result


def register_preview_routes() -> bool:
    """Register preview endpoints when imported inside a ComfyUI server."""
    try:
        from aiohttp import web
        from server import PromptServer

        prompt_server = PromptServer.instance
        if prompt_server is None or getattr(prompt_server, "_retrolab_preview_routes_registered", False):
            return False

        @prompt_server.routes.post("/retrolab/preview")
        async def retrolab_render_preview(request):
            try:
                payload = await request.json()
                token = payload.get("token", "") if isinstance(payload, dict) else ""
                settings = payload.get("settings", {}) if isinstance(payload, dict) else {}
                include_original = payload.get("include_original") is True if isinstance(payload, dict) else False
                if not isinstance(token, str) or len(token) != 32:
                    return web.json_response({"error": "Invalid preview token."}, status=400)
                result = await asyncio.to_thread(
                    render_cached_preview, token, settings, include_original=include_original
                )
                return web.json_response(result)
            except KeyError as exc:
                return web.json_response({"error": str(exc).strip("'")}, status=404)
            except Exception as exc:
                return web.json_response({"error": f"Preview render failed: {type(exc).__name__}: {exc}"}, status=500)

        @prompt_server.routes.delete("/retrolab/preview/{token}")
        async def retrolab_discard_preview(request):
            token = request.match_info.get("token", "")
            discard_preview_cache(token)
            return web.json_response({"ok": True})

        @prompt_server.routes.post("/retrolab/video_preview")
        async def retrolab_render_video_preview(request):
            try:
                payload = await request.json()
                if not isinstance(payload, dict):
                    return web.json_response({"error": "Invalid video preview request."}, status=400)
                token = payload.get("token", "")
                if not isinstance(token, str) or len(token) != 32:
                    return web.json_response({"error": "Invalid preview token."}, status=400)
                result = await asyncio.to_thread(
                    render_video_preview_frames, token, payload.get("settings", {}), payload.get("frames", []),
                    include_original=payload.get("include_original") is True,
                )
                return web.json_response(result)
            except KeyError as exc:
                return web.json_response({"error": str(exc).strip("'")}, status=404)
            except Exception as exc:
                return web.json_response({"error": f"Video preview render failed: {type(exc).__name__}: {exc}"}, status=500)

        @prompt_server.routes.delete("/retrolab/video_preview/{token}")
        async def retrolab_discard_video_preview(request):
            discard_video_preview_cache(request.match_info.get("token", ""))
            return web.json_response({"ok": True})

        prompt_server._retrolab_preview_routes_registered = True
        return True
    except (ImportError, AttributeError):
        # Importing the package in tests or outside ComfyUI is intentionally safe.
        return False
