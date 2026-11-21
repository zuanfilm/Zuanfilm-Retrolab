import fs from 'node:fs';
import vm from 'node:vm';

class FakeElement {
  constructor(tag) {
    this.tagName = tag;
    this.style = { setProperty(name, value) { this[name] = value; } };
    this.children = [];
    this.listeners = {};
    this.attributes = {};
    this.value = '';
    this.textContent = '';
    this._src = '';
    this.naturalWidth = 0;
    this.naturalHeight = 0;
    this.onload = null;
    this.onerror = null;
  }
  get src() { return this._src; }
  set src(value) {
    this._src = value;
    if (this.tagName === 'img' && value.startsWith('data:image/png;base64,')) {
      if (value.includes('RlVMTF')) {
        this.naturalWidth = 410;
        this.naturalHeight = 512;
      } else {
        this.naturalWidth = 240;
        this.naturalHeight = 240;
      }
      this.onload?.();
    }
  }
  get lastChild() { return this.children[this.children.length - 1]; }
  getBoundingClientRect() { return this.rect || { left: 0, top: 0, width: 88, height: 88 }; }
  append(...items) {
    for (const item of items) {
      if (item?.parentElement) item.parentElement.children = item.parentElement.children.filter((child) => child !== item);
      if (item) item.parentElement = this;
      this.children.push(item);
    }
  }
  addEventListener(name, callback) { this.listeners[name] = callback; }
  removeEventListener(name) { delete this.listeners[name]; }
  setAttribute(name, value) { this.attributes[name] = value; }
  dispatch(name, event = {}) { this.listeners[name]?.({ preventDefault() {}, stopPropagation() {}, target: this, ...event }); }
  contains(target) { return target === this || this.children.some((child) => child?.contains?.(target)); }
  remove() {
    if (this.parentElement) this.parentElement.children = this.parentElement.children.filter((child) => child !== this);
    this.parentElement = null;
  }
  focus() { this.focused = true; }
}

const document = {
  createElement: (tag) => new FakeElement(tag),
  body: new FakeElement('body'),
  documentElement: new FakeElement('html'),
  listeners: {},
  addEventListener(name, callback) { this.listeners[name] = callback; },
  removeEventListener(name) { delete this.listeners[name]; },
};
const window = {
  innerWidth: 1440, innerHeight: 1000, listeners: {},
  addEventListener(name, callback) { this.listeners[name] = callback; },
  removeEventListener(name) { delete this.listeners[name]; },
  dispatch(name, event = {}) { this.listeners[name]?.({ target: this, ...event }); },
};
const storage = new Map();
const localStorage = {
  getItem(key) { return storage.has(key) ? storage.get(key) : null; },
  setItem(key, value) { storage.set(key, String(value)); },
};
const extensions = [];
const requests = [];
const animationFrames = [];
function flushAnimationFrames(maxFrames = 256) {
  let count = 0;
  while (animationFrames.length && count < maxFrames) {
    const callbacks = animationFrames.splice(0);
    for (const callback of callbacks) callback();
    count += callbacks.length;
  }
  if (animationFrames.length) throw new Error('Animation-frame width checks did not settle');
}
const graphCanvas = { ds: { scale: 0.5 }, drawNodeCalls: 0, vueNodesMode: false };
const graph = { _nodes: [], primaryCanvas: graphCanvas, list_of_graphcanvas: [graphCanvas], setDirtyCanvas() {} };
graphCanvas.graph = graph;
graphCanvas.drawNode = function (_node, _ctx) {
  this.drawNodeCalls += 1;
  if (this.vueNodesMode) return 'vue-rendered';
  return 'drawn';
};
const app = {
  registerExtension: (extension) => extensions.push(extension),
  canvas: graphCanvas,
  graph,
};
const api = {
  async fetchApi(path, options = {}) {
    requests.push({ path, options });
    if (options.method === 'DELETE') return { ok: true, json: async () => ({ ok: true }) };
    return {
      ok: true,
      status: 200,
      json: async () => ({
        full_png: 'RlVMTF9QUkVWSUVX',
        original_png: 'T1JJR0lOQUxfUFJFVklFVw==',
        grain_png: 'R1JBSU5fREVUQUlM',
        full_size: [410, 512],
        grain_size: [240, 240],
        source_size: [1024, 1280],
      }),
    };
  },
};

const source = fs.readFileSync(new URL('../js/zuanfilm_retrolab.js', import.meta.url), 'utf8')
  .replace(/^import\s+\{\s*app\s*\}\s+from\s+["'][^"']+["'];\s*\n/m, '')
  .replace(/^import\s+\{\s*api\s*\}\s+from\s+["'][^"']+["'];\s*\n/m, '');
vm.runInNewContext(source, {
  app, api, document, window, localStorage, setTimeout, clearTimeout, console,
  requestAnimationFrame(callback) { animationFrames.push(callback); return animationFrames.length; },
});

const extension = extensions[0];
const namesAndDefaults = {
  grain_amount: 0.0, grain_size: 0.3, color_grain: 0.09, grain_blend_mode: 'Additive',
  halation_amount: 0.0, ring_radius: 8.0,
  bloom_amount: 0.0, bloom_threshold: 0.1, bloom_radius: 8.0,
  solarization: 0.0, highlight_confinement: 0.09, mackie_lines: 0.0,
  leak_mode: 'Soft Edge', leak_position: 'Bottom', leak_exposure: 0.0,
  leak_seed: 27, leak_color: '#C2AF8E', leak_radius: 1.0, halation_color: '#FF9959',
  soft_focus_amount: 0.0, soft_focus_radius: 24.0, vignette_amount: 0.0, vignette_feather: 0.65,
  color_emulsion: 'neutral', white_balance_temperature: 0.0, white_balance_tint: 0.0,
  anti_ai: 0.0, noise_texture: 'Gaussian', noise_amount: 0.0, noise_seed: 73, noise_scale: 1.0, noise_blend_mode: 'Additive', exposure: 0.0,
  emulsion_response: 1.0,
};
const widgets = Object.entries(namesAndDefaults).map(([name, value]) => ({
  name,
  value: name === 'leak_color' ? '#FF0026'
    : (name === 'leak_mode' || name === 'leak_position' || name === 'color_emulsion' || name === 'emulsion_response') ? value
      : (typeof value === 'number' ? value + 1 : 'altered'),
  callback(next) { this.callbackValue = next; },
}));
function Node() {}
Node.prototype.computeSize = function () { return [440, 600]; };
Node.prototype.onNodeCreated = function () {};
Node.prototype.onExecuted = function () {};
Node.prototype.onRemoved = function () {};
Node.prototype.onConfigure = function () {};
Node.prototype.onAdded = function () {};
Node.prototype.onResize = function (size) { this.size = size; };
Node.prototype.onDrawForeground = function (_ctx, canvas) { this.lastForegroundCanvas = canvas; };
Node.prototype.setSize = function (size) {
  this.size = [...size];
  this.onResize?.(this.size);
  return this.size;
};
extension.beforeRegisterNodeDef(Node, { name: 'ZuanfilmRetroLab' });
const node = new Node();
node.widgets = widgets;
node.size = [460, 600];
node.comfyClass = 'ZuanfilmRetroLab';
node.graph = graph;
graph._nodes.push(node);
node.setDirtyCanvas = () => {};
node.domWidgets = new Map();
node.addDOMWidget = (name, type, element, options) => {
  const widget = { name, type, element, ...options, value: undefined };
  node.widgets.push(widget);
  node.domWidgets.set(name, widget);
  return widget;
};
const originalBackendOrder = node.widgets.map((widget) => widget.name);
node.onNodeCreated();
if (!node.domWidgets.size) throw new Error('DOM widgets were not created');
extension.nodeCreated(node, app);
if (node.size[0] !== 960) throw new Error('New Retrolab node did not receive the one-time 480 CSS-pixel initial width at 0.5x zoom');
if (node.computeSize()[0] !== 440) throw new Error('Retrolab changed LiteGraph computeSize after initialization');

