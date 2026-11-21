import { app } from "../../scripts/app.js";
import { api } from "../../scripts/api.js";

const NODE_NAME = "ZuanfilmRetroLab";
const DARKROOM_STYLE = `
.zrl-dr { --zrl-ac: #E7B56A; --zrl-card: #2E2B28; --zrl-card-hi: #3A3631; --zrl-line: rgba(255,240,220,0.09); --zrl-text: #ECE5DA; --zrl-muted: #9C9285;
    color: var(--zrl-text); font-family: Inter, "Segoe UI", system-ui, sans-serif; box-sizing: border-box; }
.zrl-dr[hidden] { display: none !important; }
.dom-widget > .zrl-dr:not(.zrl-preview) { height: auto !important; }
.zrl-panel { padding: 6px 6px 8px !important; column-gap: 18px !important; row-gap: 8px !important; }
.zrl-panel > div { border: 0 !important; padding-left: 0 !important; padding-right: 0 !important; }
.zrl-heading { font-size: 10px !important; font-weight: 600 !important; letter-spacing: 0.08em !important; text-transform: uppercase; color: var(--zrl-muted) !important; opacity: 1 !important; }
.zrl-dr input[type=range] { -webkit-appearance: none; appearance: none; height: 6px !important; margin: 0; border: 0 !important; border-radius: 999px !important; outline: none; cursor: pointer;
    background: linear-gradient(to right, var(--zrl-ac) var(--zrl-p, 0%), #403B35 var(--zrl-p, 0%)) !important; }
.zrl-dr input[type=range]::-webkit-slider-runnable-track { height: 6px; background: transparent; border-radius: 999px; }
.zrl-dr input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; margin-top: -4px; border: 0; border-radius: 50%; background: #F4EDE2; box-shadow: 0 1px 4px rgba(0,0,0,0.5); }
.zrl-dr input[type=range]::-moz-range-thumb { width: 14px; height: 14px; border: 0; border-radius: 50%; background: #F4EDE2; }
.zrl-dr select { height: 28px !important; padding: 0 8px !important; border: 1px solid var(--zrl-line) !important; border-radius: 8px !important; background: var(--zrl-card) !important; color: var(--zrl-text) !important; font-size: 11px !important; }
.zrl-dr button { border: 1px solid var(--zrl-line) !important; border-radius: 8px !important; background: var(--zrl-card) !important; color: var(--zrl-text) !important; cursor: pointer; }
.zrl-dr input[type=color] { width: 26px !important; height: 26px !important; padding: 0 !important; border: 1px solid var(--zrl-line) !important; border-radius: 7px !important; background: none !important; }
.zrl-dr input[type=color]::-webkit-color-swatch-wrapper { padding: 2px; }
.zrl-dr input[type=color]::-webkit-color-swatch { border: 0; border-radius: 5px; }
.zrl-preview { display: flex; flex-direction: column; gap: 6px; width: 100%; height: 100%; padding: 2px 0 0; }
.zrl-card { position: relative; flex: 1 1 auto; min-height: 0; border-radius: 10px; overflow: hidden; background: #0E0E0D; }
.zrl-card img.zrl-frame { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; user-select: none; -webkit-user-drag: none; }
.zrl-split { position: absolute; top: 0; bottom: 0; width: 2px; margin-left: -1px; background: var(--zrl-ac); pointer-events: none; }
.zrl-split::after { content: ""; position: absolute; top: 50%; left: 50%; width: 20px; height: 20px; border: 2px solid var(--zrl-ac); border-radius: 50%; background: rgba(20,18,15,0.55); transform: translate(-50%, -50%); }
.zrl-ov { position: absolute; display: flex; gap: 6px; align-items: center; z-index: 1; }
.zrl-dr .zrl-glass { background: rgba(18,16,14,0.62) !important; backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.08) !important; border-radius: 999px !important; color: var(--zrl-text) !important; }
.zrl-seg { display: inline-flex; padding: 2px; }
.zrl-dr .zrl-seg button { border: 0 !important; background: transparent !important; color: var(--zrl-muted) !important; font-size: 10px; letter-spacing: 0.04em; padding: 3px 9px; border-radius: 999px !important; }
.zrl-dr .zrl-seg button[aria-pressed=true] { background: var(--zrl-ac) !important; color: #1C1712 !important; font-weight: 600; }
.zrl-icon { position: relative; width: 26px; height: 26px; display: grid; place-items: center; padding: 0 !important; font-size: 13px; line-height: 1; }
.zrl-icon select { position: absolute; inset: 0; width: 100%; height: 100% !important; opacity: 0; cursor: pointer; }
.zrl-status { font-size: 10.5px !important; padding: 3px 9px; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.zrl-loupe { width: 84px; height: 84px; border-radius: 9px; overflow: hidden; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 4px 14px rgba(0,0,0,0.5); transition: width 0.15s ease, height 0.15s ease; }
.zrl-loupe:hover { width: 200px; height: 200px; }
.zrl-loupe img { display: block; width: 100%; height: 100%; object-fit: cover; }
.zrl-emulsion { display: flex; gap: 8px; align-items: center; padding: 2px 0; }
.zrl-dr .zrl-trigger { flex: 1; min-width: 0; display: flex; align-items: center; gap: 9px; height: 34px; padding: 0 10px; border-radius: 10px !important; font-size: 12px; text-align: left; }
.zrl-trigger-value { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.zrl-swatch { width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0; background: conic-gradient(#E8A45C, #C9614B, #6F8FA8, #E8D39A, #E8A45C); }
.zrl-swatch[data-neutral=true] { background: #5A554E; }
.zrl-stepper { display: flex; align-items: center; height: 34px; border-radius: 10px; background: rgba(231,181,106,0.16); }
.zrl-dr .zrl-stepper button { width: 26px; height: 100%; border: 0 !important; background: transparent !important; font-size: 15px; }
.zrl-stepper span { min-width: 46px; text-align: center; font-variant-numeric: tabular-nums; font-size: 12px; }
.zrl-tabs { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 2px; padding: 3px; border-radius: 10px; background: var(--zrl-card); }
.zrl-dr.zrl-tabs button { position: relative; border: 0 !important; background: transparent !important; color: var(--zrl-muted) !important; font-size: 11.5px; padding: 6px 0; border-radius: 7px !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.zrl-dr.zrl-tabs button[aria-selected=true] { background: var(--zrl-card-hi) !important; color: var(--zrl-text) !important; }
.zrl-tabs button[data-active=true]::after { content: ""; position: absolute; top: 4px; right: 5px; width: 5px; height: 5px; border-radius: 50%; background: var(--zrl-ac); }
.zrl-menu { border-radius: 10px !important; border: 1px solid var(--zrl-line) !important; background: #1E1C1A !important; }
`;
let darkroomStyleInstalled = false;
// Control groups shown one at a time beneath the preview. The widget lists
// drive the "changed" dot on each tab.
const CONTROL_TABS = Object.freeze([
    { id: "color", widgets: ["white_balance_temperature", "white_balance_tint"] },
    { id: "light", widgets: ["bloom_amount", "bloom_threshold", "bloom_radius", "halation_amount", "ring_radius", "halation_color"] },
    { id: "tone", widgets: ["anti_ai", "exposure", "solarization", "highlight_confinement", "mackie_lines"] },
    { id: "leak", widgets: ["leak_mode", "leak_position", "leak_exposure", "leak_seed", "leak_color", "leak_radius"] },
    { id: "optics", widgets: ["soft_focus_amount", "soft_focus_radius", "vignette_amount", "vignette_feather"] },
    { id: "grain", widgets: ["grain_amount", "grain_size", "color_grain", "grain_blend_mode", "noise_texture", "noise_amount", "noise_seed", "noise_scale", "noise_blend_mode"] },
]);
const TAB_LABELS = Object.freeze({
    en: { color: "Color", light: "Light", tone: "Tone", leak: "Leak", optics: "Optics", grain: "Grain" },
    zh: { color: "色彩", light: "光效", tone: "影调", leak: "漏光", optics: "光学", grain: "颗粒" },
    ja: { color: "カラー", light: "ライト", tone: "トーン", leak: "光漏れ", optics: "光学", grain: "粒子" },
    es: { color: "Color", light: "Luz", tone: "Tono", leak: "Fuga", optics: "Óptica", grain: "Grano" },
    pt: { color: "Cor", light: "Luz", tone: "Tom", leak: "Vazamento", optics: "Óptica", grain: "Grão" },
    fr: { color: "Couleur", light: "Lumière", tone: "Tonalité", leak: "Fuite", optics: "Optique", grain: "Grain" },
    ru: { color: "Цвет", light: "Свет", tone: "Тон", leak: "Засвет", optics: "Оптика", grain: "Зерно" },
    de: { color: "Farbe", light: "Licht", tone: "Ton", leak: "Lichtleck", optics: "Optik", grain: "Korn" },
    hi: { color: "रंग", light: "प्रकाश", tone: "टोन", leak: "लीक", optics: "ऑप्टिक्स", grain: "ग्रेन" },
    ar: { color: "اللون", light: "الضوء", tone: "النغمة", leak: "التسرب", optics: "البصريات", grain: "الحبيبات" },
});
const VIDEO_NODE_NAME = "ZuanfilmRetroLabVideo";
const VIDEO_PREVIEW_ENDPOINT = "/retrolab/video_preview";
const VIDEO_FPS_OPTIONS = Object.freeze([8, 12, 16, 24, 25, 30]);
const VIDEO_FRAMES_PER_REQUEST = 4;
const DEFAULT_COLOR = "#C2AF8E";
const DEFAULT_HALATION_COLOR = "#FF9959";
const LANGUAGE_STORAGE_KEY = "zuanfilm_retrolab.language.v1";
const PREVIEW_ENDPOINT = "/retrolab/preview";
const PREVIEW_DEBOUNCE_MS = 180;
const ACTIVE_NODES = new Set();

const PARAMETER_TOOLTIPS = Object.freeze({
    grain_amount: "Controls the visibility of the final film-grain layer. 0 disables grain; raise it gradually for a stronger photographic grain structure.",
    grain_size: "Sets the physical size of film-grain particles relative to the source image. Higher values create broader, softer particles; lower values create finer grain.",
    color_grain: "Blends shared luminance grain toward independent RGB grain. 0 is monochrome; 1 introduces fully independent color-channel variation.",
    halation_amount: "Controls the strength of the colored light spread around intense highlights, separate from Bloom.",
    ring_radius: "Sets the width of the halation ring in source-image-relative pixels. Larger values spread the halo farther from the highlight edge.",
    halation_color: "Sets the color emitted by the halation effect. This changes the halo tint, not the source image white balance.",
    bloom_amount: "Controls the strength of broad optical highlight diffusion. 0 disables Bloom.",
    bloom_threshold: "Sets the luminance level where highlights begin contributing to Bloom. Lower values include more of the image; higher values restrict Bloom to brighter highlights.",
    bloom_radius: "Sets the spread of the Bloom glow relative to the source image. Larger values create a broader, softer glow.",
    anti_ai: "Controls a restrained global photographic normalization: softer contrast and highlights, a gentler black toe, more open midtones and reduced red/orange excess. It is not an AI detector. 0 bypasses it.",
    solarization: "Controls the strength of the Sabattier partial-reversal response. Increase gradually to introduce stronger tonal reversal.",
    highlight_confinement: "Controls where Sabattier reversal is concentrated. Lower values let the effect reach farther into midtones; higher values confine it to brighter tones.",
    leak_mode: "Chooses the physical character of the Light Leak: edge diffusion, first-frame burn, 120 roll, light piping or Holga-style corner ingress.",
    leak_position: "Chooses the image edge or corner where the Light Leak enters. The selected position guides the leak geometry.",
    leak_exposure: "Controls the added exposure from the Light Leak. 0 disables the leak; higher values create a stronger burn.",
    leak_seed: "Changes the repeatable Light Leak pattern while keeping its selected mode and position. Independent from Procedural Texture and Film Grain.",
    leak_radius: "Controls how far the Light Leak travels inward from its selected edge. Higher values spread the light farther across the frame.",
    leak_color: "Sets the color of the incident Light Leak. It does not change Halation Color or White Balance.",
    soft_focus_amount: "Controls corner-directed optical diffusion while keeping the image center comparatively sharp. 0 disables Soft Focus.",
    soft_focus_radius: "Sets the maximum blur radius reached toward the image corners. Larger values create a softer, more diffused edge.",
    vignette_amount: "Controls edge and corner exposure falloff. Higher values darken the periphery more strongly; 0 disables the vignette.",
    vignette_feather: "Controls how gradually the vignette transitions from the center toward the edges. Higher values create a broader, softer transition.",
    color_emulsion: "Selects a creative color-film response. Neutral bypasses the emulsion transform and preserves the input color response.",
    white_balance_temperature: "Moves the base white-balance correction from cool toward warm. The centered position leaves the input color balance unchanged.",
    white_balance_tint: "Moves the base white-balance correction from green toward magenta. The centered position leaves the input color balance unchanged.",
    base_wb: "Returns both White Balance wheel axes to their base (zero) values. It does not analyze or automatically white-balance the image.",
    noise_texture: "Selects the surface character of Procedural Texture. Each family produces a different deterministic photographic imperfection pattern.",
    noise_amount: "Controls the visibility of Procedural Texture independently from Film Grain. 0 disables the texture layer.",
    noise_scale: "Sets the physical feature size relative to the source image. Higher values create larger, broader texture marks; lower values create finer detail.",
    noise_seed: "Changes the repeatable Procedural Texture pattern. Independent from Light Leak Seed and Film Grain.",
    noise_blend_mode: "Controls how the procedural texture interacts with image tones. Additive preserves the established response; other modes change tonal blending.",
    exposure: "Adjusts overall lightness. 0 bypasses; negative values retain the linear darkening response, while positive values ease in gradually for finer control and reach 95% toward white at +100.",
    grain_blend_mode: "Controls how Film Grain interacts with image tones. Additive preserves the established grain response; other modes change tonal blending.",
    emulsion_response: "Scales the selected emulsion's complete tonal and color signature around the image entering the emulsion stage. 1.00× preserves the original profile; Neutral bypasses the response.",
});

