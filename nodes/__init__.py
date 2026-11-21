"""ComfyUI node registrations."""

from .zuanfilm_retrolab import ZuanfilmRetroLab, ZuanfilmRetroLabVideo

NODE_CLASS_MAPPINGS = {
    "ZuanfilmRetroLab": ZuanfilmRetroLab,
    "ZuanfilmRetroLabVideo": ZuanfilmRetroLabVideo,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "ZuanfilmRetroLab": "Zuanfilm Retrolab",
    "ZuanfilmRetroLabVideo": "Zuanfilm Retrolab Video",
}