// Initial sizing is applied once after construction, targeted to a useful
// visible width while bounding graph-space size at extreme zoom levels.
for (const [scale, expectedWidth] of [[0.25, 1600], [0.30, 1600], [0.5, 960], [0.75, 640], [1.0, 640], [2.0, 640]]) {
  const sizedNode = {
    comfyClass: 'ZuanfilmRetroLab',
    size: [440, 600],
    setSize(next) { this.size = [...next]; },
  };
  extension.nodeCreated(sizedNode, { canvas: { ds: { scale } } });
  if (sizedNode.size[0] !== expectedWidth) throw new Error(`Incorrect one-time initial width at canvas zoom ${scale}: ${sizedNode.size[0]}`);
  sizedNode.setSize([420, 600]);
  extension.nodeCreated(sizedNode, { canvas: { ds: { scale: 0.25 } } });
  if (sizedNode.size[0] !== 420) throw new Error('Repeated nodeCreated hook overrode manual resizing');
}

// The initial width must not become a permanent minimum. User resize requests
// are authoritative at every canvas zoom level and after workflow configure.
node.setSize([420, 600]);
if (node.size[0] !== 420) throw new Error('Manual node resize was overridden by a persistent width guard');
graphCanvas.ds.scale = 0.25;
node.setSize([360, 600]);
if (node.size[0] !== 360) throw new Error('Canvas zoom incorrectly changed fixed graph-space node geometry');
node.onResize([340, 600]);
if (node.size[0] !== 340) throw new Error('LiteGraph onResize was overridden by a width guard');
node.size = [380, 600];
node.onConfigure({});
if (node.size[0] !== 380) throw new Error('Workflow restoration did not preserve serialized node width');

// Drawing at different canvas scales must never mutate graph-space geometry.
const widthBeforeDraw = node.size[0];
const drawResult = graphCanvas.drawNode(node, {});
if (drawResult !== 'drawn') throw new Error('Canvas drawNode result changed');
if (node.size[0] !== widthBeforeDraw) throw new Error('Canvas draw mutated Retrolab node width');
graphCanvas.vueNodesMode = true;
graphCanvas.ds.scale = 1.5;
graphCanvas.drawNode(node, {});
if (node.size[0] !== widthBeforeDraw) throw new Error('Vue-node rendering mutated Retrolab node width');
graphCanvas.vueNodesMode = false;
flushAnimationFrames();
if (node.size[0] !== widthBeforeDraw) throw new Error('Deferred animation frame changed the user-selected node width');
if (node.lastForegroundCanvas !== undefined && node.lastForegroundCanvas !== graphCanvas) throw new Error('Original onDrawForeground callback arguments were changed');

const tooltipWidgetNames = [
  'grain_amount', 'grain_size', 'color_grain', 'halation_amount', 'ring_radius',
  'bloom_amount', 'bloom_threshold', 'bloom_radius', 'solarization', 'highlight_confinement',
  'leak_mode', 'leak_position', 'leak_exposure', 'leak_seed', 'leak_radius', 'leak_color',
  'halation_color', 'soft_focus_amount', 'soft_focus_radius', 'vignette_amount', 'vignette_feather',
  'color_emulsion', 'white_balance_temperature', 'white_balance_tint', 'anti_ai',
  'noise_texture', 'noise_amount', 'noise_seed', 'noise_scale', 'noise_blend_mode', 'exposure', 'grain_blend_mode', 'emulsion_response',
];
const englishTooltips = new Map();
for (const name of tooltipWidgetNames) {
  const widget = node.widgets.find((candidate) => candidate.name === name);
  if (!widget?.tooltip?.trim()) throw new Error(`${name} is missing its hover description`);
  englishTooltips.set(name, widget.tooltip);
}

const persistedWidgetOrder = node.widgets.filter((widget) => widget.serialize !== false).map((widget) => widget.name);
if (JSON.stringify(persistedWidgetOrder) !== JSON.stringify(originalBackendOrder)) {
  throw new Error('DOM UI additions changed the serialized backend widget order');
}

