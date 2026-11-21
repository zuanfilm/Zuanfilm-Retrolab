from __future__ import annotations

import base64
import sys
import types
import unittest
from unittest.mock import patch

import torch

from zuanfilm_retrolab_test_package.core.grain import _normal_field, apply_film_grain
from zuanfilm_retrolab_test_package.preview import (
    _PREVIEW_CACHE,
    _VIDEO_CACHE,
    create_preview_cache,
    create_video_preview_cache,
    discard_video_preview_cache,
    discard_preview_cache,
    normalize_preview_settings,
    render_cached_preview,
    render_video_preview_frames,
    register_preview_routes,
)


class LivePreviewTests(unittest.TestCase):
    def setUp(self):
        torch.manual_seed(2026)
        h, w = 640, 800
        y = torch.linspace(0.0, 1.0, h).view(h, 1).expand(h, w)
        x = torch.linspace(0.0, 1.0, w).view(1, w).expand(h, w)
        self.image = torch.stack((x, y, 0.25 + 0.5 * x * y), dim=-1).unsqueeze(0)

    def test_preview_source_is_compact_and_grain_crop_is_native_240(self):
        token = create_preview_cache(self.image)
        try:
            entry = _PREVIEW_CACHE[token]
            self.assertEqual(max(entry["full"].shape[:2]), 512)
            self.assertEqual(entry["grain"]["size"], (240, 240))
            self.assertEqual(entry["full"].device.type, "cpu")
            self.assertEqual(entry["grain"]["image"].device.type, "cpu")
            self.assertLess(entry["grain"]["image"].numel(), 500 * 500 * 3)
        finally:
            discard_preview_cache(token)

    def test_live_preview_returns_full_and_native_grain_pngs(self):
        token = create_preview_cache(self.image)
        try:
            result = render_cached_preview(token, {
                "grain_amount": 0.7,
                "grain_size": 1.4,
                "color_grain": 0.3,
                "leak_seed": 42,
                "leak_color": "#D47A35",
                "halation_color": "#00FFCC",
                "halation_amount": 0.8,
                "leak_exposure": 1.0,
            })
            self.assertEqual(result["full_size"][0], 512)
            self.assertEqual(result["grain_size"], [240, 240])
            full_bytes = base64.b64decode(result["full_png"])
            original_bytes = base64.b64decode(result["original_png"])
            grain_bytes = base64.b64decode(result["grain_png"])
            self.assertTrue(full_bytes.startswith(b"\x89PNG\r\n\x1a\n"))
            self.assertTrue(original_bytes.startswith(b"\x89PNG\r\n\x1a\n"))
            self.assertTrue(grain_bytes.startswith(b"\x89PNG\r\n\x1a\n"))
            self.assertGreater(len(full_bytes), 1000)
            self.assertGreater(len(original_bytes), 1000)
            self.assertGreater(len(grain_bytes), 1000)
        finally:
            discard_preview_cache(token)

    def test_original_preview_png_can_be_omitted_after_frontend_caches_it(self):
        token = create_preview_cache(self.image)
        try:
            result = render_cached_preview(token, {}, include_original=False)
            self.assertIn("full_png", result)
            self.assertIn("grain_png", result)
            self.assertNotIn("original_png", result)
        finally:
            discard_preview_cache(token)


    def test_emulsion_updates_composition_preview_but_not_grain_detail(self):
        token = create_preview_cache(self.image)
        try:
            neutral = render_cached_preview(token, {"color_emulsion": "neutral", "grain_amount": 0.8})
            velvia = render_cached_preview(token, {"color_emulsion": "velvia_50", "grain_amount": 0.8})
            portra = render_cached_preview(token, {"color_emulsion": "portra_400", "grain_amount": 0.8})
            self.assertNotEqual(neutral["full_png"], velvia["full_png"])
            self.assertNotEqual(velvia["full_png"], portra["full_png"])
            self.assertEqual(neutral["grain_png"], velvia["grain_png"])
            self.assertEqual(velvia["grain_png"], portra["grain_png"])
        finally:
            discard_preview_cache(token)

    def test_white_balance_updates_composition_preview_not_grain_detail(self):
        token = create_preview_cache(self.image)
        try:
            neutral = render_cached_preview(token, {
                "white_balance_temperature": 0.0,
                "white_balance_tint": 0.0,
                "grain_amount": 0.8,
            })
            warm = render_cached_preview(token, {
                "white_balance_temperature": 0.65,
                "white_balance_tint": 0.0,
                "grain_amount": 0.8,
            })
            magenta = render_cached_preview(token, {
                "white_balance_temperature": 0.0,
                "white_balance_tint": 0.65,
                "grain_amount": 0.8,
            })
            self.assertNotEqual(neutral["full_png"], warm["full_png"])
            self.assertNotEqual(neutral["full_png"], magenta["full_png"])
            self.assertEqual(neutral["grain_png"], warm["grain_png"])
            self.assertEqual(neutral["grain_png"], magenta["grain_png"])
        finally:
            discard_preview_cache(token)

    def test_full_preview_updates_for_vignette_and_soft_focus(self):
        token = create_preview_cache(self.image)
        try:
            baseline = render_cached_preview(token, {})
            processed = render_cached_preview(token, {
                "soft_focus_amount": 0.8,
                "soft_focus_radius": 28.0,
                "vignette_amount": 0.9,
                "vignette_feather": 0.6,
            })
            self.assertNotEqual(processed["full_png"], baseline["full_png"])
            self.assertEqual(processed["grain_png"], baseline["grain_png"],
                             "Grain Detail remains an isolated Film Grain inspection")
            self.assertEqual(processed["full_size"], baseline["full_size"])
        finally:
            discard_preview_cache(token)

    def test_grain_preview_updates_with_grain_amount(self):
        token = create_preview_cache(self.image)
        try:
            base = render_cached_preview(token, {"grain_amount": 0.0, "leak_seed": 27})
            grain = render_cached_preview(token, {"grain_amount": 1.0, "leak_seed": 27})
            self.assertNotEqual(base["grain_png"], grain["grain_png"])
            self.assertEqual(base["full_png"], grain["full_png"],
                             "The reduced composition preview must bypass Film Grain")
            other_leak_seed = render_cached_preview(token, {"grain_amount": 1.0, "leak_seed": 904})
            self.assertEqual(grain["grain_png"], other_leak_seed["grain_png"],
                             "Leak Seed must not change the Film Grain pattern")
        finally:
            discard_preview_cache(token)

    def test_grain_size_and_color_grain_affect_only_native_detail_preview(self):
        token = create_preview_cache(self.image)
        try:
            reference = render_cached_preview(token, {
                "grain_amount": 0.9,
                "grain_size": 0.3,
                "color_grain": 0.09,
                "leak_seed": 27,
            })
            fine_color = render_cached_preview(token, {
                "grain_amount": 0.9,
                "grain_size": 0.1,
                "color_grain": 0.9,
                "leak_seed": 27,
            })
            self.assertEqual(
                reference["full_png"], fine_color["full_png"],
                "Composition preview must remain grain-free for every grain setting",
            )
            self.assertNotEqual(
                reference["grain_png"], fine_color["grain_png"],
                "Grain Size and Color Grain must remain visible in the dedicated detail preview",
            )
        finally:
            discard_preview_cache(token)


    def test_exposure_updates_composition_without_affecting_detail_crop(self):
        token = create_preview_cache(self.image)
        try:
            baseline = render_cached_preview(token, {
                "exposure": 0.0, "grain_amount": 0.0, "noise_amount": 0.0,
            })
            adjusted = render_cached_preview(token, {
                "exposure": 65.0, "grain_amount": 0.0, "noise_amount": 0.0,
            })
            self.assertNotEqual(baseline["full_png"], adjusted["full_png"])
            self.assertEqual(
                baseline["grain_png"], adjusted["grain_png"],
                "Exposure must not alter the source-scale Grain & Texture Detail crop",
            )
        finally:
            discard_preview_cache(token)

    def test_anti_ai_updates_composition_without_affecting_detail_crop(self):
        token = create_preview_cache(self.image)
        try:
            baseline = render_cached_preview(token, {"anti_ai": 0.0, "grain_amount": 0.0, "noise_amount": 0.0})
            corrected = render_cached_preview(token, {"anti_ai": 75.0, "grain_amount": 0.0, "noise_amount": 0.0})
            self.assertNotEqual(baseline["full_png"], corrected["full_png"])
            self.assertEqual(baseline["grain_png"], corrected["grain_png"])
        finally:
            discard_preview_cache(token)

    def test_procedural_texture_and_seed_change_detail_only(self):
        token = create_preview_cache(self.image)
        try:
            baseline = render_cached_preview(token, {"noise_amount": 0.0, "grain_amount": 0.0, "noise_seed": 73})
            texture_a = render_cached_preview(token, {"noise_texture": "Value fBm", "noise_amount": 0.85, "noise_seed": 73, "grain_amount": 0.0})
            texture_a_repeat = render_cached_preview(token, {"noise_texture": "Value fBm", "noise_amount": 0.85, "noise_seed": 73, "grain_amount": 0.0})
            texture_b = render_cached_preview(token, {"noise_texture": "Value fBm", "noise_amount": 0.85, "noise_seed": 74, "grain_amount": 0.0})
            self.assertEqual(baseline["full_png"], texture_a["full_png"], "Reduced composition preview must bypass Procedural Texture")
            self.assertEqual(texture_a["full_png"], texture_b["full_png"])
            self.assertNotEqual(baseline["grain_png"], texture_a["grain_png"], "Grain Detail should display Procedural Texture")
            self.assertEqual(texture_a["grain_png"], texture_a_repeat["grain_png"], "Noise Seed must be repeatable")
            self.assertNotEqual(texture_a["grain_png"], texture_b["grain_png"], "Noise Seed must select another texture realization")
            other_leak_seed = render_cached_preview(token, {"noise_texture": "Value fBm", "noise_amount": 0.85, "noise_seed": 73, "leak_seed": 991, "grain_amount": 0.0})
            self.assertEqual(texture_a["grain_png"], other_leak_seed["grain_png"], "Leak Seed must not alter Procedural Texture")
        finally:
            discard_preview_cache(token)

    def test_texture_blend_mode_changes_detail_crop_without_changing_composition(self):
        token = create_preview_cache(self.image)
        try:
            additive = render_cached_preview(token, {
                "noise_texture": "Emulsion Mottle", "noise_amount": 0.8,
                "noise_seed": 33, "noise_scale": 0.0, "noise_blend_mode": "Additive",
                "grain_amount": 0.0,
            })
            soft_light = render_cached_preview(token, {
                "noise_texture": "Emulsion Mottle", "noise_amount": 0.8,
                "noise_seed": 33, "noise_scale": 0.0, "noise_blend_mode": "Soft Light",
                "grain_amount": 0.0,
            })
            self.assertEqual(additive["full_png"], soft_light["full_png"])
            self.assertNotEqual(additive["grain_png"], soft_light["grain_png"])
        finally:
            discard_preview_cache(token)

    def test_procedural_texture_is_aligned_to_absolute_source_coordinates(self):
        from zuanfilm_retrolab_test_package.core.noise_texture import apply_noise_texture
        image = torch.full((520, 640, 3), 0.5, dtype=torch.float32)
        full = apply_noise_texture(image, texture="Gaussian", amount=0.8, seed=173, reference_dimensions=(520, 640))
        x0, y0 = 171, 133
        crop = apply_noise_texture(
            image[y0:y0 + 240, x0:x0 + 240], texture="Gaussian", amount=0.8, seed=173,
            reference_dimensions=(520, 640), coordinate_origin=(x0, y0),
        )
        # Normalization is crop-local, so compare the rank/pattern correlation
        # rather than exact values; absolute hash coordinates must still align.
        full_delta = full[y0:y0 + 240, x0:x0 + 240] - image[y0:y0 + 240, x0:x0 + 240]
        crop_delta = crop - image[y0:y0 + 240, x0:x0 + 240]
        correlation = torch.corrcoef(torch.stack((full_delta[..., 0].flatten(), crop_delta[..., 0].flatten())))[0, 1]
        self.assertGreater(float(correlation), 0.995)

    def test_expired_or_unknown_preview_token_is_reported(self):
        with self.assertRaises(KeyError):
            render_cached_preview("0" * 32, {})

    def test_preview_settings_are_clamped_and_safe(self):
        settings = normalize_preview_settings({
            "grain_amount": float("nan"),
            "leak_exposure": 99,
            "leak_radius": -10,
            "leak_mode": "Mechanical Marks",
            "leak_color": "bad-color",
            "leak_seed": -5,
            "bloom_amount": 9.0,
            "halation_color": "not-a-color",
            "soft_focus_amount": 8.0,
            "soft_focus_radius": 120.0,
            "vignette_amount": 9.0,
            "grain_size": 0.05,
            "vignette_feather": 2.0,
            "color_emulsion": "not-a-real-profile",
            "white_balance_temperature": 9.0,
            "white_balance_tint": -9.0,
            "anti_ai": 140.0,
            "exposure": 140.0,
            "noise_amount": 9.0,
            "noise_seed": 1200,
            "noise_scale": 99.0,
            "noise_texture": "Not a texture",
            "noise_blend_mode": "Not a blend mode",
            "emulsion_response": 99.0,
        })
        self.assertEqual(settings.grain_amount, 0.0)
        self.assertEqual(settings.leak_exposure, 10.0)
        self.assertEqual(settings.leak_radius, 0.25)
        self.assertEqual(settings.leak_mode, "Soft Edge")
        self.assertEqual(normalize_preview_settings({}).leak_position, "Bottom")
        self.assertEqual(normalize_preview_settings({}).color_emulsion, "neutral")
        self.assertEqual(normalize_preview_settings({}).white_balance_temperature, 0.0)
        self.assertEqual(normalize_preview_settings({}).white_balance_tint, 0.0)
        self.assertEqual(normalize_preview_settings({"color_emulsion": "velvia_50"}).color_emulsion, "velvia_50")
        self.assertEqual(settings.leak_color, "#C2AF8E")
        self.assertEqual(settings.halation_color, "#FF9959")
        self.assertEqual(settings.bloom_amount, 3.0)
        self.assertEqual(settings.bloom_threshold, 0.1)
        self.assertEqual(settings.leak_seed, 0)
        self.assertEqual(settings.soft_focus_amount, 1.0)
        self.assertEqual(settings.soft_focus_radius, 80.0)
        self.assertEqual(settings.vignette_amount, 2.0)
        self.assertEqual(settings.grain_size, 0.1)
        self.assertEqual(settings.vignette_feather, 1.0)
        self.assertEqual(settings.color_emulsion, "neutral")
        self.assertEqual(settings.white_balance_temperature, 1.0)
        self.assertEqual(settings.white_balance_tint, -1.0)
        self.assertEqual(settings.anti_ai, 100.0)
        self.assertEqual(settings.exposure, 100.0)
        self.assertEqual(normalize_preview_settings({"exposure": -999.0}).exposure, -100.0)
        self.assertEqual(normalize_preview_settings({}).exposure, 0.0)
        self.assertEqual(settings.noise_amount, 2.0)
        self.assertEqual(settings.noise_seed, 999)
        self.assertEqual(settings.noise_scale, 4.0)
        self.assertEqual(settings.noise_texture, "Gaussian")
        self.assertEqual(settings.noise_blend_mode, "Additive")
        self.assertEqual(settings.emulsion_response, 3.0)
        self.assertEqual(normalize_preview_settings({}).emulsion_response, 1.0)
        self.assertEqual(normalize_preview_settings({"emulsion_response": 0.1}).emulsion_response, 0.5)
        self.assertEqual(normalize_preview_settings({"emulsion_response": float("nan")}).emulsion_response, 1.0)
        self.assertEqual(normalize_preview_settings({"noise_scale": 0.0}).noise_scale, 0.0)
        self.assertEqual(normalize_preview_settings({"noise_blend_mode": "Screen"}).noise_blend_mode, "Screen")



    def test_preview_noise_amount_supports_the_expanded_two_point_maximum(self):
        one = normalize_preview_settings({"noise_amount": 1.0})
        two = normalize_preview_settings({"noise_amount": 2.0})
        overflow = normalize_preview_settings({"noise_amount": 8.0})
        self.assertEqual(one.noise_amount, 1.0)
        self.assertEqual(two.noise_amount, 2.0)
        self.assertEqual(overflow.noise_amount, 2.0)

    def test_preview_emulsion_response_scales_composition_and_detail_preview(self):
        token = create_preview_cache(self.image)
        try:
            subtle = render_cached_preview(token, {
                "color_emulsion": "portra_400", "emulsion_response": 0.5,
                "grain_amount": 1.0, "noise_amount": 0.0,
            })
            expressive = render_cached_preview(token, {
                "color_emulsion": "portra_400", "emulsion_response": 2.5,
                "grain_amount": 1.0, "noise_amount": 0.0,
            })
            self.assertNotEqual(subtle["full_png"], expressive["full_png"])
            # The separate Grain & Texture detail crop intentionally bypasses
            # the composition/emulsion stages and remains independent.
            self.assertEqual(subtle["grain_png"], expressive["grain_png"])
        finally:
            discard_preview_cache(token)

    def test_preview_grain_blend_mode_is_normalized(self):
        self.assertEqual(normalize_preview_settings({"grain_blend_mode": "Screen"}).grain_blend_mode, "Screen")
        self.assertEqual(normalize_preview_settings({"grain_blend_mode": "invalid"}).grain_blend_mode, "Additive")

    def test_grain_blend_mode_changes_detail_crop_without_changing_composition(self):
        token = create_preview_cache(self.image)
        try:
            additive = render_cached_preview(token, {
                "grain_amount": 2.0, "grain_size": 0.8, "color_grain": 0.35,
                "grain_blend_mode": "Additive", "noise_amount": 0.0,
            })
            screen = render_cached_preview(token, {
                "grain_amount": 2.0, "grain_size": 0.8, "color_grain": 0.35,
                "grain_blend_mode": "Screen", "noise_amount": 0.0,
            })
            self.assertEqual(additive["full_png"], screen["full_png"])
            self.assertNotEqual(additive["grain_png"], screen["grain_png"])
        finally:
            discard_preview_cache(token)

    def test_preview_grain_amount_supports_three_and_clamps_above_it(self):
        settings = normalize_preview_settings({"grain_amount": 99.0})
        self.assertEqual(settings.grain_amount, 3.0)

    def test_counter_noise_uses_full_frame_pixel_coordinates(self):
        full = _normal_field(600, 800, 777, 99, torch.device("cpu"))
        crop = _normal_field(240, 240, 777, 99, torch.device("cpu"), origin_x=280, origin_y=180)
        self.assertTrue(torch.equal(full[180:420, 280:520], crop))


    def test_comfy_server_preview_routes_register_once(self):
        class FakeRoutes:
            def __init__(self):
                self.paths = []
            def post(self, path):
                self.paths.append(("POST", path))
                return lambda function: function
            def delete(self, path):
                self.paths.append(("DELETE", path))
                return lambda function: function
        class FakePromptServer:
            instance = types.SimpleNamespace(routes=FakeRoutes())
        server_module = types.ModuleType("server")
        server_module.PromptServer = FakePromptServer
        with patch.dict(sys.modules, {"server": server_module}):
            self.assertTrue(register_preview_routes())
            self.assertFalse(register_preview_routes())
        self.assertIn(("POST", "/retrolab/preview"), FakePromptServer.instance.routes.paths)
        self.assertIn(("DELETE", "/retrolab/preview/{token}"), FakePromptServer.instance.routes.paths)
        self.assertIn(("POST", "/retrolab/video_preview"), FakePromptServer.instance.routes.paths)
        self.assertIn(("DELETE", "/retrolab/video_preview/{token}"), FakePromptServer.instance.routes.paths)

    def test_video_preview_keeps_compact_uint8_proxy_and_samples_long_clips(self):
        clip = self.image.expand(500, -1, -1, -1)
        token = create_video_preview_cache(clip)
        try:
            frames = _VIDEO_CACHE[token]["frames"]
            self.assertEqual(frames.dtype, torch.uint8)
            self.assertEqual(tuple(frames.shape), (167, 307, 384, 3))
            result = render_video_preview_frames(token, {"grain_amount": 1.0, "vignette_amount": 0.5}, [0, 3, 3, 999, "x"], include_original=True)
            self.assertEqual([frame["index"] for frame in result["frames"]], [0, 3])
            self.assertEqual(result["frame_count"], 167)
            self.assertEqual(result["frame_stride"], 3)
            self.assertEqual(result["source_frame_count"], 500)
            self.assertEqual(result["source_size"], [800, 640])
            self.assertTrue(base64.b64decode(result["frames"][0]["jpg"]).startswith(b"\xff\xd8"))
            self.assertIn("original_jpg", result["frames"][1])
            # Grain follows the source batch index, so sampled frames differ.
            self.assertNotEqual(result["frames"][0]["jpg"], result["frames"][1]["jpg"])
        finally:
            discard_video_preview_cache(token)
        with self.assertRaises(KeyError):
            render_video_preview_frames(token, {}, [0])

    def test_native_crop_grain_is_spatially_aligned_to_full_frame(self):
        settings = dict(amount=0.8, grain_size=1.4, color_grain=0.4, seed=55)
        full_output = apply_film_grain(self.image[0], **settings)
        y0, x0 = 200, 280
        # Include a blur context so the selected 240x240 output region does not
        # depend on artificial crop boundaries.
        context = self.image[0, y0 - 8:y0 + 248, x0 - 8:x0 + 248]
        context_output = apply_film_grain(
            context,
            **settings,
            reference_dimensions=(640, 800),
            coordinate_origin=(x0 - 8, y0 - 8),
        )
        aligned = context_output[8:248, 8:248]
        target = full_output[y0:y0 + 240, x0:x0 + 240]
        # Per-crop grain normalization can produce a tiny amplitude change, but
        # the deterministic pixel-coordinate pattern remains registered.
        self.assertGreater(float(torch.corrcoef(torch.stack((aligned.flatten(), target.flatten())))[0, 1]), 0.995)


if __name__ == "__main__":
    unittest.main()
