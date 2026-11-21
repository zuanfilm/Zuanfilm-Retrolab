"""ComfyUI node: Zuanfilm Retrolab."""

from __future__ import annotations

from ..core.halation import DEFAULT_HALATION_COLOR, normalize_halation_color
from ..core.emulsions import EMULSION_CHOICES, normalize_emulsion_id, normalize_emulsion_response
from ..core.light_leak import LEAK_MODES, POSITIONS, normalize_hex_color
from ..core.pipeline import RetroLabSettings, process_batch_with_report
from ..core.noise_texture import NOISE_TEXTURES, NOISE_BLEND_MODES, normalize_noise_texture
from ..preview import create_preview_cache, create_video_preview_cache, register_preview_routes


class ZuanfilmRetroLab:
    """Compact post-decode RGB photographic finishing node."""

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "image": ("IMAGE",),
                # 01 — Film Grain (3 creative controls)
                "grain_amount": ("FLOAT", {"display": "slider", "default": 0.0, "min": 0.0, "max": 3.0, "step": 0.01, "tooltip": "Amount of photographic grain. 0 bypasses grain exactly."}),
                "grain_size": ("FLOAT", {"display": "slider", "default": 0.3, "min": 0.1, "max": 4.0, "step": 0.05, "tooltip": "Grain correlation radius in reference pixels at a 1024-pixel long edge. Lower values create finer, less-correlated grain."}),
                "color_grain": ("FLOAT", {"display": "slider", "default": 0.09, "min": 0.0, "max": 1.0, "step": 0.01, "tooltip": "0 = shared luminance grain; 1 = independent RGB grain."}),
                # 02 — Halation (amount range doubled to 0–2)
                "halation_amount": ("FLOAT", {"display": "slider", "default": 0.0, "min": 0.0, "max": 2.0, "step": 0.01, "tooltip": "Strength of annular film-base halation; range doubled for stronger effects."}),
                "ring_radius": ("FLOAT", {"display": "slider", "default": 8.0, "min": 3.0, "max": 60.0, "step": 0.5, "tooltip": "TIR ring radius in reference pixels at a 1024-pixel long edge."}),
                # 03 — Bloom (expanded amount range 0–3)
                "bloom_amount": ("FLOAT", {"display": "slider", "default": 0.0, "min": 0.0, "max": 3.0, "step": 0.01, "tooltip": "Amount of optical highlight bloom. The expanded 0–3 range provides additional creative headroom."}),
                "bloom_threshold": ("FLOAT", {"display": "slider", "default": 0.1, "min": 0.0, "max": 0.98, "step": 0.01, "tooltip": "Linear luminance level where bloom extraction begins. 0 includes the broadest tonal range."}),
                "bloom_radius": ("FLOAT", {"display": "slider", "default": 8.0, "min": 1.0, "max": 40.0, "step": 0.5, "tooltip": "Bloom core radius in reference pixels at a 1024-pixel long edge."}),
                # 04 — Sabattier (3 creative controls)
                "solarization": ("FLOAT", {"display": "slider", "default": 0.0, "min": 0.0, "max": 1.0, "step": 0.01, "tooltip": "Depth of the Sabattier highlight reversal. 0 bypasses the tone fold."}),
                "highlight_confinement": ("FLOAT", {"display": "slider", "default": 0.09, "min": 0.0, "max": 1.0, "step": 0.01, "tooltip": "Low values spread reversal into midtones; high values confine it to highlights."}),
                "mackie_lines": ("FLOAT", {"display": "slider", "default": 0.0, "min": 0.0, "max": 1.0, "step": 0.01, "tooltip": "Strength of the asymmetric bright / dark contour lines."}),
                # 05 — Light Leak (five characters; expanded 0–10 exposure and influence radius)
                "leak_mode": (LEAK_MODES, {"default": "Soft Edge", "tooltip": "Soft Edge, First-Frame Burn, 120 Fat Roll, Light Piping or Holga 135."}),
                "leak_position": (POSITIONS, {"default": "Bottom", "tooltip": "Select the edge or corner where the light enters. Holga 135 corner positions resolve to the corresponding film edge."}),
                "leak_exposure": ("FLOAT", {"display": "slider", "default": 0.0, "min": 0.0, "max": 10.0, "step": 0.01, "precision": 2, "tooltip": "Additional exposure from the leak. The 0–10 slider remains visibly filled across its full range, including at the maximum."}),
                # Deterministic seed for procedural Light Leak geometry only.
                "leak_seed": ("INT", {"display": "slider", "default": 27, "min": 0, "max": 999, "step": 1, "tooltip": "Changes the deterministic Light Leak pattern. It does not affect Procedural Texture or Film Grain."}),
                # Append-only additions: do not insert before existing widgets (workflow widgets serialize by order).
                "leak_color": ("STRING", {"default": "#C2AF8E", "multiline": False, "tooltip": "Incident light color. Use the color picker in the ComfyUI frontend."}),
                "leak_radius": ("FLOAT", {"display": "slider", "default": 1.0, "min": 0.25, "max": 10.0, "step": 0.01, "tooltip": "Inward influence radius multiplier. 1.0 preserves the established footprint; higher values spread the leak farther across the image, up to border-to-border at 10.0."}),
                # Append-only addition: preserves every pre-existing saved widget index.
                "halation_color": ("STRING", {"default": DEFAULT_HALATION_COLOR, "multiline": False, "tooltip": "Halation emission color. The default preserves the original red-dominant channel response."}),
                # Append-only optical finish controls. Existing saved widget indices remain unchanged.
                "soft_focus_amount": ("FLOAT", {"display": "slider", "default": 0.0, "min": 0.0, "max": 1.0, "step": 0.01, "tooltip": "Progressively blend optical blur toward the corners while preserving the center."}),
                "soft_focus_radius": ("FLOAT", {"display": "slider", "default": 24.0, "min": 1.0, "max": 80.0, "step": 0.5, "tooltip": "Maximum Gaussian blur radius at the corners, in reference pixels at a 1024-pixel long edge."}),
                "vignette_amount": ("FLOAT", {"display": "slider", "default": 0.0, "min": 0.0, "max": 2.0, "step": 0.01, "tooltip": "Radial exposure falloff, reaching up to 3 stops of darkening at the corners."}),
                "vignette_feather": ("FLOAT", {"display": "slider", "default": 0.65, "min": 0.0, "max": 1.0, "step": 0.01, "tooltip": "Controls how far the vignette transition begins from the center; higher values spread the transition farther inward for a softer falloff."}),
                # Appended to preserve the established backend widget order. The frontend
                # renders this selector directly beneath the Live Preview image.
                "color_emulsion": (EMULSION_CHOICES, {"default": "neutral", "tooltip": "Choose one of 50 creative color-film emulsion looks, or Neutral to bypass the atlas."}),
                # Appended white-balance wheel coordinates; the frontend exposes
                # these as one two-axis Resolve-inspired puck control.
                "white_balance_temperature": ("FLOAT", {"default": 0.0, "min": -1.0, "max": 1.0, "step": 0.001, "tooltip": "White-balance wheel vertical axis: cool (-1) to warm (+1)."}),
                "white_balance_tint": ("FLOAT", {"default": 0.0, "min": -1.0, "max": 1.0, "step": 0.001, "tooltip": "White-balance wheel horizontal axis: green (-1) to magenta (+1)."}),
                # New public finishing controls are append-only so previous workflow
                # widget positions remain stable during this development iteration.
                "anti_ai": ("FLOAT", {"display": "slider", "default": 0.0, "min": 0.0, "max": 100.0, "step": 1.0, "tooltip": "Deterministic photographic normalization: soften AI-style contrast/highlights, recover midtones and gently restrain red/orange saturation."}),
                "noise_texture": (NOISE_TEXTURES, {"default": "Gaussian", "tooltip": "Select a deterministic image-space procedural texture family."}),
                "noise_amount": ("FLOAT", {"display": "slider", "default": 0.0, "min": 0.0, "max": 2.0, "step": 0.01, "tooltip": "Procedural texture contribution. The 0–2 range provides twice the previous maximum strength; existing values retain their previous response."}),
                "noise_seed": ("INT", {"display": "slider", "default": 73, "min": 0, "max": 999, "step": 1, "tooltip": "Changes the deterministic Procedural Texture pattern only. Independent of Light Leak Seed and Film Grain."}),
                "noise_scale": ("FLOAT", {"display": "slider", "default": 1.0, "min": 0.0, "max": 4.0, "step": 0.05, "tooltip": "Controls the physical feature size of Procedural Texture. Zero selects the finest supported detail; higher values create broader marks relative to source dimensions."}),
                # Appended texture compositing control preserves all earlier workflow widget indices.
                "noise_blend_mode": (NOISE_BLEND_MODES, {"default": "Additive", "tooltip": "Controls how the procedural surface pattern combines with image tones. Additive preserves the original subtle texture response; other modes change tonal interaction."}),
                # Append-only tonal control preserves every earlier workflow widget position.
                "exposure": ("FLOAT", {"display": "slider", "default": 0.0, "min": -100.0, "max": 100.0, "step": 1.0, "tooltip": "Adjusts overall lightness. 0 bypasses; negative values retain the approved linear darkening response, while positive values use a gradual 2.5-power ease-in and reach 95% toward white at +100."}),
                # Append-only control: keep all previous serialized widget indices stable.
                "grain_blend_mode": (NOISE_BLEND_MODES, {"default": "Additive", "tooltip": "Controls how Film Grain interacts with image tones. Additive preserves the established grain response; other modes change tonal blending."}),
                # Append-only creative control. 1.0 preserves every existing emulsion profile output.
                "emulsion_response": ("FLOAT", {"display": "slider", "default": 1.0, "min": 0.5, "max": 3.0, "step": 0.01, "precision": 2, "tooltip": "Scales the selected emulsion's complete tonal and color response. 1.0 preserves the original profile; Neutral bypasses this control."}),
            }
        }

    RETURN_TYPES = ("IMAGE", "STRING")
    RETURN_NAMES = ("image", "report")
    FUNCTION = "execute"
    CATEGORY = "Zuanfilm/RetroLab"

    def execute(
        self,
        image,
        grain_amount=0.0,
        grain_size=0.3,
        color_grain=0.09,
        halation_amount=0.0,
        ring_radius=8.0,
        bloom_amount=0.0,
        bloom_threshold=0.1,
        bloom_radius=8.0,
        solarization=0.0,
        highlight_confinement=0.09,
        mackie_lines=0.0,
        leak_mode="Soft Edge",
        leak_position="Bottom",
        leak_exposure=0.0,
        leak_seed=27,
        leak_color="#C2AF8E",
        leak_radius=1.0,
        halation_color=DEFAULT_HALATION_COLOR,
        soft_focus_amount=0.0,
        soft_focus_radius=24.0,
        vignette_amount=0.0,
        vignette_feather=0.65,
        color_emulsion="neutral",
        white_balance_temperature=0.0,
        white_balance_tint=0.0,
        anti_ai=0.0,
        noise_texture="Gaussian",
        noise_amount=0.0,
        noise_seed=73,
        noise_scale=1.0,
        noise_blend_mode="Additive",
        exposure=0.0,
        grain_blend_mode="Additive",
        emulsion_response=1.0,
    ):
        settings = RetroLabSettings(
            grain_amount=float(grain_amount),
            grain_size=float(grain_size),
            color_grain=float(color_grain),
            halation_amount=float(halation_amount),
            ring_radius=float(ring_radius),
            bloom_amount=float(bloom_amount),
            bloom_threshold=float(bloom_threshold),
            bloom_radius=float(bloom_radius),
            solarization=float(solarization),
            highlight_confinement=float(highlight_confinement),
            mackie_lines=float(mackie_lines),
            leak_mode=str(leak_mode),
            leak_position=str(leak_position),
            leak_exposure=float(leak_exposure),
            leak_color=normalize_hex_color(str(leak_color)),
            leak_seed=min(max(int(leak_seed), 0), 999),
            leak_radius=float(leak_radius),
            halation_color=normalize_halation_color(str(halation_color)),
            soft_focus_amount=float(soft_focus_amount),
            soft_focus_radius=float(soft_focus_radius),
            vignette_amount=float(vignette_amount),
            vignette_feather=float(vignette_feather),
            color_emulsion=normalize_emulsion_id(color_emulsion),
            white_balance_temperature=float(white_balance_temperature),
            white_balance_tint=float(white_balance_tint),
            anti_ai=float(anti_ai),
            noise_texture=normalize_noise_texture(noise_texture),
            noise_amount=float(noise_amount),
            noise_seed=min(max(int(noise_seed), 0), 999),
            noise_scale=float(noise_scale),
            noise_blend_mode=str(noise_blend_mode),
            exposure=float(exposure),
            grain_blend_mode=str(grain_blend_mode),
            emulsion_response=normalize_emulsion_response(emulsion_response),
        )
        output, report = process_batch_with_report(image, settings)
        return self._with_preview(image, output, report)

    def _with_preview(self, image, output, report):
        try:
            # Retry route registration at execution time in case the ComfyUI
            # PromptServer was created after custom-node import.
            register_preview_routes()
            preview_token = create_preview_cache(image)
            return {"ui": {"retrolab_preview_id": [preview_token]}, "result": (output, report)}
        except Exception:
            # Preview failure must never break the actual image-processing node.
            return (output, report)


class ZuanfilmRetroLabVideo(ZuanfilmRetroLab):
    """Retrolab finishing for video frame batches, with a scrubbable live player."""

    def _with_preview(self, image, output, report):
        try:
            register_preview_routes()
            preview_token = create_video_preview_cache(image)
            return {"ui": {"retrolab_video_preview_id": [preview_token]}, "result": (output, report)}
        except Exception:
            return (output, report)