const topPreview = node.domWidgets.get('zrl_composition_preview');
const emulsionWidget = node.domWidgets.get('zrl_emulsion_atlas');
const tabsWidget = node.domWidgets.get('zrl_tabs');
const colorWidget = node.domWidgets.get('zrl_color_controls');
const lightWidget = node.domWidgets.get('zrl_light_controls');
const toneWidget = node.domWidgets.get('zrl_tone_controls');
const leakControlsWidget = node.domWidgets.get('zrl_leak_controls');
const opticalWidget = node.domWidgets.get('zrl_optics_controls');
const grainWidget = node.domWidgets.get('zrl_grain_controls');
if (!topPreview || !emulsionWidget || !tabsWidget || !colorWidget || !lightWidget || !toneWidget || !leakControlsWidget || !opticalWidget || !grainWidget) {
  throw new Error('One or more DOM widgets are missing');
}
const domOrder = node.widgets.filter((widget) => node.domWidgets.has(widget.name)).map((widget) => widget.name);
if (domOrder.slice(0, 3).join(',') !== 'zrl_composition_preview,zrl_emulsion_atlas,zrl_tabs') {
  throw new Error('Preview, emulsion row and tab strip are not stacked at the top of the node');
}
if (node.widgets.indexOf(grainWidget) > node.widgets.findIndex((widget) => widget.name === 'grain_amount')) {
  throw new Error('Darkroom panels are not placed above the hidden backend widgets');
}
// Only the preview may stretch; every other panel reports its own content height.
if (topPreview.getMinHeight() !== 280 || topPreview.getMaxHeight) throw new Error('Preview does not absorb the spare node height');
for (const widget of [emulsionWidget, tabsWidget, colorWidget, lightWidget, toneWidget, leakControlsWidget, opticalWidget, grainWidget]) {
  if (typeof widget.getMinHeight !== 'function' || typeof widget.getMaxHeight !== 'function') throw new Error(`${widget.name} does not report a fixed content height`);
}
for (const name of ['zrl_divider_sabattier', 'zrl_divider_light_leak', 'zrl_divider_optical_finish', 'zrl_bottom_controls']) {
  if (node.domWidgets.has(name)) throw new Error(`${name} should no longer exist`);
}
const tabPanels = { color: colorWidget, light: lightWidget, tone: toneWidget, leak: leakControlsWidget, optics: opticalWidget, grain: grainWidget };
const tabButtons = tabsWidget.element.children;
if (tabButtons.map((button) => button.textContent).join(',') !== 'Color,Light,Tone,Leak,Optics,Grain') throw new Error('Tab strip labels are missing or out of order');
const visibleTabs = () => Object.entries(tabPanels).filter(([, widget]) => !widget.element.hidden).map(([id]) => id);
if (node.properties.zrl_tab !== 'color' || visibleTabs().join() !== 'color' || tabButtons[0].attributes['aria-selected'] !== 'true') throw new Error('Color tab is not the default single visible panel');
tabButtons[1].dispatch('click');
if (node.properties.zrl_tab !== 'light' || visibleTabs().join() !== 'light' || tabButtons[1].attributes['aria-selected'] !== 'true') throw new Error('Clicking a tab did not show only its panel');
if (!node.widgets.find((item) => item.name === 'mackie_lines').hidden) throw new Error('Mackie Lines slider should be hidden from the UI');
for (const name of ['anti_ai', 'exposure', 'solarization', 'highlight_confinement', 'soft_focus_amount', 'soft_focus_radius', 'vignette_amount', 'vignette_feather', 'noise_texture', 'noise_amount', 'noise_seed', 'noise_scale', 'noise_blend_mode']) {
  if (!node.widgets.find((item) => item.name === name).hidden) throw new Error(`${name} native widget should be hidden behind the two-column controls`);
}
if (opticalWidget.element.style.gridTemplateColumns !== 'repeat(2, minmax(0, 1fr))') throw new Error('Soft Focus and Vignette are not arranged as a two-column group');

