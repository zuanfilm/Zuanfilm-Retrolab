from __future__ import annotations

import importlib.util
import json
import re
import sys
import unittest
from pathlib import Path

import torch

# Load the extension as a package with relative imports, matching ComfyUI's loader.
ROOT = Path(__file__).resolve().parents[1]
PACKAGE_NAME = "zuanfilm_retrolab_test_package"
spec = importlib.util.spec_from_file_location(
    PACKAGE_NAME,
    ROOT / "__init__.py",
    submodule_search_locations=[str(ROOT)],
)
package = importlib.util.module_from_spec(spec)
sys.modules[PACKAGE_NAME] = package
spec.loader.exec_module(package)
NODE_CLASS_MAPPINGS = package.NODE_CLASS_MAPPINGS
NODE_DISPLAY_NAME_MAPPINGS = package.NODE_DISPLAY_NAME_MAPPINGS


class ComfyNodeTests(unittest.TestCase):
    def test_node_registration_and_display_name(self):
        self.assertIn("ZuanfilmRetroLab", NODE_CLASS_MAPPINGS)
        self.assertEqual(NODE_DISPLAY_NAME_MAPPINGS["ZuanfilmRetroLab"], "Zuanfilm Retrolab")
        self.assertEqual(NODE_CLASS_MAPPINGS["ZuanfilmRetroLab"].CATEGORY, "Zuanfilm/RetroLab")
        self.assertEqual(NODE_DISPLAY_NAME_MAPPINGS["ZuanfilmRetroLabVideo"], "Zuanfilm Retrolab Video")
        self.assertEqual(
            NODE_CLASS_MAPPINGS["ZuanfilmRetroLabVideo"].INPUT_TYPES(),
            NODE_CLASS_MAPPINGS["ZuanfilmRetroLab"].INPUT_TYPES(),
        )
        self.assertEqual(package.__version__, "1.0.0")

    def test_interface_has_reduced_controls_and_current_effect_limits(self):
        required = NODE_CLASS_MAPPINGS["ZuanfilmRetroLab"].INPUT_TYPES()["required"]
        expected = {
            "grain_amount", "grain_size", "color_grain",
            "halation_amount", "ring_radius",
            "bloom_amount", "bloom_threshold", "bloom_radius",
            "solarization", "highlight_confinement", "mackie_lines",
            "leak_mode", "leak_position", "leak_color", "leak_exposure", "leak_seed", "leak_radius", "halation_color",
            "soft_focus_amount", "soft_focus_radius", "vignette_amount", "vignette_feather", "color_emulsion",
            "white_balance_temperature", "white_balance_tint", "anti_ai",
            "noise_texture", "noise_amount", "noise_seed", "noise_scale", "noise_blend_mode", "exposure", "grain_blend_mode", "emulsion_response",
        }
        self.assertEqual(set(required) - {"image"}, expected)
        self.assertNotIn("anti_halation", required)
        self.assertEqual(required["halation_amount"][1]["max"], 2.0)
        self.assertEqual(required["grain_amount"][1]["max"], 3.0)
        self.assertEqual(required["grain_size"][1]["min"], 0.1)
        self.assertEqual(required["grain_size"][1]["default"], 0.3)
        self.assertEqual(required["color_grain"][1]["default"], 0.09)
        self.assertEqual(required["highlight_confinement"][1]["default"], 0.09)
        self.assertEqual(required["leak_mode"][1]["default"], "Soft Edge")
        self.assertEqual(required["leak_position"][1]["default"], "Bottom")
        self.assertEqual(required["leak_seed"][1]["default"], 27)
        self.assertEqual(required["leak_seed"][1]["display"], "slider")
        self.assertEqual(required["leak_seed"][1]["min"], 0)
        self.assertEqual(required["leak_seed"][1]["max"], 999)
        self.assertEqual(required["bloom_amount"][1]["max"], 3.0)
        self.assertEqual(required["bloom_amount"][1]["default"], 0.0)
        self.assertEqual(required["bloom_threshold"][1]["default"], 0.1)
        self.assertEqual(required["leak_exposure"][1]["max"], 10.0)
        leak_choices = required["leak_mode"][0]
        self.assertEqual(
            leak_choices,
            ("Soft Edge", "First-Frame Burn", "120 Fat Roll", "Light Piping", "Holga 135"),
        )
        self.assertNotIn("Mechanical Marks", leak_choices)
        self.assertNotIn("Pinhole", leak_choices)
        self.assertEqual(required["leak_color"][1]["default"], "#C2AF8E")
        self.assertEqual(required["color_emulsion"][1]["default"], "neutral")
        self.assertEqual(len(required["color_emulsion"][0]), 51, "Neutral plus 50 public emulsion looks")
        self.assertEqual(required["leak_radius"][1]["min"], 0.25)
        self.assertEqual(required["leak_radius"][1]["max"], 10.0)
        self.assertEqual(required["leak_radius"][1]["default"], 1.0)
        self.assertEqual(required["halation_color"][1]["default"], "#FF9959")
        self.assertEqual(required["soft_focus_amount"][1]["default"], 0.0)
        self.assertEqual(required["soft_focus_radius"][1]["default"], 24.0)
        self.assertEqual(required["vignette_amount"][1]["default"], 0.0)
        self.assertEqual(required["vignette_amount"][1]["max"], 2.0)
        self.assertEqual(required["vignette_feather"][1]["default"], 0.65)
        # Existing controls retain their relative order; the emulsion selector
        # and two non-slider wheel coordinates are append-only additions.
        self.assertEqual(list(required.keys())[-16:-12], ["soft_focus_amount", "soft_focus_radius", "vignette_amount", "vignette_feather"])
        self.assertEqual(list(required.keys())[-12:], [
            "color_emulsion", "white_balance_temperature", "white_balance_tint",
            "anti_ai", "noise_texture", "noise_amount", "noise_seed", "noise_scale", "noise_blend_mode", "exposure", "grain_blend_mode", "emulsion_response",
        ])
        self.assertEqual(required["anti_ai"][1]["default"], 0.0)
        self.assertEqual(required["anti_ai"][1]["min"], 0.0)
        self.assertEqual(required["anti_ai"][1]["max"], 100.0)
        self.assertEqual(required["exposure"][1]["default"], 0.0)
        self.assertEqual(required["exposure"][1]["min"], -100.0)
        self.assertEqual(required["exposure"][1]["max"], 100.0)
        self.assertEqual(required["exposure"][1]["display"], "slider")
        self.assertEqual(required["noise_texture"][1]["default"], "Gaussian")
        self.assertEqual(len(required["noise_texture"][0]), 12)
        self.assertNotIn("Gabor Texture", required["noise_texture"][0])
        self.assertEqual(required["noise_amount"][1]["default"], 0.0)
        self.assertEqual(required["noise_amount"][1]["min"], 0.0)
        self.assertEqual(required["noise_amount"][1]["max"], 2.0)
        self.assertEqual(required["noise_seed"][1]["default"], 73)
        self.assertEqual(required["noise_seed"][1]["display"], "slider")
        self.assertEqual(required["noise_seed"][1]["min"], 0)
        self.assertEqual(required["noise_seed"][1]["max"], 999)
        self.assertEqual(required["noise_scale"][1]["default"], 1.0)
        self.assertEqual(required["noise_scale"][1]["min"], 0.0)
        self.assertEqual(required["noise_scale"][1]["max"], 4.0)
        self.assertEqual(required["noise_scale"][1]["display"], "slider")
        self.assertEqual(required["noise_blend_mode"][0], (
            "Additive", "Multiply", "Screen", "Overlay", "Soft Light", "Hard Light",
            "Color Dodge", "Color Burn", "Lighten", "Darken", "Difference", "Exclusion",
        ))
        self.assertEqual(required["noise_blend_mode"][1]["default"], "Additive")
        self.assertEqual(required["grain_blend_mode"][0], required["noise_blend_mode"][0])
        self.assertEqual(required["grain_blend_mode"][1]["default"], "Additive")
        self.assertEqual(required["emulsion_response"][1]["display"], "slider")
        self.assertEqual(required["emulsion_response"][1]["default"], 1.0)
        self.assertEqual(required["emulsion_response"][1]["min"], 0.5)
        self.assertEqual(required["emulsion_response"][1]["max"], 3.0)
        self.assertEqual(required["emulsion_response"][1]["step"], 0.01)
        self.assertEqual(required["leak_seed"][1]["display"], "slider")
        self.assertEqual(required["leak_seed"][1]["min"], 0)
        self.assertEqual(required["leak_seed"][1]["max"], 999)
        self.assertEqual(required["white_balance_temperature"][1]["default"], 0.0)
        self.assertEqual(required["white_balance_temperature"][1]["min"], -1.0)
        self.assertEqual(required["white_balance_temperature"][1]["max"], 1.0)
        self.assertEqual(required["white_balance_tint"][1]["default"], 0.0)
        self.assertEqual(required["white_balance_tint"][1]["min"], -1.0)
        self.assertEqual(required["white_balance_tint"][1]["max"], 1.0)
        self.assertEqual(package.WEB_DIRECTORY, "./js")


    def test_leak_exposure_is_explicit_slider_with_two_decimal_precision(self):
        required = NODE_CLASS_MAPPINGS["ZuanfilmRetroLab"].INPUT_TYPES()["required"]
        options = required["leak_exposure"][1]
        self.assertEqual(options["display"], "slider")
        self.assertEqual(options["min"], 0.0)
        self.assertEqual(options["max"], 10.0)
        self.assertEqual(options["precision"], 2)

    def test_frontend_and_backend_emulsion_ids_are_identical(self):
        from core.emulsions import EMULSION_BY_ID

        frontend = (ROOT / "js" / "zuanfilm_retrolab.js").read_text(encoding="utf-8")
        atlas_start = frontend.index("const EMULSION_ATLAS = Object.freeze([")
        atlas_end = frontend.index("\n]);", atlas_start)
        atlas_source = frontend[atlas_start:atlas_end]
        frontend_ids = re.findall(r'\["([a-z0-9_]+)",\s*"', atlas_source)
        self.assertEqual(len(frontend_ids), 50)
        self.assertEqual(set(frontend_ids), set(EMULSION_BY_ID))
        self.assertEqual(len(set(frontend_ids)), 50)

    def test_every_float_control_uses_the_same_slider_presentation(self):
        required = NODE_CLASS_MAPPINGS["ZuanfilmRetroLab"].INPUT_TYPES()["required"]
        # White-balance axes are hidden numeric backend values driven by the
        # two-dimensional puck, not standalone sliders.
        wheel_names = {"white_balance_temperature", "white_balance_tint"}
        float_names = [name for name, definition in required.items() if definition[0] == "FLOAT" and name not in wheel_names]
        self.assertGreaterEqual(len(float_names), 13)
        for name in float_names:
            with self.subTest(name=name):
                self.assertEqual(required[name][1].get("display"), "slider")
        for name in wheel_names:
            self.assertNotIn("display", required[name][1])
        self.assertNotEqual(required["leak_seed"][0], "FLOAT")

    def test_frontend_reset_defaults_cover_every_backend_widget(self):
        root = Path(__file__).resolve().parents[1]
        js = (root / "js" / "zuanfilm_retrolab.js").read_text(encoding="utf-8")
        match = re.search(
            r"const DEFAULT_WIDGET_VALUES = Object\.freeze\(\{(.*?)\n\}\);",
            js,
            re.S,
        )
        self.assertIsNotNone(match, "Frontend reset defaults map is missing")
        entries = {}
        for name, raw_value in re.findall(r"^\s+([a-z_]+):\s*(.+?),?$", match.group(1), re.M):
            raw_value = raw_value.strip()
            if raw_value == "DEFAULT_COLOR":
                value = "#C2AF8E"
            elif raw_value == "DEFAULT_HALATION_COLOR":
                value = "#FF9959"
            elif raw_value.startswith('"'):
                value = json.loads(raw_value)
            elif "." in raw_value:
                value = float(raw_value)
            else:
                value = int(raw_value)
            entries[name] = value

        required = NODE_CLASS_MAPPINGS["ZuanfilmRetroLab"].INPUT_TYPES()["required"]
        expected = {}
        for name, definition in required.items():
            if name == "image":
                continue
            options = definition[1] if len(definition) > 1 and isinstance(definition[1], dict) else {}
            expected[name] = options.get("default")
        self.assertEqual(entries, expected)
        self.assertIn("Reset to Defaults", js)
        self.assertIn("widget.callback?.(defaultValue, app.canvas, this)", js)
        self.assertIn("const CONTROL_TABS = Object.freeze([", js)
        self.assertIn("GRAIN & TEXTURE DETAIL · CENTER CROP 240 PX", js)
        self.assertIn("LOCALIZED_TOOLTIPS", js)
        self.assertIn("ACTIVE_TOOLTIP_LANGUAGE", js)
        self.assertIn("const INITIAL_NODE_SCREEN_WIDTH = 480", js)
        self.assertIn("const INITIAL_NODE_MIN_GRAPH_WIDTH = 640", js)
        self.assertIn("const INITIAL_NODE_MAX_GRAPH_WIDTH = 1600", js)
        self.assertIn("function getInitialCanvasScale(node, extensionApp = app)", js)
        self.assertIn("function applyInitialNodeWidth(node, extensionApp = app)", js)
        self.assertIn("nodeCreated(node, extensionApp)", js)
        self.assertIn("node._zrlInitialWidthApplied = true", js)
        self.assertNotIn("applyInitialNodeWidth(this)", js)
        self.assertNotIn("minimumNodeWidth", js)
        self.assertNotIn("installCanvasDrawNodeWidthGuard", js)
        self.assertNotIn("canvas.drawNode = function", js)
        self.assertNotIn("nodeType.prototype.onResize = function", js)
        self.assertNotIn("nodeType.prototype.onConfigure = function", js)
        self.assertIn("exposure", js)
        self.assertIn("noise_blend_mode", js)
        self.assertIn("grain_blend_mode", js)
        self.assertIn("emulsion_response", js)
        self.assertIn("const LANGUAGES = Object.freeze([", js)
        self.assertIn("zh: {", js)
        self.assertIn("ja: {", js)
        self.assertIn("de: {", js)
        self.assertIn("LANGUAGE_STORAGE_KEY", js)
        self.assertIn("createPreviewPanel", js)
        self.assertIn("function createControlTabs(node)", js)
        self.assertIn("previewUI.resetSlot.append(resetButton)", js)
        self.assertIn("noise_scale", js)
        self.assertIn("parameterTooltip(control.name)", js)
        self.assertIn("addDOMWidgetAt(this, \"zrl_composition_preview\", previewUI.panel, \"grain_amount\",", js)
        self.assertIn("createPreviewModeControl", js)
        self.assertIn("include_original", js)
        self.assertNotIn("zrl_divider_", js)
        self.assertIn("addDOMWidgetAt(this, `zrl_${tabId}_controls`, section, \"grain_amount\", contentHeight(section))", js)
        self.assertIn("data-zrl-layout", js)
        self.assertIn("LIGHT_LEAK_RANGE_CONTROLS", js)
        self.assertIn("ui.fullImage.style.visibility = \"visible\"", js)
        self.assertIn("createGrainControls", js)
        self.assertIn("widget.hidden = true", js)
        self.assertIn("api.fetchApi(PREVIEW_ENDPOINT", js)
        self.assertIn("onExecuted", js)

    def test_node_exposes_append_only_text_report_output(self):
        node_class = NODE_CLASS_MAPPINGS["ZuanfilmRetroLab"]
        self.assertEqual(node_class.RETURN_TYPES, ("IMAGE", "STRING"))
        self.assertEqual(node_class.RETURN_NAMES, ("image", "report"))

    def test_node_executes_default_identity_and_returns_report(self):
        node = NODE_CLASS_MAPPINGS["ZuanfilmRetroLab"]()
        image = torch.rand((1, 24, 32, 3))
        result = node.execute(image)
        output, report_text = result["result"]
        self.assertIs(output, image)
        report = json.loads(report_text)
        self.assertEqual(report["schema"], "zuanfilm.retrolab.execution-report.v1")
        self.assertEqual(report["product"]["version"], package.__version__)
        self.assertTrue(report["execution"]["identity_bypass"])
        self.assertEqual(report["execution"]["planner_reason"], "all_effects_neutral")
        self.assertEqual(report["image"]["input_shape_bhwc"], [1, 24, 32, 3])
        self.assertIn("retrolab_preview_id", result["ui"])
        self.assertEqual(len(result["ui"]["retrolab_preview_id"][0]), 32)

    def test_node_executes_enabled_effect_and_returns_report(self):
        node = NODE_CLASS_MAPPINGS["ZuanfilmRetroLab"]()
        image = torch.rand((1, 32, 40, 3))
        result = node.execute(image, grain_amount=0.5, leak_exposure=0.6, leak_color="#35B8E8", leak_mode="Light Piping", leak_seed=9, leak_radius=4.0, white_balance_temperature=0.35, white_balance_tint=-0.2, exposure=40)
        output, report_text = result["result"]
        report = json.loads(report_text)
        self.assertEqual(output.shape, image.shape)
        self.assertTrue(torch.isfinite(output).all())
        self.assertFalse(torch.equal(output, image))
        self.assertEqual(report["image"]["megapixels"], 0.001)
        self.assertEqual(report["execution"]["route"], "cpu")
        self.assertIn("film_grain", report["workload"]["active_stages_in_order"])
        self.assertIn("light_leak", report["workload"]["active_stages_in_order"])

    def test_processing_code_has_no_new_image_stack_dependencies(self):
        root = Path(__file__).resolve().parents[1]
        forbidden = {"numpy", "scipy", "opensimplex", "numba", "PIL"}
        for folder in (root / "core", root / "nodes"):
            for source in folder.rglob("*.py"):
                text = source.read_text(encoding="utf-8")
                for line in text.splitlines():
                    stripped = line.strip()
                    if stripped.startswith("import ") or stripped.startswith("from "):
                        module = stripped.split()[1].split(".")[0]
                        self.assertNotIn(module, forbidden, f"Unexpected dependency in {source}: {line}")


if __name__ == "__main__":
    unittest.main()