const TOOLTIP_KEYS = Object.freeze(Object.keys(PARAMETER_TOOLTIPS));
const TOOLTIP_TEXT = Object.freeze({

    zh: Object.freeze([
        "控制最终胶片颗粒层。0 关闭颗粒；逐渐提高可增强颗粒质感。",
        "设置颗粒相对于原图的尺寸。较低值更细，较高值更宽大。",
        "调整单色亮度颗粒与独立 RGB 变化的比例。0 为单色，1 为独立通道。",
        "控制强光周围彩色光线扩散的强度，与 Bloom 分开。",
        "设置相对于原图的晕光环宽度。数值越高，扩散范围越大。",
        "设置高光周围晕光的颜色，不会改变原图白平衡。",
        "控制宽范围的光学高光柔化。0 关闭 Bloom。",
        "设置开始产生 Bloom 的亮度阈值。较低值包含更多色调。",
        "设置 Bloom 相对于原图的扩散范围。较高值更宽、更柔和。",
        "进行轻微整体摄影化调整：柔化对比和高光、压低黑场、打开中间调并抑制过量红橙色。不是 AI 检测器；0 关闭。",
        "控制 Sabattier 局部反转强度。逐渐增加可加强色调反转。",
        "控制 Sabattier 反转区域。较低值延伸至中间调，较高值限制在亮部。",
        "选择漏光特征：柔和边缘、首帧烧片、120 胶卷、导光漏光或 Holga 风格角部。",
        "选择漏光进入画面的边缘或角落。",
        "控制漏光增加的曝光量。0 关闭，较高值烧片更强。",
        "改变可重复的漏光图案；与程序纹理和胶片颗粒种子独立。",
        "控制漏光从选定边缘向画面内部扩散的距离。",
        "设置进入画面的漏光颜色；与晕光颜色和白平衡独立。",
        "控制朝画面边角的光学柔化，同时尽量保持中心清晰。0 关闭。",
        "设置边角最大模糊半径。数值越高，边缘越柔和。",
        "控制边缘和角落的曝光衰减。数值越高周边越暗；0 关闭。",
        "控制暗角从中心向边缘的过渡。数值越高，过渡越宽、越柔和。",
        "选择创意彩色胶片效果。Neutral 会跳过乳剂变换。",
        "将基础白平衡从冷色调整到暖色。居中表示此轴不作调整。",
        "将基础白平衡从绿色调整到洋红色。居中表示此轴不作调整。",
        "将白平衡色轮两轴重置为零；不会分析图像或自动校正白平衡。",
        "选择程序纹理表面特征，例如乳剂斑驳、划痕、灰尘或相纸老化。",
        "独立控制程序纹理的可见程度。0 关闭此纹理层。",
        "设置相对于原图尺寸的纹理特征大小。0 为可用的最细细节；数值越高纹理越大。",
        "改变可重复的程序纹理图案；与漏光种子和胶片颗粒独立。",
        "控制纹理与图像色调的混合方式。Additive 保留现有细腻效果；其他模式改变色调混合。"
    ]),
    ja: Object.freeze([
        "最終的なフィルムグレイン層の強さです。0 で無効になり、上げるほど粒子感が強くなります。",
        "元画像に対する粒子サイズです。低いほど細かく、高いほど大きくなります。",
        "モノクロ輝度粒子と独立した RGB 変動の割合です。0 はモノクロ、1 は各チャンネル独立です。",
        "強いハイライト周辺に広がる色付きの光の強さです。Bloom とは別の効果です。",
        "元画像に対するハレーションリングの幅です。高いほど広く広がります。",
        "ハイライト周辺に発生するハレーションの色です。元画像のホワイトバランスは変わりません。",
        "広がりのある光学的なハイライト拡散の強さです。0 で無効になります。",
        "Bloom が始まる輝度レベルです。低いほど多くの階調が対象になります。",
        "元画像に対する Bloom の広がりです。高いほど広く柔らかな光になります。",
        "コントラストとハイライトを柔らかくし、黒のトーンを抑え、中間調を開き、赤橙の過度な彩度を抑える穏やかな写真調整です。AI 検出器ではなく、0 で無効です。",
        "Sabattier 部分反転の強さです。上げるほど階調反転が強くなります。",
        "Sabattier 反転が現れる範囲です。低いほど中間調へ広がり、高いほど明るい部分に限定されます。",
        "ソフトな端部光、初回露光焼け、120 ロール、ライトパイピング、Holga 風コーナーなどの漏光特性を選びます。",
        "漏光がフレームに入る端または角を選びます。",
        "漏光による追加露光量です。0 で無効になり、高いほど焼けが強くなります。",
        "再現可能な漏光パターンを変更します。テクスチャやフィルムグレインのシードとは独立です。",
        "選択した端から画面内へ広がる漏光の距離です。",
        "入射する漏光の色です。ハレーション色やホワイトバランスとは独立です。",
        "中央のシャープさを保ちながら、画面の角に向けて光学的な拡散を加えます。0 で無効です。",
        "画面の角で適用される最大ぼかし半径です。高いほど周辺が柔らかくなります。",
        "画面端と四隅の露出低下を調整します。高いほど周辺が暗くなり、0 で無効です。",
        "中心から端へ向かうビネットの遷移を調整します。高いほど広く柔らかくなります。",
        "クリエイティブなカラーフィルム表現を選びます。Neutral は乳剤変換をバイパスします。",
        "ベースのホワイトバランスを寒色から暖色へ調整します。中央ではこの軸は変化しません。",
        "ベースのホワイトバランスを緑からマゼンタへ調整します。中央ではこの軸は変化しません。",
        "ホワイトバランスホイールの両軸をゼロに戻します。画像解析や自動補正は行いません。",
        "乳剤のムラ、傷、ほこり、印画紙の経年変化など、表面テクスチャの種類を選びます。",
        "フィルムグレインとは独立して、プロシージャルテクスチャの見え方を調整します。0 で無効です。",
        "元画像サイズに対するテクスチャ特徴のサイズです。0 は利用可能な最細ディテールです。高いほど大きな模様になります。",
        "再現可能なテクスチャパターンを変更します。漏光やフィルムグレインのシードとは独立です。",
        "テクスチャと画像階調の合成方法です。Additive は従来の繊細な反応を保ち、他のモードは階調の混ざり方を変えます。"
    ]),
    es: Object.freeze([
        "Controla la capa final de grano fotoquímico. 0 la desactiva; aumenta gradualmente para reforzar la textura.",
        "Define el tamaño de las partículas respecto a la imagen fuente. Valores bajos producen grano fino; los altos, partículas amplias.",
        "Mezcla el grano de luminancia monocromo con variaciones RGB independientes. 0 es monocromo; 1 separa los canales.",
        "Controla la difusión de color alrededor de luces intensas. La halación es independiente de Bloom.",
        "Define el ancho del anillo de halación respecto a la imagen fuente. Valores mayores amplían su difusión.",
        "Define el color de la halación alrededor de las altas luces; no modifica el balance de blancos.",
        "Controla la difusión óptica amplia de las altas luces. 0 desactiva Bloom.",
        "Define la luminancia a partir de la cual comienza Bloom. Valores bajos incluyen más tonos.",
        "Define la extensión del resplandor Bloom respecto a la imagen. Valores altos producen un halo más amplio y suave.",
        "Aplica una normalización fotográfica global y sutil: suaviza contraste y luces, modera el pie de negros, abre medios tonos y reduce excesos rojos/naranjas. No detecta IA. 0 la desactiva.",
        "Controla la fuerza de la inversión parcial Sabattier. Aumenta gradualmente para reforzar la inversión tonal.",
        "Define dónde aparece la inversión Sabattier. Valores bajos alcanzan medios tonos; los altos la limitan a luces.",
        "Elige el carácter de la fuga de luz: borde suave, quemado del primer fotograma, rollo 120, conducción de luz o esquinas tipo Holga.",
        "Elige el borde o la esquina por donde entra la fuga de luz.",
        "Controla la exposición añadida por la fuga. 0 la desactiva; valores altos intensifican el quemado.",
        "Cambia el patrón repetible de la fuga de luz. Es independiente de la textura procedural y del grano.",
        "Controla cuánto avanza la fuga de luz desde el borde seleccionado hacia el interior.",
        "Define el color de la luz incidente; es independiente del color de halación y del balance de blancos.",
        "Controla la difusión óptica hacia las esquinas y mantiene el centro relativamente nítido. 0 la desactiva.",
        "Define el radio máximo de desenfoque hacia las esquinas. Valores altos suavizan más los bordes.",
        "Controla la caída de exposición en bordes y esquinas. Valores altos oscurecen más la periferia; 0 la desactiva.",
        "Controla la transición gradual de la viñeta desde el centro hacia los bordes. Valores altos producen una transición más amplia y suave.",
        "Selecciona una respuesta creativa de película en color. Neutral omite la transformación de emulsión.",
        "Desplaza el balance de blancos base de frío a cálido. El centro no modifica este eje.",
        "Desplaza el balance de blancos base de verde a magenta. El centro no modifica este eje.",
        "Devuelve ambos ejes de la rueda de balance de blancos a cero. No analiza ni equilibra automáticamente la imagen.",
        "Selecciona el carácter de superficie de la textura procedural: moteado de emulsión, rayas, polvo o envejecimiento del papel.",
        "Controla la visibilidad de la textura procedural de forma independiente del grano. 0 desactiva esta capa.",
        "Define el tamaño de las marcas respecto a las dimensiones de origen. 0 ofrece el detalle más fino disponible; valores altos generan marcas mayores.",
        "Cambia el patrón repetible de la textura procedural. Es independiente de la semilla de fuga y del grano.",
        "Controla cómo se mezcla la textura con los tonos de imagen. Additive conserva la respuesta sutil existente; los demás modos cambian la mezcla tonal."
    ]),
    pt: Object.freeze([
        "Controla a camada final de grão de filme. 0 desativa; aumente gradualmente para reforçar a textura.",
        "Define o tamanho das partículas em relação à imagem de origem. Valores baixos criam grão fino; valores altos, partículas maiores.",
        "Mistura o grão de luminância monocromático com variações RGB independentes. 0 é monocromático; 1 separa os canais.",
        "Controla a difusão colorida ao redor dos realces intensos. Halation é independente de Bloom.",
        "Define a largura do anel de halation em relação à imagem. Valores maiores ampliam a difusão.",
        "Define a cor emitida ao redor dos realces; não altera o balanço de branco da imagem.",
        "Controla a difusão óptica ampla dos realces. 0 desativa Bloom.",
        "Define o nível de luminância em que Bloom começa. Valores baixos incluem mais tons.",
        "Define a extensão do brilho Bloom em relação à imagem. Valores altos criam um halo mais amplo e suave.",
        "Aplica uma normalização fotográfica global e suave: suaviza contraste e realces, modera o pé dos pretos, abre meios-tons e reduz excessos de vermelho/laranja. Não detecta IA. 0 desativa.",
        "Controla a intensidade da inversão parcial Sabattier. Aumente gradualmente para reforçar a inversão tonal.",
        "Define onde a inversão Sabattier aparece. Valores baixos alcançam meios-tons; altos restringem aos realces.",
        "Escolhe o caráter do vazamento de luz: borda suave, queima do primeiro quadro, rolo 120, condução de luz ou cantos tipo Holga.",
        "Escolhe a borda ou o canto por onde o vazamento entra na imagem.",
        "Controla a exposição adicionada pelo vazamento. 0 desativa; valores altos intensificam a queima.",
        "Altera o padrão repetível do vazamento. Independente da textura procedural e do grão de filme.",
        "Controla a distância que o vazamento percorre para dentro a partir da borda escolhida.",
        "Define a cor da luz incidente; independente da cor de halation e do balanço de branco.",
        "Controla a difusão óptica em direção aos cantos, mantendo o centro relativamente nítido. 0 desativa.",
        "Define o raio máximo de desfoque nos cantos. Valores altos suavizam mais as bordas.",
        "Controla a queda de exposição nas bordas e cantos. Valores altos escurecem mais a periferia; 0 desativa.",
        "Controla a suavidade da transição da vinheta do centro às bordas. Valores altos criam transição mais ampla e suave.",
        "Seleciona uma resposta criativa de filme colorido. Neutral ignora a transformação de emulsão.",
        "Move o balanço de branco base de frio para quente. O centro não altera este eixo.",
        "Move o balanço de branco base de verde para magenta. O centro não altera este eixo.",
        "Retorna os dois eixos da roda de balanço de branco a zero. Não analisa nem corrige automaticamente a imagem.",
        "Seleciona o caráter da superfície procedural, como moteado da emulsão, riscos, poeira ou envelhecimento do papel.",
        "Controla a visibilidade da textura procedural independentemente do grão. 0 desativa esta camada.",
        "Define o tamanho dos detalhes em relação às dimensões de origem. 0 oferece o detalhe mais fino disponível; valores altos criam marcas maiores.",
        "Altera o padrão repetível da textura procedural. Independente das sementes de vazamento e grão.",
        "Controla como a textura se mistura aos tons da imagem. Additive mantém a resposta sutil atual; os demais modos alteram a mistura tonal."
    ]),
    fr: Object.freeze([
        "Contrôle la couche finale de grain argentique. 0 la désactive ; augmentez progressivement pour renforcer la texture.",
        "Définit la taille des particules par rapport à l’image source. Les faibles valeurs donnent un grain fin, les fortes un grain plus large.",
        "Mélange le grain de luminance monochrome avec des variations RGB indépendantes. 0 est monochrome ; 1 sépare les canaux.",
        "Contrôle la diffusion colorée autour des hautes lumières intenses. L’halation est indépendante du Bloom.",
        "Définit la largeur de l’anneau d’halation par rapport à l’image. Les valeurs élevées élargissent sa diffusion.",
        "Définit la couleur émise autour des hautes lumières ; ne modifie pas la balance des blancs.",
        "Contrôle la diffusion optique large des hautes lumières. 0 désactive le Bloom.",
        "Définit la luminance à partir de laquelle le Bloom commence. Les valeurs basses incluent davantage de tons.",
        "Définit la portée du halo Bloom par rapport à l’image. Les valeurs élevées créent une lueur plus large et douce.",
        "Applique une normalisation photographique globale et modérée : adoucit contraste et hautes lumières, assouplit le pied noir, ouvre les tons moyens et réduit les excès rouges/orangés. Ce n’est pas un détecteur d’IA. 0 désactive.",
        "Contrôle la force de l’inversion partielle Sabattier. Augmentez progressivement pour renforcer l’inversion tonale.",
        "Détermine où apparaît l’inversion Sabattier. Les valeurs basses atteignent les tons moyens ; les hautes la limitent aux lumières.",
        "Choisit le caractère de la fuite de lumière : bord doux, brûlure première image, bobine 120, conduction lumineuse ou coins façon Holga.",
        "Choisit le bord ou le coin par lequel la fuite entre dans l’image.",
        "Contrôle l’exposition ajoutée par la fuite. 0 la désactive ; les valeurs élevées renforcent la brûlure.",
        "Modifie le motif reproductible de la fuite. Indépendant de la texture procédurale et du grain argentique.",
        "Contrôle la distance parcourue par la fuite depuis le bord sélectionné vers l’intérieur.",
        "Définit la couleur de la lumière incidente ; indépendante de l’halation et de la balance des blancs.",
        "Contrôle la diffusion optique vers les coins tout en gardant le centre relativement net. 0 désactive.",
        "Définit le rayon maximal de flou vers les coins. Les valeurs élevées adoucissent davantage les bords.",
        "Contrôle la baisse d’exposition des bords et des coins. Les valeurs élevées assombrissent la périphérie ; 0 désactive.",
        "Contrôle la progressivité de la vignette du centre vers les bords. Les valeurs élevées donnent une transition plus large et douce.",
        "Sélectionne un rendu créatif de film couleur. Neutral contourne la transformation d’émulsion.",
        "Déplace la balance des blancs de base du froid vers le chaud. Le centre ne modifie pas cet axe.",
        "Déplace la balance des blancs de base du vert vers le magenta. Le centre ne modifie pas cet axe.",
        "Réinitialise les deux axes de la roue de balance des blancs à zéro. N’analyse pas et ne corrige pas automatiquement l’image.",
        "Choisit le caractère de surface de la texture : marbrure d’émulsion, rayures, poussière ou vieillissement du papier.",
        "Contrôle la visibilité de la texture procédurale indépendamment du grain argentique. 0 désactive cette couche.",
        "Définit la taille des motifs par rapport à l’image source. 0 donne le détail le plus fin disponible ; les valeurs élevées créent des marques plus larges.",
        "Modifie le motif reproductible de texture. Indépendant des graines de fuite et de grain argentique.",
        "Contrôle le mélange de la texture avec les tons de l’image. Additive conserve la réponse subtile actuelle ; les autres modes changent le mélange tonal."
    ]),
    ru: Object.freeze([
        "Управляет финальным слоем плёночного зерна. 0 отключает его; увеличение усиливает фактуру.",
        "Задаёт размер частиц относительно исходного изображения. Меньше — мельче зерно, больше — крупнее частицы.",
        "Смешивает монохромное яркостное зерно с независимыми RGB-отклонениями. 0 — монохромно, 1 — независимые каналы.",
        "Управляет цветным рассеянием вокруг ярких участков. Эффект работает отдельно от Bloom.",
        "Задаёт ширину кольца гало относительно исходника. Большее значение расширяет его.",
        "Задаёт цвет гало вокруг светлых участков; баланс белого изображения не меняется.",
        "Управляет широким оптическим рассеянием светов. 0 отключает Bloom.",
        "Задаёт яркость, с которой начинается Bloom. Низкие значения включают больше тонов.",
        "Задаёт радиус свечения Bloom относительно изображения. Большее значение даёт более широкое мягкое свечение.",
        "Применяет мягкую общую фотокоррекцию: смягчает контраст и света, приглушает чёрную точку, открывает средние тона и снижает избыток красного/оранжевого. Это не детектор ИИ. 0 отключает эффект.",
        "Управляет силой частичной инверсии Sabattier. Увеличивайте постепенно для более выраженного обращения тонов.",
        "Определяет область инверсии Sabattier. Низкие значения затрагивают средние тона, высокие ограничивают эффект светами.",
        "Выбирает характер засветки: мягкий край, засветка первого кадра, рулон 120, световая проводка или углы в стиле Holga.",
        "Выбирает край или угол, через который свет попадает в кадр.",
        "Управляет дополнительной экспозицией засветки. 0 отключает её; высокие значения усиливают прожог.",
        "Меняет воспроизводимый рисунок засветки. Не зависит от процедурной текстуры и плёночного зерна.",
        "Задаёт глубину распространения засветки от выбранного края внутрь кадра.",
        "Задаёт цвет падающего света; не зависит от цвета гало и баланса белого.",
        "Управляет оптическим рассеянием к углам, сохраняя центр относительно резким. 0 отключает эффект.",
        "Задаёт максимальный радиус размытия в углах. Большее значение сильнее смягчает края.",
        "Управляет спадом экспозиции по краям и углам. Большее значение затемняет периферию; 0 отключает эффект.",
        "Управляет плавностью перехода виньетки от центра к краям. Большее значение делает переход шире и мягче.",
        "Выбирает творческий отклик цветной плёнки. Neutral пропускает преобразование эмульсии.",
        "Смещает базовый баланс белого от холодного к тёплому. Центр не изменяет эту ось.",
        "Смещает базовый баланс белого от зелёного к пурпурному. Центр не изменяет эту ось.",
        "Сбрасывает обе оси колеса баланса белого в ноль. Не анализирует и не балансирует изображение автоматически.",
        "Выбирает характер поверхности: пятнистость эмульсии, царапины, пыль или старение бумаги.",
        "Управляет видимостью процедурной текстуры независимо от плёночного зерна. 0 отключает слой.",
        "Задаёт размер деталей относительно исходника. 0 — максимально мелкие доступные детали; выше — крупнее отметины.",
        "Меняет воспроизводимый рисунок текстуры. Независим от seed засветки и плёночного зерна.",
        "Управляет смешением текстуры с тонами изображения. Additive сохраняет прежний деликатный отклик; другие режимы меняют смешение."
    ]),
    de: Object.freeze([
        "Steuert die finale Filmkorn-Ebene. 0 deaktiviert sie; höhere Werte verstärken die fotografische Körnung.",
        "Legt die Korngröße relativ zum Quellbild fest. Niedrige Werte erzeugen feines, hohe Werte gröberes Korn.",
        "Mischt monochromes Helligkeitskorn mit unabhängigen RGB-Abweichungen. 0 ist monochrom, 1 kanalweise unabhängig.",
        "Steuert die farbige Lichtausbreitung um starke Spitzlichter. Halation ist unabhängig von Bloom.",
        "Legt die Breite des Halationsrings relativ zum Quellbild fest. Höhere Werte verbreitern ihn.",
        "Legt die Halationsfarbe um Spitzlichter fest; der Weißabgleich des Bildes bleibt unverändert.",
        "Steuert die breite optische Diffusion von Spitzlichtern. 0 deaktiviert Bloom.",
        "Legt die Helligkeitsschwelle fest, ab der Bloom beginnt. Niedrige Werte beziehen mehr Tonwerte ein.",
        "Legt die Ausbreitung des Bloom-Lichts relativ zum Bild fest. Höhere Werte erzeugen einen breiteren, weicheren Schein.",
        "Wendet eine sanfte globale fotografische Normalisierung an: mildert Kontrast und Lichter, beruhigt den Schwarzfuß, öffnet Mitteltöne und reduziert übermäßiges Rot/Orange. Kein KI-Detektor. 0 deaktiviert.",
        "Steuert die Stärke der partiellen Sabattier-Umkehr. Langsam erhöhen, um die Tonwertumkehr zu verstärken.",
        "Bestimmt den Bereich der Sabattier-Umkehr. Niedrige Werte reichen in Mitteltöne, hohe Werte begrenzen sie auf Lichter.",
        "Wählt den Charakter des Lichteinfalls: weicher Rand, First-Frame-Burn, 120er-Rolle, Lichtleitung oder Holga-artige Ecken.",
        "Wählt den Rand oder die Ecke, an der Licht in das Bild eintritt.",
        "Steuert die zusätzliche Belichtung des Lichteinfalls. 0 deaktiviert ihn; höhere Werte verstärken den Einbrand.",
        "Ändert das reproduzierbare Muster des Lichteinfalls. Unabhängig von prozeduraler Textur und Filmkorn.",
        "Steuert, wie weit der Lichteinfall vom gewählten Rand ins Bild reicht.",
        "Legt die Farbe des einfallenden Lichts fest; unabhängig von Halation und Weißabgleich.",
        "Steuert optische Diffusion zu den Ecken, während die Bildmitte vergleichsweise scharf bleibt. 0 deaktiviert.",
        "Legt den maximalen Unschärferadius in den Ecken fest. Höhere Werte machen die Ränder weicher.",
        "Steuert den Belichtungsabfall an Rändern und Ecken. Höhere Werte dunkeln den Rand stärker ab; 0 deaktiviert.",
        "Steuert den weichen Übergang der Vignette von der Mitte zu den Rändern. Höhere Werte machen ihn breiter und weicher.",
        "Wählt eine kreative Farbfilm-Interpretation. Neutral umgeht die Emulsionsumwandlung.",
        "Verschiebt den Basis-Weißabgleich von kühl nach warm. Die Mittelstellung ändert diese Achse nicht.",
        "Verschiebt den Basis-Weißabgleich von Grün nach Magenta. Die Mittelstellung ändert diese Achse nicht.",
        "Setzt beide Achsen des Weißabgleich-Rads auf null zurück. Das Bild wird nicht automatisch analysiert oder abgeglichen.",
        "Wählt den Oberflächencharakter: Emulsionsmarmorierung, Kratzer, Staub oder gealtertes Papier.",
        "Steuert die Sichtbarkeit der prozeduralen Textur unabhängig vom Filmkorn. 0 deaktiviert diese Ebene.",
        "Legt die Texturmerkmalgröße relativ zum Quellbild fest. 0 liefert das feinste verfügbare Detail; höhere Werte erzeugen größere Zeichen.",
        "Ändert das reproduzierbare Texturmuster. Unabhängig von Lichteinfall-Seed und Filmkorn.",
        "Steuert, wie die Textur mit Bildtönen verrechnet wird. Additive erhält die bisherige subtile Wirkung; andere Modi ändern die Tonmischung."
    ]),
    hi: Object.freeze([
        "अंतिम फिल्म ग्रेन परत को नियंत्रित करता है। 0 इसे बंद करता है; धीरे बढ़ाने से फोटोग्राफिक बनावट बढ़ती है।",
        "स्रोत छवि के अनुपात में कणों का आकार तय करता है। कम मान महीन और अधिक मान बड़े कण बनाते हैं।",
        "मोनोक्रोम ल्यूमिनेंस ग्रेन और स्वतंत्र RGB बदलावों का मिश्रण तय करता है। 0 मोनोक्रोम, 1 अलग चैनल।",
        "तेज़ हाइलाइट के आसपास रंगीन प्रकाश फैलाव नियंत्रित करता है। Halation, Bloom से अलग है।",
        "स्रोत छवि के अनुपात में Halation रिंग की चौड़ाई तय करता है। अधिक मान फैलाव बढ़ाते हैं।",
        "हाइलाइट के आसपास Halation का रंग तय करता है; स्रोत का व्हाइट बैलेंस नहीं बदलता।",
        "चौड़े ऑप्टिकल हाइलाइट फैलाव को नियंत्रित करता है। 0 Bloom बंद करता है।",
        "वह luminance स्तर तय करता है जहाँ Bloom शुरू होता है। कम मान अधिक टोन शामिल करते हैं।",
        "स्रोत छवि के अनुपात में Bloom फैलाव तय करता है। अधिक मान चौड़ा और नरम glow देते हैं।",
        "हल्का वैश्विक फोटोग्राफिक संतुलन लागू करता है: contrast और highlights नरम, black toe मंद, midtones खुले और अतिरिक्त red/orange कम। यह AI detector नहीं है। 0 बंद करता है।",
        "Sabattier आंशिक tonal reversal की ताकत नियंत्रित करता है। अधिक मान reversal बढ़ाते हैं।",
        "Sabattier reversal का क्षेत्र तय करता है। कम मान midtones तक पहुँचते हैं; अधिक मान इसे highlights तक सीमित करते हैं।",
        "Light Leak का स्वभाव चुनता है: soft edge, first-frame burn, 120 roll, light piping या Holga-जैसे corners।",
        "वह किनारा या कोना चुनता है जहाँ से Light Leak फ्रेम में आता है।",
        "Light Leak से जुड़ा अतिरिक्त exposure नियंत्रित करता है। 0 बंद करता है; अधिक मान burn बढ़ाते हैं।",
        "दोहराए जा सकने वाले Light Leak पैटर्न को बदलता है। Procedural Texture और Film Grain से स्वतंत्र।",
        "चुने हुए किनारे से फ्रेम के भीतर Light Leak की दूरी नियंत्रित करता है।",
        "आने वाली रोशनी का रंग तय करता है; Halation Color और White Balance से स्वतंत्र।",
        "केंद्र को अपेक्षाकृत स्पष्ट रखते हुए कोनों की ओर ऑप्टिकल diffusion नियंत्रित करता है। 0 बंद करता है।",
        "कोनों पर अधिकतम blur radius तय करता है। अधिक मान किनारों को नरम करते हैं।",
        "किनारों और कोनों पर exposure falloff नियंत्रित करता है। अधिक मान परिधि को गहरा करते हैं; 0 बंद करता है।",
        "केंद्र से किनारों तक vignette का smooth transition नियंत्रित करता है। अधिक मान चौड़ा और नरम transition देते हैं।",
        "रचनात्मक color-film response चुनता है। Neutral emulsion transform को bypass करता है।",
        "Base White Balance को cool से warm की ओर ले जाता है। बीच की स्थिति इस axis को नहीं बदलती।",
        "Base White Balance को green से magenta की ओर ले जाता है। बीच की स्थिति इस axis को नहीं बदलती।",
        "White Balance wheel की दोनों axes को शून्य पर लौटाता है। यह छवि का विश्लेषण या auto-balance नहीं करता।",
        "Procedural Texture का सतही रूप चुनता है, जैसे emulsion mottle, scratches, dust या aged paper।",
        "Film Grain से स्वतंत्र Procedural Texture की दृश्यता नियंत्रित करता है। 0 इस परत को बंद करता है।",
        "स्रोत आकार के अनुपात में texture feature size तय करता है। 0 सबसे महीन उपलब्ध detail है; अधिक मान बड़े marks बनाते हैं।",
        "दोहराए जा सकने वाले Procedural Texture pattern को बदलता है। Leak Seed और Film Grain से स्वतंत्र।",
        "Texture और image tones के मिश्रण को नियंत्रित करता है। Additive मौजूदा हल्का प्रभाव रखता है; अन्य modes tonal blending बदलते हैं।"
    ]),
    ar: Object.freeze([
        "يتحكم في طبقة حبيبات الفيلم النهائية. القيمة 0 تعطلها؛ وزيادتها تدريجيًا تقوي الملمس.",
        "يحدد حجم الحبيبات نسبةً إلى الصورة المصدر. القيم الأقل أدق والأعلى أكبر.",
        "يمزج حبيبات السطوع أحادية اللون مع اختلافات RGB مستقلة. 0 أحادي و1 قنوات مستقلة.",
        "يتحكم في انتشار الضوء الملون حول الإضاءات القوية. الهالة منفصلة عن Bloom.",
        "يحدد عرض حلقة الهالة نسبةً إلى الصورة. القيم الأعلى توسع انتشارها.",
        "يحدد لون الهالة حول الإضاءات؛ ولا يغير توازن الأبيض للصورة.",
        "يتحكم في الانتشار البصري الواسع للإضاءات. القيمة 0 تعطل Bloom.",
        "يحدد مستوى السطوع الذي يبدأ عنده Bloom. القيم الأقل تشمل درجات لونية أكثر.",
        "يحدد امتداد توهج Bloom نسبةً إلى الصورة. القيم الأعلى تنتج توهجًا أوسع وأنعم.",
        "يطبق ضبطًا فوتوغرافيًا عامًا وخفيفًا: يلين التباين والإضاءات، يهدئ قاعدة الأسود، يفتح الدرجات الوسطى ويقلل تشبع الأحمر/البرتقالي الزائد. ليس كاشفًا للذكاء الاصطناعي. القيمة 0 تعطل التأثير.",
        "يتحكم في قوة الانعكاس الجزئي Sabattier. زد القيمة تدريجيًا للحصول على انعكاس لوني أقوى.",
        "يحدد نطاق ظهور انعكاس Sabattier. القيم المنخفضة تمتد إلى الدرجات الوسطى؛ والعالية تقصره على الإضاءات.",
        "يختار طابع تسرب الضوء: حافة ناعمة، احتراق الإطار الأول، لفة 120، توجيه الضوء أو زوايا بأسلوب Holga.",
        "يحدد الحافة أو الزاوية التي يدخل منها تسرب الضوء إلى الإطار.",
        "يتحكم في التعريض الإضافي لتسرب الضوء. القيمة 0 تعطل التسرب؛ والأعلى تزيد الاحتراق.",
        "يغير نمط تسرب الضوء القابل للتكرار. مستقل عن النسيج الإجرائي وحبيبات الفيلم.",
        "يتحكم في مدى امتداد تسرب الضوء من الحافة المختارة إلى داخل الصورة.",
        "يحدد لون الضوء الداخل؛ مستقل عن لون الهالة وتوازن الأبيض.",
        "يتحكم في الانتشار البصري نحو الزوايا مع إبقاء المركز حادًا نسبيًا. القيمة 0 تعطل التأثير.",
        "يحدد أقصى نصف قطر للتمويه عند الزوايا. القيم الأعلى تجعل الحواف أنعم.",
        "يتحكم في انخفاض التعريض عند الحواف والزوايا. القيم الأعلى تجعل الأطراف أغمق؛ والقيمة 0 تعطل التأثير.",
        "يتحكم في نعومة انتقال التظليل من المركز إلى الحواف. القيم الأعلى تعطي انتقالًا أوسع وأنعم.",
        "يختار استجابة إبداعية لفيلم ملون. Neutral يتجاوز تحويل المستحلب.",
        "يحرك توازن الأبيض الأساسي من البارد إلى الدافئ. المركز لا يغير هذا المحور.",
        "يحرك توازن الأبيض الأساسي من الأخضر إلى الأرجواني. المركز لا يغير هذا المحور.",
        "يعيد محوري عجلة توازن الأبيض إلى الصفر. لا يحلل الصورة ولا يوازن الأبيض تلقائيًا.",
        "يختار طابع السطح مثل تبقع المستحلب أو الخدوش أو الغبار أو تقادم الورق.",
        "يتحكم في ظهور النسيج الإجرائي بصورة مستقلة عن حبيبات الفيلم. القيمة 0 تعطل هذه الطبقة.",
        "يحدد حجم تفاصيل النسيج نسبةً إلى أبعاد المصدر. القيمة 0 تعطي أدق تفاصيل متاحة؛ والأعلى ينتج علامات أكبر.",
        "يغير نمط النسيج الإجرائي القابل للتكرار. مستقل عن بذرة تسرب الضوء وحبيبات الفيلم.",
        "يتحكم في دمج النسيج مع درجات الصورة. يحافظ Additive على التأثير الدقيق الحالي؛ وتغير الأوضاع الأخرى المزج اللوني."
    ])
});
const LOCALIZED_TOOLTIPS = Object.freeze(Object.assign(
    { en: PARAMETER_TOOLTIPS },
    Object.fromEntries(
        Object.entries(TOOLTIP_TEXT).map(([language, values]) => [
            language,
            Object.freeze(Object.fromEntries(TOOLTIP_KEYS.map((key, index) => [key, values[index] || PARAMETER_TOOLTIPS[key]]))),
        ]),
    ),
));
let ACTIVE_TOOLTIP_LANGUAGE = "en";

const EMULSION_RESPONSE_TRANSLATIONS = Object.freeze({
    en: { label: "EMULSION RESPONSE", tooltip: "Scales the selected emulsion's complete tonal and color signature around the image entering the emulsion stage. 1.00× preserves the original profile; Neutral bypasses the response." },
    zh: { label: "乳剂响应", tooltip: "围绕进入乳剂阶段的图像，调整所选乳剂完整的色调与色彩特征。1.00× 保持原始配置；Neutral 会跳过此响应。" },
    ja: { label: "乳剤レスポンス", tooltip: "乳剤段階に入る画像を基準に、選択した乳剤の階調と色の特徴全体を調整します。1.00× は元のプロファイルを維持し、Neutral では適用されません。" },
    es: { label: "RESPUESTA DE EMULSIÓN", tooltip: "Escala la firma tonal y cromática completa de la emulsión seleccionada respecto a la imagen que entra en esta etapa. 1,00× conserva el perfil original; Neutral omite esta respuesta." },
    pt: { label: "RESPOSTA DA EMULSÃO", tooltip: "Escala a assinatura tonal e cromática completa da emulsão selecionada em relação à imagem que entra nesta etapa. 1,00× preserva o perfil original; Neutral ignora esta resposta." },
    fr: { label: "RÉPONSE DE L’ÉMULSION", tooltip: "Ajuste toute la signature tonale et chromatique de l’émulsion sélectionnée par rapport à l’image qui entre dans cette étape. 1,00× conserve le profil d’origine ; Neutral ignore cette réponse." },
    ru: { label: "ОТКЛИК ЭМУЛЬСИИ", tooltip: "Масштабирует полный тональный и цветовой характер выбранной эмульсии относительно изображения на входе этого этапа. 1,00× сохраняет исходный профиль; Neutral отключает отклик." },
    de: { label: "EMULSIONSWIRKUNG", tooltip: "Skaliert die gesamte Ton- und Farbsignatur der gewählten Emulsion relativ zum Bild am Eingang dieser Stufe. 1,00× bewahrt das ursprüngliche Profil; Neutral umgeht diese Wirkung." },
    hi: { label: "इमल्शन प्रतिक्रिया", tooltip: "इस चरण में आने वाली छवि के आधार पर चुने गए इमल्शन के पूरे टोनल और रंग-स्वरूप को स्केल करता है। 1.00× मूल प्रोफ़ाइल बनाए रखता है; Neutral इसे लागू नहीं करता।" },
    ar: { label: "استجابة المستحلب", tooltip: "يضبط التوقيع اللوني والدرجي الكامل للمستحلب المحدد نسبةً إلى الصورة الداخلة إلى هذه المرحلة. القيمة 1.00× تحافظ على الملف الأصلي؛ ويتجاوز Neutral هذه الاستجابة." },
});

function emulsionResponseTranslation(language) {
    return EMULSION_RESPONSE_TRANSLATIONS[getLanguage(language)] || EMULSION_RESPONSE_TRANSLATIONS.en;
}

const NOISE_BLEND_MODE_OPTIONS = Object.freeze([
    "Additive", "Multiply", "Screen", "Overlay", "Soft Light", "Hard Light",
    "Color Dodge", "Color Burn", "Lighten", "Darken", "Difference", "Exclusion",
]);
const NOISE_BLEND_TRANSLATIONS = Object.freeze({
    en: { label: "Texture Blend Mode", modes: { "Additive":"Additive", "Multiply":"Multiply", "Screen":"Screen", "Overlay":"Overlay", "Soft Light":"Soft Light", "Hard Light":"Hard Light", "Color Dodge":"Color Dodge", "Color Burn":"Color Burn", "Lighten":"Lighten", "Darken":"Darken", "Difference":"Difference", "Exclusion":"Exclusion" } },
    zh: { label: "纹理混合模式", modes: { "Additive":"叠加", "Multiply":"正片叠底", "Screen":"滤色", "Overlay":"叠加柔光", "Soft Light":"柔光", "Hard Light":"强光", "Color Dodge":"颜色减淡", "Color Burn":"颜色加深", "Lighten":"变亮", "Darken":"变暗", "Difference":"差值", "Exclusion":"排除" } },
    ja: { label: "テクスチャ合成モード", modes: { "Additive":"加算", "Multiply":"乗算", "Screen":"スクリーン", "Overlay":"オーバーレイ", "Soft Light":"ソフトライト", "Hard Light":"ハードライト", "Color Dodge":"覆い焼きカラー", "Color Burn":"焼き込みカラー", "Lighten":"比較（明）", "Darken":"比較（暗）", "Difference":"差の絶対値", "Exclusion":"除外" } },
    es: { label: "Modo de mezcla de textura", modes: { "Additive":"Aditivo", "Multiply":"Multiplicar", "Screen":"Trama", "Overlay":"Superponer", "Soft Light":"Luz suave", "Hard Light":"Luz fuerte", "Color Dodge":"Sobreexponer color", "Color Burn":"Subexponer color", "Lighten":"Aclarar", "Darken":"Oscurecer", "Difference":"Diferencia", "Exclusion":"Exclusión" } },
    pt: { label: "Modo de mesclagem da textura", modes: { "Additive":"Aditivo", "Multiply":"Multiplicação", "Screen":"Tela", "Overlay":"Sobreposição", "Soft Light":"Luz suave", "Hard Light":"Luz forte", "Color Dodge":"Subexposição de cor", "Color Burn":"Superexposição de cor", "Lighten":"Clarear", "Darken":"Escurecer", "Difference":"Diferença", "Exclusion":"Exclusão" } },
    fr: { label: "Mode de fusion de texture", modes: { "Additive":"Additif", "Multiply":"Produit", "Screen":"Écran", "Overlay":"Incrustation", "Soft Light":"Lumière tamisée", "Hard Light":"Lumière crue", "Color Dodge":"Densité couleur -", "Color Burn":"Densité couleur +", "Lighten":"Éclaircir", "Darken":"Assombrir", "Difference":"Différence", "Exclusion":"Exclusion" } },
    ru: { label: "Режим смешивания текстуры", modes: { "Additive":"Сложение", "Multiply":"Умножение", "Screen":"Экран", "Overlay":"Перекрытие", "Soft Light":"Мягкий свет", "Hard Light":"Жёсткий свет", "Color Dodge":"Осветление основы", "Color Burn":"Затемнение основы", "Lighten":"Замена светлым", "Darken":"Замена тёмным", "Difference":"Разница", "Exclusion":"Исключение" } },
    de: { label: "Textur-Verrechnungsmodus", modes: { "Additive":"Additiv", "Multiply":"Multiplizieren", "Screen":"Negativ multiplizieren", "Overlay":"Ineinanderkopieren", "Soft Light":"Weiches Licht", "Hard Light":"Hartes Licht", "Color Dodge":"Farbig abwedeln", "Color Burn":"Farbig nachbelichten", "Lighten":"Aufhellen", "Darken":"Abdunkeln", "Difference":"Differenz", "Exclusion":"Ausschluss" } },
    hi: { label: "टेक्सचर ब्लेंड मोड", modes: { "Additive":"एडिटिव", "Multiply":"मल्टिप्लाई", "Screen":"स्क्रीन", "Overlay":"ओवरले", "Soft Light":"सॉफ्ट लाइट", "Hard Light":"हार्ड लाइट", "Color Dodge":"कलर डॉज", "Color Burn":"कलर बर्न", "Lighten":"लाइटन", "Darken":"डार्कन", "Difference":"डिफरेंस", "Exclusion":"एक्सक्लूज़न" } },
    ar: { label: "وضع مزج النسيج", modes: { "Additive":"إضافة", "Multiply":"ضرب", "Screen":"شاشة", "Overlay":"تراكب", "Soft Light":"ضوء ناعم", "Hard Light":"ضوء قوي", "Color Dodge":"تفتيح اللون", "Color Burn":"حرق اللون", "Lighten":"تفتيح", "Darken":"تعتيم", "Difference":"فرق", "Exclusion":"استبعاد" } },
});
function getNoiseBlendTranslation(language) {
    return NOISE_BLEND_TRANSLATIONS[getLanguage(language)] || NOISE_BLEND_TRANSLATIONS.en;
}
const GRAIN_BLEND_LABELS = Object.freeze({
    en: "Grain Blend Mode", zh: "颗粒混合模式", ja: "グレイン合成モード",
    es: "Modo de mezcla de grano", pt: "Modo de mesclagem do grão",
    fr: "Mode de fusion du grain", ru: "Режим смешивания зерна",
    de: "Korn-Verrechnungsmodus", hi: "ग्रेन ब्लेंड मोड", ar: "وضع مزج الحبيبات",
});
function getGrainBlendLabel(language) {
    return GRAIN_BLEND_LABELS[getLanguage(language)] || GRAIN_BLEND_LABELS.en;
}