const topPanel = topPreview.element;
const previewUI = node._zrlPreviewUI;
const previewCard = topPanel.children[0];
if (previewCard !== previewUI.card || previewCard.className !== 'zrl-card') throw new Error('Preview card is missing');
const languageIcon = previewUI.languageIcon;
const languageSelect = previewUI.languageSelect;
const resetSlot = previewUI.resetSlot;
if (resetSlot.children.length !== 2 || resetSlot.children[1].textContent !== '↺' || !resetSlot.children[1].title) throw new Error('Reset icon is not beside the language globe on the preview');
const emulsionUI = node._zrlEmulsionUI;
const emulsionSelect = emulsionWidget.element.children[0];
const emulsionTrigger = emulsionWidget.element.children[1];
const emulsionStepper = emulsionWidget.element.children[2];
const [emulsionResponseMinus, emulsionResponseValue, emulsionResponsePlus] = emulsionStepper.children;
const whiteBalanceColumn = colorWidget.element.children[0];
const whiteBalanceHeading = whiteBalanceColumn.children[0];
const whiteBalanceControlRow = whiteBalanceColumn.children[1];
const whiteBalanceReset = whiteBalanceControlRow.children[0];
englishTooltips.set('base_wb', whiteBalanceReset.title);
const whiteBalanceContent = whiteBalanceControlRow.children[1];
const whiteBalanceFrame = whiteBalanceContent.children[0];
const whiteBalanceReadouts = whiteBalanceContent.children[1];
const whiteBalanceTemperatureReadout = whiteBalanceReadouts.children[0];
const whiteBalanceTintReadout = whiteBalanceReadouts.children[1];
const whiteBalanceInnerRim = whiteBalanceFrame.children[0];
const whiteBalanceWheel = whiteBalanceInnerRim.children[0];
const whiteBalanceCenter = whiteBalanceWheel.children[0];
const whiteBalancePuck = whiteBalanceWheel.children[1];
if (emulsionStepper.attributes['data-zrl-control'] !== 'emulsion_response' || !emulsionStepper.title) throw new Error('Emulsion Response stepper is missing beside the emulsion selector');
if (emulsionResponseValue.textContent !== '1.00×') throw new Error('Emulsion Response stepper does not start at 1.00×');
if (emulsionSelect.style.display !== 'none' || emulsionTrigger.attributes.role !== 'combobox') throw new Error('Emulsion selector is not using the preview-safe custom dropdown trigger');
if (whiteBalanceHeading.textContent !== 'WHITE BALANCE' || whiteBalanceHeading.className !== 'zrl-heading') throw new Error('White-balance heading is missing');
if (!whiteBalanceReset.title) throw new Error('Base WB button is missing hover guidance');
if (whiteBalanceReset.textContent !== 'BASE WB') throw new Error('Base WB button label is incorrect');
if (whiteBalanceWheel.style.borderRadius !== '50%' || whiteBalanceWheel.attributes.role !== 'application') throw new Error('Resolve-style white-balance gain wheel is missing');
if (whiteBalancePuck.style.transform !== 'translate(-50%, -50%)') throw new Error('White-balance cursor is not centered');
if (whiteBalanceCenter.style.width !== '15px' || whiteBalancePuck.style.width !== '10px') throw new Error('Fixed white-balance center reference is not distinct from the movable cursor');
if (!whiteBalanceTemperatureReadout.children[0].textContent.includes('COOL') || !whiteBalanceTemperatureReadout.children[1].textContent.includes('T +1.00')) throw new Error('Temperature axis label/value are not displayed together beside the wheel');
if (!whiteBalanceTintReadout.children[0].textContent.includes('MAGENTA') || !whiteBalanceTintReadout.children[1].textContent.includes('TINT +1.00')) throw new Error('Tint axis label/value are not displayed together beside the wheel');
if (emulsionSelect.value !== 'neutral') throw new Error('Emulsion atlas must default to Neutral');
if (emulsionSelect.children[0].value !== 'neutral') throw new Error('Neutral identity option must be first');
const emulsionProfileCount = emulsionSelect.children.slice(1).reduce((sum, group) => sum + group.children.length, 0);
if (emulsionProfileCount !== 50) throw new Error(`Expected exactly 50 emulsion profiles, found ${emulsionProfileCount}`);
if (emulsionSelect.children.slice(1).map((group) => group.children.length).join(',') !== '10,10,10,20') throw new Error('Emulsion atlas category counts are not 10/10/10/20');
emulsionTrigger.rect = { left: 120, top: 500, bottom: 530, width: 320, height: 30 };
emulsionTrigger.dispatch('click');
if (emulsionUI.menu.style.display !== 'block' || emulsionUI.menu.style.position !== 'fixed') throw new Error('Emulsion menu did not open as a viewport-level popup');
if (Number.parseFloat(emulsionUI.menu.style.top) < emulsionTrigger.rect.bottom) throw new Error('Emulsion menu opened above the trigger and can cover the preview');
if (!document.body.children.includes(emulsionUI.menu) || emulsionUI.menuOptions.length !== 51) throw new Error('Emulsion menu portal is missing Neutral or one of the 50 emulsion profiles');
if (typeof window.listeners.scroll !== 'function') throw new Error('Emulsion menu is not observing canvas/page scrolling while open');
window.listeners.scroll({ target: emulsionUI.menu });
if (emulsionUI.menu.style.display !== 'block') throw new Error('Scrolling the emulsion option list unexpectedly closed the menu');
window.listeners.scroll({ target: document.body });
if (emulsionUI.menu.style.display !== 'none') throw new Error('Scrolling outside the emulsion menu did not dismiss it');
emulsionTrigger.dispatch('click');
if (emulsionUI.menu.style.display !== 'block') throw new Error('Emulsion menu did not reopen after an outside scroll');
const menuVelvia = emulsionUI.menuOptions.find((option) => option.value === 'velvia_50');
menuVelvia.dispatch('click');
if (node.widgets.find((item) => item.name === 'color_emulsion').value !== 'velvia_50' || emulsionUI.menu.style.display !== 'none') throw new Error('Custom emulsion menu selection did not update the canonical widget and close');
if (tabButtons[0].attributes['data-active'] !== 'true') throw new Error('Color tab does not mark its changed white balance');
const leakSection = leakControlsWidget.element;
const modeRow = leakSection.children[0];
const positionRow = leakSection.children[1];
const leakExposureRow = leakSection.children[2];
const leakSeedRow = leakSection.children[3];
const leakRadiusRow = leakSection.children[4];
const leakColorRow = leakSection.children[5];
const grainSection = grainWidget.element;
const grainColumn = grainSection.children[0];
const textureColumn = grainSection.children[1];
const tonePanel = toneWidget.element;
const antiAIColumn = tonePanel.children[0];
const sabattierColumn = tonePanel.children[1];
const opticalPanel = opticalWidget.element;
const lightPanel = lightWidget.element;
const bloomColumn = lightPanel.children[0];
const halationColumn = lightPanel.children[1];
const halationColorRow = halationColumn.children[3];
if (lightPanel.style.gridTemplateColumns !== 'repeat(2, minmax(0, 1fr))') throw new Error('Halation and Bloom are not arranged as a two-column group');
if (bloomColumn.children[0].textContent !== 'BLOOM' || halationColumn.children[0].textContent !== 'HALATION') throw new Error('Bloom/Halation group headings are missing or in the wrong order');
if (antiAIColumn.children[0].textContent !== 'ANTI-AI' || sabattierColumn.children[0].textContent !== 'SABATTIER') throw new Error('Anti-AI/Sabattier columns are missing or in the wrong order');
for (const name of ['halation_amount', 'ring_radius', 'bloom_amount', 'bloom_threshold', 'bloom_radius']) {
  if (!node.widgets.find((item) => item.name === name).hidden) throw new Error(`${name} native widget should be hidden behind the two-column controls`);
}
const leakPicker = leakColorRow.children[2];
const halationColorInput = halationColorRow.children[2];
const englishLeakColorTooltip = leakPicker.title;
const englishHalationColorTooltip = halationColorInput.title;
const englishLeakColorLabelTooltip = leakColorRow.children[0].title;
const englishHalationColorLabelTooltip = halationColorRow.children[0].title;
if (!englishLeakColorTooltip?.trim() || !englishHalationColorTooltip?.trim() ||
    !englishLeakColorLabelTooltip?.trim() || !englishHalationColorLabelTooltip?.trim()) {
  throw new Error('Color pickers are missing hover descriptions');
}
const modeSelect = modeRow.children[1];
const positionSelect = positionRow.children[1];
const leakExposureInput = leakExposureRow.children[1];
const leakSeedInput = leakSeedRow.children[1];
const leakRadiusInput = leakRadiusRow.children[1];