const EXPOSURE_TOOLTIP_TRANSLATIONS = Object.freeze({
    en: "Adjusts overall lightness. 0 bypasses; negative values retain the linear darkening response, while positive values ease in gradually for finer control and reach 95% toward white at +100.",
    zh: "调整整体亮度。0 为旁路；负值保持线性变暗响应，正值采用渐进缓入曲线以便精细控制，并在 +100 时向白色移动 95%。",
    ja: "全体の明るさを調整します。0 はバイパスです。負の値は従来の線形の暗化を維持し、正の値は細かな調整ができる緩やかなイーズインで、+100 では白へ 95% 近づきます。",
    es: "Ajusta la luminosidad global. 0 omite el ajuste; los valores negativos conservan el oscurecimiento lineal, mientras los positivos usan una curva progresiva para un control más fino y alcanzan un 95% hacia el blanco en +100.",
    pt: "Ajusta a luminosidade geral. 0 ignora o ajuste; valores negativos mantêm o escurecimento linear, enquanto valores positivos usam uma curva gradual para controle mais fino e chegam a 95% em direção ao branco em +100.",
    fr: "Ajuste la luminosité globale. 0 désactive l'effet ; les valeurs négatives conservent l'assombrissement linéaire, tandis que les valeurs positives suivent une courbe progressive pour un réglage plus fin et atteignent 95 % vers le blanc à +100.",
    ru: "Регулирует общую яркость. 0 отключает коррекцию; отрицательные значения сохраняют линейное затемнение, а положительные используют плавную кривую для более точной настройки и достигают 95% пути к белому при +100.",
    de: "Passt die Gesamthelligkeit an. 0 deaktiviert die Korrektur; negative Werte behalten die lineare Abdunklung bei, positive Werte verwenden eine sanft ansteigende Kurve für feinere Kontrolle und erreichen bei +100 95 % in Richtung Weiß.",
    hi: "समग्र लाइटनेस समायोजित करता है। 0 पर बायपास; नकारात्मक मान मौजूदा रैखिक डार्कनिंग रखते हैं, जबकि सकारात्मक मान बेहतर नियंत्रण के लिए धीरे बढ़ती प्रतिक्रिया अपनाते हैं और +100 पर 95% सफेद की ओर पहुँचते हैं।",
    ar: "يضبط الإضاءة العامة. القيمة 0 تتجاوز التأثير؛ وتحافظ القيم السالبة على التعتيم الخطي، بينما تستخدم القيم الموجبة منحنى تدريجيًا لتحكم أدق وتصل إلى 95% باتجاه الأبيض عند +100.",
});

const GRAIN_BLEND_TOOLTIP_TRANSLATIONS = Object.freeze({
    en: "Controls how Film Grain interacts with image tones. Additive preserves the established grain response; other modes change tonal blending.",
    zh: "控制胶片颗粒与图像色调的混合方式。Additive 保留现有颗粒效果；其他模式会改变色调混合。",
    ja: "フィルムグレインと画像の階調の合成方法を制御します。Additive は従来の粒状感を維持し、他のモードは階調の合成を変えます。",
    es: "Controla cómo el grano interactúa con los tonos de la imagen. Aditivo conserva la respuesta actual; los demás modos modifican la mezcla tonal.",
    pt: "Controla como o grão interage com os tons da imagem. Aditivo preserva a resposta atual; os outros modos alteram a mesclagem tonal.",
    fr: "Détermine comment le grain interagit avec les tons de l’image. Additif conserve le rendu actuel ; les autres modes modifient le mélange tonal.",
    ru: "Определяет взаимодействие зерна с тонами изображения. Сложение сохраняет прежний отклик; остальные режимы меняют тональное смешивание.",
    de: "Steuert, wie Filmkorn mit den Bildtönen verrechnet wird. Additiv erhält das bisherige Verhalten; andere Modi verändern die Tonmischung.",
    hi: "नियंत्रित करता है कि फिल्म ग्रेन छवि के टोन के साथ कैसे मिश्रित होता है। एडिटिव मौजूदा प्रभाव बनाए रखता है; अन्य मोड टोनल मिश्रण बदलते हैं।",
    ar: "يتحكم في تفاعل حبيبات الفيلم مع درجات الصورة. يحافظ الوضع الإضافي على الاستجابة الحالية؛ وتغيّر الأوضاع الأخرى المزج اللوني."
});

function parameterTooltip(name, language = ACTIVE_TOOLTIP_LANGUAGE) {
    const selectedLanguage = getLanguage(language);
    if (name === "emulsion_response") return emulsionResponseTranslation(selectedLanguage).tooltip;
    if (name === "grain_blend_mode") return GRAIN_BLEND_TOOLTIP_TRANSLATIONS[selectedLanguage] || PARAMETER_TOOLTIPS.grain_blend_mode;
    if (name === "exposure") return EXPOSURE_TOOLTIP_TRANSLATIONS[selectedLanguage] || PARAMETER_TOOLTIPS.exposure;
    const localized = LOCALIZED_TOOLTIPS[selectedLanguage] || LOCALIZED_TOOLTIPS.en;
    return localized[name] || PARAMETER_TOOLTIPS[name] || "Adjusts this photographic finishing parameter.";
}

// Give freshly-created nodes a useful on-screen starting width without
// installing any persistent minimum-size behavior. The zoom is sampled once
// from the active canvas after construction; subsequent zooming and manual
// resizing remain entirely under LiteGraph/user control. A graph-space cap
// prevents creating an enormous world-space node when the canvas is very
// zoomed out.
const INITIAL_NODE_SCREEN_WIDTH = 480;
const INITIAL_NODE_MIN_GRAPH_WIDTH = 640;
const INITIAL_NODE_MAX_GRAPH_WIDTH = 1600;
const INITIAL_NODE_MIN_SCALE = 0.30;
const DEFAULT_NODE_HEIGHT = 640;

function getInitialCanvasScale(node, extensionApp = app) {
    const canvases = [
        extensionApp?.canvas,
        node?.graph?.primaryCanvas,
        ...(Array.isArray(node?.graph?.list_of_graphcanvas) ? node.graph.list_of_graphcanvas : []),
        app?.canvas,
    ];
    for (const canvas of canvases) {
        const candidates = [canvas?.ds?.scale, canvas?.ds?.scaleX];
        for (const candidate of candidates) {
            const scale = Number(candidate);
            if (Number.isFinite(scale) && scale > 0.01) return scale;
        }
    }
    return 1;
}

function applyInitialNodeWidth(node, extensionApp = app) {
    if (!node || node._zrlInitialWidthApplied) return;
    const scale = Math.max(INITIAL_NODE_MIN_SCALE, getInitialCanvasScale(node, extensionApp));
    const targetWidth = Math.max(
        INITIAL_NODE_MIN_GRAPH_WIDTH,
        Math.min(INITIAL_NODE_MAX_GRAPH_WIDTH, Math.ceil(INITIAL_NODE_SCREEN_WIDTH / scale)),
    );
    const current = Array.isArray(node.size) ? [...node.size] : [targetWidth, DEFAULT_NODE_HEIGHT];
    const currentWidth = Number(current[0]);
    if (!Number.isFinite(currentWidth) || currentWidth < targetWidth) {
        current[0] = targetWidth;
        if (typeof node.setSize === "function") node.setSize(current);
        else node.size = current;
    }
    // Mark only after the one-time creation adjustment. There are deliberately
    // no setSize/onResize/computeSize wrappers or draw-loop corrections.
    node._zrlInitialWidthApplied = true;
}

function widgetLabel(translation, name) {
    return name === "anti_ai" ? (translation.strengthLabel || "Strength") : translation.widgetLabels[name];
}

const LANGUAGES = Object.freeze([
    { code: "en", label: "English" },
    { code: "zh", label: "简体中文" },
    { code: "ja", label: "日本語" },
    { code: "es", label: "Español" },
    { code: "pt", label: "Português" },
    { code: "fr", label: "Français" },
    { code: "ru", label: "Русский" },
    { code: "de", label: "Deutsch" },
    { code: "hi", label: "हिन्दी" },
    { code: "ar", label: "العربية" },
]);

// The language preference is browser-local and intentionally never enters
// ComfyUI widget values, workflow JSON, or prompt/API inputs.
const TRANSLATIONS = Object.freeze({
    en: {
        emulsionLabel: 'COLOR FILM EMULSION', emulsionNeutral: 'Neutral · No emulsion', emulsionCategories: { Cinema: 'CINEMA / MOTION PICTURE', Instant: 'INSTANT FILM', Slide: 'SLIDE / REVERSAL', "35mm": '35MM COLOR NEGATIVE' },
        whiteBalanceLabel: 'WHITE BALANCE',
        whiteBalanceNeutral: 'BASE WB',
        wbCool: 'COOL',
        wbWarm: 'WARM',
        wbGreen: 'GREEN',
        wbMagenta: 'MAGENTA',
        wbReset: 'Reset WB',
        wbTemp: 'TEMP',
        wbTint: 'TINT',  strengthLabel: 'Strength', noiseScale: 'Texture Scale', language: "Language",
        before: "BEFORE", after: "AFTER", halationGroup: "HALATION", bloomGroup: "BLOOM", compareTooltip: "Toggle between original and processed image",
        previewQueue: "Queue the node once to create a preview source.",
        previewUpdating: "Updating preview…", previewUnavailable: "Preview unavailable",
        source: "Source", grainDetail: "GRAIN & TEXTURE DETAIL · CENTER CROP 240 PX", filmGrain: "FILM GRAIN", antiAIGroup: "ANTI-AI", sabattierGroup: "SABATTIER", proceduralTexture: "PROCEDURAL TEXTURE", noiseTextureLabel: "Noise Texture", noiseAmount: "Noise Amount", noiseSeed: "Noise Seed", noiseTextures: {'Gaussian': 'Gaussian', 'Value fBm': 'Value fBm', 'Gradient fBm': 'Gradient fBm', 'Simplex fBm': 'Simplex fBm', 'Ridged fBm': 'Ridged fBm', 'Worley Microcells': 'Worley Microcells', 'Domain Warp': 'Domain Warp', 'Silver Halide Clumps': 'Silver Halide Clumps', 'Emulsion Mottle': 'Emulsion Mottle', 'Film Scratches': 'Film Scratches', 'Dust & Fibers': 'Dust & Fibers', 'Paper Foxing': 'Paper Foxing'}, softFocus: "SOFT FOCUS", vignette: "VIGNETTE",
        amount: "Amount", size: "Size", colorGrain: "Color Grain",
        halationColor: "Halation Color", leakColor: "Leak Color",
        resetDefaults: "↺  Reset to Defaults",
        resetTitle: "Restore all Zuanfilm Retrolab controls to their factory defaults",
        chooseColor: "Choose color", leakModeLabel: 'Light Leak Mode', leakPositionLabel: "Leak Position",
        widgetLabels: {
            halation_amount: "Halation Amount", ring_radius: "Ring Radius",
            bloom_amount: "Bloom Amount", bloom_threshold: "Bloom Threshold", bloom_radius: "Bloom Radius",
            solarization: "Solarization", highlight_confinement: "Highlight Confinement", mackie_lines: "Mackie Lines",
            leak_exposure: "Leak Exposure", leak_seed: "Leak Seed", leak_radius: "Leak Radius", vignette_amount: "Vignette Amount", vignette_feather: "Vignette Feather", soft_focus_amount: "Soft Focus Amount", soft_focus_radius: "Soft Focus Radius",
            anti_ai: "Strength", exposure: "Exposure",
        },
        leakModes: { "Soft Edge": "Soft Edge", "First-Frame Burn": "First-Frame Burn", "120 Fat Roll": "120 Fat Roll", "Light Piping": "Light Piping", "Holga 135": "Holga 135" },
        leakPositions: { "Top": "Top", "Bottom": "Bottom", "Left": "Left", "Right": "Right", "Top Left": "Top Left", "Top Right": "Top Right", "Bottom Left": "Bottom Left", "Bottom Right": "Bottom Right" },
    },
    zh: {
        emulsionLabel: '彩色胶片乳剂', emulsionNeutral: '中性 · 不应用乳剂', emulsionCategories: { Cinema: '电影胶片', Instant: '拍立得 / 即时成像', Slide: '反转片 / 正片', "35mm": '35毫米彩色负片' },
        whiteBalanceLabel: '白平衡',
        whiteBalanceNeutral: '基础白平衡',
        wbCool: '冷色',
        wbWarm: '暖色',
        wbGreen: '绿色',
        wbMagenta: '品红',
        wbReset: '重置白平衡',
        wbTemp: '色温',
        wbTint: '色调', strengthLabel: '强度', noiseScale: '纹理尺寸', language: "语言",
        before: "处理前", after: "处理后", halationGroup: "晕光", bloomGroup: "辉光", compareTooltip: "切换原图与处理后图像",
        previewQueue: "运行一次节点以创建预览源。", previewUpdating: "正在更新预览…",
        previewUnavailable: "预览不可用", source: "原图", grainDetail: "颗粒与纹理细节 · 中心裁切 240 像素", filmGrain: "胶片颗粒", antiAIGroup: "反 AI 校正", sabattierGroup: "萨巴蒂效应", proceduralTexture: "程序纹理", noiseTextureLabel: "噪声纹理", noiseAmount: "噪声强度", noiseSeed: "噪声种子", noiseTextures: {'Gaussian': '高斯', 'Value fBm': '值噪声 fBm', 'Gradient fBm': '梯度噪声 fBm', 'Simplex fBm': 'Simplex fBm', 'Ridged fBm': '脊状 fBm', 'Worley Microcells': 'Worley 微单元', 'Domain Warp': '域扭曲', 'Silver Halide Clumps': '卤化银颗粒团', 'Emulsion Mottle': '乳剂斑驳', 'Film Scratches': '胶片划痕', 'Dust & Fibers': '灰尘与纤维', 'Paper Foxing': '相纸霉斑'}, softFocus: "柔焦", vignette: "暗角",
        amount: "强度", size: "颗粒尺寸", colorGrain: "彩色颗粒",
        halationColor: "晕光颜色", leakColor: "漏光颜色", resetDefaults: "↺  恢复默认值",
        resetTitle: "将 Zuanfilm Retrolab 的所有控件恢复为出厂默认值", chooseColor: "选择颜色",
        leakModeLabel: '漏光模式', leakPositionLabel: "漏光位置",
        widgetLabels: {
            halation_amount: "晕光强度", ring_radius: "光环半径", bloom_amount: "辉光强度", bloom_threshold: "辉光阈值", bloom_radius: "辉光半径",
            solarization: "萨巴蒂效应", highlight_confinement: "高光限制", mackie_lines: "麦基线", leak_exposure: "漏光曝光", leak_seed: "漏光种子", leak_radius: "漏光范围", vignette_amount: "暗角强度", vignette_feather: "暗角羽化", soft_focus_amount: "柔焦强度", soft_focus_radius: "柔焦半径",
            anti_ai: "强度", exposure: "曝光",
        },
        leakModes: { "Soft Edge": "柔和边缘", "First-Frame Burn": "首帧烧片", "120 Fat Roll": "120 胶卷卷边", "Light Piping": "导光漏光", "Holga 135": "Holga 135" },
        leakPositions: { "Top": "顶部", "Bottom": "底部", "Left": "左侧", "Right": "右侧", "Top Left": "左上", "Top Right": "右上", "Bottom Left": "左下", "Bottom Right": "右下" },
    },
    hi: {
        emulsionLabel: 'कलर फिल्म इमल्शन', emulsionNeutral: 'न्यूट्रल · कोई इमल्शन नहीं', emulsionCategories: { Cinema: 'सिनेमा / मोशन पिक्चर', Instant: 'इंस्टेंट फिल्म', Slide: 'स्लाइड / रिवर्सल', "35mm": '35MM कलर नेगेटिव' },
        whiteBalanceLabel: 'श्वेत संतुलन',
        whiteBalanceNeutral: 'बेस WB',
        wbCool: 'ठंडा',
        wbWarm: 'गर्म',
        wbGreen: 'हरा',
        wbMagenta: 'मैजेंटा',
        wbReset: 'WB रीसेट करें',
        wbTemp: 'ताप',
        wbTint: 'टिंट', strengthLabel: 'ताकत', noiseScale: 'टेक्सचर स्केल', language: "भाषा",
        before: "पहले", after: "बाद", halationGroup: "हेलो", bloomGroup: "ब्लूम", compareTooltip: "मूल और संसाधित छवि के बीच बदलें",
        previewQueue: "पूर्वावलोकन स्रोत बनाने के लिए नोड को एक बार चलाएँ।", previewUpdating: "पूर्वावलोकन अपडेट हो रहा है…",
        previewUnavailable: "पूर्वावलोकन उपलब्ध नहीं है", source: "स्रोत", grainDetail: "ग्रेन एवं टेक्सचर विवरण · केंद्र क्रॉप 240 PX", filmGrain: "फिल्म ग्रेन", antiAIGroup: "एंटी-AI", sabattierGroup: "सबैटियर", proceduralTexture: "प्रोसीजरल टेक्सचर", noiseTextureLabel: "नॉइज़ टेक्सचर", noiseAmount: "नॉइज़ मात्रा", noiseSeed: "नॉइज़ सीड", noiseTextures: {'Gaussian': 'गॉसियन', 'Value fBm': 'वैल्यू fBm', 'Gradient fBm': 'ग्रेडिएंट fBm', 'Simplex fBm': 'सिंप्लेक्स fBm', 'Ridged fBm': 'रिज्ड fBm', 'Worley Microcells': 'वॉर्ली माइक्रोसेल', 'Domain Warp': 'डोमेन वॉर्प', 'Silver Halide Clumps': 'सिल्वर हैलाइड गुच्छे', 'Emulsion Mottle': 'इमल्शन मॉटल', 'Film Scratches': 'फिल्म की खरोंचें', 'Dust & Fibers': 'धूल और रेशे', 'Paper Foxing': 'कागज़ के पुराने धब्बे'}, softFocus: "सॉफ्ट फोकस", vignette: "विग्नेट",
        amount: "मात्रा", size: "आकार", colorGrain: "रंगीन ग्रेन",
        halationColor: "हेलो रंग", leakColor: "लाइट लीक रंग", resetDefaults: "↺  डिफ़ॉल्ट रीसेट करें",
        resetTitle: "Zuanfilm Retrolab के सभी नियंत्रण फ़ैक्टरी डिफ़ॉल्ट पर लौटाएँ", chooseColor: "रंग चुनें",
        leakModeLabel: 'लाइट लीक मोड', leakPositionLabel: "लीक स्थिति",
        widgetLabels: {
            halation_amount: "हेलो मात्रा", ring_radius: "रिंग त्रिज्या", bloom_amount: "ब्लूम मात्रा", bloom_threshold: "ब्लूम थ्रेशोल्ड", bloom_radius: "ब्लूम त्रिज्या",
            solarization: "सोलराइज़ेशन", highlight_confinement: "हाइलाइट सीमा", mackie_lines: "मैकी लाइनें", leak_exposure: "लीक एक्सपोज़र", leak_seed: "लीक सीड", leak_radius: "लीक त्रिज्या", vignette_amount: "विग्नेट मात्रा", vignette_feather: "विग्नेट फेदर", soft_focus_amount: "सॉफ्ट फोकस मात्रा", soft_focus_radius: "सॉफ्ट फोकस त्रिज्या",
            anti_ai: "ताकत", exposure: "एक्सपोज़र",
        },
        leakModes: { "Soft Edge": "नरम किनारा", "First-Frame Burn": "पहले फ़्रेम का बर्न", "120 Fat Roll": "120 फ़ैट रोल", "Light Piping": "लाइट पाइपिंग", "Holga 135": "Holga 135" },
        leakPositions: { "Top": "ऊपर", "Bottom": "नीचे", "Left": "बाएँ", "Right": "दाएँ", "Top Left": "ऊपर बाएँ", "Top Right": "ऊपर दाएँ", "Bottom Left": "नीचे बाएँ", "Bottom Right": "नीचे दाएँ" },
    },
    es: {
        emulsionLabel: 'EMULSIÓN DE PELÍCULA EN COLOR', emulsionNeutral: 'Neutral · Sin emulsión', emulsionCategories: { Cinema: 'CINE / PELÍCULA CINEMATOGRÁFICA', Instant: 'PELÍCULA INSTANTÁNEA', Slide: 'DIAPOSITIVA / REVERSIBLE', "35mm": 'NEGATIVO COLOR 35 MM' },
        whiteBalanceLabel: 'BALANCE DE BLANCOS',
        whiteBalanceNeutral: 'WB BASE',
        wbCool: 'FRÍO',
        wbWarm: 'CÁLIDO',
        wbGreen: 'VERDE',
        wbMagenta: 'MAGENTA',
        wbReset: 'Restablecer WB',
        wbTemp: 'TEMP.',
        wbTint: 'TINTE',
        strengthLabel: 'Intensidad', noiseScale: 'Escala de textura', language: "Idioma",
        before: "ANTES", after: "DESPUÉS", halationGroup: "HALACIÓN", bloomGroup: "BLOOM", compareTooltip: "Alternar entre imagen original y procesada",
        previewQueue: "Ejecuta el nodo una vez para crear la fuente de vista previa.", previewUpdating: "Actualizando vista previa…",
        previewUnavailable: "Vista previa no disponible", source: "Origen", grainDetail: "DETALLE DE GRANO Y TEXTURA · RECORTE CENTRAL 240 PX", filmGrain: "GRANO DE PELÍCULA", antiAIGroup: "ANTI-IA", sabattierGroup: "SABATTIER", proceduralTexture: "TEXTURA PROCEDURAL", noiseTextureLabel: "Textura de ruido", noiseAmount: "Cantidad de ruido", noiseSeed: "Semilla de ruido", noiseTextures: {'Gaussian': 'Gaussiano', 'Value fBm': 'Value fBm', 'Gradient fBm': 'Gradient fBm', 'Simplex fBm': 'Simplex fBm', 'Ridged fBm': 'Ridged fBm', 'Worley Microcells': 'Microceldas Worley', 'Domain Warp': 'Distorsión de dominio', 'Silver Halide Clumps': 'Grumos de haluro de plata', 'Emulsion Mottle': 'Moteado de emulsión', 'Film Scratches': 'Rayas de película', 'Dust & Fibers': 'Polvo y fibras', 'Paper Foxing': 'Manchas de papel'}, softFocus: "ENFOQUE SUAVE", vignette: "VIÑETA",
        amount: "Cantidad", size: "Tamaño", colorGrain: "Grano de color",
        halationColor: "Color de halación", leakColor: "Color de fuga de luz", resetDefaults: "↺  Restablecer valores",
        resetTitle: "Restaurar todos los controles de Zuanfilm Retrolab a sus valores de fábrica", chooseColor: "Elegir color",
        leakModeLabel: 'Modo de fuga de luz', leakPositionLabel: "Posición de fuga",
        widgetLabels: {
            halation_amount: "Intensidad de halación", ring_radius: "Radio del anillo", bloom_amount: "Intensidad de bloom", bloom_threshold: "Umbral de bloom", bloom_radius: "Radio de bloom",
            solarization: "Solarización", highlight_confinement: "Confinamiento de luces", mackie_lines: "Líneas Mackie", leak_exposure: "Exposición de fuga", leak_seed: "Semilla de fuga", leak_radius: "Radio de fuga", vignette_amount: "Intensidad de viñeta", vignette_feather: "Transición de viñeta", soft_focus_amount: "Intensidad de enfoque suave", soft_focus_radius: "Radio de enfoque suave",
            anti_ai: "Intensidad", exposure: "Exposición",
        },
        leakModes: { "Soft Edge": "Borde suave", "First-Frame Burn": "Quemado del primer fotograma", "120 Fat Roll": "Fat Roll 120", "Light Piping": "Fuga por conducción de luz", "Holga 135": "Holga 135" },
        leakPositions: { "Top": "Arriba", "Bottom": "Abajo", "Left": "Izquierda", "Right": "Derecha", "Top Left": "Arriba a la izquierda", "Top Right": "Arriba a la derecha", "Bottom Left": "Abajo a la izquierda", "Bottom Right": "Abajo a la derecha" },
    },
    ar: {
        emulsionLabel: 'مستحلب أفلام ملونة', emulsionNeutral: 'محايد · بدون مستحلب', emulsionCategories: { Cinema: 'سينما / أفلام الحركة', Instant: 'أفلام فورية', Slide: 'شرائح / عكسية', "35mm": 'نيجاتيف ملون 35 مم' },
        whiteBalanceLabel: 'توازن اللون الأبيض',
        whiteBalanceNeutral: 'توازن أبيض أساسي',
        wbCool: 'بارد',
        wbWarm: 'دافئ',
        wbGreen: 'أخضر',
        wbMagenta: 'أرجواني',
        wbReset: 'إعادة ضبط توازن الأبيض',
        wbTemp: 'حرارة',
        wbTint: 'صبغة', strengthLabel: 'الشدة', noiseScale: 'مقياس النسيج', language: "اللغة",
        before: "قبل", after: "بعد", halationGroup: "الهالة", bloomGroup: "التوهج", compareTooltip: "التبديل بين الصورة الأصلية والمعالجة",
        previewQueue: "شغّل العقدة مرة واحدة لإنشاء مصدر للمعاينة.", previewUpdating: "جارٍ تحديث المعاينة…",
        previewUnavailable: "المعاينة غير متاحة", source: "المصدر", grainDetail: "تفاصيل الحبيبات والملمس · قص مركزي 240 بكسل", filmGrain: "حبيبات الفيلم", antiAIGroup: "مضاد للذكاء الاصطناعي", sabattierGroup: "ساباتييه", proceduralTexture: "نسيج إجرائي", noiseTextureLabel: "نسيج الضوضاء", noiseAmount: "مقدار الضوضاء", noiseSeed: "بذرة الضوضاء", noiseTextures: {'Gaussian': 'غاوسي', 'Value fBm': 'Value fBm', 'Gradient fBm': 'Gradient fBm', 'Simplex fBm': 'Simplex fBm', 'Ridged fBm': 'Ridged fBm', 'Worley Microcells': 'خلايا Worley دقيقة', 'Domain Warp': 'تشويه المجال', 'Silver Halide Clumps': 'تكتلات هاليد الفضة', 'Emulsion Mottle': 'تبقع المستحلب', 'Film Scratches': 'خدوش الفيلم', 'Dust & Fibers': 'غبار وألياف', 'Paper Foxing': 'بقع الورق القديم'}, softFocus: "تركيز ناعم", vignette: "تظليل",
        amount: "القوة", size: "الحجم", colorGrain: "حبيبات ملونة",
        halationColor: "لون الهالة", leakColor: "لون تسرب الضوء", resetDefaults: "↺  استعادة الإعدادات الافتراضية",
        resetTitle: "استعادة جميع عناصر Zuanfilm Retrolab إلى إعدادات المصنع", chooseColor: "اختيار اللون",
        leakModeLabel: 'وضع تسرب الضوء', leakPositionLabel: "موضع التسرب",
        widgetLabels: {
            halation_amount: "قوة الهالة", ring_radius: "نصف قطر الحلقة", bloom_amount: "قوة التوهج", bloom_threshold: "عتبة التوهج", bloom_radius: "نصف قطر التوهج",
            solarization: "التشميس", highlight_confinement: "حصر الإضاءات", mackie_lines: "خطوط ماكي", leak_exposure: "تعريض التسرب", leak_seed: "بذرة التسرب", leak_radius: "نطاق التسرب", vignette_amount: "قوة التظليل", vignette_feather: "تدرج التظليل", soft_focus_amount: "قوة التركيز الناعم", soft_focus_radius: "نصف قطر التركيز الناعم",
            anti_ai: "الشدة", exposure: "التعريض",
        },
        leakModes: { "Soft Edge": "حافة ناعمة", "First-Frame Burn": "احتراق الإطار الأول", "120 Fat Roll": "لفة فيلم 120", "Light Piping": "تسرب عبر توجيه الضوء", "Holga 135": "Holga 135" },
        leakPositions: { "Top": "أعلى", "Bottom": "أسفل", "Left": "يسار", "Right": "يمين", "Top Left": "أعلى اليسار", "Top Right": "أعلى اليمين", "Bottom Left": "أسفل اليسار", "Bottom Right": "أسفل اليمين" },
    },
    fr: {
        emulsionLabel: 'ÉMULSION PHOTO COULEUR', emulsionNeutral: 'Neutre · Sans émulsion', emulsionCategories: { Cinema: 'CINÉMA / FILM CINÉMATOGRAPHIQUE', Instant: 'FILM INSTANTANÉ', Slide: 'DIAPOSITIVE / INVERSIBLE', "35mm": 'NÉGATIF COULEUR 35 MM' },
        whiteBalanceLabel: 'BALANCE DES BLANCS',
        whiteBalanceNeutral: 'BdB DE BASE',
        wbCool: 'FROID',
        wbWarm: 'CHAUD',
        wbGreen: 'VERT',
        wbMagenta: 'MAGENTA',
        wbReset: 'Réinitialiser BdB',
        wbTemp: 'TEMP.',
        wbTint: 'TEINTE', strengthLabel: 'Intensité', noiseScale: 'Échelle de texture', language: "Langue",
        before: "AVANT", after: "APRÈS", halationGroup: "HALATION", bloomGroup: "BLOOM", compareTooltip: "Basculer entre l’image originale et l’image traitée",
        previewQueue: "Exécutez le nœud une fois pour créer une source d’aperçu.", previewUpdating: "Mise à jour de l’aperçu…",
        previewUnavailable: "Aperçu indisponible", source: "Source", grainDetail: "DÉTAIL GRAIN & TEXTURE · RECADRAGE CENTRAL 240 PX", filmGrain: "GRAIN ARGENTIQUE", antiAIGroup: "ANTI-IA", sabattierGroup: "SABATTIER", proceduralTexture: "TEXTURE PROCÉDURALE", noiseTextureLabel: "Texture de bruit", noiseAmount: "Intensité du bruit", noiseSeed: "Graine du bruit", noiseTextures: {'Gaussian': 'Gaussien', 'Value fBm': 'Value fBm', 'Gradient fBm': 'Gradient fBm', 'Simplex fBm': 'Simplex fBm', 'Ridged fBm': 'Ridged fBm', 'Worley Microcells': 'Microcellules Worley', 'Domain Warp': 'Distorsion de domaine', 'Silver Halide Clumps': 'Amas d’halogénure d’argent', 'Emulsion Mottle': 'Marbrure d’émulsion', 'Film Scratches': 'Rayures de film', 'Dust & Fibers': 'Poussière et fibres', 'Paper Foxing': 'Taches de papier ancien'}, softFocus: "FLOU DIFFUS", vignette: "VIGNETTAGE",
        amount: "Intensité", size: "Taille", colorGrain: "Grain couleur",
        halationColor: "Couleur de l’halation", leakColor: "Couleur de fuite de lumière", resetDefaults: "↺  Réinitialiser",
        resetTitle: "Rétablir les valeurs d’usine de tous les réglages de Zuanfilm Retrolab", chooseColor: "Choisir une couleur",
        leakModeLabel: 'Mode de fuite de lumière', leakPositionLabel: "Position de fuite",
        widgetLabels: {
            halation_amount: "Intensité de l’halation", ring_radius: "Rayon de l’anneau", bloom_amount: "Intensité du bloom", bloom_threshold: "Seuil du bloom", bloom_radius: "Rayon du bloom",
            solarization: "Solarisation", highlight_confinement: "Limitation des hautes lumières", mackie_lines: "Lignes Mackie", leak_exposure: "Exposition de fuite", leak_seed: "Graine de fuite", leak_radius: "Rayon de fuite", vignette_amount: "Intensité du vignettage", vignette_feather: "Progressivité du vignettage", soft_focus_amount: "Intensité du flou doux", soft_focus_radius: "Rayon du flou doux",
            anti_ai: "Intensité", exposure: "Exposition",
        },
        leakModes: { "Soft Edge": "Bord doux", "First-Frame Burn": "Brûlure de première image", "120 Fat Roll": "Fat Roll 120", "Light Piping": "Fuite par conduction lumineuse", "Holga 135": "Holga 135" },
        leakPositions: { "Top": "Haut", "Bottom": "Bas", "Left": "Gauche", "Right": "Droite", "Top Left": "Haut gauche", "Top Right": "Haut droite", "Bottom Left": "Bas gauche", "Bottom Right": "Bas droite" },
    },
    pt: {
        emulsionLabel: 'EMULSÃO DE FILME COLORIDO', emulsionNeutral: 'Neutro · Sem emulsão', emulsionCategories: { Cinema: 'CINEMA / FILME CINEMATOGRÁFICO', Instant: 'FILME INSTANTÂNEO', Slide: 'SLIDE / REVERSÍVEL', "35mm": 'NEGATIVO COLORIDO 35 MM' },
        whiteBalanceLabel: 'BALANÇO DE BRANCO',
        whiteBalanceNeutral: 'WB BASE',
        wbCool: 'FRIO',
        wbWarm: 'QUENTE',
        wbGreen: 'VERDE',
        wbMagenta: 'MAGENTA',
        wbReset: 'Redefinir WB',
        wbTemp: 'TEMP.',
        wbTint: 'MATIZ', strengthLabel: 'Intensidade', noiseScale: 'Escala da textura', language: "Idioma",
        before: "ANTES", after: "DEPOIS", halationGroup: "HALATION", bloomGroup: "BLOOM", compareTooltip: "Alternar entre a imagem original e a processada",
        previewQueue: "Execute o nó uma vez para criar uma fonte de prévia.", previewUpdating: "Atualizando prévia…",
        previewUnavailable: "Prévia indisponível", source: "Origem", grainDetail: "DETALHE DE GRÃO E TEXTURA · RECORTE CENTRAL 240 PX", filmGrain: "GRÃO DE FILME", antiAIGroup: "ANTI-IA", sabattierGroup: "SABATTIER", proceduralTexture: "TEXTURA PROCEDURAL", noiseTextureLabel: "Textura de ruído", noiseAmount: "Intensidade do ruído", noiseSeed: "Semente do ruído", noiseTextures: {'Gaussian': 'Gaussiano', 'Value fBm': 'Value fBm', 'Gradient fBm': 'Gradient fBm', 'Simplex fBm': 'Simplex fBm', 'Ridged fBm': 'Ridged fBm', 'Worley Microcells': 'Microcélulas Worley', 'Domain Warp': 'Distorção de domínio', 'Silver Halide Clumps': 'Aglomerados de haleto de prata', 'Emulsion Mottle': 'Marmorização da emulsão', 'Film Scratches': 'Riscos no filme', 'Dust & Fibers': 'Poeira e fibras', 'Paper Foxing': 'Manchas de papel envelhecido'}, softFocus: "FOCO SUAVE", vignette: "VINHETA",
        amount: "Intensidade", size: "Tamanho", colorGrain: "Grão colorido",
        halationColor: "Cor da halation", leakColor: "Cor do vazamento de luz", resetDefaults: "↺  Restaurar padrões",
        resetTitle: "Restaurar todos os controles do Zuanfilm Retrolab aos padrões de fábrica", chooseColor: "Escolher cor",
        leakModeLabel: 'Modo de vazamento de luz', leakPositionLabel: "Posição do vazamento",
        widgetLabels: {
            halation_amount: "Intensidade da halation", ring_radius: "Raio do anel", bloom_amount: "Intensidade do bloom", bloom_threshold: "Limiar do bloom", bloom_radius: "Raio do bloom",
            solarization: "Solarização", highlight_confinement: "Limite dos realces", mackie_lines: "Linhas Mackie", leak_exposure: "Exposição do vazamento", leak_seed: "Semente do vazamento", leak_radius: "Raio do vazamento", vignette_amount: "Intensidade da vinheta", vignette_feather: "Transição da vinheta", soft_focus_amount: "Intensidade do foco suave", soft_focus_radius: "Raio do foco suave",
            anti_ai: "Intensidade", exposure: "Exposição",
        },
        leakModes: { "Soft Edge": "Borda suave", "First-Frame Burn": "Queima do primeiro quadro", "120 Fat Roll": "Fat Roll 120", "Light Piping": "Condução de luz", "Holga 135": "Perfurações 135" },
        leakPositions: { "Top": "Topo", "Bottom": "Base", "Left": "Esquerda", "Right": "Direita", "Top Left": "Superior esquerdo", "Top Right": "Superior direito", "Bottom Left": "Inferior esquerdo", "Bottom Right": "Inferior direito" },
    },
    ru: {
        emulsionLabel: 'ЦВЕТНАЯ ФОТОЭМУЛЬСИЯ', emulsionNeutral: 'Нейтральный · Без эмульсии', emulsionCategories: { Cinema: 'КИНО / КИНОПЛЁНКА', Instant: 'МОМЕНТАЛЬНАЯ ФОТОГРАФИЯ', Slide: 'СЛАЙД / ОБРАЩАЕМАЯ ПЛЁНКА', "35mm": '35-ММ ЦВЕТНОЙ НЕГАТИВ' },
        whiteBalanceLabel: 'БАЛАНС БЕЛОГО',
        whiteBalanceNeutral: 'БАЗОВЫЙ ББ',
        wbCool: 'ХОЛОДНЫЙ',
        wbWarm: 'ТЁПЛЫЙ',
        wbGreen: 'ЗЕЛЁНЫЙ',
        wbMagenta: 'ПУРПУРНЫЙ',
        wbReset: 'Сбросить ББ',
        wbTemp: 'ТЕМП.',
        wbTint: 'ОТТЕНОК', strengthLabel: 'Сила', noiseScale: 'Масштаб текстуры', language: "Язык",
        before: "ДО", after: "ПОСЛЕ", halationGroup: "ОРЕОЛ", bloomGroup: "СВЕЧЕНИЕ", compareTooltip: "Переключить исходное и обработанное изображение",
        previewQueue: "Запустите узел один раз, чтобы создать источник предпросмотра.", previewUpdating: "Обновление предпросмотра…",
        previewUnavailable: "Предпросмотр недоступен", source: "Источник", grainDetail: "ДЕТАЛИ ЗЕРНА И ТЕКСТУРЫ · ЦЕНТРАЛЬНЫЙ КАДР 240 PX", filmGrain: "ЗЕРНО ПЛЁНКИ", antiAIGroup: "АНТИ-ИИ", sabattierGroup: "САБАТЬЕ", proceduralTexture: "ПРОЦЕДУРНАЯ ТЕКСТУРА", noiseTextureLabel: "Текстура шума", noiseAmount: "Интенсивность шума", noiseSeed: "Сид шума", noiseTextures: {'Gaussian': 'Гауссовский', 'Value fBm': 'Value fBm', 'Gradient fBm': 'Gradient fBm', 'Simplex fBm': 'Simplex fBm', 'Ridged fBm': 'Ridged fBm', 'Worley Microcells': 'Микроячейки Worley', 'Domain Warp': 'Доменное искажение', 'Silver Halide Clumps': 'Скопления галогенида серебра', 'Emulsion Mottle': 'Пятнистость эмульсии', 'Film Scratches': 'Царапины плёнки', 'Dust & Fibers': 'Пыль и волокна', 'Paper Foxing': 'Пятна старой бумаги'}, softFocus: "МЯГКИЙ ФОКУС", vignette: "ВИНЬЕТКА",
        amount: "Количество", size: "Размер", colorGrain: "Цветное зерно",
        halationColor: "Цвет ореола", leakColor: "Цвет засветки", resetDefaults: "↺  Сбросить настройки",
        resetTitle: "Вернуть все настройки Zuanfilm Retrolab к заводским значениям", chooseColor: "Выбрать цвет",
        leakModeLabel: 'Режим засветки', leakPositionLabel: "Положение засветки",
        widgetLabels: {
            halation_amount: "Интенсивность ореола", ring_radius: "Радиус кольца", bloom_amount: "Интенсивность свечения", bloom_threshold: "Порог свечения", bloom_radius: "Радиус свечения",
            solarization: "Соляризация", highlight_confinement: "Ограничение светов", mackie_lines: "Линии Макки", leak_exposure: "Экспозиция засветки", leak_seed: "Семя засветки", leak_radius: "Радиус засветки", vignette_amount: "Интенсивность виньетки", vignette_feather: "Растушёвка виньетки", soft_focus_amount: "Интенсивность мягкого фокуса", soft_focus_radius: "Радиус мягкого фокуса",
            anti_ai: "Сила", exposure: "Экспозиция",
        },
        leakModes: { "Soft Edge": "Мягкий край", "First-Frame Burn": "Засветка первого кадра", "120 Fat Roll": "120 Fat Roll", "Light Piping": "Световая проводка", "Holga 135": "Holga 135" },
        leakPositions: { "Top": "Сверху", "Bottom": "Снизу", "Left": "Слева", "Right": "Справа", "Top Left": "Сверху слева", "Top Right": "Сверху справа", "Bottom Left": "Снизу слева", "Bottom Right": "Снизу справа" },
    },
    ja: {
        emulsionLabel: 'カラーフィルム乳剤', emulsionNeutral: 'ニュートラル · 乳剤なし', emulsionCategories: { Cinema: 'シネマ / 映画用フィルム', Instant: 'インスタントフィルム', Slide: 'リバーサル / スライド', "35mm": '35MM カラーネガ' },
        whiteBalanceLabel: 'ホワイトバランス',
        whiteBalanceNeutral: 'ベース WB',
        wbCool: '寒色',
        wbWarm: '暖色',
        wbGreen: 'グリーン',
        wbMagenta: 'マゼンタ',
        wbReset: 'WBをリセット',
        wbTemp: '色温度',
        wbTint: '色かぶり', strengthLabel: '強さ', noiseScale: 'テクスチャスケール', language: "言語",
        before: "処理前", after: "処理後", halationGroup: "ハレーション", bloomGroup: "ブルーム", compareTooltip: "元画像と処理後の画像を切り替える",
        previewQueue: "プレビューを作成するには、ノードを一度実行してください。", previewUpdating: "プレビューを更新中…",
        previewUnavailable: "プレビューを利用できません", source: "元画像", grainDetail: "グレイン＆テクスチャ詳細 · 中央クロップ 240 PX", filmGrain: "フィルムグレイン", antiAIGroup: "AI補正", sabattierGroup: "サバティエ", proceduralTexture: "プロシージャルテクスチャ", noiseTextureLabel: "ノイズテクスチャ", noiseAmount: "ノイズ量", noiseSeed: "ノイズシード", noiseTextures: {'Gaussian': 'ガウス', 'Value fBm': 'Value fBm', 'Gradient fBm': 'Gradient fBm', 'Simplex fBm': 'Simplex fBm', 'Ridged fBm': 'Ridged fBm', 'Worley Microcells': 'Worleyマイクロセル', 'Domain Warp': 'ドメインワープ', 'Silver Halide Clumps': 'ハロゲン化銀の粒子塊', 'Emulsion Mottle': '乳剤のむら', 'Film Scratches': 'フィルムの傷', 'Dust & Fibers': 'ほこりと繊維', 'Paper Foxing': '古紙の斑点'}, softFocus: "ソフトフォーカス", vignette: "ビネット",
        amount: "量", size: "サイズ", colorGrain: "カラ―グレイン",
        halationColor: "ハレーションの色", leakColor: "光漏れの色", resetDefaults: "↺  デフォルトに戻す",
        resetTitle: "Zuanfilm Retrolab のすべての設定を初期値に戻します", chooseColor: "色を選択",
        leakModeLabel: 'ライトリークモード', leakPositionLabel: "光漏れの位置",
        widgetLabels: {
            halation_amount: "ハレーション量", ring_radius: "リング半径", bloom_amount: "ブルーム量", bloom_threshold: "ブルームしきい値", bloom_radius: "ブルーム半径",
            solarization: "ソラリゼーション", highlight_confinement: "ハイライト範囲", mackie_lines: "マッキーライン", leak_exposure: "光漏れ露出", leak_seed: "光漏れシード", leak_radius: "光漏れ半径", vignette_amount: "ビネットの強さ", vignette_feather: "ビネットのぼかし", soft_focus_amount: "ソフトフォーカスの強さ", soft_focus_radius: "ソフトフォーカス半径",
            anti_ai: "強さ", exposure: "露出",
        },
        leakModes: { "Soft Edge": "ソフトエッジ", "First-Frame Burn": "ファーストフレーム焼け", "120 Fat Roll": "120 ファットロール", "Light Piping": "ライトパイピング", "Holga 135": "Holga 135" },
        leakPositions: { "Top": "上", "Bottom": "下", "Left": "左", "Right": "右", "Top Left": "左上", "Top Right": "右上", "Bottom Left": "左下", "Bottom Right": "右下" },
    },
    de: {
        emulsionLabel: 'FARBFILM-EMULSION', emulsionNeutral: 'Neutral · Keine Emulsion', emulsionCategories: { Cinema: 'KINO / MOTION-PICTURE-FILM', Instant: 'SOFORTBILDFILM', Slide: 'DIA / UMKEHRFILM', "35mm": '35-MM-FARBNEGATIV' },
        whiteBalanceLabel: 'WEISSABGLEICH',
        whiteBalanceNeutral: 'BASIS-WB',
        wbCool: 'KÜHL',
        wbWarm: 'WARM',
        wbGreen: 'GRÜN',
        wbMagenta: 'MAGENTA',
        wbReset: 'Weißabgleich zurücksetzen',
        wbTemp: 'TEMP.',
        wbTint: 'FARBTON', strengthLabel: 'Stärke', noiseScale: 'Texturskalierung', language: "Sprache",
        before: "VORHER", after: "NACHHER", halationGroup: "HALATION", bloomGroup: "BLOOM", compareTooltip: "Zwischen Original und bearbeitetem Bild wechseln",
        previewQueue: "Führe den Node einmal aus, um eine Vorschauquelle zu erstellen.", previewUpdating: "Vorschau wird aktualisiert…",
        previewUnavailable: "Vorschau nicht verfügbar", source: "Quelle", grainDetail: "KORN- & TEXTURDETAIL · MITTIGER AUSSCHNITT 240 PX", filmGrain: "FILMKORN", antiAIGroup: "ANTI-KI", sabattierGroup: "SABATTIER", proceduralTexture: "PROZEDURALE TEXTUR", noiseTextureLabel: "Rauschtextur", noiseAmount: "Rauschstärke", noiseSeed: "Rausch-Seed", noiseTextures: {'Gaussian': 'Gauß', 'Value fBm': 'Value fBm', 'Gradient fBm': 'Gradient fBm', 'Simplex fBm': 'Simplex fBm', 'Ridged fBm': 'Ridged fBm', 'Worley Microcells': 'Worley-Mikrozellen', 'Domain Warp': 'Domain Warp', 'Silver Halide Clumps': 'Silberhalogenid-Cluster', 'Emulsion Mottle': 'Emulsionsmarmorierung', 'Film Scratches': 'Filmschlieren', 'Dust & Fibers': 'Staub und Fasern', 'Paper Foxing': 'Altpapierflecken'}, softFocus: "SOFT FOCUS", vignette: "VIGNETTE",
        amount: "Stärke", size: "Größe", colorGrain: "Farbkorn",
        halationColor: "Halationsfarbe", leakColor: "Lichteinfallfarbe", resetDefaults: "↺  Auf Standard zurücksetzen",
        resetTitle: "Alle Zuanfilm-Retrolab-Regler auf Werkseinstellungen zurücksetzen", chooseColor: "Farbe auswählen",
        leakModeLabel: 'Lichteinfallmodus', leakPositionLabel: "Lichteinfall-Position",
        widgetLabels: {
            halation_amount: "Halationsstärke", ring_radius: "Ringradius", bloom_amount: "Bloom-Stärke", bloom_threshold: "Bloom-Schwellenwert", bloom_radius: "Bloom-Radius",
            solarization: "Solarisation", highlight_confinement: "Lichterbegrenzung", mackie_lines: "Mackie-Linien", leak_exposure: "Lichteinfall-Belichtung", leak_seed: "Lichteinfall-Seed", leak_radius: "Lichteinfall-Radius", vignette_amount: "Vignettenstärke", vignette_feather: "Vignettenweichheit", soft_focus_amount: "Soft-Focus-Stärke", soft_focus_radius: "Soft-Focus-Radius",
            anti_ai: "Stärke", exposure: "Belichtung",
        },
        leakModes: { "Soft Edge": "Weicher Rand", "First-Frame Burn": "Einbrennen im ersten Bild", "120 Fat Roll": "120 Fat Roll", "Light Piping": "Lichtleitung", "Holga 135": "Holga 135" },
        leakPositions: { "Top": "Oben", "Bottom": "Unten", "Left": "Links", "Right": "Rechts", "Top Left": "Oben links", "Top Right": "Oben rechts", "Bottom Left": "Unten links", "Bottom Right": "Unten rechts" },
    },
});

// Keep these values aligned with ZuanfilmRetroLab.INPUT_TYPES(). DOM-only
// language and selector controls never enter the backend widget contract.
const DEFAULT_WIDGET_VALUES = Object.freeze({
    grain_amount: 0.0,
    grain_size: 0.3,
    color_grain: 0.09,
    halation_amount: 0.0,
    ring_radius: 8.0,
    bloom_amount: 0.0,
    bloom_threshold: 0.1,
    bloom_radius: 8.0,
    solarization: 0.0,
    highlight_confinement: 0.09,
    mackie_lines: 0.0,
    leak_mode: "Soft Edge",
    leak_position: "Bottom",
    leak_exposure: 0.0,
    leak_seed: 27,
    leak_color: DEFAULT_COLOR,
    leak_radius: 1.0,
    halation_color: DEFAULT_HALATION_COLOR,
    soft_focus_amount: 0.0,
    soft_focus_radius: 24.0,
    vignette_amount: 0.0,
    vignette_feather: 0.65,
    color_emulsion: "neutral",
    white_balance_temperature: 0.0,
    white_balance_tint: 0.0,
    anti_ai: 0.0,
    noise_texture: "Gaussian",
    noise_amount: 0.0,
    noise_seed: 73,
    noise_scale: 1.0,
    noise_blend_mode: "Additive",
    exposure: 0.0,
    grain_blend_mode: "Additive",
    emulsion_response: 1.0,
});

const GRAIN_CONTROLS = Object.freeze([
    { name: "grain_amount", labelKey: "amount", min: 0.0, max: 3.0, step: 0.01, precision: 2 },
    { name: "grain_size", labelKey: "size", min: 0.1, max: 4.0, step: 0.05, precision: 2 },
    { name: "color_grain", labelKey: "colorGrain", min: 0.0, max: 1.0, step: 0.01, precision: 2 },
]);

const WIDGET_LABEL_KEYS = Object.freeze({
    halation_amount: "halation_amount", ring_radius: "ring_radius",
    bloom_amount: "bloom_amount", bloom_threshold: "bloom_threshold", bloom_radius: "bloom_radius",
    solarization: "solarization", highlight_confinement: "highlight_confinement", mackie_lines: "mackie_lines",
    leak_exposure: "leak_exposure", leak_seed: "leak_seed", leak_radius: "leak_radius",
    soft_focus_amount: "soft_focus_amount", soft_focus_radius: "soft_focus_radius",
    vignette_amount: "vignette_amount", vignette_feather: "vignette_feather",
    anti_ai: "anti_ai", exposure: "exposure",
});

const LEAK_MODE_VALUES = Object.freeze(["Soft Edge", "First-Frame Burn", "120 Fat Roll", "Light Piping", "Holga 135"]);
const LEAK_POSITION_VALUES = Object.freeze(["Top", "Bottom", "Left", "Right", "Top Left", "Top Right", "Bottom Left", "Bottom Right"]);
const NOISE_TEXTURE_OPTIONS = Object.freeze(["Gaussian", "Value fBm", "Gradient fBm", "Simplex fBm", "Ridged fBm", "Worley Microcells", "Domain Warp", "Silver Halide Clumps", "Emulsion Mottle", "Film Scratches", "Dust & Fibers", "Paper Foxing"]);