// Language options are browser-local UI preferences, not ComfyUI workflow widgets.
const expectedLanguages = ['en', 'zh', 'ja', 'es', 'pt', 'fr', 'ru', 'de', 'hi', 'ar'];
if (languageSelect.children.map((option) => option.value).join(',') !== expectedLanguages.join(',')) {
  throw new Error('Language dropdown does not contain the requested ten languages');
}
if (storage.get('zuanfilm_retrolab.language.v1') !== undefined) {
  throw new Error('Language preference should not be stored until the user selects one');
}
languageSelect.value = 'es';
languageSelect.dispatch('change');
if (storage.get('zuanfilm_retrolab.language.v1') !== 'es') throw new Error('Language preference was not saved locally');
if (tabButtons[3].textContent !== 'Fuga') throw new Error('Spanish tab labels were not applied');
if (languageIcon.textContent !== '🌐') throw new Error('Language selector does not use the requested globe icon');
if (languageIcon.attributes['aria-label'] !== 'Idioma') throw new Error('Globe icon does not retain a translated accessible label');
if (node.widgets.find((item) => item.name === 'halation_amount').label !== 'Intensidad de halación') throw new Error('Native widget labels were not translated');
if (node.widgets.find((item) => item.name === 'vignette_amount').label !== 'Intensidad de viñeta') throw new Error('Vignette label was not translated');
if (node.widgets.find((item) => item.name === 'soft_focus_amount').label !== 'Intensidad de enfoque suave') throw new Error('Soft Focus label was not translated');
if (emulsionTrigger.attributes['aria-label'] !== 'EMULSIÓN DE PELÍCULA EN COLOR') throw new Error('Emulsion atlas label was not translated to Spanish');
if (emulsionStepper.attributes['aria-label'] !== 'RESPUESTA DE EMULSIÓN' || !emulsionStepper.title.includes('Escala')) throw new Error('Emulsion Response label or tooltip was not localized to Spanish');
for (let i = 0; i < 3; i += 1) emulsionResponsePlus.dispatch('click');
emulsionResponseMinus.dispatch('click');
if (node.widgets.find((item) => item.name === 'emulsion_response').value !== 1.1 || emulsionResponseValue.textContent !== '1.10×') throw new Error('Emulsion Response stepper did not update its canonical backend widget and readout');
if (whiteBalanceHeading.textContent !== 'BALANCE DE BLANCOS') throw new Error('White-balance heading was not translated to Spanish');
if (whiteBalanceReset.textContent !== 'WB BASE') throw new Error('Neutral WB action was not translated to Spanish');
if (emulsionSelect.children[0].textContent !== 'Neutral · Sin emulsión') throw new Error('Neutral identity option was not translated');
if (emulsionSelect.children[1].label !== 'CINE / PELÍCULA CINEMATOGRÁFICA') throw new Error('Emulsion family heading was not translated');
if (emulsionUI.menuGroups[0].heading.textContent !== 'CINE / PELÍCULA CINEMATOGRÁFICA') throw new Error('Custom emulsion menu group heading was not translated');
emulsionSelect.value = 'velvia_50';
emulsionSelect.dispatch('change');
if (node.widgets.find((item) => item.name === 'color_emulsion').value !== 'velvia_50') throw new Error('Film emulsion selection did not update the backend widget');
whiteBalanceWheel.dispatch('pointerdown', { clientX: 80, clientY: 44, pointerId: 1 });
whiteBalanceWheel.dispatch('pointerup', { pointerId: 1 });
if (!(node.widgets.find((item) => item.name === 'white_balance_tint').value > 0.8)) throw new Error('White-balance wheel puck did not move toward magenta');
if (Math.abs(node.widgets.find((item) => item.name === 'white_balance_temperature').value) > 0.01) throw new Error('Horizontal wheel movement unexpectedly changed temperature');
whiteBalanceReset.dispatch('click');
if (node.widgets.find((item) => item.name === 'white_balance_temperature').value !== 0 || node.widgets.find((item) => item.name === 'white_balance_tint').value !== 0) throw new Error('White-balance Neutral button did not recenter the wheel');
if (whiteBalancePuck.style.left !== 'calc(50% + 0px)' || whiteBalancePuck.style.top !== 'calc(50% + 0px)') throw new Error('Neutral white-balance cursor is not geometrically centered');
whiteBalanceWheel.dispatch('keydown', { key: 'ArrowUp' });
if (!(node.widgets.find((item) => item.name === 'white_balance_temperature').value < 0)) throw new Error('White-balance keyboard control did not move toward cool');
whiteBalanceWheel.dispatch('keydown', { key: 'Home' });
if (node.widgets.find((item) => item.name === 'white_balance_temperature').value !== 0 || node.widgets.find((item) => item.name === 'white_balance_tint').value !== 0) throw new Error('White-balance Home key did not restore Neutral');
if (modeRow.children[0].textContent !== 'Modo de fuga de luz') throw new Error('Light Leak Mode label was not translated');
if (modeSelect.children[0].textContent !== 'Borde suave') throw new Error('Light Leak mode options were not translated');
if (positionSelect.children[0].textContent !== 'Arriba') throw new Error('Light Leak position options were not translated');

// Reset respects the new factory defaults and keeps the current language.
resetSlot.children[1].dispatch('click');
for (const [name, expected] of Object.entries(namesAndDefaults)) {
  const widget = node.widgets.find((item) => item.name === name);
  if (widget.value !== expected) throw new Error(`${name} did not reset: ${widget.value} !== ${expected}`);
}
if (leakPicker.value !== '#C2AF8E') throw new Error('Leak Color picker did not sync to its new default color');
if (leakExposureInput.value !== '0' || leakSeedInput.value !== '27' || leakRadiusInput.value !== '1') throw new Error('Light Leak sliders did not synchronize after Reset to Defaults');
if (halationColorInput.value !== '#FF9959') throw new Error('Halation Color picker did not sync to its default color');
if (emulsionSelect.value !== 'neutral' || node.widgets.find((item) => item.name === 'color_emulsion').value !== 'neutral') throw new Error('Emulsion atlas Reset to Defaults did not restore Neutral');
if (node.widgets.find((item) => item.name === 'emulsion_response').value !== 1.0 || emulsionResponseValue.textContent !== '1.00×') throw new Error('Emulsion Response Reset to Defaults did not restore its 1.00× baseline');
if (node.widgets.find((item) => item.name === 'white_balance_temperature').value !== 0 || node.widgets.find((item) => item.name === 'white_balance_tint').value !== 0) throw new Error('Reset to Defaults did not restore neutral white balance');
if (grainSection.children.length !== 3) throw new Error('The texture group is not arranged as Film Grain, Procedural Texture and a shared blend row');
if (tabButtons.some((button) => button.attributes['data-active'] === 'true')) throw new Error('Tab change dots remain after Reset to Defaults');
if (grainSection.style.gridTemplateColumns !== 'repeat(2, minmax(0, 1fr))') throw new Error('Film Grain and Procedural Texture are not arranged as two columns');
if (textureColumn.children[0].textContent !== 'TEXTURA PROCEDURAL') throw new Error('Procedural Texture group heading is missing');
const blendPairRow = grainSection.children[2];
const grainBlendModeRow = blendPairRow.children[0];
const grainBlendModeSelect = grainBlendModeRow.children[1];
if (previewUI.status.textContent !== 'Ejecuta el nodo una vez para crear la fuente de vista previa.') throw new Error('Spanish preview status was not applied');
if (previewUI.loupe.title !== 'DETALLE DE GRANO Y TEXTURA · RECORTE CENTRAL 240 PX') throw new Error('Spanish grain & texture detail label was not applied');
for (const name of ['grain_amount', 'grain_size', 'color_grain']) {
  if (!node.widgets.find((item) => item.name === name).hidden) throw new Error(`${name} native widget should be hidden while its bottom control is visible`);
}
if (['leak_mode', 'leak_position', 'leak_exposure', 'leak_seed', 'leak_color', 'leak_radius'].some((name) => !node.widgets.find((item) => item.name === name).hidden)) {
  throw new Error('Canonical Light Leak widgets should be hidden behind the compact two-column DOM controls');
}
if (leakSection.style.display !== 'grid' || leakSection.style.gridTemplateColumns !== 'repeat(2, minmax(0, 1fr))' || leakSection.children.length !== 6) {
  throw new Error('Light Leak controls are not arranged as a six-cell, two-column grid');
}
if (leakSection.children.map((cell) => cell.attributes['data-zrl-control']).join(',') !== 'leak_mode,leak_position,leak_exposure,leak_seed,leak_radius,leak_color') {
  throw new Error('Light Leak controls are not ordered Mode/Position, Exposure/Seed, Radius/Color');
}
if (leakExposureInput.min !== '0' || leakExposureInput.max !== '10' || leakSeedInput.min !== '0' || leakSeedInput.max !== '999' || leakRadiusInput.min !== '0.25' || leakRadiusInput.max !== '10') {
  throw new Error('Light Leak slider ranges changed during the compact layout migration');
}
if (grainColumn.children[1].children[1].max !== '3') throw new Error('Film Grain Amount slider does not reach 3.0');
if (grainColumn.children[3].children[0].textContent !== 'Grano de color' || grainBlendModeRow.children[0].textContent !== 'Modo de mezcla de grano') throw new Error('Grain Blend Mode is not positioned beneath Color Grain with its Spanish label');
if (grainBlendModeRow.style.gridTemplateColumns !== blendPairRow.children[1].style.gridTemplateColumns) throw new Error('Grain and Texture blend selectors do not share aligned row geometry');
if (grainBlendModeSelect.children.length !== 12 || grainBlendModeSelect.value !== 'Additive') throw new Error('Grain Blend Mode does not expose the twelve shared modes with Additive default');
if (leakColorRow.style.justifyContent !== 'flex-end' || halationColorRow.style.justifyContent !== 'flex-end') {
  throw new Error('Color picker rows are not right-aligned as a compact label/value/picker group');
}
if (node.widgets.find((item) => item.name === 'grain_size') === undefined) throw new Error('Grain Size widget is missing');
if (grainColumn.children[2].children[1].min !== '0.1') throw new Error('Fine Grain Size slider does not reach below 0.7');
const softFocusColumn = opticalPanel.children[0];
const vignetteColumn = opticalPanel.children[1];
if (softFocusColumn.children[0].textContent !== 'ENFOQUE SUAVE' || vignetteColumn.children[0].textContent !== 'VIÑETA') throw new Error('Optical group headings were not translated');
const softFocusAmountInput = softFocusColumn.children[1].children[1];
const vignetteAmountInput = vignetteColumn.children[1].children[1];
if (vignetteAmountInput.max !== '2') throw new Error('Vignette Amount control does not reach 2.0');
softFocusAmountInput.value = '0.8';
softFocusAmountInput.dispatch('input');
if (node.widgets.find((item) => item.name === 'soft_focus_amount').value !== 0.8) throw new Error('Two-column Soft Focus control does not update its backend widget');
vignetteAmountInput.value = '1.75';
vignetteAmountInput.dispatch('input');
if (node.widgets.find((item) => item.name === 'vignette_amount').value !== 1.75) throw new Error('Two-column Vignette control does not update its backend widget');
const halationAmountInput = halationColumn.children[1].children[1];
const bloomAmountInput = bloomColumn.children[1].children[1];
halationAmountInput.value = '1.25';
halationAmountInput.dispatch('input');
if (node.widgets.find((item) => item.name === 'halation_amount').value !== 1.25) throw new Error('Two-column Halation control does not update its backend widget');
bloomAmountInput.value = '2.25';
bloomAmountInput.dispatch('input');
if (node.widgets.find((item) => item.name === 'bloom_amount').value !== 2.25) throw new Error('Two-column Bloom control does not update its backend widget');
const antiAIInput = antiAIColumn.children[1].children[1];
if (antiAIColumn.children[1].children[0].children[0].textContent !== 'Intensidad' || !antiAIInput.title) throw new Error('Anti-AI control does not use the concise Strength label or hover detail');
if (antiAIInput.min !== '0' || antiAIInput.max !== '100') throw new Error('Anti-AI slider does not span 0–100%');
const exposureRow = antiAIColumn.children[2];
const exposureInput = exposureRow.children[1];
if (exposureRow.children[0].children[0].textContent !== 'Exposición' || exposureInput.min !== '-100' || exposureInput.max !== '100' || !exposureInput.title) throw new Error('Exposure is not localized, below Strength, or bounded from -100 to +100');
exposureInput.value = '55';
exposureInput.dispatch('input');
if (node.widgets.find((item) => item.name === 'exposure').value !== 55) throw new Error('Exposure slider did not update its backend widget');
antiAIInput.value = '64';
antiAIInput.dispatch('input');
if (node.widgets.find((item) => item.name === 'anti_ai').value !== 64) throw new Error('Anti-AI slider did not update its backend widget');
const sabattierInput = sabattierColumn.children[1].children[1];
sabattierInput.value = '0.32';
sabattierInput.dispatch('input');
if (node.widgets.find((item) => item.name === 'solarization').value !== 0.32) throw new Error('Sabattier right-column control did not update its backend widget');
const noiseSelect = textureColumn.children[2];
const blendModeRow = blendPairRow.children[1];
const blendModeSelect = blendModeRow.children[1];
const noiseAmountInput = textureColumn.children[3].children[1];
const noiseSeedInput = textureColumn.children[4].children[1];
const noiseScaleInput = textureColumn.children[5].children[1];
if (noiseSelect.children.length !== 12 || noiseSelect.value !== 'Gaussian') throw new Error('Procedural Texture dropdown does not expose all twelve families');
if (!noiseSelect.title || !blendModeSelect.title || !grainBlendModeSelect.title || !noiseAmountInput.title || !noiseSeedInput.title || !noiseScaleInput.title) throw new Error('Procedural Texture controls are missing hover details');
if (blendModeSelect.children.length !== 12 || blendModeSelect.value !== 'Additive') throw new Error('Procedural Texture blend selector does not expose 12 modes with Additive default');
if (blendModeRow.children[0].textContent !== 'Modo de mezcla de textura') throw new Error('Texture blend label was not localized into Spanish');
grainBlendModeSelect.value = 'Multiply';
grainBlendModeSelect.dispatch('change');
if (node.widgets.find((item) => item.name === 'grain_blend_mode').value !== 'Multiply') throw new Error('Grain Blend Mode did not update its backend widget');
blendModeSelect.value = 'Soft Light';
blendModeSelect.dispatch('change');
if (node.widgets.find((item) => item.name === 'noise_blend_mode').value !== 'Soft Light') throw new Error('Texture blend mode did not update its backend widget');
noiseSelect.value = 'Gradient fBm';
noiseSelect.dispatch('change');
if (node.widgets.find((item) => item.name === 'noise_texture').value !== 'Gradient fBm') throw new Error('Noise Texture selection did not update its backend widget');
if (noiseAmountInput.max !== '2') throw new Error('Noise Amount maximum was not doubled to 2.0');
noiseAmountInput.value = '1.44';
noiseAmountInput.dispatch('input');
if (node.widgets.find((item) => item.name === 'noise_amount').value !== 1.44) throw new Error('Noise Amount did not update its backend widget above the previous maximum');
if (noiseSeedInput.min !== '0' || noiseSeedInput.max !== '999') throw new Error('Noise Seed is not a bounded 0–999 slider');
noiseSeedInput.value = '928';
noiseSeedInput.dispatch('input');
if (node.widgets.find((item) => item.name === 'noise_seed').value !== 928) throw new Error('Noise Seed did not update its backend widget');
if (noiseScaleInput.min !== '0') throw new Error('Texture Scale does not support its requested zero minimum');
noiseScaleInput.value = '0';
noiseScaleInput.dispatch('input');
if (node.widgets.find((item) => item.name === 'noise_scale').value !== 0) throw new Error('Texture Scale could not set zero');
noiseScaleInput.value = '2.5';
noiseScaleInput.dispatch('input');
if (node.widgets.find((item) => item.name === 'noise_scale').value !== 2.5) throw new Error('Texture Scale did not update its backend widget');
if (leakColorRow.children[0].style.flex === '1' || halationColorRow.children[0].style.flex === '1') {
  throw new Error('Color labels remain stretched away from their pickers');
}