const EMULSION_ATLAS = Object.freeze([
    { family: "Cinema", profiles: [
        ["vision3_50d", "Kodak VISION3 50D"], ["vision3_250d", "Kodak VISION3 250D"],
        ["vision3_200t", "Kodak VISION3 200T"], ["vision3_500t", "Kodak VISION3 500T"],
        ["vision3_500t_push", "Kodak VISION3 500T · Push"], ["verita_200d", "Kodak VERITA 200D"],
        ["cinestill_50d", "CineStill 50D"], ["cinestill_400d", "CineStill 400D"],
        ["cinestill_800t", "CineStill 800T"], ["cinestill_800t_night", "CineStill 800T · Night"],
    ]},
    { family: "Instant", profiles: [
        ["polaroid_sx70", "Polaroid SX-70 Color"], ["polaroid_600", "Polaroid 600 Color"],
        ["polaroid_itype", "Polaroid i-Type Color"], ["polaroid_669", "Polaroid 669 Packfilm"],
        ["polaroid_timezero", "Polaroid Time-Zero"], ["polaroid_690", "Polaroid 690 Color"],
        ["instax_mini", "Fujifilm instax mini"], ["instax_square", "Fujifilm instax SQUARE"],
        ["instax_wide", "Fujifilm instax WIDE"], ["fuji_fp100c", "Fujifilm FP-100C"],
    ]},
    { family: "Slide", profiles: [
        ["ektachrome_e100", "Kodak Ektachrome E100"], ["ektachrome_100d", "Kodak Ektachrome 100D"],
        ["velvia_50", "Fujichrome Velvia 50"], ["velvia_100", "Fujichrome Velvia 100"],
        ["provia_100f", "Fujichrome Provia 100F"], ["astia_100f", "Fujichrome Astia 100F"],
        ["sensia_100", "Fujichrome Sensia 100"], ["sensia_400", "Fujichrome Sensia 400"],
        ["kodachrome_64", "Kodachrome 64 · Archive"], ["agfachrome_rsx100", "Agfachrome RSX 100"],
    ]},
    { family: "35mm", profiles: [
        ["portra_160", "Kodak Portra 160"], ["portra_400", "Kodak Portra 400"], ["portra_800", "Kodak Portra 800"],
        ["ektar_100", "Kodak Ektar 100"], ["gold_200", "Kodak Gold 200"], ["colorplus_200", "Kodak ColorPlus 200"],
        ["ultramax_400", "Kodak UltraMax 400"], ["kodacolor_100", "Kodak Kodacolor 100"], ["kodacolor_200", "Kodak Kodacolor 200"],
        ["fujicolor_400", "Fujicolor 400"], ["superia_400", "Fujicolor Superia X-TRA 400"], ["superia_reala", "Fujicolor Superia Reala"],
        ["pro400h", "Fujicolor PRO 400H"], ["natura_1600", "Fujicolor Natura 1600"], ["superia_800", "Fujicolor Superia 800"],
        ["lomo_100", "Lomography Color Negative 100"], ["lomo_400", "Lomography Color Negative 400"],
        ["lomo_800", "Lomography Color Negative 800"], ["ektacolor_pro_160", "Kodak Ektacolor Pro 160"],
        ["ektacolor_pro_400", "Kodak Ektacolor Pro 400"],
    ]},
]);


function getLanguage(code) {
    return Object.prototype.hasOwnProperty.call(TRANSLATIONS, code) ? code : "en";
}

function getTranslation(code) {
    return TRANSLATIONS[getLanguage(code)] || TRANSLATIONS.en;
}

function loadStoredLanguage() {
    try {
        if (typeof localStorage !== "undefined") return getLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en");
    } catch (_) { /* Use English when browser storage is unavailable. */ }
    return "en";
}

function saveStoredLanguage(code) {
    try {
        if (typeof localStorage !== "undefined") localStorage.setItem(LANGUAGE_STORAGE_KEY, getLanguage(code));
    } catch (_) { /* Language remains active for this session. */ }
}

function makeText(text, size = "11px") {
    const element = document.createElement("span");
    element.textContent = text;
    element.style.fontSize = size;
    element.style.color = "var(--fg-color, #DDD)";
    return element;
}

function createLanguageControl() {
    const row = document.createElement("div");
    row.className = "zrl-glass zrl-icon";
    const icon = makeText("🌐", "13px");
    icon.setAttribute("role", "img");
    icon.setAttribute("aria-label", "Language");
    icon.title = "Language";

    // The real select sits invisibly over the globe so the native list opens on click.
    const select = document.createElement("select");
    select.setAttribute("aria-label", "Zuanfilm Retrolab language");
    for (const language of LANGUAGES) {
        const option = document.createElement("option");
        option.value = language.code;
        option.textContent = language.label;
        select.append(option);
    }
    select.value = loadStoredLanguage();
    row.append(icon, select);
    return { row, icon, select };
}

const PREVIEW_MODES = Object.freeze(["split", "before", "after"]);

function createPreviewModeControl() {
    const group = document.createElement("div");
    group.className = "zrl-glass zrl-seg";
    let mode = "split";
    let onChange = null;
    let currentTranslation = getTranslation("en");
    const buttons = PREVIEW_MODES.map((value) => {
        const button = document.createElement("button");
        button.type = "button";
        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            mode = value;
            sync();
            onChange?.(mode);
        });
        group.append(button);
        return button;
    });
    function sync() {
        PREVIEW_MODES.forEach((value, index) => {
            const button = buttons[index];
            button.textContent = value === "split" ? "◧" : currentTranslation[value];
            button.title = value === "split" ? currentTranslation.compareTooltip : currentTranslation[value];
            button.setAttribute("aria-pressed", value === mode ? "true" : "false");
        });
    }
    sync();
    return {
        element: group,
        buttons,
        mode: () => mode,
        setMode(value) {
            mode = PREVIEW_MODES.includes(value) ? value : "split";
            sync();
        },
        applyLanguage(translation) {
            currentTranslation = translation;
            sync();
        },
        setOnChange(callback) { onChange = callback; },
    };
}

function applyPreviewMode(ui) {
    const mode = ui.compare.mode();
    const hasBefore = ui.beforeImage.style.visibility === "visible";
    const position = mode === "split" ? ui.splitPosition : mode === "before" ? 100 : 0;
    ui.beforeImage.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
    ui.split.style.display = mode === "split" && hasBefore ? "block" : "none";
    ui.split.style.left = `${position}%`;
}

function renderActiveCompositionPreview(node) {
    const ui = node?._zrlPreviewUI;
    if (!ui) return;
    if (node._zrlVideo) {
        showVideoFrame(node);
        return;
    }
    if (node._zrlPreviewProcessedSrc) ui.fullImage.src = node._zrlPreviewProcessedSrc;
    if (node._zrlPreviewOriginalSrc) ui.beforeImage.src = node._zrlPreviewOriginalSrc;
    ui.beforeImage.style.visibility = node._zrlPreviewOriginalSrc && ui.fullImage.style.visibility === "visible" ? "visible" : "hidden";
    applyPreviewMode(ui);
}

function createWhiteBalanceWheel(node, temperatureWidget, tintWidget) {
    const translation = getTranslation(node._zrlLanguage || "en");
    const column = document.createElement("div");
    column.style.display = "flex";
    column.style.flexDirection = "column";
    column.style.alignItems = "stretch";
    column.style.justifyContent = "center";
    column.style.gap = "5px";
    column.style.minWidth = "0";
    column.style.width = "100%";

    const heading = makeText(translation.whiteBalanceLabel, "10px");
    heading.className = "zrl-heading";

    // The reset control occupies the left edge of the White Balance row,
    // vertically aligned with the Emulsion dropdown. The wheel/readouts are
    // grouped to its right so the color instrument remains visually right-led.
    const controlRow = document.createElement("div");
    controlRow.style.display = "flex";
    controlRow.style.alignItems = "center";
    controlRow.style.justifyContent = "space-between";
    controlRow.style.gap = "7px";
    controlRow.style.width = "100%";
    controlRow.style.height = "82px";
    controlRow.style.minHeight = "82px";
    controlRow.style.minWidth = "0";

    const reset = document.createElement("button");
    reset.type = "button";
    reset.textContent = translation.whiteBalanceNeutral;
    reset.title = parameterTooltip("base_wb");
    reset.setAttribute("aria-label", parameterTooltip("base_wb"));
    reset.style.flex = "0 0 auto";
    reset.style.minWidth = "76px";
    reset.style.whiteSpace = "nowrap";
    reset.style.height = "30px";
    reset.style.padding = "2px 6px";
    reset.style.marginTop = "0px";
    reset.style.alignSelf = "center";
    reset.style.border = "1px solid var(--border-color, #555)";
    reset.style.borderRadius = "5px";
    reset.style.background = "var(--comfy-input-bg, #20242A)";
    reset.style.color = "var(--fg-color, #DDD)";
    reset.style.fontSize = "8px";
    reset.style.cursor = "pointer";

    // A compact machined-metal rim surrounds the color field. The disc and
    // readouts are pushed to the right side of the available half-width row.
    const wheelContent = document.createElement("div");
    wheelContent.style.display = "flex";
    wheelContent.style.alignItems = "center";
    wheelContent.style.justifyContent = "flex-end";
    wheelContent.style.gap = "1px";
    wheelContent.style.flex = "0 0 auto";
    wheelContent.style.width = "auto";
    wheelContent.style.marginLeft = "auto";
    wheelContent.style.height = "82px";
    wheelContent.style.minWidth = "0";

    const wheelFrame = document.createElement("div");
    wheelFrame.style.width = "82px";
    wheelFrame.style.height = "82px";
    wheelFrame.style.flex = "0 0 82px";
    wheelFrame.style.boxSizing = "border-box";
    wheelFrame.style.padding = "2px";
    wheelFrame.style.borderRadius = "50%";
    wheelFrame.style.background = "#3A3631";
    wheelFrame.style.boxShadow = "0 2px 8px rgba(0,0,0,0.45)";

    const innerRim = document.createElement("div");
    innerRim.style.width = "100%";
    innerRim.style.height = "100%";
    innerRim.style.boxSizing = "border-box";
    innerRim.style.padding = "1px";
    innerRim.style.borderRadius = "50%";
    innerRim.style.background = "#2E2B28";

    const wheel = document.createElement("div");
    wheel.style.position = "relative";
    wheel.style.width = "74px";
    wheel.style.height = "74px";
    wheel.style.boxSizing = "border-box";
    wheel.style.borderRadius = "50%";
    wheel.style.cursor = "crosshair";
    wheel.style.touchAction = "none";
    wheel.style.border = "1px solid rgba(248,250,252,0.72)";
    wheel.style.boxShadow = "inset 0 0 0 1px rgba(22,26,32,0.70), inset 0 1px 3px rgba(255,255,255,0.26), inset 0 -2px 4px rgba(0,0,0,0.20)";
    wheel.style.background = "radial-gradient(circle, rgba(29,33,39,0.96) 0 12%, rgba(29,33,39,0.82) 19%, rgba(29,33,39,0.06) 66%), conic-gradient(from -90deg, #6D9FD0 0deg, #998AC8 55deg, #CC8CB1 105deg, #E5A866 180deg, #91AA7D 270deg, #6D9FD0 360deg)";
    wheel.setAttribute("role", "application");
    wheel.setAttribute("tabindex", "0");
    wheel.setAttribute("aria-label", translation.whiteBalanceLabel);
    wheel.setAttribute("aria-roledescription", "two-axis color wheel");
    wheel.title = `${parameterTooltip("white_balance_temperature")} ${parameterTooltip("white_balance_tint")}`;

    const center = document.createElement("div");
    center.style.position = "absolute";
    center.style.left = "50%";
    center.style.top = "50%";
    center.style.width = "15px";
    center.style.height = "15px";
    center.style.transform = "translate(-50%, -50%)";
    center.style.borderRadius = "50%";
    center.style.border = "1px solid rgba(239,243,247,0.62)";
    center.style.background = "radial-gradient(circle at 36% 30%, #8B929A 0%, #4A5058 48%, #252A30 100%)";
    center.style.boxShadow = "inset 0 1px 1px rgba(255,255,255,0.34), 0 1px 2px rgba(0,0,0,0.60)";
    center.style.pointerEvents = "none";

    // The movable indicator is intentionally smaller than the fixed center
    // reference and uses transform centering so (0, 0) is geometrically exact.
    const puck = document.createElement("div");
    puck.style.position = "absolute";
    puck.style.left = "50%";
    puck.style.top = "50%";
    puck.style.width = "10px";
    puck.style.height = "10px";
    puck.style.boxSizing = "border-box";
    puck.style.transform = "translate(-50%, -50%)";
    puck.style.borderRadius = "50%";
    puck.style.border = "1px solid rgba(224,231,238,0.96)";
    puck.style.background = "radial-gradient(circle at 34% 28%, #C9D0D8 0%, #818B97 40%, #3A424C 100%)";
    puck.style.boxShadow = "0 1px 4px rgba(0,0,0,0.82), 0 0 0 1px rgba(48,55,64,0.96), inset 0 1px 1px rgba(255,255,255,0.42)";
    puck.style.pointerEvents = "none";
    wheel.append(center, puck);
    innerRim.append(wheel);
    wheelFrame.append(innerRim);

    const readouts = document.createElement("div");
    readouts.style.display = "flex";
    readouts.style.flexDirection = "column";
    readouts.style.alignItems = "flex-end";
    readouts.style.justifyContent = "center";
    readouts.style.textAlign = "right";
    readouts.style.gap = "9px";
    readouts.style.flex = "0 1 auto";
    readouts.style.minWidth = "0";

    const temperatureReadout = document.createElement("div");
    temperatureReadout.style.display = "flex";
    temperatureReadout.style.flexDirection = "column";
    temperatureReadout.style.alignItems = "flex-end";
    temperatureReadout.style.textAlign = "right";
    temperatureReadout.style.gap = "3px";
    temperatureReadout.style.minWidth = "0";
    const axes = makeText(`${translation.wbCool} ↑  ·  ${translation.wbWarm} ↓`, "8px");
    axes.style.opacity = "0.66";
    axes.style.whiteSpace = "nowrap";
    axes.style.lineHeight = "1.25";
    axes.style.textAlign = "right";
    const temperatureValue = makeText("T +0.00", "11px");
    temperatureValue.style.fontFamily = "monospace";
    temperatureValue.style.fontWeight = "600";
    temperatureValue.style.color = "var(--fg-color, #D5D8DC)";
    temperatureValue.style.whiteSpace = "nowrap";
    temperatureReadout.append(axes, temperatureValue);

    const tintReadout = document.createElement("div");
    tintReadout.style.display = "flex";
    tintReadout.style.flexDirection = "column";
    tintReadout.style.alignItems = "flex-end";
    tintReadout.style.textAlign = "right";
    tintReadout.style.gap = "3px";
    tintReadout.style.minWidth = "0";
    const tintAxes = makeText(`${translation.wbGreen} ←  ·  ${translation.wbMagenta} →`, "8px");
    tintAxes.style.opacity = "0.66";
    tintAxes.style.whiteSpace = "nowrap";
    tintAxes.style.lineHeight = "1.25";
    tintAxes.style.textAlign = "right";
    const tintValue = makeText("TINT +0.00", "11px");
    tintValue.style.fontFamily = "monospace";
    tintValue.style.fontWeight = "600";
    tintValue.style.color = "var(--fg-color, #D5D8DC)";
    tintValue.style.whiteSpace = "nowrap";
    tintReadout.append(tintAxes, tintValue);
    readouts.append(temperatureReadout, tintReadout);
    wheelContent.append(wheelFrame, readouts);
    controlRow.append(reset, wheelContent);

    const clamp = (value) => Math.max(-1, Math.min(1, Number.isFinite(value) ? value : 0));
    const readValues = () => ({
        temperature: clamp(Number(temperatureWidget.value)),
        tint: clamp(Number(tintWidget.value)),
    });
    const syncFromBackend = () => {
        const { temperature, tint } = readValues();
        const travel = 29;
        puck.style.left = `calc(50% + ${tint * travel}px)`;
        puck.style.top = `calc(50% + ${temperature * travel}px)`;
        const signed = (value) => `${value >= 0 ? "+" : ""}${value.toFixed(2)}`;
        temperatureValue.textContent = `T ${signed(temperature)}`;
        tintValue.textContent = `TINT ${signed(tint)}`;
        wheel.setAttribute("aria-valuetext", `${translation.wbCool} / ${translation.wbWarm}: ${signed(temperature)}; ${translation.wbGreen} / ${translation.wbMagenta}: ${signed(tint)}`);
    };
    const update = (temperature, tint) => {
        temperatureWidget.value = clamp(temperature);
        tintWidget.value = clamp(tint);
        temperatureWidget.callback?.(temperatureWidget.value, app.canvas, node);
        tintWidget.callback?.(tintWidget.value, app.canvas, node);
        syncFromBackend();
        schedulePreview(node);
        node.setDirtyCanvas?.(true, true);
    };
    const applyPointer = (event) => {
        const rect = wheel.getBoundingClientRect?.();
        const width = Number(rect?.width) || 74;
        const height = Number(rect?.height) || 74;
        const left = Number(rect?.left) || 0;
        const top = Number(rect?.top) || 0;
        const radius = Math.max(1, Math.min(width, height) / 2 - 8);
        let tint = (Number(event.clientX) - (left + width / 2)) / radius;
        let temperature = (Number(event.clientY) - (top + height / 2)) / radius;
        const distance = Math.hypot(tint, temperature);
        if (distance > 1) {
            tint /= distance;
            temperature /= distance;
        }
        update(temperature, tint);
    };
    let dragging = false;
    wheel.addEventListener("pointerdown", (event) => {
        event.preventDefault?.();
        event.stopPropagation?.();
        dragging = true;
        wheel.setPointerCapture?.(event.pointerId);
        applyPointer(event);
    });
    wheel.addEventListener("pointermove", (event) => {
        if (!dragging) return;
        event.preventDefault?.();
        event.stopPropagation?.();
        applyPointer(event);
    });
    const stopDragging = () => { dragging = false; };
    wheel.addEventListener("pointerup", stopDragging);
    wheel.addEventListener("pointercancel", stopDragging);
    wheel.addEventListener("lostpointercapture", stopDragging);
    wheel.addEventListener("keydown", (event) => {
        const step = event.shiftKey ? 0.1 : 0.025;
        let { temperature, tint } = readValues();
        if (event.key === "ArrowLeft") tint -= step;
        else if (event.key === "ArrowRight") tint += step;
        else if (event.key === "ArrowUp") temperature -= step;
        else if (event.key === "ArrowDown") temperature += step;
        else if (event.key === "Home") { temperature = 0; tint = 0; }
        else return;
        event.preventDefault?.();
        event.stopPropagation?.();
        update(temperature, tint);
    });
    reset.addEventListener("click", (event) => {
        event.preventDefault?.();
        event.stopPropagation?.();
        update(0, 0);
    });

    column.append(heading, controlRow);
    column.addEventListener("pointerdown", (event) => event.stopPropagation());
    column.addEventListener("mousedown", (event) => event.stopPropagation());
    reset.title = translation.wbReset;
    syncFromBackend();
    return {
        column, controlRow, wheelContent, wheelFrame, innerRim, wheel, puck, heading, readouts, temperatureReadout,
        tintReadout, temperatureValue, tintValue, axes, tintAxes, reset, syncFromBackend,
        applyLanguage(nextTranslation) {
            heading.textContent = nextTranslation.whiteBalanceLabel;
            wheel.setAttribute("aria-label", nextTranslation.whiteBalanceLabel);
            wheel.title = `${nextTranslation.wbCool} ↑ · ${nextTranslation.wbWarm} ↓ · ${nextTranslation.wbGreen} ← · ${nextTranslation.wbMagenta} →`;
            axes.textContent = `${nextTranslation.wbCool} ↑  ${nextTranslation.wbWarm} ↓`;
            tintAxes.textContent = `${nextTranslation.wbGreen} ←  ${nextTranslation.wbMagenta} →`;
            reset.textContent = nextTranslation.whiteBalanceNeutral;
            reset.title = parameterTooltip("base_wb");
            syncFromBackend();
        },
    };
}

function createEmulsionAtlasControl(node, backendWidget, temperatureWidget, tintWidget, responseWidget) {
    backendWidget.hidden = true;
    temperatureWidget.hidden = true;
    tintWidget.hidden = true;
    responseWidget.hidden = true;

    const row = document.createElement("div");
    row.className = "zrl-dr zrl-emulsion";
    const emulsionLabel = getTranslation(node._zrlLanguage || "en").emulsionLabel;

    // Keep a hidden canonical select as a lightweight option/value adapter.
    // The visible popup is a body-level portal, so the 50-item list can always
    // open below the control instead of the browser placing it over the preview.
    const select = document.createElement("select");
    select.title = parameterTooltip("color_emulsion");
    select.style.display = "none";
    select.style.width = "100%";
    select.style.maxWidth = "100%";
    select.style.minWidth = "0";
    select.style.height = "30px";
    select.setAttribute("aria-hidden", "true");
    select.tabIndex = -1;

    const neutral = document.createElement("option");
    neutral.value = "neutral";
    neutral.textContent = getTranslation(node._zrlLanguage || "en").emulsionNeutral;
    select.append(neutral);
    for (const group of EMULSION_ATLAS) {
        const optgroup = document.createElement("optgroup");
        optgroup.label = getTranslation(node._zrlLanguage || "en").emulsionCategories[group.family];
        optgroup.setAttribute("label", optgroup.label);
        for (const [profileId, profileName] of group.profiles) {
            const option = document.createElement("option");
            option.value = profileId;
            option.textContent = profileName;
            optgroup.append(option);
        }
        select.append(optgroup);
    }

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "zrl-trigger";
    trigger.title = parameterTooltip("color_emulsion");
    trigger.setAttribute("role", "combobox");
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-label", emulsionLabel);

    const swatch = document.createElement("span");
    swatch.className = "zrl-swatch";
    const triggerValue = document.createElement("span");
    triggerValue.className = "zrl-trigger-value";
    const triggerArrow = document.createElement("span");
    triggerArrow.textContent = "▾";
    triggerArrow.style.opacity = "0.6";
    trigger.append(swatch, triggerValue, triggerArrow);

    const menu = document.createElement("div");
    menu.className = "zrl-dr zrl-menu";
    menu.setAttribute("role", "listbox");
    menu.setAttribute("aria-label", emulsionLabel);
    menu.style.display = "none";
    menu.style.position = "fixed";
    menu.style.zIndex = "10000";
    menu.style.boxSizing = "border-box";
    menu.style.overflowY = "auto";
    menu.style.overscrollBehavior = "contain";
    menu.style.padding = "4px 0";
    menu.style.border = "1px solid var(--border-color, #56606B)";
    menu.style.borderRadius = "5px";
    menu.style.background = "var(--comfy-menu-bg, #171B20)";
    menu.style.color = "var(--fg-color, #DDD)";
    menu.style.boxShadow = "0 8px 24px rgba(0,0,0,0.42)";
    menu.style.fontSize = "12px";

    const menuOptions = [];
    const appendMenuOption = (profileId, profileName) => {
        const optionButton = document.createElement("button");
        optionButton.type = "button";
        optionButton.value = profileId;
        optionButton.textContent = profileName;
        optionButton.setAttribute("role", "option");
        optionButton.setAttribute("aria-selected", "false");
        optionButton.style.display = "block";
        optionButton.style.width = "100%";
        optionButton.style.padding = "7px 10px";
        optionButton.style.border = "0";
        optionButton.style.borderRadius = "0";
        optionButton.style.background = "transparent";
        optionButton.style.color = "inherit";
        optionButton.style.font = "inherit";
        optionButton.style.textAlign = "left";
        optionButton.style.cursor = "pointer";
        optionButton.style.whiteSpace = "nowrap";
        optionButton.addEventListener("mouseenter", () => {
            if (select.value !== profileId) optionButton.style.background = "rgba(255,255,255,0.08)";
        });
        optionButton.addEventListener("mouseleave", () => {
            if (select.value !== profileId) optionButton.style.background = "transparent";
        });
        optionButton.addEventListener("click", (event) => {
            event.preventDefault?.();
            event.stopPropagation?.();
            updateSelection(profileId, true);
            closeMenu();
        });
        menuOptions.push(optionButton);
        menu.append(optionButton);
        return optionButton;
    };

    appendMenuOption("neutral", neutral.textContent);
    const menuGroups = [];
    for (const group of EMULSION_ATLAS) {
        const groupHeading = document.createElement("div");
        groupHeading.style.padding = "8px 10px 4px";
        groupHeading.style.fontWeight = "700";
        groupHeading.style.fontSize = "11px";
        groupHeading.style.opacity = "0.9";
        groupHeading.style.pointerEvents = "none";
        menu.append(groupHeading);
        const groupOptions = [];
        for (const [profileId, profileName] of group.profiles) {
            const optionButton = appendMenuOption(profileId, profileName);
            groupOptions.push(optionButton);
        }
        menuGroups.push({ family: group.family, heading: groupHeading, options: groupOptions });
    }

    // Emulsion Response as a compact stepper; double-click the value for 1.00×.
    // The hidden ComfyUI widget remains the canonical serialized value.
    const responseStepper = document.createElement("div");
    responseStepper.className = "zrl-stepper";
    responseStepper.setAttribute("data-zrl-control", "emulsion_response");
    const responseMinus = document.createElement("button");
    responseMinus.type = "button";
    responseMinus.textContent = "−";
    const responseValue = document.createElement("span");
    const responsePlus = document.createElement("button");
    responsePlus.type = "button";
    responsePlus.textContent = "+";
    responseStepper.append(responseMinus, responseValue, responsePlus);
    const applyResponseLanguage = () => {
        const tooltip = parameterTooltip("emulsion_response");
        const label = emulsionResponseTranslation(node._zrlLanguage || "en").label;
        responseStepper.title = tooltip;
        responseStepper.setAttribute("aria-label", label);
        responseMinus.setAttribute("aria-label", `${label} −`);
        responsePlus.setAttribute("aria-label", `${label} +`);
    };
    const showResponse = () => {
        responseValue.textContent = Number(responseWidget.value ?? 1.0).toFixed(2) + "×";
    };
    const setResponse = (next) => {
        const value = Math.round(Math.min(3.0, Math.max(0.5, next)) * 100) / 100;
        responseWidget.value = value;
        showResponse();
        responseWidget.callback?.(value, app.canvas, node);
        node.setDirtyCanvas?.(true, true);
    };
    responseMinus.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        setResponse(Number(responseWidget.value ?? 1.0) - 0.05);
    });
    responsePlus.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        setResponse(Number(responseWidget.value ?? 1.0) + 0.05);
    });
    responseValue.addEventListener("dblclick", () => setResponse(1.0));
    applyResponseLanguage();
    showResponse();

    let isOpen = false;
    const removeOpenListeners = () => {
        if (typeof document.removeEventListener === "function") {
            document.removeEventListener("pointerdown", onOutsidePointerDown, true);
            document.removeEventListener("keydown", onDocumentKeyDown, true);
        }
        if (typeof window !== "undefined" && typeof window.removeEventListener === "function") {
            window.removeEventListener("resize", closeMenu);
            window.removeEventListener("scroll", onWindowScroll, true);
        }
    };
    function closeMenu() {
        if (!isOpen) return;
        isOpen = false;
        menu.style.display = "none";
        trigger.setAttribute("aria-expanded", "false");
        removeOpenListeners();
    }
    function onOutsidePointerDown(event) {
        const target = event?.target;
        if (target === trigger || target === menu || trigger.contains?.(target) || menu.contains?.(target)) return;
        closeMenu();
    }
    function onDocumentKeyDown(event) {
        if (event?.key === "Escape") {
            event.preventDefault?.();
            closeMenu();
            trigger.focus?.();
        }
    }
    function onWindowScroll(event) {
        // Scrolling the 51-option popup must not dismiss itself. Any page or
        // graph-canvas scroll still closes the anchored viewport-level menu.
        const target = event?.target;
        if (target === menu || menu.contains?.(target)) return;
        closeMenu();
    }
    function openMenu() {
        if (isOpen) return;
        const rect = trigger.getBoundingClientRect();
        const viewportWidth = typeof window !== "undefined" && Number(window.innerWidth) > 0 ? Number(window.innerWidth) : 1280;
        const viewportHeight = typeof window !== "undefined" && Number(window.innerHeight) > 0 ? Number(window.innerHeight) : 900;
        const width = Math.min(Math.max(Number(rect.width) || 260, 240), Math.max(160, viewportWidth - 16));
        const left = Math.min(Math.max(8, Number(rect.left) || 0), Math.max(8, viewportWidth - width - 8));
        const top = Math.max(8, (Number(rect.bottom) || ((Number(rect.top) || 0) + (Number(rect.height) || 30))) + 4);
        const availableBelow = Math.max(96, viewportHeight - top - 10);
        menu.style.left = `${left}px`;
        menu.style.top = `${top}px`;
        menu.style.width = `${width}px`;
        menu.style.maxHeight = `${Math.min(360, availableBelow)}px`;
        menu.style.display = "block";
        isOpen = true;
        trigger.setAttribute("aria-expanded", "true");
        if (typeof document.addEventListener === "function") {
            document.addEventListener("pointerdown", onOutsidePointerDown, true);
            document.addEventListener("keydown", onDocumentKeyDown, true);
        }
        if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
            window.addEventListener("resize", closeMenu);
            window.addEventListener("scroll", onWindowScroll, true);
        }
    }
    function syncSelectedOption() {
        const selected = String(select.value || "neutral");
        const selectedOption = Array.from(select.children || []).flatMap((entry) => {
            if (entry.value) return [entry];
            return Array.from(entry.children || []);
        }).find((entry) => entry.value === selected);
        triggerValue.textContent = selectedOption?.textContent || neutral.textContent;
        swatch.setAttribute("data-neutral", selected === "neutral" ? "true" : "false");
        for (const optionButton of menuOptions) {
            const active = optionButton.value === selected;
            optionButton.setAttribute("aria-selected", active ? "true" : "false");
            optionButton.style.background = active ? "rgba(231,181,106,0.22)" : "transparent";
            optionButton.style.color = active ? "var(--fg-color, #FFF)" : "inherit";
        }
    }
    function updateSelection(value, notify) {
        select.value = value;
        backendWidget.value = value;
        syncSelectedOption();
        if (notify) {
            backendWidget.callback?.(value, app.canvas, node);
            schedulePreview(node);
            node.setDirtyCanvas?.(true, true);
        }
    }
    select.addEventListener("change", () => updateSelection(select.value, true));
    trigger.addEventListener("click", (event) => {
        event.preventDefault?.();
        event.stopPropagation?.();
        if (isOpen) closeMenu();
        else openMenu();
    });
    trigger.addEventListener("keydown", (event) => {
        if (["ArrowDown", "Enter", " "].includes(event?.key)) {
            event.preventDefault?.();
            openMenu();
        } else if (event?.key === "Escape") {
            closeMenu();
        }
    });

    select.value = backendWidget.value || "neutral";
    syncSelectedOption();
    const overlayRoot = document.body || document.documentElement;
    overlayRoot.append(menu);
    row.append(select, trigger, responseStepper);

    // White Balance lives in the Color tab; the emulsion control keeps owning
    // it so reset/configure/language syncing stay in one place.
    const whiteBalanceUI = createWhiteBalanceWheel(node, temperatureWidget, tintWidget);
    row.addEventListener("pointerdown", (event) => event.stopPropagation());
    row.addEventListener("mousedown", (event) => event.stopPropagation());
    return {
        row, select, trigger, triggerValue, swatch, menu, menuOptions, menuGroups,
        responseStepper, responseMinus, responseValue, responsePlus, whiteBalanceUI,
        syncFromBackend() {
            select.value = backendWidget.value || "neutral";
            syncSelectedOption();
            showResponse();
            whiteBalanceUI.syncFromBackend();
        },
        applyLanguage(translation) {
            applyResponseLanguage();
            trigger.setAttribute("aria-label", translation.emulsionLabel);
            menu.setAttribute("aria-label", translation.emulsionLabel);
            if (select.children[0]) select.children[0].textContent = translation.emulsionNeutral;
            if (menuOptions[0]) menuOptions[0].textContent = translation.emulsionNeutral;
            for (let i = 0; i < EMULSION_ATLAS.length; i += 1) {
                const group = EMULSION_ATLAS[i];
                const optgroup = select.children[i + 1];
                const menuGroup = menuGroups[i];
                if (optgroup) {
                    optgroup.label = translation.emulsionCategories[group.family];
                    optgroup.setAttribute("label", optgroup.label);
                }
                if (menuGroup) menuGroup.heading.textContent = translation.emulsionCategories[group.family];
            }
            syncSelectedOption();
            whiteBalanceUI.applyLanguage(translation);
        },
        dispose() {
            closeMenu();
            menu.remove?.();
        },
    };
}