// The translated DOM selectors keep canonical English values in backend widgets.
if (!modeSelect.children.some((option) => option.value === 'Holga 135')) throw new Error('Holga 135 mode option is missing');
modeSelect.value = 'Holga 135';
modeSelect.dispatch('change');
if (node.widgets.find((item) => item.name === 'leak_mode').value !== 'Holga 135') throw new Error('Holga 135 did not retain its canonical backend value');
modeSelect.value = 'Light Piping';
modeSelect.dispatch('change');
if (node.widgets.find((item) => item.name === 'leak_mode').value !== 'Light Piping') {
  throw new Error('Translated mode selector changed the canonical backend value');
}
positionSelect.value = 'Bottom Left';
positionSelect.dispatch('change');
if (node.widgets.find((item) => item.name === 'leak_position').value !== 'Bottom Left') {
  throw new Error('Translated position selector changed the canonical backend value');
}
leakExposureInput.value = '7.25';
leakExposureInput.dispatch('input');
if (node.widgets.find((item) => item.name === 'leak_exposure').value !== 7.25) throw new Error('Compact Leak Exposure slider did not update its backend widget');
leakSeedInput.value = '812';
leakSeedInput.dispatch('input');
if (node.widgets.find((item) => item.name === 'leak_seed').value !== 812) throw new Error('Compact Leak Seed slider did not update its backend widget');
leakRadiusInput.value = '6.5';
leakRadiusInput.dispatch('input');
if (node.widgets.find((item) => item.name === 'leak_radius').value !== 6.5) throw new Error('Compact Leak Radius slider did not update its backend widget');

// New color picker writes to the appended Halation Color backend widget.
halationColorInput.value = '#00FF80';
halationColorInput.dispatch('input');
if (node.widgets.find((item) => item.name === 'halation_color').value !== '#00FF80') {
  throw new Error('Halation Color picker did not update its backend widget');
}

// Editing a bottom Film Grain range control updates its original backend widget.
const grainAmountInput = grainColumn.children[1].children[1];
grainAmountInput.value = '2.4';
grainAmountInput.dispatch('input');
if (node.widgets.find((item) => item.name === 'grain_amount').value !== 2.4) {
  throw new Error('Film Grain Amount slider did not update its backend widget above the old maximum');
}

// The preview endpoint returns the same two independent preview images.
node.onExecuted({ retrolab_preview_id: ['0123456789abcdef0123456789abcdef'] });
await new Promise((resolve) => setTimeout(resolve, 30));
if (!requests.some((request) => request.path === '/retrolab/preview')) throw new Error('Preview request was not issued');
const compositionImage = previewUI.fullImage;
const beforeImage = previewUI.beforeImage;
const [splitButton, beforeButton, afterButton] = previewUI.compare.buttons;
if (!compositionImage.src.startsWith('data:image/png;base64,')) throw new Error('Composition preview PNG was not rendered');
const processedPreviewSrc = compositionImage.src;
const originalPreviewSrc = node._zrlPreviewOriginalSrc;
if (!originalPreviewSrc || !requests.some((request) => JSON.parse(request.options.body).include_original === true)) throw new Error('Original preview source was not requested/cached');
if (splitButton.attributes['aria-pressed'] !== 'true' || beforeImage.src !== originalPreviewSrc || beforeImage.style.visibility !== 'visible' ||
    beforeImage.style.clipPath !== 'inset(0 50% 0 0)' || previewUI.split.style.display !== 'block') throw new Error('Preview does not default to a centered Before/After split');
beforeButton.dispatch('click');
if (beforeImage.style.clipPath !== 'inset(0 0% 0 0)' || beforeButton.attributes['aria-pressed'] !== 'true' || previewUI.split.style.display !== 'none') throw new Error('Before mode did not show the untouched source image');
const halationBackend = node.widgets.find((item) => item.name === 'halation_amount');
halationBackend.value = 0.91;
halationBackend.callback(halationBackend.value, app.canvas, node);
await new Promise((resolve) => setTimeout(resolve, 230));
const previewPosts = requests.filter((request) => request.path === '/retrolab/preview' && request.options.method === 'POST');
const latestPreviewPayload = JSON.parse(previewPosts[previewPosts.length - 1].options.body);
if (latestPreviewPayload.include_original !== false) throw new Error('A later preview update retransmitted the original PNG');
if (beforeImage.style.clipPath !== 'inset(0 0% 0 0)') throw new Error('A processed-image update replaced the currently selected Before view');
afterButton.dispatch('click');
if (compositionImage.src !== node._zrlPreviewProcessedSrc || compositionImage.src !== processedPreviewSrc || beforeImage.style.clipPath !== 'inset(0 100% 0 0)') throw new Error('After mode did not restore the processed composition');
if (!previewUI.grainImage.src.startsWith('data:image/png;base64,') || previewUI.loupe.style.display !== 'block') throw new Error('Grain Detail loupe was not rendered');
if (previewUI.status.textContent.includes('CPU preview')) throw new Error('Removed CPU preview status text is still present');