function createPreviewPanel() {
    const panel = document.createElement("div");
    panel.className = "zrl-dr zrl-preview";

    const card = document.createElement("div");
    card.className = "zrl-card";
    const fullImage = document.createElement("img");
    fullImage.className = "zrl-frame";
    fullImage.alt = "Zuanfilm Retrolab live preview";
    fullImage.style.visibility = "hidden";
    const beforeImage = document.createElement("img");
    beforeImage.className = "zrl-frame";
    beforeImage.alt = "Zuanfilm Retrolab source";
    beforeImage.style.visibility = "hidden";
    const split = document.createElement("div");
    split.className = "zrl-split";
    split.style.display = "none";

    const compare = createPreviewModeControl();
    const modeSlot = document.createElement("div");
    modeSlot.className = "zrl-ov";
    modeSlot.style.top = "8px";
    modeSlot.style.left = "8px";
    modeSlot.append(compare.element);

    const languageControl = createLanguageControl();
    const actions = document.createElement("div");
    actions.className = "zrl-ov";
    actions.style.top = "8px";
    actions.style.right = "8px";
    actions.append(languageControl.row);

    const status = makeText("Queue the node once to create a preview source.", "10.5px");
    status.className = "zrl-glass zrl-status";
    const statusSlot = document.createElement("div");
    statusSlot.className = "zrl-ov";
    statusSlot.style.left = "8px";
    statusSlot.style.right = "100px";
    statusSlot.style.bottom = "8px";
    statusSlot.append(status);

    // Native-resolution center crop for judging grain and texture at 100%.
    const loupe = document.createElement("div");
    loupe.className = "zrl-ov zrl-loupe";
    loupe.style.right = "8px";
    loupe.style.bottom = "8px";
    loupe.style.display = "none";
    const grainImage = document.createElement("img");
    grainImage.alt = "Native-resolution 240 by 240 grain detail crop";
    loupe.append(grainImage);

    card.append(fullImage, beforeImage, split, modeSlot, actions, statusSlot, loupe);
    panel.append(card);

    const ui = {
        panel, card, status, fullImage, beforeImage, split, compare, splitPosition: 50, resetSlot: actions,
        languageIcon: languageControl.icon, languageSelect: languageControl.select, loupe, grainImage,
    };
    let dragging = false;
    const moveSplit = (event) => {
        const rect = card.getBoundingClientRect();
        ui.splitPosition = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100));
        applyPreviewMode(ui);
    };
    card.addEventListener("pointerdown", (event) => {
        if (compare.mode() !== "split" || event.target.closest(".zrl-ov")) return;
        dragging = true;
        card.setPointerCapture(event.pointerId);
        moveSplit(event);
    });
    card.addEventListener("pointermove", (event) => { if (dragging) moveSplit(event); });
    card.addEventListener("pointerup", () => { dragging = false; });
    card.addEventListener("lostpointercapture", () => { dragging = false; });
    return ui;
}

function normalizeHex(value, fallback = DEFAULT_COLOR) {
    if (typeof value !== "string") return fallback;
    let hex = value.trim().replace(/^#/, "");
    if (/^[0-9a-fA-F]{3}$/.test(hex)) hex = hex.split("").map((ch) => ch + ch).join("");
    return /^[0-9a-fA-F]{6}$/.test(hex) ? `#${hex.toUpperCase()}` : fallback;
}

function createColorPickerRow(labelKey, backendWidget, node, fallbackColor) {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "8px";
    row.style.width = "100%";
    row.style.boxSizing = "border-box";
    row.style.justifyContent = "flex-end";

    const label = makeText(getTranslation(node._zrlLanguage)[labelKey], "10.5px");
    label.style.flex = "0 1 auto";
    label.style.textAlign = "right";
    label.style.whiteSpace = "nowrap";
    const colorValue = makeText("", "11px");
    colorValue.style.fontFamily = "monospace";
    colorValue.style.opacity = "0.78";
    colorValue.style.minWidth = "66px";
    colorValue.style.textAlign = "right";

    const picker = document.createElement("input");
    picker.type = "color";
    const tooltipName = labelKey === "halationColor" ? "halation_color" : "leak_color";
    const applyColorTooltip = () => {
        // Resolve on every language change. Capturing the tooltip at node
        // creation left native color inputs stuck in the original language.
        const tooltip = parameterTooltip(tooltipName, node._zrlLanguage || "en");
        label.title = tooltip;
        row.title = tooltip;
        colorValue.title = tooltip;
        picker.title = tooltip;
        return tooltip;
    };
    applyColorTooltip();
    picker.value = normalizeHex(backendWidget.value, fallbackColor);
    picker.style.width = "42px";
    picker.style.height = "28px";
    picker.style.padding = "2px";
    picker.style.border = "1px solid var(--border-color, #555)";
    picker.style.borderRadius = "5px";
    picker.style.background = "transparent";
    picker.style.cursor = "pointer";

    const syncFromBackend = () => {
        picker.value = normalizeHex(backendWidget.value, fallbackColor);
        colorValue.textContent = picker.value;
    };
    const syncToBackend = () => {
        const hex = normalizeHex(picker.value, fallbackColor);
        backendWidget.value = hex;
        colorValue.textContent = hex;
        backendWidget.callback?.(hex, app.canvas, node);
        schedulePreview(node);
        node.setDirtyCanvas?.(true, true);
    };
    picker.addEventListener("input", syncToBackend);
    picker.addEventListener("change", syncToBackend);
    row.append(label, colorValue, picker);
    syncFromBackend();
    return {
        row, picker, label, colorValue, syncFromBackend,
        applyLanguage(translation) {
            label.textContent = translation[labelKey];
            applyColorTooltip();
            picker.setAttribute("aria-label", translation[labelKey]);
        },
    };
}

function createTranslatedSelectRow(widgetName, node) {
    const backendWidget = node.widgets?.find((candidate) => candidate.name === widgetName);
    const isLeakMode = widgetName === "leak_mode";
    const values = isLeakMode ? LEAK_MODE_VALUES : LEAK_POSITION_VALUES;
    const labelKey = isLeakMode ? "leakModeLabel" : "leakPositionLabel";
    const mapKey = isLeakMode ? "leakModes" : "leakPositions";

    backendWidget.hidden = true;
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "10px";
    row.style.width = "100%";
    row.style.boxSizing = "border-box";

    const label = makeText(getTranslation(node._zrlLanguage)[labelKey], "12px");
    label.style.flex = "1";

    const select = document.createElement("select");
    select.title = parameterTooltip(widgetName);
    label.title = parameterTooltip(widgetName);
    row.title = parameterTooltip(widgetName);
    select.style.flex = "1.2";
    select.style.minWidth = "0";
    select.style.height = "28px";
    select.style.padding = "3px 7px";
    select.style.border = "1px solid var(--border-color, #555)";
    select.style.borderRadius = "5px";
    select.style.background = "var(--comfy-input-bg, #20242A)";
    select.style.color = "var(--fg-color, #DDD)";
    select.style.fontSize = "12px";
    for (const value of values) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.append(option);
    }
    select.value = values.includes(backendWidget.value) ? backendWidget.value : values[0];
    select.addEventListener("change", () => {
        backendWidget.value = select.value;
        backendWidget.callback?.(select.value, app.canvas, node);
        schedulePreview(node);
        node.setDirtyCanvas?.(true, true);
    });
    row.append(label, select);
    return {
        row, label, select,
        syncFromBackend() {
            select.value = values.includes(backendWidget.value) ? backendWidget.value : values[0];
        },
        applyLanguage(translation) {
            label.textContent = translation[labelKey];
            for (const option of select.children) option.textContent = translation[mapKey][option.value] || option.value;
            select.title = parameterTooltip(widgetName);
            select.setAttribute("aria-label", translation[labelKey]);
        },
    };
}

const LIGHT_LEAK_RANGE_CONTROLS = Object.freeze([
    { name: "leak_exposure", min: 0.0, max: 10.0, step: 0.01, precision: 2 },
    { name: "leak_seed", min: 0, max: 999, step: 1, precision: 0 },
    { name: "leak_radius", min: 0.25, max: 10.0, step: 0.01, precision: 2 },
]);

function createLightLeakRangeControl(node, definition) {
    const widget = node.widgets?.find((candidate) => candidate.name === definition.name);
    if (!widget) return null;
    widget.hidden = true;

    const row = document.createElement("div");
    row.setAttribute("data-zrl-control", definition.name);
    row.style.display = "grid";
    row.style.gridTemplateColumns = "minmax(0, 0.82fr) minmax(0, 1fr) 38px";
    row.style.columnGap = "6px";
    row.style.alignItems = "center";
    row.style.width = "100%";
    row.style.minWidth = "0";
    row.style.boxSizing = "border-box";

    const translation = getTranslation(node._zrlLanguage || "en");
    const label = makeText(widgetLabel(translation, definition.name), "10px");
    label.style.whiteSpace = "nowrap";
    label.style.overflow = "hidden";
    label.style.textOverflow = "ellipsis";
    label.title = parameterTooltip(definition.name);

    const input = document.createElement("input");
    input.type = "range";
    input.className = "zrl-light-range";
    input.min = String(definition.min);
    input.max = String(definition.max);
    input.step = String(definition.step);
    input.value = String(widget.value ?? definition.min);
    input.title = parameterTooltip(definition.name);
    input.setAttribute("aria-label", translation.widgetLabels[definition.name] || label.textContent);
    input.style.width = "100%";
    input.style.minWidth = "0";
    input.style.margin = "0";
    input.style.padding = "0";
    input.style.border = "0";
    input.style.borderRadius = "4px";
    input.style.outline = "none";
    input.style.cursor = "pointer";
    input.style.appearance = "none";

    const value = makeText(Number(widget.value).toFixed(definition.precision), "10px");
    value.style.fontVariantNumeric = "tabular-nums";
    value.style.textAlign = "right";
    value.style.whiteSpace = "nowrap";
    value.style.opacity = "0.86";

    input.addEventListener("input", () => {
        const next = Number(input.value);
        widget.value = next;
        value.textContent = next.toFixed(definition.precision);
        updateRangeFill(input);
        widget.callback?.(next, app.canvas, node);
        node.setDirtyCanvas?.(true, true);
    });
    updateRangeFill(input);
    row.append(label, input, value);

    return {
        name: definition.name, precision: definition.precision, row, label, input, value,
        syncFromBackend() {
            const current = Number(widget.value);
            input.value = String(current);
            value.textContent = current.toFixed(definition.precision);
            updateRangeFill(input);
        },
        applyLanguage(nextTranslation) {
            label.textContent = widgetLabel(nextTranslation, definition.name);
            label.title = parameterTooltip(definition.name);
            input.title = parameterTooltip(definition.name);
            input.setAttribute("aria-label", nextTranslation.widgetLabels[definition.name] || label.textContent);
        },
    };
}

function createLightLeakControls(node, leakColorUI) {
    const section = document.createElement("div");
    section.className = "zrl-dr zrl-panel";
    section.setAttribute("data-zrl-layout", "light-leak-two-column");
    section.style.display = "grid";
    section.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
    section.style.columnGap = "12px";
    section.style.rowGap = "8px";
    section.style.width = "100%";
    section.style.minWidth = "0";
    section.style.boxSizing = "border-box";
    section.style.padding = "7px 2px 8px";

    const modeUI = createTranslatedSelectRow("leak_mode", node);
    const positionUI = createTranslatedSelectRow("leak_position", node);
    for (const [name, ui] of [["leak_mode", modeUI], ["leak_position", positionUI]]) {
        ui.row.setAttribute("data-zrl-control", name);
        ui.row.style.minWidth = "0";
        ui.row.style.gap = "6px";
        ui.label.style.minWidth = "0";
        ui.label.style.fontSize = "10px";
        ui.label.style.whiteSpace = "nowrap";
        ui.label.style.overflow = "hidden";
        ui.label.style.textOverflow = "ellipsis";
        ui.select.style.flex = "1.15";
        ui.select.style.height = "26px";
        ui.select.style.padding = "2px 5px";
        ui.select.style.fontSize = "10px";
    }

    const ranges = LIGHT_LEAK_RANGE_CONTROLS
        .map((definition) => createLightLeakRangeControl(node, definition))
        .filter(Boolean);

    // Keep the existing color picker and serialized color widget contract,
    // but place it in the sixth cell beside Leak Radius.
    leakColorUI.row.setAttribute("data-zrl-control", "leak_color");
    leakColorUI.row.style.minWidth = "0";
    leakColorUI.row.style.gap = "6px";
    leakColorUI.row.style.justifyContent = "flex-end";
    leakColorUI.label.style.fontSize = "10px";
    leakColorUI.label.style.minWidth = "0";
    leakColorUI.colorValue.style.fontSize = "10px";
    leakColorUI.colorValue.style.minWidth = "58px";
    leakColorUI.picker.style.width = "34px";
    leakColorUI.picker.style.height = "25px";

    // Grid order is intentionally fixed to three paired rows:
    // Mode / Position, Exposure / Seed, Radius / Color.
    section.append(
        modeUI.row,
        positionUI.row,
        ranges.find((control) => control.name === "leak_exposure")?.row,
        ranges.find((control) => control.name === "leak_seed")?.row,
        ranges.find((control) => control.name === "leak_radius")?.row,
        leakColorUI.row,
    );

    return {
        section,
        modeUI,
        positionUI,
        ranges,
        sync() {
            modeUI.syncFromBackend();
            positionUI.syncFromBackend();
            for (const control of ranges) control.syncFromBackend();
            leakColorUI.syncFromBackend();
        },
        applyLanguage(translation) {
            modeUI.applyLanguage(translation);
            positionUI.applyLanguage(translation);
            for (const control of ranges) control.applyLanguage(translation);
            leakColorUI.applyLanguage(translation);
        },
    };
}

function addDOMWidgetAt(node, name, element, beforeWidgetName = null, widgetOptions = {}) {
    node.addDOMWidget(name, "custom", element, {
        serialize: false,
        hideOnZoom: false,
        ...widgetOptions,
    });
    const widgets = node.widgets || [];
    const currentIndex = widgets.findIndex((widget) => widget.name === name);
    if (currentIndex < 0) return;
    const [widget] = widgets.splice(currentIndex, 1);
    const targetIndex = beforeWidgetName
        ? widgets.findIndex((candidate) => candidate.name === beforeWidgetName)
        : -1;
    widgets.splice(targetIndex >= 0 ? targetIndex : widgets.length, 0, widget);
}

const LIGHT_CONTROL_GROUPS = Object.freeze([
    {
        headingKey: "bloomGroup",
        controls: [
            { name: "bloom_amount", min: 0.0, max: 3.0, step: 0.01, precision: 2 },
            { name: "bloom_threshold", min: 0.0, max: 0.98, step: 0.01, precision: 2 },
            { name: "bloom_radius", min: 1.0, max: 40.0, step: 0.5, precision: 1 },
        ],
    },
    {
        headingKey: "halationGroup",
        controls: [
            { name: "halation_amount", min: 0.0, max: 2.0, step: 0.01, precision: 2 },
            { name: "ring_radius", min: 3.0, max: 60.0, step: 0.5, precision: 1 },
        ],
        includeHalationColor: true,
    },
]);

function createLightControls(node, halationColorUI) {
    const section = document.createElement("div");
    section.className = "zrl-dr zrl-panel";
    section.style.display = "grid";
    section.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
    section.style.columnGap = "12px";
    section.style.width = "100%";
    section.style.boxSizing = "border-box";
    section.style.padding = "7px 2px 6px";


    node._zrlLightControls = [];
    const initialTranslation = getTranslation(node._zrlLanguage || "en");
    for (let groupIndex = 0; groupIndex < LIGHT_CONTROL_GROUPS.length; groupIndex += 1) {
        const group = LIGHT_CONTROL_GROUPS[groupIndex];
        const column = document.createElement("div");
        column.style.display = "flex";
        column.style.flexDirection = "column";
        column.style.gap = "6px";
        column.style.minWidth = "0";
        if (groupIndex === 0) {
            column.style.paddingRight = "6px";
            column.style.borderRight = "1px solid var(--border-color, rgba(255,255,255,0.10))";
        } else {
            column.style.paddingLeft = "2px";
        }

        const heading = makeText(initialTranslation[group.headingKey], "10px");
        heading.className = "zrl-heading";
        column.append(heading);

        for (const definition of group.controls) {
            const widget = node.widgets?.find((candidate) => candidate.name === definition.name);
            if (!widget) continue;
            widget.hidden = true;

            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.flexDirection = "column";
            row.style.gap = "3px";
            row.style.width = "100%";
            row.style.minWidth = "0";

            const header = document.createElement("div");
            header.style.display = "flex";
            header.style.alignItems = "baseline";
            header.style.justifyContent = "space-between";
            header.style.gap = "5px";
            const label = makeText(widgetLabel(initialTranslation, definition.name), "10.5px");
            label.style.whiteSpace = "nowrap";
            label.style.overflow = "hidden";
            label.style.textOverflow = "ellipsis";
            const value = makeText(Number(widget.value).toFixed(definition.precision), "10.5px");
            value.style.fontVariantNumeric = "tabular-nums";
            value.style.flexShrink = "0";
            value.style.opacity = "0.86";
            header.append(label, value);

            const input = document.createElement("input");
            input.type = "range";
            input.className = "zrl-light-range";
            input.min = String(definition.min);
            input.max = String(definition.max);
            input.step = String(definition.step);
            input.value = String(widget.value ?? definition.min);
            input.title = parameterTooltip(definition.name);
            label.title = parameterTooltip(definition.name);
            input.setAttribute("aria-label", label.textContent);
            input.style.margin = "0";
            input.style.padding = "0";
            input.style.border = "0";
            input.style.borderRadius = "4px";
            input.style.outline = "none";
            input.style.cursor = "pointer";
            input.style.appearance = "none";
            input.style.accentColor = "var(--input-text, #8BA9C0)";

            const control = { name: definition.name, precision: definition.precision, input, value, label };
            input.addEventListener("input", () => {
                const next = Number(input.value);
                widget.value = next;
                value.textContent = next.toFixed(definition.precision);
                updateRangeFill(input);
                widget.callback?.(next, app.canvas, node);
                node.setDirtyCanvas?.(true, true);
            });
            updateRangeFill(input);
            row.append(header, input);
            column.append(row);
            node._zrlLightControls.push(control);
        }
        if (group.includeHalationColor && halationColorUI) {
            halationColorUI.row.style.gap = "6px";
            halationColorUI.row.style.paddingTop = "1px";
            halationColorUI.row.style.justifyContent = "flex-end";
            halationColorUI.label.style.fontSize = "10.5px";
            halationColorUI.colorValue.style.fontSize = "10px";
            halationColorUI.colorValue.style.minWidth = "58px";
            halationColorUI.picker.style.width = "36px";
            halationColorUI.picker.style.height = "25px";
            column.append(halationColorUI.row);
        }
        section.append(column);
    }

    return {
        section,
        applyLanguage(translation) {
            for (let i = 0; i < LIGHT_CONTROL_GROUPS.length; i += 1) {
                const group = LIGHT_CONTROL_GROUPS[i];
                const heading = section.children[i];
                if (heading?.children[0]) heading.children[0].textContent = translation[group.headingKey];
            }
            for (const control of node._zrlLightControls) {
                control.label.textContent = widgetLabel(translation, control.name);
                control.input.title = parameterTooltip(control.name);
                control.label.title = parameterTooltip(control.name);
                control.input.setAttribute("aria-label", translation.widgetLabels[control.name]);
            }
        },
    };
}

const TONE_CONTROL_GROUPS = Object.freeze([
    {
        headingKey: "antiAIGroup",
        controls: [
            { name: "anti_ai", min: 0, max: 100, step: 1, precision: 0 },
            { name: "exposure", min: -100, max: 100, step: 1, precision: 0 },
        ],
    },
    {
        headingKey: "sabattierGroup",
        controls: [
            { name: "solarization", min: 0.0, max: 1.0, step: 0.01, precision: 2 },
            { name: "highlight_confinement", min: 0.0, max: 1.0, step: 0.01, precision: 2 },
        ],
    },
]);

function createToneControls(node) {
    const section = document.createElement("div");
    section.className = "zrl-dr zrl-panel";
    section.style.display = "grid";
    section.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
    section.style.columnGap = "12px";
    section.style.width = "100%";
    section.style.boxSizing = "border-box";
    section.style.padding = "7px 2px 6px";
    const initialTranslation = getTranslation(node._zrlLanguage || "en");
    node._zrlToneControls = [];

    for (let groupIndex = 0; groupIndex < TONE_CONTROL_GROUPS.length; groupIndex += 1) {
        const group = TONE_CONTROL_GROUPS[groupIndex];
        const column = document.createElement("div");
        column.style.display = "flex";
        column.style.flexDirection = "column";
        column.style.gap = "7px";
        column.style.minWidth = "0";
        if (groupIndex === 0) {
            column.style.paddingRight = "6px";
            column.style.borderRight = "1px solid var(--border-color, rgba(255,255,255,0.10))";
        } else {
            column.style.paddingLeft = "2px";
        }
        const heading = makeText(initialTranslation[group.headingKey], "10px");
        heading.className = "zrl-heading";
        column.append(heading);

        for (const definition of group.controls) {
            const widget = node.widgets?.find((candidate) => candidate.name === definition.name);
            if (!widget) continue;
            widget.hidden = true;
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.flexDirection = "column";
            row.style.gap = "3px";
            row.style.width = "100%";
            row.style.minWidth = "0";
            const header = document.createElement("div");
            header.style.display = "flex";
            header.style.alignItems = "baseline";
            header.style.justifyContent = "space-between";
            header.style.gap = "5px";
            const label = makeText(widgetLabel(initialTranslation, definition.name), "10.5px");
            label.style.whiteSpace = "nowrap";
            label.style.overflow = "hidden";
            label.style.textOverflow = "ellipsis";
            const value = makeText(Number(widget.value).toFixed(definition.precision), "10.5px");
            value.style.fontVariantNumeric = "tabular-nums";
            value.style.flexShrink = "0";
            value.style.opacity = "0.86";
            header.append(label, value);
            const input = document.createElement("input");
            input.type = "range";
            input.className = "zrl-light-range";
            input.min = String(definition.min);
            input.max = String(definition.max);
            input.step = String(definition.step);
            input.value = String(widget.value ?? definition.min);
            input.title = parameterTooltip(definition.name);
            label.title = parameterTooltip(definition.name);
            input.setAttribute("aria-label", label.textContent);
            input.style.margin = "0";
            input.style.padding = "0";
            input.style.border = "0";
            input.style.borderRadius = "4px";
            input.style.outline = "none";
            input.style.cursor = "pointer";
            input.style.appearance = "none";
            input.style.accentColor = "var(--input-text, #8BA9C0)";
            const control = { name: definition.name, precision: definition.precision, input, value, label };
            input.addEventListener("input", () => {
                const next = Number(input.value);
                widget.value = next;
                value.textContent = next.toFixed(definition.precision);
                updateRangeFill(input);
                widget.callback?.(next, app.canvas, node);
                node.setDirtyCanvas?.(true, true);
            });
            updateRangeFill(input);
            row.append(header, input);
            column.append(row);
            node._zrlToneControls.push(control);
        }
        section.append(column);
    }
    return {
        section,
        applyLanguage(translation) {
            for (let i = 0; i < TONE_CONTROL_GROUPS.length; i += 1) {
                const heading = section.children[i];
                if (heading?.children[0]) heading.children[0].textContent = translation[TONE_CONTROL_GROUPS[i].headingKey];
            }
            for (const control of node._zrlToneControls) {
                control.label.textContent = widgetLabel(translation, control.name);
                control.input.title = parameterTooltip(control.name);
                control.label.title = parameterTooltip(control.name);
                control.input.setAttribute("aria-label", translation.widgetLabels[control.name]);
            }
        },
    };
}