// Japanese, Russian and German selections are available and update the whole node.
languageSelect.value = 'ja';
languageSelect.dispatch('change');
if (tabButtons[1].textContent !== 'ライト') throw new Error('Japanese translation did not apply');
languageSelect.value = 'ru';
languageSelect.dispatch('change');
if (tabButtons[1].textContent !== 'Свет') throw new Error('Russian translation did not apply');
if (modeSelect.children[0].textContent !== 'Мягкий край') throw new Error('Russian Light Leak character translation did not apply');
languageSelect.value = 'de';
languageSelect.dispatch('change');
if (tabButtons[1].textContent !== 'Licht' || !afterButton.textContent.trim()) throw new Error('German translation did not apply');
if (storage.get('zuanfilm_retrolab.language.v1') !== 'de') throw new Error('Latest language selection was not persisted locally');
if (expectedLanguages.includes('id') || !expectedLanguages.includes('ru')) throw new Error('Removed Indonesian / missing Russian language registration');
node.size = [420, 600];
node.onConfigure({});
if (node.size[0] !== 420 || node.computeSize()[0] !== 440) throw new Error('Workflow restore did not preserve LiteGraph node geometry');

// Every advertised language must populate every visible localization surface.
const expectedNeutralWBLabels = {
  en: 'BASE WB', zh: '基础白平衡', ja: 'ベース WB', es: 'WB BASE', pt: 'WB BASE',
  fr: 'BdB DE BASE', ru: 'БАЗОВЫЙ ББ', de: 'BASIS-WB', hi: 'बेस WB', ar: 'توازن أبيض أساسي',
};
for (const language of expectedLanguages) {
  languageSelect.value = language;
  languageSelect.dispatch('change');
  for (const name of tooltipWidgetNames) {
    const tooltip = node.widgets.find((item) => item.name === name).tooltip;
    if (!tooltip?.trim()) throw new Error(`Language ${language} has missing hover help for ${name}`);
    if (language !== 'en' && tooltip === englishTooltips.get(name)) throw new Error(`Language ${language} did not localize hover help for ${name}`);
  }
  if (!whiteBalanceReset.title?.trim()) throw new Error(`Language ${language} has missing Base WB hover help`);
  if (!leakPicker.title?.trim() || !halationColorInput.title?.trim() ||
      !leakColorRow.title?.trim() || !halationColorRow.title?.trim() ||
      !leakColorRow.children[0].title?.trim() || !halationColorRow.children[0].title?.trim()) {
    throw new Error(`Language ${language} has missing native color-picker hover help`);
  }
  if (language !== 'en' && (
      leakPicker.title === englishLeakColorTooltip || halationColorInput.title === englishHalationColorTooltip ||
      leakColorRow.children[0].title === englishLeakColorLabelTooltip || halationColorRow.children[0].title === englishHalationColorLabelTooltip)) {
    throw new Error(`Language ${language} did not localize native color-picker hover help`);
  }
  if (language !== 'en' && whiteBalanceReset.title === englishTooltips.get('base_wb')) throw new Error(`Language ${language} did not localize Base WB hover help`);
  const requiredTexts = [
    ...tabButtons.map((button) => button.textContent),
    beforeButton.textContent,
    afterButton.textContent,
    lightPanel.children[0].children[0].textContent,
    lightPanel.children[1].children[0].textContent,
    tonePanel.children[0].children[0].textContent,
    tonePanel.children[1].children[0].textContent,
    languageIcon.textContent,
    previewUI.status.textContent,
    halationColorRow.children[0].textContent,
    leakColorRow.children[0].textContent,
    resetSlot.children[1].title,
    opticalPanel.children[0].children[0].textContent,
    opticalPanel.children[1].children[0].textContent,
    opticalPanel.children[0].children[1].children[0].children[0].textContent,
    opticalPanel.children[1].children[1].children[0].children[0].textContent,
    grainColumn.children[0].textContent,
    textureColumn.children[0].textContent,
    textureColumn.children[1].textContent,
    ...textureColumn.children[2].children.map((option) => option.textContent),
    textureColumn.children[3].children[0].textContent,
    textureColumn.children[4].children[0].textContent,
    textureColumn.children[5].children[0].textContent,
    grainBlendModeRow.children[0].textContent,
    blendModeRow.children[0].textContent,
    ...grainBlendModeSelect.children.map((option) => option.textContent),
    ...blendModeSelect.children.map((option) => option.textContent),
    previewUI.loupe.title,
    modeRow.children[0].textContent,
    positionRow.children[0].textContent,
    emulsionTrigger.attributes['aria-label'],
    emulsionSelect.children[0].textContent,
    emulsionTrigger.children[1].textContent,
    whiteBalanceHeading.textContent,
    whiteBalanceTemperatureReadout.children[0].textContent,
    whiteBalanceTintReadout.children[0].textContent,
    whiteBalanceTemperatureReadout.children[1].textContent,
    whiteBalanceTintReadout.children[1].textContent,
    whiteBalanceReset.textContent,
    ...emulsionSelect.children.slice(1).map((group) => group.label),
    ...modeSelect.children.map((option) => option.textContent),
    ...positionSelect.children.map((option) => option.textContent),
  ];
  if (requiredTexts.some((value) => typeof value !== 'string' || !value.trim())) {
    throw new Error(`Language ${language} has an untranslated/empty visible label`);
  }
  if (whiteBalanceReset.textContent !== expectedNeutralWBLabels[language]) {
    throw new Error(`Language ${language} has an incorrect Neutral WB button label`);
  }
  for (const widgetName of ['halation_amount', 'ring_radius', 'bloom_amount', 'bloom_threshold', 'bloom_radius', 'solarization', 'highlight_confinement', 'mackie_lines', 'leak_exposure', 'leak_seed', 'leak_radius', 'soft_focus_amount', 'soft_focus_radius', 'vignette_amount', 'vignette_feather', 'anti_ai', 'exposure']) {
    const label = node.widgets.find((item) => item.name === widgetName).label;
    if (typeof label !== 'string' || !label.trim()) throw new Error(`Language ${language} is missing ${widgetName}`);
  }
}

console.log('Frontend interaction smoke test passed');