function syncToneControls(node) {
    for (const control of node._zrlToneControls || []) {
        const widget = node.widgets?.find((candidate) => candidate.name === control.name);
        if (!widget) continue;
        const value = Number(widget.value);
        control.input.value = String(value);
        control.value.textContent = value.toFixed(control.precision);
        updateRangeFill(control.input);
    }
}

function syncLightControls(node) {
    for (const control of node._zrlLightControls || []) {
        const widget = node.widgets?.find((candidate) => candidate.name === control.name);
        if (!widget) continue;
        const value = Number(widget.value);
        control.input.value = String(value);
        control.value.textContent = value.toFixed(control.precision);
        updateRangeFill(control.input);
    }
}

function readNodeSettings(node) {
    const settings = {};
    for (const name of Object.keys(DEFAULT_WIDGET_VALUES)) {
        const widget = node.widgets?.find((candidate) => candidate.name === name);
        if (!widget) continue;
        settings[name] = name === "leak_color"
            ? normalizeHex(widget.value, DEFAULT_COLOR)
            : name === "halation_color"
                ? normalizeHex(widget.value, DEFAULT_HALATION_COLOR)
                : widget.value;
    }
    return settings;
}

function syncGrainControls(node) {
    for (const control of node._zrlGrainControls || []) {
        const widget = node.widgets?.find((candidate) => candidate.name === control.name);
        if (!widget) continue;
        const value = Number(widget.value);
        control.input.value = String(value);
        control.value.textContent = value.toFixed(control.precision);
        updateRangeFill(control.input);
    }
}

function updateRangeFill(input) {
    const min = Number(input.min);
    const max = Number(input.max);
    const value = Number(input.value);
    const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;
    input.style.setProperty("--zrl-p", `${percent}%`);
}

function createGrainControls(node) {
    const section = document.createElement("div");
    section.style.display = "grid";
    section.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
    section.style.columnGap = "14px";
    section.style.width = "100%";
    section.style.boxSizing = "border-box";
    section.style.padding = "6px 2px 3px";
    section.className = "zrl-dr zrl-panel";
    section.setAttribute("data-zrl-region", "grain-texture-detail");


    const grainColumn = document.createElement("div");
    grainColumn.style.display = "flex";
    grainColumn.style.flexDirection = "column";
    grainColumn.style.gap = "7px";
    grainColumn.style.minWidth = "0";
    grainColumn.style.paddingRight = "7px";
    grainColumn.style.borderRight = "1px solid var(--border-color, rgba(255,255,255,0.10))";
    const heading = makeText(getTranslation(node._zrlLanguage).filmGrain, "10px");
    heading.className = "zrl-heading";
    grainColumn.append(heading);

    const createRange = (column, widget, definition, labelText, className, labelKey = null) => {
        widget.hidden = true;
        const row = document.createElement("div");
        row.style.display = "grid";
        row.style.gridTemplateColumns = "96px minmax(0, 1fr) 42px";
        row.style.alignItems = "center";
        row.style.columnGap = "7px";
        row.style.width = "100%";
        const label = makeText(labelText, "10px");
        label.style.whiteSpace = "nowrap";
        label.style.overflow = "hidden";
        label.style.textOverflow = "ellipsis";
        const input = document.createElement("input");
        input.type = "range";
        input.className = className;
        input.min = String(definition.min);
        input.max = String(definition.max);
        input.step = String(definition.step);
        input.value = String(widget.value ?? definition.min);
        input.title = parameterTooltip(definition.name);
        label.title = parameterTooltip(definition.name);
        input.setAttribute("aria-label", labelText);
        input.style.width = "100%";
        input.style.margin = "0";
        input.style.padding = "0";
        input.style.border = "0";
        input.style.borderRadius = "4px";
        input.style.outline = "none";
        input.style.cursor = "pointer";
        input.style.appearance = "none";
        const value = makeText(Number(widget.value).toFixed(definition.precision), "10px");
        value.style.fontVariantNumeric = "tabular-nums";
        value.style.textAlign = "right";
        const control = { name: definition.name, labelKey, precision: definition.precision, input, value, label };
        input.addEventListener("input", () => {
            const next = Number(input.value);
            widget.value = next;
            value.textContent = next.toFixed(definition.precision);
            updateRangeFill(input);
            widget.callback?.(next, app.canvas, node);
            node.setDirtyCanvas?.(true, true);
        });
        updateRangeFill(input);
        row.append(label, input, value);
        column.append(row);
        return control;
    };

    node._zrlGrainControls = [];
    for (const definition of GRAIN_CONTROLS) {
        const widget = node.widgets?.find((candidate) => candidate.name === definition.name);
        if (!widget) continue;
        const label = getTranslation(node._zrlLanguage)[definition.labelKey];
        node._zrlGrainControls.push(createRange(grainColumn, widget, definition, label, "zrl-grain-range", definition.labelKey));
    }

    const grainBlendModeWidget = node.widgets?.find((candidate) => candidate.name === "grain_blend_mode");
    if (grainBlendModeWidget) grainBlendModeWidget.hidden = true;
    const grainBlendTranslation = getNoiseBlendTranslation(node._zrlLanguage);
    const grainBlendModeRow = document.createElement("div");
    grainBlendModeRow.style.display = "grid";
    grainBlendModeRow.style.gridTemplateColumns = "96px minmax(0, 1fr)";
    grainBlendModeRow.style.alignItems = "center";
    grainBlendModeRow.style.columnGap = "7px";
    grainBlendModeRow.style.width = "100%";
    const grainBlendModeLabel = makeText(getGrainBlendLabel(node._zrlLanguage), "10px");
    grainBlendModeLabel.style.whiteSpace = "nowrap";
    grainBlendModeLabel.style.overflow = "hidden";
    grainBlendModeLabel.style.textOverflow = "ellipsis";
    grainBlendModeLabel.title = parameterTooltip("grain_blend_mode");
    const grainBlendModeSelect = document.createElement("select");
    grainBlendModeSelect.style.width = "100%";
    grainBlendModeSelect.style.minWidth = "0";
    grainBlendModeSelect.style.height = "25px";
    grainBlendModeSelect.style.padding = "2px 6px";
    grainBlendModeSelect.style.border = "1px solid var(--border-color, #454B54)";
    grainBlendModeSelect.style.borderRadius = "5px";
    grainBlendModeSelect.style.background = "var(--comfy-input-bg, #20242A)";
    grainBlendModeSelect.style.color = "var(--fg-color, #DDD)";
    grainBlendModeSelect.style.fontSize = "10px";
    grainBlendModeSelect.title = parameterTooltip("grain_blend_mode");
    for (const mode of NOISE_BLEND_MODE_OPTIONS) {
        const option = document.createElement("option");
        option.value = mode;
        option.textContent = grainBlendTranslation.modes[mode] || mode;
        option.title = parameterTooltip("grain_blend_mode");
        grainBlendModeSelect.append(option);
    }
    if (grainBlendModeWidget) {
        grainBlendModeSelect.value = NOISE_BLEND_MODE_OPTIONS.includes(grainBlendModeWidget.value)
            ? grainBlendModeWidget.value : "Additive";
        if (!NOISE_BLEND_MODE_OPTIONS.includes(grainBlendModeWidget.value)) grainBlendModeWidget.value = "Additive";
    } else {
        grainBlendModeSelect.value = "Additive";
    }
    grainBlendModeSelect.setAttribute("aria-label", getGrainBlendLabel(node._zrlLanguage));
    grainBlendModeSelect.addEventListener("change", () => {
        if (!grainBlendModeWidget) return;
        grainBlendModeWidget.value = grainBlendModeSelect.value;
        grainBlendModeWidget.callback?.(grainBlendModeWidget.value, app.canvas, node);
        schedulePreview(node);
        node.setDirtyCanvas?.(true, true);
    });
    grainBlendModeRow.append(grainBlendModeLabel, grainBlendModeSelect);

    const textureColumn = document.createElement("div");
    textureColumn.style.display = "flex";
    textureColumn.style.flexDirection = "column";
    textureColumn.style.gap = "7px";
    textureColumn.style.minWidth = "0";
    const textureHeading = makeText(getTranslation(node._zrlLanguage).proceduralTexture, "10px");
    textureHeading.className = "zrl-heading";
    textureColumn.append(textureHeading);

    const textureWidget = node.widgets?.find((candidate) => candidate.name === "noise_texture");
    const amountWidget = node.widgets?.find((candidate) => candidate.name === "noise_amount");
    const seedWidget = node.widgets?.find((candidate) => candidate.name === "noise_seed");
    const blendModeWidget = node.widgets?.find((candidate) => candidate.name === "noise_blend_mode");
    if (textureWidget) textureWidget.hidden = true;
    if (amountWidget) amountWidget.hidden = true;
    if (seedWidget) seedWidget.hidden = true;
    if (blendModeWidget) blendModeWidget.hidden = true;

    const textureLabel = makeText(getTranslation(node._zrlLanguage).noiseTextureLabel, "10px");
    textureLabel.style.whiteSpace = "nowrap";
    const textureSelect = document.createElement("select");
    textureSelect.style.width = "100%";
    textureSelect.style.minWidth = "0";
    textureSelect.style.height = "25px";
    textureSelect.style.padding = "2px 6px";
    textureSelect.style.border = "1px solid var(--border-color, #454B54)";
    textureSelect.style.borderRadius = "5px";
    textureSelect.style.background = "var(--comfy-input-bg, #20242A)";
    textureSelect.style.color = "var(--fg-color, #DDD)";
    textureSelect.style.fontSize = "10px";
    textureSelect.title = parameterTooltip("noise_texture");
    for (const mode of NOISE_TEXTURE_OPTIONS) {
        const option = document.createElement("option");
        option.value = mode;
        option.textContent = getTranslation(node._zrlLanguage).noiseTextures[mode] || mode;
        option.title = parameterTooltip("noise_texture");
        textureSelect.append(option);
    }
    if (textureWidget) {
        textureSelect.value = textureWidget.value === "Gabor Texture" ? "Emulsion Mottle" : textureWidget.value;
        if (!textureSelect.value) textureSelect.value = "Gaussian";
        if (textureWidget.value === "Gabor Texture") textureWidget.value = "Emulsion Mottle";
    }
    textureSelect.addEventListener("change", () => {
        if (!textureWidget) return;
        textureWidget.value = textureSelect.value;
        textureWidget.callback?.(textureWidget.value, app.canvas, node);
        node.setDirtyCanvas?.(true, true);
    });
    textureColumn.append(textureLabel, textureSelect);

    const blendTranslation = getNoiseBlendTranslation(node._zrlLanguage);
    const blendModeRow = document.createElement("div");
    blendModeRow.style.display = "grid";
    blendModeRow.style.gridTemplateColumns = "96px minmax(0, 1fr)";
    blendModeRow.style.alignItems = "center";
    blendModeRow.style.columnGap = "7px";
    blendModeRow.style.width = "100%";
    const blendModeLabel = makeText(blendTranslation.label, "10px");
    blendModeLabel.style.whiteSpace = "nowrap";
    blendModeLabel.style.overflow = "hidden";
    blendModeLabel.style.textOverflow = "ellipsis";
    const blendModeSelect = document.createElement("select");
    blendModeSelect.style.width = "100%";
    blendModeSelect.style.minWidth = "0";
    blendModeSelect.style.height = "25px";
    blendModeSelect.style.padding = "2px 6px";
    blendModeSelect.style.border = "1px solid var(--border-color, #454B54)";
    blendModeSelect.style.borderRadius = "5px";
    blendModeSelect.style.background = "var(--comfy-input-bg, #20242A)";
    blendModeSelect.style.color = "var(--fg-color, #DDD)";
    blendModeSelect.style.fontSize = "10px";
    blendModeSelect.title = parameterTooltip("noise_blend_mode");
    blendModeLabel.title = parameterTooltip("noise_blend_mode");
    for (const mode of NOISE_BLEND_MODE_OPTIONS) {
        const option = document.createElement("option");
        option.value = mode;
        option.textContent = blendTranslation.modes[mode] || mode;
        option.title = parameterTooltip("noise_blend_mode");
        blendModeSelect.append(option);
    }
    if (blendModeWidget) {
        blendModeSelect.value = NOISE_BLEND_MODE_OPTIONS.includes(blendModeWidget.value)
            ? blendModeWidget.value : "Additive";
        if (!NOISE_BLEND_MODE_OPTIONS.includes(blendModeWidget.value)) blendModeWidget.value = "Additive";
    } else {
        blendModeSelect.value = "Additive";
    }
    blendModeSelect.addEventListener("change", () => {
        if (!blendModeWidget) return;
        blendModeWidget.value = blendModeSelect.value;
        blendModeWidget.callback?.(blendModeWidget.value, app.canvas, node);
        schedulePreview(node);
        node.setDirtyCanvas?.(true, true);
    });
    blendModeRow.append(blendModeLabel, blendModeSelect);

    let noiseAmountControl = null;
    if (amountWidget) {
        noiseAmountControl = createRange(textureColumn, amountWidget,
            { name: "noise_amount", min: 0, max: 2, step: 0.01, precision: 2 },
            getTranslation(node._zrlLanguage).noiseAmount, "zrl-noise-range");
    }

    const seedControl = seedWidget ? createRange(textureColumn, seedWidget,
        { name: "noise_seed", min: 0, max: 999, step: 1, precision: 0 },
        getTranslation(node._zrlLanguage).noiseSeed, "zrl-noise-range") : null;
    const scaleWidget = node.widgets?.find((candidate) => candidate.name === "noise_scale");
    if (scaleWidget) scaleWidget.hidden = true;
    const scaleControl = scaleWidget ? createRange(textureColumn, scaleWidget,
        { name: "noise_scale", min: 0.0, max: 4.0, step: 0.05, precision: 2 },
        getTranslation(node._zrlLanguage).noiseScale || "Texture Scale", "zrl-noise-range") : null;
    // Put both compositing controls in one shared row. Grain Blend Mode sits
    // directly beneath Color Grain, while Texture Blend Mode follows the
    // procedural texture controls; the paired selectors remain horizontally aligned.
    const blendModePairRow = document.createElement("div");
    blendModePairRow.style.display = "grid";
    blendModePairRow.style.gridColumn = "1 / -1";
    blendModePairRow.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
    blendModePairRow.style.columnGap = "14px";
    blendModePairRow.style.width = "100%";
    blendModePairRow.style.minWidth = "0";
    blendModePairRow.append(grainBlendModeRow, blendModeRow);
    node._zrlTextureControls = [noiseAmountControl, seedControl, scaleControl].filter(Boolean);
    section.append(grainColumn, textureColumn, blendModePairRow);

    return {
        section, heading, textureHeading, blendModePairRow,
        applyLanguage(translation) {
            heading.textContent = translation.filmGrain;
            textureHeading.textContent = translation.proceduralTexture;
            textureLabel.textContent = translation.noiseTextureLabel;
            for (const option of textureSelect.children) { option.textContent = translation.noiseTextures[option.value] || option.value; option.title = parameterTooltip("noise_texture"); }
            const localizedBlend = getNoiseBlendTranslation(node._zrlLanguage);
            blendModeLabel.textContent = localizedBlend.label;
            blendModeLabel.title = parameterTooltip("noise_blend_mode");
            blendModeSelect.title = parameterTooltip("noise_blend_mode");
            grainBlendModeLabel.textContent = getGrainBlendLabel(node._zrlLanguage);
            grainBlendModeLabel.title = parameterTooltip("grain_blend_mode");
            grainBlendModeSelect.title = parameterTooltip("grain_blend_mode");
            grainBlendModeSelect.setAttribute("aria-label", getGrainBlendLabel(node._zrlLanguage));
            for (const option of grainBlendModeSelect.children) {
                option.textContent = localizedBlend.modes[option.value] || option.value;
                option.title = parameterTooltip("grain_blend_mode");
            }
            for (const option of blendModeSelect.children) {
                option.textContent = localizedBlend.modes[option.value] || option.value;
                option.title = parameterTooltip("noise_blend_mode");
            }
            if (noiseAmountControl) {
                noiseAmountControl.label.textContent = translation.noiseAmount;
                noiseAmountControl.input.setAttribute("aria-label", translation.noiseAmount);
                noiseAmountControl.label.title = parameterTooltip("noise_amount");
                noiseAmountControl.input.title = parameterTooltip("noise_amount");
            }
            if (seedControl) {
                seedControl.label.textContent = translation.noiseSeed;
                seedControl.input.setAttribute("aria-label", translation.noiseSeed);
                seedControl.label.title = parameterTooltip("noise_seed");
                seedControl.input.title = parameterTooltip("noise_seed");
            }
            if (scaleControl) {
                scaleControl.label.textContent = translation.noiseScale || "Texture Scale";
                scaleControl.input.setAttribute("aria-label", translation.noiseScale || "Texture Scale");
                scaleControl.label.title = parameterTooltip("noise_scale");
                scaleControl.input.title = parameterTooltip("noise_scale");
            }
            textureLabel.title = parameterTooltip("noise_texture");
            textureSelect.title = parameterTooltip("noise_texture");
            blendModeLabel.setAttribute("aria-label", localizedBlend.label);
            blendModeSelect.setAttribute("aria-label", localizedBlend.label);
            for (const control of node._zrlGrainControls) {
                control.label.textContent = translation[control.labelKey];
                control.input.title = parameterTooltip(control.name);
                control.label.title = parameterTooltip(control.name);
            }
        },
        sync() {
            if (textureWidget) {
        textureSelect.value = textureWidget.value === "Gabor Texture" ? "Emulsion Mottle" : textureWidget.value;
        if (!textureSelect.value) textureSelect.value = "Gaussian";
        if (textureWidget.value === "Gabor Texture") textureWidget.value = "Emulsion Mottle";
    }
            if (blendModeWidget) {
                blendModeSelect.value = NOISE_BLEND_MODE_OPTIONS.includes(blendModeWidget.value)
                    ? blendModeWidget.value : "Additive";
            }
            if (grainBlendModeWidget) {
                grainBlendModeSelect.value = NOISE_BLEND_MODE_OPTIONS.includes(grainBlendModeWidget.value)
                    ? grainBlendModeWidget.value : "Additive";
            }
            for (const control of node._zrlTextureControls || []) {
                const widget = node.widgets?.find((candidate) => candidate.name === control.name);
                if (!widget) continue;
                const value = Number(widget.value);
                control.input.value = String(value);
                control.value.textContent = value.toFixed(control.precision);
                updateRangeFill(control.input);
            }
        },
        controls: { textureSelect, blendModeSelect, blendModeLabel, noiseAmountControl, seedControl, scaleControl, textureLabel },
    };
}

const OPTICAL_CONTROL_GROUPS = Object.freeze([
    {
        headingKey: "softFocus",
        controls: [
            { name: "soft_focus_amount", min: 0.0, max: 1.0, step: 0.01, precision: 2 },
            { name: "soft_focus_radius", min: 1.0, max: 80.0, step: 0.5, precision: 1 },
        ],
    },
    {
        headingKey: "vignette",
        controls: [
            { name: "vignette_amount", min: 0.0, max: 2.0, step: 0.01, precision: 2 },
            { name: "vignette_feather", min: 0.0, max: 1.0, step: 0.01, precision: 2 },
        ],
    },
]);

function createOpticalControls(node) {
    const section = document.createElement("div");
    section.className = "zrl-dr zrl-panel";
    section.style.display = "grid";
    section.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
    section.style.columnGap = "12px";
    section.style.width = "100%";
    section.style.boxSizing = "border-box";
    section.style.padding = "7px 2px 5px";


    node._zrlOpticalControls = [];
    const initialTranslation = getTranslation(node._zrlLanguage || "en");
    for (let groupIndex = 0; groupIndex < OPTICAL_CONTROL_GROUPS.length; groupIndex += 1) {
        const group = OPTICAL_CONTROL_GROUPS[groupIndex];
        const column = document.createElement("div");
        column.style.display = "flex";
        column.style.flexDirection = "column";
        column.style.gap = "7px";
        column.style.minWidth = "0";
        if (groupIndex === 0) {
            column.style.paddingRight = "6px";
            column.style.borderRight = "1px solid var(--border-color, rgba(255,255,255,0.10))";
        } else {
            column.style.paddingLeft = "2px";
        }

        const heading = makeText(initialTranslation[group.headingKey], "10px");
        heading.className = "zrl-heading";
        column.append(heading);

        for (const definition of group.controls) {
            const widget = node.widgets?.find((candidate) => candidate.name === definition.name);
            if (!widget) continue;
            widget.hidden = true;

            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.flexDirection = "column";
            row.style.gap = "3px";
            row.style.width = "100%";
            row.style.minWidth = "0";

            const header = document.createElement("div");
            header.style.display = "flex";
            header.style.alignItems = "baseline";
            header.style.justifyContent = "space-between";
            header.style.gap = "5px";
            const label = makeText(widgetLabel(initialTranslation, definition.name), "10.5px");
            label.style.whiteSpace = "nowrap";
            label.style.overflow = "hidden";
            label.style.textOverflow = "ellipsis";
            const value = makeText(Number(widget.value).toFixed(definition.precision), "10.5px");
            value.style.fontVariantNumeric = "tabular-nums";
            value.style.flexShrink = "0";
            value.style.opacity = "0.86";
            header.append(label, value);

            const input = document.createElement("input");
            input.type = "range";
            input.className = "zrl-optical-range";
            input.min = String(definition.min);
            input.max = String(definition.max);
            input.step = String(definition.step);
            input.value = String(widget.value ?? definition.min);
            input.title = parameterTooltip(definition.name);
            label.title = parameterTooltip(definition.name);
            input.setAttribute("aria-label", label.textContent);
            input.style.margin = "0";
            input.style.padding = "0";
            input.style.border = "0";
            input.style.borderRadius = "4px";
            input.style.outline = "none";
            input.style.cursor = "pointer";
            input.style.appearance = "none";
            input.style.accentColor = "var(--input-text, #8BA9C0)";

            const control = { name: definition.name, precision: definition.precision, input, value, label };
            input.addEventListener("input", () => {
                const next = Number(input.value);
                widget.value = next;
                value.textContent = next.toFixed(definition.precision);
                updateRangeFill(input);
                widget.callback?.(next, app.canvas, node);
                node.setDirtyCanvas?.(true, true);
            });
            updateRangeFill(input);
            row.append(header, input);
            column.append(row);
            node._zrlOpticalControls.push(control);
        }
        section.append(column);
    }
    return {
        section,
        applyLanguage(translation) {
            for (let i = 0; i < OPTICAL_CONTROL_GROUPS.length; i += 1) {
                const group = OPTICAL_CONTROL_GROUPS[i];
                const column = section.children[i];
                if (column?.children[0]) column.children[0].textContent = translation[group.headingKey];
            }
            for (const control of node._zrlOpticalControls) {
                control.label.textContent = widgetLabel(translation, control.name);
                control.input.title = parameterTooltip(control.name);
                control.label.title = parameterTooltip(control.name);
                control.input.setAttribute("aria-label", translation.widgetLabels[control.name]);
            }
        },
    };
}

function syncOpticalControls(node) {
    for (const control of node._zrlOpticalControls || []) {
        const widget = node.widgets?.find((candidate) => candidate.name === control.name);
        if (!widget) continue;
        const value = Number(widget.value);
        control.input.value = String(value);
        control.value.textContent = value.toFixed(control.precision);
        updateRangeFill(control.input);
    }
}

function applyLanguageToNode(node, code) {
    const language = getLanguage(code);
    ACTIVE_TOOLTIP_LANGUAGE = language;
    const translation = getTranslation(language);
    node._zrlLanguage = language;
    if (node._zrlPreviewUI) {
        node._zrlPreviewUI.compare.applyLanguage(translation);
        node._zrlPreviewUI.languageIcon.setAttribute("aria-label", translation.language);
        node._zrlPreviewUI.languageIcon.title = translation.language;
        node._zrlPreviewUI.languageSelect.setAttribute("aria-label", translation.language);
        node._zrlPreviewUI.languageSelect.value = language;
        node._zrlPreviewUI.status.textContent = node._zrlPreviewSourceSize
            ? `${translation.source}: ${node._zrlPreviewSourceSize[0]} × ${node._zrlPreviewSourceSize[1]}`
            : translation.previewQueue;
    }
    if (node._zrlPreviewUI) node._zrlPreviewUI.loupe.title = translation.grainDetail;
    node._zrlTabsUI?.applyLanguage(language);
    if (node._zrlGrainHeading) node._zrlGrainHeading.textContent = translation.filmGrain;
    node._zrlOpticalControlUI?.applyLanguage(translation);
    node._zrlLightControlUI?.applyLanguage(translation);
    node._zrlToneControlUI?.applyLanguage(translation);
    node._zrlGrainControlsUI?.applyLanguage(translation);
    for (const control of node._zrlGrainControls || []) {
        control.label.textContent = translation[control.labelKey];
        control.input.title = parameterTooltip(control.name);
        control.label.title = parameterTooltip(control.name);
        control.input.setAttribute("aria-label", `${translation.filmGrain}: ${translation[control.labelKey]}`);
    }
    node._zrlHalationColorUI?.applyLanguage(translation);
    node._zrlLightLeakControlsUI?.applyLanguage(translation);
    node._zrlEmulsionUI?.applyLanguage(translation);
    if (node._zrlResetButton) {
        node._zrlResetButton.title = translation.resetTitle;
        node._zrlResetButton.setAttribute("aria-label", translation.resetDefaults.replace(/^↺\s*/, ""));
    }
    for (const [widgetName, labelKey] of Object.entries(WIDGET_LABEL_KEYS)) {
        const widget = node.widgets?.find((candidate) => candidate.name === widgetName);
        if (!widget) continue;
        if (!widget._zrlOriginalLabelCaptured) {
            widget._zrlOriginalLabel = widget.label;
            widget._zrlOriginalLabelCaptured = true;
        }
        widget.label = translation.widgetLabels[labelKey] || widget._zrlOriginalLabel;
    }
    // Native ComfyUI controls (notably Light Leak Seed) do not use the custom
    // DOM wrappers above, so attach hover guidance directly to their widget
    // metadata and any host-provided input elements.
    for (const [widgetName, tooltip] of Object.entries(PARAMETER_TOOLTIPS)) {
        const widget = node.widgets?.find((candidate) => candidate.name === widgetName);
        if (!widget) continue;
        const localizedTooltip = parameterTooltip(widgetName, language);
        widget.tooltip = localizedTooltip;
        widget._zrlTooltip = localizedTooltip;
        if (widget.options && typeof widget.options === "object") widget.options.tooltip = localizedTooltip;
        for (const element of [widget.element, widget.inputEl, widget.domElement]) {
            if (!element) continue;
            element.title = localizedTooltip;
            element.setAttribute?.("title", localizedTooltip);
        }
    }
    node.setDirtyCanvas?.(true, true);
    node.graph?.setDirtyCanvas?.(true, true);
}

function setLanguageForAllNodes(sourceNode, code) {
    const language = getLanguage(code);
    saveStoredLanguage(language);
    for (const node of ACTIVE_NODES) node._zrlApplyLanguage?.(language);
    sourceNode?._zrlApplyLanguage?.(language);
}

async function deletePreviewToken(token) {
    if (!token) return;
    try {
        await api.fetchApi(`${PREVIEW_ENDPOINT}/${encodeURIComponent(token)}`, { method: "DELETE" });
    } catch (_) {
        // Cache entries also expire and are bounded server-side; cleanup is best-effort.
    }
}

async function deleteVideoPreviewToken(token) {
    if (!token) return;
    try {
        await api.fetchApi(`${VIDEO_PREVIEW_ENDPOINT}/${encodeURIComponent(token)}`, { method: "DELETE" });
    } catch (_) {
        // Video cache entries are also bounded and expire server-side.
    }
}

function schedulePreview(node, immediate = false) {
    if (!node?._zrlPreviewUI) return;
    node._zrlTabsUI?.sync();
    if (node._zrlPreviewTimer) clearTimeout(node._zrlPreviewTimer);
    const run = () => (node._zrlVideo ? restartVideoRender(node) : requestPreview(node));
    if (immediate) run();
    else node._zrlPreviewTimer = setTimeout(run, PREVIEW_DEBOUNCE_MS);
}

async function requestPreview(node) {
    const ui = node?._zrlPreviewUI;
    const token = node?._zrlPreviewToken;
    const translation = getTranslation(node?._zrlLanguage || "en");
    if (!ui) return;
    if (!token) {
        ui.status.textContent = translation.previewQueue;
        return;
    }

    const requestId = (node._zrlPreviewRequestId || 0) + 1;
    node._zrlPreviewRequestId = requestId;
    const includeOriginal = !node._zrlPreviewOriginalSrc && !node._zrlPreviewOriginalRequested;
    if (includeOriginal) node._zrlPreviewOriginalRequested = true;
    ui.status.textContent = translation.previewUpdating;
    try {
        const response = await api.fetchApi(PREVIEW_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token,
                settings: readNodeSettings(node),
                include_original: includeOriginal,
            }),
        });
        let result;
        try {
            result = await response.json();
        } catch (_) {
            throw new Error(`Preview endpoint returned HTTP ${response.status}.`);
        }
        if (!response.ok) throw new Error(result?.error || `Preview failed (HTTP ${response.status}).`);
        if (token !== node._zrlPreviewToken) return;
        if (typeof result.original_png === "string" && result.original_png.length > 0) {
            node._zrlPreviewOriginalSrc = `data:image/png;base64,${result.original_png}`;
            node._zrlPreviewOriginalRequested = true;
        } else if (includeOriginal) {
            node._zrlPreviewOriginalRequested = false;
        }
        if (requestId !== node._zrlPreviewRequestId) return;

        node._zrlPreviewProcessedSrc = `data:image/png;base64,${result.full_png}`;
        ui.fullImage.style.visibility = "visible";
        renderActiveCompositionPreview(node);
        ui.grainImage.src = `data:image/png;base64,${result.grain_png}`;
        ui.loupe.style.display = "block";
        node._zrlPreviewSourceSize = result.source_size;
        ui.status.textContent = `${translation.source}: ${result.source_size[0]} × ${result.source_size[1]}`;
        node.setDirtyCanvas?.(true, true);
    } catch (error) {
        if (token === node._zrlPreviewToken && includeOriginal && !node._zrlPreviewOriginalSrc) {
            node._zrlPreviewOriginalRequested = false;
        }
        if (requestId !== node._zrlPreviewRequestId) return;
        ui.status.textContent = `${translation.previewUnavailable}: ${error?.message || error}`;
    }
}

function createVideoPlayerControls(node) {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "8px";
    row.style.width = "100%";
    row.style.height = "28px";
    row.style.flexShrink = "0";

    const play = document.createElement("button");
    play.type = "button";
    play.textContent = "▶";
    play.title = "Play / Pause";
    play.style.width = "32px";
    play.style.height = "26px";
    play.style.flexShrink = "0";

    const scrubber = document.createElement("input");
    scrubber.type = "range";
    scrubber.min = "0";
    scrubber.max = "0";
    scrubber.step = "1";
    scrubber.value = "0";
    scrubber.style.flex = "1";
    scrubber.style.minWidth = "0";

    const label = makeText("0 / 0", "10px");
    label.style.minWidth = "64px";
    label.style.textAlign = "right";
    label.style.fontVariantNumeric = "tabular-nums";

    const fps = document.createElement("select");
    fps.title = "Preview playback speed";
    for (const value of VIDEO_FPS_OPTIONS) {
        const option = document.createElement("option");
        option.value = String(value);
        option.textContent = `${value} fps`;
        fps.append(option);
    }
    node.properties = node.properties || {};
    fps.value = String(node.properties.zrl_preview_fps || 24);
    fps.style.flexShrink = "0";

    play.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        setVideoPlaying(node, !node._zrlVideo.playing);
    });
    scrubber.addEventListener("input", () => {
        updateRangeFill(scrubber);
        setVideoPlaying(node, false);
        node._zrlVideo.current = Number(scrubber.value);
        showVideoFrame(node);
        pumpVideoRender(node);
    });
    fps.addEventListener("change", () => {
        node.properties.zrl_preview_fps = Number(fps.value);
        if (node._zrlVideo.playing) setVideoPlaying(node, true);
    });

    row.append(play, scrubber, label, fps);
    return { row, play, scrubber, label, fps };
}

function resetVideoState(node, token = null) {
    const video = node._zrlVideo;
    setVideoPlaying(node, false);
    Object.assign(video, {
        token, count: 0, stride: 1, sourceCount: 0, current: 0, generation: video.generation + 1,
        original: [], processed: [], fresh: [],
    });
    const player = node._zrlVideoPlayerUI;
    player.scrubber.max = "0";
    player.scrubber.value = "0";
    player.label.textContent = "0 / 0";
}

function setVideoPlaying(node, playing) {
    const video = node._zrlVideo;
    if (video.timer) clearInterval(video.timer);
    video.timer = null;
    video.playing = Boolean(playing) && video.count > 1;
    node._zrlVideoPlayerUI.play.textContent = video.playing ? "❚❚" : "▶";
    if (!video.playing) return;
    const fps = Number(node._zrlVideoPlayerUI.fps.value) || 24;
    video.timer = setInterval(() => {
        video.current = (video.current + 1) % video.count;
        showVideoFrame(node);
    }, (1000 * video.stride) / fps);
    pumpVideoRender(node);
}

function showVideoFrame(node) {
    const video = node._zrlVideo;
    const ui = node._zrlPreviewUI;
    const player = node._zrlVideoPlayerUI;
    if (!video.count) return;
    const index = video.current;
    const original = video.original[index];
    const processed = video.processed[index] || original;
    if (processed) {
        ui.fullImage.src = processed;
        ui.fullImage.style.visibility = "visible";
    }
    if (original) ui.beforeImage.src = original;
    ui.beforeImage.style.visibility = original ? "visible" : "hidden";
    applyPreviewMode(ui);
    player.scrubber.value = String(index);
    updateRangeFill(player.scrubber);
    player.label.textContent = `${Math.min(index * video.stride + 1, video.sourceCount)} / ${video.sourceCount}`;
}

function restartVideoRender(node) {
    const video = node._zrlVideo;
    const translation = getTranslation(node._zrlLanguage || "en");
    if (!video.token) {
        node._zrlPreviewUI.status.textContent = translation.previewQueue;
        return;
    }
    // Keep the stale processed frames on screen until their replacements arrive.
    video.generation += 1;
    video.fresh = [];
    pumpVideoRender(node);
}

async function pumpVideoRender(node) {
    const video = node._zrlVideo;
    const ui = node._zrlPreviewUI;
    if (video.pumping || !video.token) return;
    video.pumping = true;
    const translation = getTranslation(node._zrlLanguage || "en");
    try {
        while (video.token) {
            const token = video.token;
            const generation = video.generation;
            // The playhead frame renders alone first for an immediate live
            // response; the rest of the clip follows from the playhead onward.
            const limit = video.fresh[video.current] ? VIDEO_FRAMES_PER_REQUEST : 1;
            const indices = [];
            const total = video.count || 1;
            for (let step = 0; step < total && indices.length < limit; step += 1) {
                const index = (video.current + step) % total;
                if (!video.fresh[index]) indices.push(index);
            }
            if (!indices.length) break;
            const response = await api.fetchApi(VIDEO_PREVIEW_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    settings: readNodeSettings(node),
                    frames: indices,
                    include_original: indices.some((index) => !video.original[index]),
                }),
            });
            let result;
            try {
                result = await response.json();
            } catch (_) {
                throw new Error(`Preview endpoint returned HTTP ${response.status}.`);
            }
            if (!response.ok) throw new Error(result?.error || `Preview failed (HTTP ${response.status}).`);
            if (token !== video.token) continue;
            if (!video.count) {
                video.count = result.frame_count;
                video.stride = result.frame_stride;
                video.sourceCount = result.source_frame_count;
                node._zrlVideoPlayerUI.scrubber.max = String(Math.max(0, video.count - 1));
                node._zrlPreviewSourceSize = result.source_size;
            }
            for (const frame of result.frames) {
                if (frame.original_jpg) video.original[frame.index] = `data:image/jpeg;base64,${frame.original_jpg}`;
                if (generation !== video.generation) continue;
                video.processed[frame.index] = `data:image/jpeg;base64,${frame.jpg}`;
                video.fresh[frame.index] = true;
            }
            if (!video.playing) showVideoFrame(node);
            const done = video.fresh.filter(Boolean).length;
            ui.status.textContent = done < video.count
                ? `${translation.previewUpdating} ${done} / ${video.count}`
                : `${translation.source}: ${result.source_size[0]} × ${result.source_size[1]} · ${video.sourceCount} frames`;
            node.setDirtyCanvas?.(true, true);
        }
    } catch (error) {
        ui.status.textContent = `${translation.previewUnavailable}: ${error?.message || error}`;
    } finally {
        video.pumping = false;
    }
}

function createControlTabs(node) {
    const element = document.createElement("div");
    element.className = "zrl-dr zrl-tabs";
    element.setAttribute("role", "tablist");
    const buttons = CONTROL_TABS.map((tab) => {
        const button = document.createElement("button");
        button.type = "button";
        button.setAttribute("role", "tab");
        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            setActiveTab(node, tab.id);
        });
        element.append(button);
        return button;
    });
    element.addEventListener("pointerdown", (event) => event.stopPropagation());
    return {
        element,
        buttons,
        applyLanguage(language) {
            const labels = TAB_LABELS[language] || TAB_LABELS.en;
            CONTROL_TABS.forEach((tab, index) => { buttons[index].textContent = labels[tab.id]; });
        },
        sync() {
            const settings = readNodeSettings(node);
            CONTROL_TABS.forEach((tab, index) => {
                const changed = tab.widgets.some((name) => name in settings && settings[name] !== DEFAULT_WIDGET_VALUES[name]);
                buttons[index].setAttribute("aria-selected", node.properties.zrl_tab === tab.id ? "true" : "false");
                buttons[index].setAttribute("data-active", changed ? "true" : "false");
            });
        },
    };
}

function setActiveTab(node, tabId) {
    node.properties.zrl_tab = CONTROL_TABS.some((tab) => tab.id === tabId) ? tabId : CONTROL_TABS[0].id;
    for (const [id, element] of node._zrlTabPanels) element.hidden = id !== node.properties.zrl_tab;
    node._zrlTabsUI.sync();
    node.setDirtyCanvas?.(true, true);
}

// ComfyUI draws a DOM widget inset by its 10 px default margin on every side.
const DOM_WIDGET_MARGIN = 10;

// Fixed-height DOM widgets report their content height plus that inset, so only
// the preview absorbs spare node height and nothing is clipped or overlaps.
function contentHeight(element) {
    const height = () => (element.hidden ? 0 : element.scrollHeight + 2 * DOM_WIDGET_MARGIN);
    return { getMinHeight: height, getMaxHeight: height };
}

function wrapWidgetCallbacks(node) {
    for (const name of Object.keys(DEFAULT_WIDGET_VALUES)) {
        const widget = node.widgets?.find((candidate) => candidate.name === name);
        if (!widget || widget._zrlPreviewWrappedCallback === widget.callback) continue;
        const previous = widget.callback;
        const wrapped = function (...args) {
            const result = previous?.apply(this, args);
            schedulePreview(node);
            return result;
        };
        widget.callback = wrapped;
        widget._zrlPreviewWrappedCallback = wrapped;
    }
}

app.registerExtension({
    name: "zuanfilm.retrolab.live_preview",

    nodeCreated(node, extensionApp) {
        const isRetrolab = [NODE_NAME, VIDEO_NODE_NAME].some((name) => node?.comfyClass === name ||
            node?.type === name ||
            node?.constructor?.nodeData?.name === name) ||
            node?.title === "Zuanfilm Retrolab" ||
            node?.title === "Zuanfilm Retrolab Video";
        if (isRetrolab) applyInitialNodeWidth(node, extensionApp);
    },

    async beforeRegisterNodeDef(nodeType, nodeData) {
        if (nodeData.name !== NODE_NAME && nodeData.name !== VIDEO_NODE_NAME) return;
        const isVideo = nodeData.name === VIDEO_NODE_NAME;

        // Build the creative UI during node construction. Initial geometry is
        // applied later by the extension-level nodeCreated hook, after the
        // constructor and DOM-widget setup have completed.
        const originalCreated = nodeType.prototype.onNodeCreated;
        nodeType.prototype.onNodeCreated = function (...args) {
            const result = originalCreated?.apply(this, args);
            const leakBackendWidget = this.widgets?.find((widget) => widget.name === "leak_color");
            const halationBackendWidget = this.widgets?.find((widget) => widget.name === "halation_color");
            const leakModeWidget = this.widgets?.find((widget) => widget.name === "leak_mode");
            const leakPositionWidget = this.widgets?.find((widget) => widget.name === "leak_position");
            const emulsionBackendWidget = this.widgets?.find((widget) => widget.name === "color_emulsion");
            const whiteBalanceTemperatureWidget = this.widgets?.find((widget) => widget.name === "white_balance_temperature");
            const whiteBalanceTintWidget = this.widgets?.find((widget) => widget.name === "white_balance_tint");
            const antiAIWidget = this.widgets?.find((widget) => widget.name === "anti_ai");
            const noiseTextureWidget = this.widgets?.find((widget) => widget.name === "noise_texture");
            const noiseAmountWidget = this.widgets?.find((widget) => widget.name === "noise_amount");
            const noiseSeedWidget = this.widgets?.find((widget) => widget.name === "noise_seed");
            const noiseBlendModeWidget = this.widgets?.find((widget) => widget.name === "noise_blend_mode");
            const grainBlendModeWidget = this.widgets?.find((widget) => widget.name === "grain_blend_mode");
            const emulsionResponseWidget = this.widgets?.find((widget) => widget.name === "emulsion_response");
            if (!leakBackendWidget || !halationBackendWidget || !leakModeWidget || !leakPositionWidget || !emulsionBackendWidget || !whiteBalanceTemperatureWidget || !whiteBalanceTintWidget || !antiAIWidget || !noiseTextureWidget || !noiseAmountWidget || !noiseSeedWidget || !noiseBlendModeWidget || !grainBlendModeWidget || !emulsionResponseWidget) return result;

            this._zrlPreviewToken = null;
            this._zrlPreviewSourceSize = null;
            this._zrlPreviewOriginalSrc = null;
            this._zrlPreviewOriginalRequested = false;
            this._zrlPreviewProcessedSrc = null;
            this._zrlLanguage = loadStoredLanguage();
            ACTIVE_TOOLTIP_LANGUAGE = this._zrlLanguage;
            if (typeof this.addDOMWidget !== "function") return result;
            ACTIVE_NODES.add(this);

            leakBackendWidget.hidden = true;
            halationBackendWidget.hidden = true;
            // Keep the serialized legacy Mackie value for older workflows, but
            // remove its visible slider to reduce node height. Saved nonzero
            // values still process exactly as before.
            const legacyMackieWidget = this.widgets?.find((widget) => widget.name === "mackie_lines");
            if (legacyMackieWidget) legacyMackieWidget.hidden = true;
            antiAIWidget.hidden = true;
            noiseBlendModeWidget.hidden = true;
            grainBlendModeWidget.hidden = true;
            emulsionResponseWidget.hidden = true;
            const solarizationWidget = this.widgets?.find((widget) => widget.name === "solarization");
            const highlightConfinementWidget = this.widgets?.find((widget) => widget.name === "highlight_confinement");
            if (solarizationWidget) solarizationWidget.hidden = true;
            if (highlightConfinementWidget) highlightConfinementWidget.hidden = true;
            // ComfyUI attaches a "control after generate" row to noise_seed; it would
            // otherwise draw over the Darkroom panels.
            for (const linked of noiseSeedWidget.linkedWidgets || []) linked.hidden = true;

            if (!darkroomStyleInstalled) {
                const style = document.createElement("style");
                style.textContent = DARKROOM_STYLE;
                (document.head || document.body).append(style);
                darkroomStyleInstalled = true;
            }
            this.properties = this.properties || {};

            const previewUI = createPreviewPanel();
            this._zrlPreviewUI = previewUI;
            previewUI.compare.setOnChange(() => renderActiveCompositionPreview(this));
            if (isVideo) {
                this._zrlVideo = { generation: 0, playing: false, timer: null, pumping: false };
                this._zrlVideoPlayerUI = createVideoPlayerControls(this);
                previewUI.panel.append(this._zrlVideoPlayerUI.row);
                resetVideoState(this);
            }
            addDOMWidgetAt(this, "zrl_composition_preview", previewUI.panel, "grain_amount", { getMinHeight: () => 280 });
            const emulsionUI = createEmulsionAtlasControl(this, emulsionBackendWidget, whiteBalanceTemperatureWidget, whiteBalanceTintWidget, emulsionResponseWidget);
            this._zrlEmulsionUI = emulsionUI;
            addDOMWidgetAt(this, "zrl_emulsion_atlas", emulsionUI.row, "grain_amount", contentHeight(emulsionUI.row));
            const tabsUI = createControlTabs(this);
            this._zrlTabsUI = tabsUI;
            addDOMWidgetAt(this, "zrl_tabs", tabsUI.element, "grain_amount", contentHeight(tabsUI.element));

            const colorSection = document.createElement("div");
            colorSection.className = "zrl-dr zrl-panel";
            colorSection.append(emulsionUI.whiteBalanceUI.column);

            const halationColorUI = createColorPickerRow("halationColor", halationBackendWidget, this, DEFAULT_HALATION_COLOR);
            this._zrlHalationColorUI = halationColorUI;
            const lightControlUI = createLightControls(this, halationColorUI);
            this._zrlLightControlUI = lightControlUI;
            const toneControlUI = createToneControls(this);
            this._zrlToneControlUI = toneControlUI;
            const leakColorUI = createColorPickerRow("leakColor", leakBackendWidget, this, DEFAULT_COLOR);
            const leakControls = createLightLeakControls(this, leakColorUI);
            this._zrlLightLeakControlsUI = leakControls;
            const opticalControlUI = createOpticalControls(this);
            this._zrlOpticalControlUI = opticalControlUI;
            const grainControls = createGrainControls(this);
            this._zrlGrainControlsUI = grainControls;
            this._zrlGrainHeading = grainControls.heading;

            this._zrlTabPanels = new Map([
                ["color", colorSection],
                ["light", lightControlUI.section],
                ["tone", toneControlUI.section],
                ["leak", leakControls.section],
                ["optics", opticalControlUI.section],
                ["grain", grainControls.section],
            ]);
            for (const [tabId, section] of this._zrlTabPanels) {
                section.addEventListener("pointerdown", (event) => event.stopPropagation());
                section.addEventListener("mousedown", (event) => event.stopPropagation());
                addDOMWidgetAt(this, `zrl_${tabId}_controls`, section, "grain_amount", contentHeight(section));
            }

            const resetButton = document.createElement("button");
            resetButton.type = "button";
            resetButton.className = "zrl-glass zrl-icon";
            resetButton.textContent = "↺";
            resetButton.title = "Restore all Zuanfilm Retrolab controls to their factory defaults";
            resetButton.setAttribute("aria-label", "Reset Zuanfilm Retrolab to Defaults");
            resetButton.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                for (const [name, defaultValue] of Object.entries(DEFAULT_WIDGET_VALUES)) {
                    const widget = this.widgets?.find((candidate) => candidate.name === name);
                    if (!widget) continue;
                    widget.value = defaultValue;
                    widget.callback?.(defaultValue, app.canvas, this);
                }
                leakControls.sync();
                halationColorUI.syncFromBackend();
                emulsionUI.syncFromBackend();
                syncGrainControls(this);
                syncLightControls(this);
                syncToneControls(this);
                grainControls.sync();
                syncOpticalControls(this);
                schedulePreview(this);
                this.setDirtyCanvas?.(true, true);
                this.graph?.setDirtyCanvas?.(true, true);
                app.graph?.setDirtyCanvas?.(true, true);
            });
            previewUI.resetSlot.append(resetButton);
            this._zrlResetButton = resetButton;

            previewUI.panel.addEventListener("pointerdown", (event) => event.stopPropagation());
            previewUI.panel.addEventListener("mousedown", (event) => event.stopPropagation());
            previewUI.languageSelect.addEventListener("change", () => setLanguageForAllNodes(this, previewUI.languageSelect.value));

            this._zrlApplyLanguage = (language) => applyLanguageToNode(this, language);
            wrapWidgetCallbacks(this);
            this._zrlApplyLanguage(this._zrlLanguage);
            syncGrainControls(this);
            syncLightControls(this);
            syncToneControls(this);
            grainControls.sync();
            setActiveTab(this, this.properties.zrl_tab);

            const originalConfigure = this.onConfigure;
            this.onConfigure = function (...configureArgs) {
                const configured = originalConfigure?.apply(this, configureArgs);
                const restoredLeak = this.widgets?.find((widget) => widget.name === "leak_color");
                const restoredHalation = this.widgets?.find((widget) => widget.name === "halation_color");
                if (restoredLeak) restoredLeak.value = normalizeHex(restoredLeak.value, DEFAULT_COLOR);
                if (restoredHalation) restoredHalation.value = normalizeHex(restoredHalation.value, DEFAULT_HALATION_COLOR);
                leakControls.sync();
                halationColorUI.syncFromBackend();
                emulsionUI.syncFromBackend();
                syncGrainControls(this);
                syncLightControls(this);
                syncToneControls(this);
                grainControls.sync();
                for (const control of this._zrlTextureControls || []) {
                    const widget = this.widgets?.find((candidate) => candidate.name === control.name);
                    if (!widget) continue;
                    control.input.value = String(widget.value);
                    control.value.textContent = Number(widget.value).toFixed(control.precision);
                    updateRangeFill(control.input);
                }
                syncOpticalControls(this);
                setActiveTab(this, this.properties.zrl_tab);
                this._zrlPreviewToken = null;
                this._zrlPreviewSourceSize = null;
                this._zrlPreviewOriginalSrc = null;
                this._zrlPreviewOriginalRequested = false;
                this._zrlPreviewProcessedSrc = null;
                previewUI.compare.setMode("split");
                previewUI.fullImage.style.visibility = "hidden";
                previewUI.beforeImage.style.visibility = "hidden";
                previewUI.loupe.style.display = "none";
                applyPreviewMode(previewUI);
                previewUI.status.textContent = getTranslation(this._zrlLanguage).previewQueue;
                if (this._zrlVideo) resetVideoState(this);
                wrapWidgetCallbacks(this);
                this._zrlApplyLanguage?.(loadStoredLanguage());
                this.setDirtyCanvas?.(true, true);
                return configured;
            };

            return result;
        };

        const originalExecuted = nodeType.prototype.onExecuted;
        nodeType.prototype.onExecuted = function (message, ...args) {
            const result = originalExecuted?.call(this, message, ...args);
            if (this._zrlVideo) {
                const videoValues = message?.retrolab_video_preview_id ?? message?.ui?.retrolab_video_preview_id ?? message?.output?.retrolab_video_preview_id;
                const videoToken = Array.isArray(videoValues) ? videoValues[0] : videoValues;
                if (typeof videoToken === "string" && videoToken.length === 32) {
                    const oldToken = this._zrlVideo.token;
                    if (oldToken && oldToken !== videoToken) deleteVideoPreviewToken(oldToken);
                    this._zrlPreviewUI?.compare.setMode("split");
                    resetVideoState(this, videoToken);
                    pumpVideoRender(this);
                }
                return result;
            }
            const values = message?.retrolab_preview_id ?? message?.ui?.retrolab_preview_id ?? message?.output?.retrolab_preview_id;
            const token = Array.isArray(values) ? values[0] : values;
            if (typeof token === "string" && token.length === 32) {
                const oldToken = this._zrlPreviewToken;
                this._zrlPreviewToken = token;
                if (oldToken !== token) {
                    this._zrlPreviewOriginalSrc = null;
                    this._zrlPreviewOriginalRequested = false;
                    this._zrlPreviewProcessedSrc = null;
                    this._zrlPreviewUI?.compare.setMode("split");
                }
                if (oldToken && oldToken !== token) deletePreviewToken(oldToken);
                schedulePreview(this, true);
            }
            return result;
        };

        const originalRemoved = nodeType.prototype.onRemoved;
        nodeType.prototype.onRemoved = function (...args) {
            this._zrlEmulsionUI?.dispose?.();
            if (this._zrlPreviewTimer) clearTimeout(this._zrlPreviewTimer);
            this._zrlPreviewRequestId = (this._zrlPreviewRequestId || 0) + 1;
            deletePreviewToken(this._zrlPreviewToken);
            if (this._zrlVideo) {
                deleteVideoPreviewToken(this._zrlVideo.token);
                resetVideoState(this);
            }
            this._zrlPreviewToken = null;
            this._zrlPreviewOriginalSrc = null;
            this._zrlPreviewOriginalRequested = false;
            this._zrlPreviewProcessedSrc = null;
            ACTIVE_NODES.delete(this);
            return originalRemoved?.apply(this, args);
        };
    },
});
