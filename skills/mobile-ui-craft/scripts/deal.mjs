#!/usr/bin/env node
// Deals a coherent, researched direction for a product: one surface, type, colour, imagery and motion system
// that celebrated apps share, picked from the niche. The seed only chooses inside the niche's own shortlist,
// so a banking app and a meditation app can never get each other's look. The same seed always gives the same
// hand, so a product keeps its look. Zero dependencies.
//
//   node deal.mjs --seed "Product name" --niche food-delivery [--platform ios|android|both] [--reroll N] [--json] [--list] [--self-test]
import assert from 'node:assert';
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Faces models reach for when left to choose. Never dealt; slop-scan flags them.
export const OVERUSED = ['Inter', 'Fraunces', 'Instrument Serif', 'Instrument Sans', 'Playfair Display', 'Space Grotesk', 'DM Sans',
  'DM Serif Display', 'Bricolage Grotesque', 'Plus Jakarta Sans', 'Manrope', 'Sora', 'Outfit', 'Syne', 'Poppins', 'Montserrat', 'Geist',
  'Figtree', 'Barlow Condensed', 'Cormorant', 'Newsreader', 'Lora'];

const SYSTEM_STACK = '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, Roboto, sans-serif';
const MONO_STACK = 'ui-monospace, "SF Mono", Menlo, monospace';

// Google families that carry ğ ş ı İ and real tabular figures (measured in Chrome: "0000" and "1111" equal width with tabular-nums;
// Albert Sans, Libre Franklin and Fredoka failed and were removed). lo/hi = the weights the family really ships.
const F = (n, lo, hi, kind = 'sans', generic = 'sans-serif') => ({ n, lo, hi, kind, stack: generic === 'serif' ? `"${n}", Georgia, "Times New Roman", serif` : `"${n}", ${SYSTEM_STACK}` });
const SYSTEM = { n: 'system', system: true, lo: 100, hi: 900, kind: 'system', stack: SYSTEM_STACK };
const FACE = {
  'Public Sans': F('Public Sans', 100, 900), 'Hanken Grotesk': F('Hanken Grotesk', 100, 900),
  Barlow: F('Barlow', 100, 900), 'IBM Plex Sans': F('IBM Plex Sans', 100, 700), 'Schibsted Grotesk': F('Schibsted Grotesk', 400, 900),
  Archivo: F('Archivo', 100, 900), Nunito: F('Nunito', 200, 900, 'rounded sans'),
  'Baloo 2': F('Baloo 2', 400, 800, 'rounded sans'),
  Literata: F('Literata', 200, 900, 'serif', 'serif'), 'Source Serif 4': F('Source Serif 4', 200, 900, 'serif', 'serif'),
  'Nunito Sans': F('Nunito Sans', 200, 900), Mulish: F('Mulish', 200, 900),
};
const PLEX_MONO = { n: 'IBM Plex Mono', lo: 100, hi: 700, kind: 'mono', stack: `"IBM Plex Mono", ${MONO_STACK}` };

const pal = (ground, raised, ink, ink2, line) => ({ ground, raised, ink, ink2, line });
// accent(name, light hex, dark hex); null = no value on that ground (the direction's fallback accent is used there)
const acc = (n, light, dark = light) => ({ n, light, dark });
// scale row: [role, size, weight, tracking, note]
const sc = (role, size, weight, tracking = '', note = '') => ({ role, size, weight, tracking, note });

// Hex values come from the direction catalogue. Where a hex failed the contrast checks in the self-test
// (accent on its ground >= 3, on-accent >= 4.5) the per-appearance value was adjusted; those are marked "adjusted".
export const DIRECTIONS = {
  'native-quiet': {
    name: 'Native quiet utility', refs: ['Things 3', 'Flighty', 'Crouton', 'Structured'], appearance: { def: 'light' },
    faces: [[SYSTEM, 3], [FACE['Public Sans'], 1]],
    scale: [sc('large title', 34, 700, '-0.02em'), sc('title', 22, 600), sc('headline', 17, 600), sc('body', 17, 400), sc('footnote', 13, 400)],
    light: pal('#FFFFFF', '#F2F2F7', '#000000', '#5E5E63', '#D8D8DC'), dark: pal('#000000', '#1C1C1E', '#FFFFFF', '#A1A1A6', '#38383A'),
    accents: [acc('ink blue', '#2457C5'), acc('teal', '#0E7C6B'), acc('red', '#D4442E'), acc('orange', '#B85C00'), acc('green', '#2E7D46')],
    pos: ['#2E7D46', '#2E7D46'], neg: ['#D4442E', '#D4442E'], icons: 'phosphor',
    radii: '12 grouped lists, 10 buttons', density: 'Platform rows, hairline separators.',
    imagery: 'Content photos only. Empty states are text plus one icon.',
    signatures: ['Completion moment: the row checks, the strike draws and the row settles with a spring.', 'Numeric text transition on a changing figure.', 'Lift-on-press of the tapped row into a detail card.'],
    bad: 'The default template with no point of view. Only acceptable with an owned signature moment and specific copy.', rules: [],
  },
  'data-canvas': {
    name: 'Data as the hero', refs: ['Tide Guide', 'Moonlitt', 'Apple Weather', 'Oura', 'Flighty status'], appearance: { def: 'light', 'wellness-meditation': 'dark' },
    faces: [[SYSTEM, 1], [FACE['Hanken Grotesk'], 1], [FACE.Barlow, 1]],
    scale: [sc('hero numeral', 72, 600, '-0.03em', 'tabular'), sc('title', 22, 600), sc('body', 16, 400), sc('label', 13, 500)],
    light: pal('#F7F9FC', '#FFFFFF', '#0B1220', '#4A5568', '#DCE3EC'), dark: pal('#0B1630', '#15213F', '#F2F5FA', '#A3AFC6', '#26345A'),
    // adjusted (light): green #19A974 -> #18A06E (also the light positive colour) and orange #F2994A -> #DB6F10, all failed 3:1 on the light ground
    accents: [acc('data blue', '#3D8BFF'), acc('data green', '#18A06E', '#19A974'), acc('data orange', '#DB6F10', '#F2994A'), acc('night violet', null, '#9B8CFF')],
    pos: ['#18A06E', '#19A974'], neg: ['#E5484D', '#E5484D'], icons: 'phosphor',
    radii: '16', density: 'Roomy: the figure or chart gets the screen, labels stay small.',
    imagery: 'The chart or a real map is the image (MapLibre with OpenFreeMap for routes).',
    signatures: ['Scrub the chart or route with a finger, with the readout following.', 'A ring or arc filling to the real value with a spring.', 'Live time-of-day tint.'],
    bad: 'Gradients unconnected to data; low-contrast text over moving backgrounds.',
    rules: ['The ground or a wash may shift with the value (time of night, effort zone, tide height), and that shift carries meaning. Never decorative.', 'Violet only for night or sky subjects.'],
  },
  'austere-dark': {
    name: 'Austere precision', refs: ['Revolut', 'Robinhood', 'Copilot Money', 'Linear'], appearance: { def: 'dark' },
    faces: [[FACE['IBM Plex Sans'], 1], [FACE['Schibsted Grotesk'], 1], [FACE['Hanken Grotesk'], 1], [FACE['Public Sans'], 1]],
    scale: [sc('balance', 48, 500, '-0.02em', 'tabular'), sc('title', 20, 600), sc('body', 15, 400), sc('label', 13, 500)],
    light: pal('#FFFFFF', '#F4F4F5', '#0B0B0C', '#52525B', '#E4E4E7'), dark: pal('#0B0B0C', '#161618', '#F4F4F5', '#A1A1AA', '#27272A'),
    // adjusted (light): lime #C6F432 -> #7B9E08, it is invisible on white (1.3:1)
    accents: [acc('lime', '#7B9E08', '#C6F432'), acc('signal blue', '#4F7DFF'), acc('coral', '#FF5A47')],
    pos: ['#15803D', '#3DD68C'], neg: ['#DC2626', '#FF6B6B'], icons: 'tabler',
    radii: '14 cards, 999 only for real toggles', density: 'Dense and exact: tabular figures, hairlines, no shadows.',
    imagery: 'Charts and card art; no stock photos.',
    signatures: ['Number roll on change (tabular digits slide).', 'Chart scrub with a value tooltip.', 'Press-and-hold to reveal masked data.'],
    bad: 'Neon glow and gradient cards (the crypto template).',
    rules: ['One accent is the signal: use it on data and the primary action only.', 'Never amber or gold on near-black.', 'No shadows: elevation by contrast.'],
  },
  'photo-editorial': {
    name: 'Photographic editorial', refs: ['Airbnb', 'Letterboxd', 'Apple Music', 'Spotify', 'Crouton library'], appearance: { def: 'light', 'media-streaming': 'dark' },
    faces: [[SYSTEM, 1], [FACE['Hanken Grotesk'], 1], [FACE['Schibsted Grotesk'], 1]],
    scale: [sc('title', 28, 700, '-0.02em'), sc('section', 20, 600), sc('body', 16, 400), sc('meta', 14, 400)],
    light: pal('#FFFFFF', '#F7F7F7', '#1A1A1A', '#5F5F5F', '#EBEBEB'), dark: pal('#0A0A0A', '#1A1A1A', '#FFFFFF', '#B3B3B3', '#2A2A2A'),
    // the action colour is black on light and white on dark
    accents: [acc('action black', '#111111', '#FFFFFF'), acc('red', '#D93B30'), acc('green', '#1F7A4C')],
    pos: ['#1F7A4C', '#3DB87A'], neg: ['#D93B30', '#F0605A'], icons: 'phosphor',
    radii: '12-16, full-bleed hero (4:3, 1:1 for covers)', density: 'Platform rows; the photo sets the rhythm.',
    imagery: 'Real photos from assets/imagery.md; never a grey box. Colour otherwise comes from content: sample the hero image\'s dominant colour for washes and tints.',
    signatures: ['Shared-element photo expand from list to detail.', 'Photo pager with a count, and a header that collapses on scroll with parallax.', 'Background tint crossfading to the sampled colour of the current artwork.'],
    bad: 'Stock photos under a dark gradient overlay with marketing copy; mismatched crops.', rules: [],
  },
  'brand-signal': {
    name: 'One loud brand colour on neutral UI', refs: ['Strava', 'Monzo', 'Spotify green', 'Duolingo green'], appearance: { def: 'light' },
    faces: [[FACE.Archivo, 1], [FACE.Barlow, 1], [FACE['Public Sans'], 1]],
    scale: [sc('title', 30, 800, '-0.02em'), sc('section', 18, 700), sc('body', 16, 400), sc('label', 13, 600)],
    light: pal('#FFFFFF', '#F5F5F5', '#121212', '#5C5C5C', '#E6E6E6'), dark: pal('#121212', '#1E1E1E', '#FFFFFF', '#ABABAB', '#2C2C2C'),
    accents: [acc('orange', '#FC5200'), acc('coral', '#FF4F40'), acc('green', '#1E9E4A'), acc('cobalt', '#1F4DFF')],
    pos: ['#1E9E4A', '#1E9E4A'], neg: ['#D93025', '#FF6B5E'], icons: 'phosphor',
    radii: '8-12', density: 'Platform rows; grey does the structure, the brand colour does the pointing.',
    imagery: 'Content photos and data; chrome stays neutral.',
    signatures: ['The primary action morphs (label to progress to check).', 'A celebration only at a real goal.', 'A segmented progress that fills with a spring.'],
    bad: 'The brand colour everywhere, so nothing stands out.',
    rules: ['The brand colour appears on the single primary action, the selected state and the key datum only. Everything else is grey.'],
  },
  'warm-habit': {
    name: 'Rounded, friendly habit', refs: ['Duolingo', 'Headspace', 'Finch', 'Gentler Streak'], appearance: { def: 'light' },
    faces: [[FACE.Nunito, 1], [FACE['Baloo 2'], 1]],
    scale: [sc('title', 28, 800), sc('section', 20, 800), sc('body', 17, 600), sc('label', 14, 700)],
    light: pal('#FFFFFF', '#F7F7F7', '#3C3C3C', '#6B6B6B', '#E5E5E5'), dark: pal('#131F24', '#1F2E35', '#F1F7FA', '#A9BCC6', '#2E4048'),
    // adjusted: all four darkened on light (originals are 2.4-3.9:1 on white and failed 3:1 or on-accent 4.5:1); red on dark #E5484D -> #EB5257 for on-accent 4.5:1
    accents: [acc('green', '#1F8454', '#2BB673'), acc('sky', '#077DB4', '#1CB0F6'), acc('orange', '#C25100', '#FF7A1A'), acc('red', '#D4252B', '#EB5257')],
    pos: ['#1F8454', '#2BB673'], neg: ['#D4252B', '#EB5257'], icons: 'phosphor',
    radii: '16-20', density: 'Roomy; chunky buttons with a 4px darker bottom edge that compresses on press.',
    imagery: 'No model-drawn mascot or illustration. Use a real photo or nothing, or the project\'s own character if supplied.',
    signatures: ['A button that presses down into its edge.', 'A progress bar filling with an overshoot spring.', 'A peak-end completion moment with the real score.'],
    bad: 'Flat vector blobs, random colours, information overload.', rules: ['One family only (Nunito or Baloo 2).'],
  },
  'reading-room': {
    name: 'Reader\'s and writer\'s room', refs: ['Bear', 'iA Writer', 'Granola', 'StoryGraph'], appearance: { def: 'light' },
    // the only direction with two families: the dealt text face for content, the system font for the UI
    faces: [[FACE.Literata, 1], [FACE['Source Serif 4'], 1]], uiSystem: true,
    scale: [sc('title', 28, 600), sc('body', 18, 400, '', 'line-height 1.55, 60-70ch measure'), sc('UI', 15, 500, '', 'system font')],
    light: pal('#FBFBF9', '#F1F1EE', '#1D1D1F', '#5A5A5E', '#E3E3DF'), dark: pal('#1A1A1C', '#242427', '#EDEDEF', '#A0A0A6', '#333337'),
    // adjusted: red #D9443A -> #D73C31 (light) and #E0574D (dark) to reach 4.5:1 for the label on the accent
    accents: [acc('red', '#D73C31', '#E0574D'), acc('blue', '#2F6FDE'), acc('green', '#2E7D46')],
    pos: ['#2E7D46', '#3DB87A'], neg: ['#D73C31', '#F0605A'], icons: 'phosphor',
    radii: '8-12', density: 'Generous margins; the text column is the layout.',
    imagery: 'Content only; covers and avatars from assets/imagery.md when the product has them.',
    signatures: ['Focus mode dimming everything but the current paragraph.', 'A highlight drawing across a selection.', 'A smooth expand of a quote or note.'],
    bad: 'A cream ground, terracotta accent and italic serif accent word (the AI second wave).',
    rules: ['The ground is a cool off-white, never cream or beige.', 'Never terracotta, clay or burnt orange.', 'Two families only here: the dealt text face for reading, the system font (or Atkinson Hyperlegible Next) for UI.'],
  },
  'quiet-sensory': {
    name: 'Quiet sensory wellness', refs: ['Tiimo', 'Calm', 'Endel', 'Moonlitt'], appearance: { def: 'light', 'wellness-meditation': 'dark' },
    faces: [[FACE['Nunito Sans'], 1], [FACE.Mulish, 1], [SYSTEM, 1]],
    scale: [sc('title', 30, 500), sc('body', 17, 400), sc('timer', 64, 300, '', 'tabular'), sc('label', 14, 500)],
    light: pal('#F3F5F8', '#FFFFFF', '#1F2933', '#52606D', '#DDE3EA'), dark: pal('#0E1426', '#1A2238', '#E8ECF5', '#A3ACC2', '#2A3350'),
    // adjusted (light): the dark-ground pastels are 1.6-2.1:1 on the light ground, so the light values are the same hues, deeper and still muted
    accents: [acc('mist blue', '#3B63B8', '#8FB3FF'), acc('sage teal', '#35826E', '#8ED1C0'), acc('soft violet', '#6A57B8', '#C3B5FF')],
    pos: ['#2F7D5B', '#8ED1C0'], neg: ['#B4413A', '#FF8F87'], icons: 'phosphor',
    radii: '20', density: 'Roomy: one thing per screen, large targets.',
    imagery: 'Real calm photography (the bedroom/night list in assets/imagery.md) or none.',
    signatures: ['A breathing ring or bar driven by the real timer (inhale 4, exhale 6), with a Reduce Motion fallback.', 'A sound crossfade with a visible level.', 'The screen dimming step by step as wind-down progresses.'],
    bad: 'A pastel gradient with rounded cards and no content logic; startling motion.',
    rules: ['Accents are desaturated, in the same family as the ground. Never pink, coral or neon on near-black.'],
  },
  'pro-tool': {
    name: 'Pro-tool precision', refs: ['Halide', 'djay', 'Procreate Dreams', 'Linear'], appearance: { def: 'dark' },
    faces: [[SYSTEM, 1], [FACE['IBM Plex Sans'], 1]], mono: true,
    scale: [sc('title', 20, 600), sc('body', 15, 400), sc('readout', 13, 500, '', 'mono, tabular'), sc('label', 12, 600)],
    light: pal('#FFFFFF', '#F2F2F3', '#0E0E10', '#55555C', '#DDDDE0'), dark: pal('#0E0E10', '#1A1A1D', '#F2F2F3', '#9C9CA3', '#2A2A2E'),
    // adjusted (light): yellow #FFD400 -> #AD9000 and green #30D158 -> #25A946, both under 3:1 on white
    accents: [acc('active yellow', '#AD9000', '#FFD400'), acc('active green', '#25A946', '#30D158'), acc('active blue', '#0A84FF')],
    pos: ['#1A8F3C', '#30D158'], neg: ['#D12B2B', '#FF5A52'], icons: 'tabler',
    radii: '10', density: 'Dense, with controls in thumb reach.',
    imagery: 'The subject (viewfinder, waveform, canvas) is the image; chrome stays out of its way.',
    signatures: ['A detented dial or slider with ticks.', 'A loupe or readout under the finger.', 'A mode switch with label morph.'],
    bad: 'Flight-simulator dials, everything visible at once.',
    rules: ['Accent marks the active state only. Colour is never the sole indicator.', 'IBM Plex Mono (or the system monospace) only for numeric readouts.'],
  },
  'social-poster': {
    name: 'Social poster', refs: ['Partiful', 'CapWords', 'BeReal', 'Letterboxd lists'], appearance: { def: 'light' },
    faces: [[SYSTEM, 1], [FACE['Hanken Grotesk'], 1]],
    scale: [sc('title', 30, 800, '-0.02em'), sc('body', 16, 400), sc('meta', 14, 500)],
    light: pal('#FFFFFF', '#F4F4F6', '#111114', '#5B5B66', '#E7E7EC'), dark: pal('#0D0D10', '#1A1A1F', '#FFFFFF', '#A8A8B3', '#2A2A31'),
    // adjusted: blue #2F6BFF -> #2A67FF so white-on-accent reaches 4.5:1. Hot pink has no dark value (pink on near-black is a generated look); the fallback accent is used there
    accents: [acc('hot pink', '#FF3D7F', null), acc('blue', '#2A67FF'), acc('green', '#00A86B')], fallback: 1,
    pos: ['#00A86B', '#00A86B'], neg: ['#E5484D', '#E5484D'], icons: 'phosphor',
    radii: '16-24', density: 'Roomy; expression lives in the user\'s content.',
    imagery: 'Real photos, and event posters made from a photo plus big type in the UI face.',
    signatures: ['A card that throws off with velocity and a spring, with Undo.', 'A reaction burst on a real action.', 'A sticker or stamp dropping with physics.'],
    bad: 'Random display fonts and colours with no real content.', rules: ['Hot pink only on a light ground.'],
  },
};

// niche -> ordered directions, weighted 3 / 2 / 1
export const NICHES = {
  fintech: ['austere-dark', 'native-quiet', 'brand-signal'], 'crypto-trading': ['austere-dark', 'pro-tool'],
  'fitness-health': ['data-canvas', 'brand-signal'], 'wellness-meditation': ['quiet-sensory', 'data-canvas'],
  'productivity-habits': ['native-quiet', 'warm-habit'], 'notes-writing': ['reading-room', 'native-quiet'],
  'social-messaging': ['social-poster', 'photo-editorial'], dating: ['photo-editorial', 'social-poster'],
  ecommerce: ['photo-editorial', 'brand-signal'], 'food-delivery': ['photo-editorial', 'brand-signal'],
  'travel-transport': ['photo-editorial', 'native-quiet', 'data-canvas'], education: ['warm-habit', 'native-quiet'], kids: ['warm-habit'],
  'media-streaming': ['photo-editorial', 'austere-dark'], 'news-reading': ['reading-room', 'photo-editorial'],
  'ai-assistant': ['reading-room', 'native-quiet'], utilities: ['native-quiet', 'data-canvas'], 'creative-tools': ['pro-tool', 'austere-dark'],
  'smart-home': ['native-quiet', 'data-canvas'], healthcare: ['native-quiet', 'quiet-sensory'], 'real-estate': ['photo-editorial', 'native-quiet'],
  'games-companion': ['warm-habit', 'social-poster'], 'b2b-field': ['native-quiet', 'pro-tool'], 'government-civic': ['native-quiet'],
};

const ICONS = {
  phosphor: {
    v: 'Phosphor 2.1.2, regular (fill for the selected state)',
    css: ['https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/regular/style.css', 'https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/fill/style.css'],
    markup: '<i class="ph ph-heart"></i>  selected: <i class="ph-fill ph-heart"></i>',
  },
  tabler: {
    v: 'Tabler 3.51.0, outline (filled for the selected state)',
    css: ['https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.51.0/dist/tabler-icons.min.css', 'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.51.0/dist/tabler-icons-filled.min.css'],
    markup: '<i class="ti ti-heart"></i>  selected: <i class="ti ti-heart-filled"></i>',
  },
  material: {
    v: 'Material Symbols Rounded (variable; FILL 1 for the selected state)',
    css: ['https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block'],
    markup: '<span class="material-symbols-rounded">favorite</span>  with .material-symbols-rounded { font-variation-settings: \'FILL\' 0, \'wght\' 400, \'GRAD\' 0, \'opsz\' 24 } and FILL 1 when selected',
  },
};

const LAYOUT = 'Layout: use the conventional structure of the niche\'s leading apps (see the niche file). The direction changes surface, type, colour, imagery and motion, not where things go.';

// --- contrast (WCAG 2.x relative luminance) ---
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)]; return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

// the darkest ink the direction owns: label colour on a light accent
const darkInk = (d) => (lum(d.light.ink) <= lum(d.dark.ground) ? d.light.ink : d.dark.ground);
export const onAccent = (d, accent) => (contrast('#FFFFFF', accent) >= contrast(darkInk(d), accent) ? '#FFFFFF' : darkInk(d));

// --- seeded randomness: FNV-1a hash, then mulberry32 ---
function fnv(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed) {
  let a = fnv(seed);
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pickW = (items, weights, r) => {
  let x = r() * weights.reduce((s, w) => s + w, 0);
  for (let i = 0; i < items.length; i++) if ((x -= weights[i]) < 0) return items[i];
  return items[items.length - 1];
};

const appearanceOf = (d, niche) => d.appearance[niche] ?? d.appearance.def;
const modeAccent = (d, a, mode) => a[mode] ?? d.accents[d.fallback ?? 0][mode];

function draw(seed, niche, salt) {
  const r = rng(`${seed.trim().toLowerCase()}#${salt}`);
  const ids = NICHES[niche];
  const id = pickW(ids, [3, 2, 1].slice(0, ids.length), r);
  const d = DIRECTIONS[id];
  const face = pickW(d.faces.map(([f]) => f), d.faces.map(([, w]) => w), r);
  const app = appearanceOf(d, niche);
  const accents = d.accents.filter((a) => a[app] != null);
  const accent = accents[Math.floor(r() * accents.length)];
  const sig = Math.floor(r() * d.signatures.length);
  return { id, face, accent, sig, key: `${id}|${face.n}|${accent.n}|${sig}` };
}

export function deal(seed, niche, platform = 'ios', reroll = 0) {
  if (!NICHES[niche]) throw new Error(`unknown niche "${niche}". Valid ids: ${Object.keys(NICHES).join(', ')}`);
  if (!['ios', 'android', 'both'].includes(platform)) throw new Error(`unknown platform "${platform}". Use ios, android or both`);
  // a reroll must change something: keep drawing until the pick differs from the previous reroll's
  let hand = draw(seed, niche, reroll);
  if (reroll > 0) { const prev = draw(seed, niche, reroll - 1).key; for (let k = 1; hand.key === prev && k < 50; k++) hand = draw(seed, niche, `${reroll}.${k}`); }
  const d = DIRECTIONS[hand.id];
  const appearance = appearanceOf(d, niche);
  const weights = [...new Set(d.scale.filter((s) => !/^(system|mono)/.test(s.note)).map((s) => Math.min(hand.face.hi, Math.max(hand.face.lo, s.weight))))].sort((a, b) => a - b);
  const url = (f, ws) => `family=${f.n.replace(/ /g, '+')}:wght@${ws.join(';')}`;
  const monoWeights = [400, 500];
  const typeface = hand.face.system
    ? { family: 'system', stack: SYSTEM_STACK, fontsUrl: null, note: 'system: no web font' }
    : { family: hand.face.n, stack: hand.face.stack, fontsUrl: `https://fonts.googleapis.com/css2?${url(hand.face, weights)}&display=swap`, note: hand.face.kind };
  if (d.mono && !hand.face.system) typeface.mono = { family: PLEX_MONO.n, stack: PLEX_MONO.stack, fontsUrl: `https://fonts.googleapis.com/css2?${url(PLEX_MONO, monoWeights)}&display=swap` };
  if (d.mono && hand.face.system) typeface.mono = { family: 'system monospace', stack: MONO_STACK, fontsUrl: null };
  if (d.uiSystem) typeface.ui = { family: 'system', stack: SYSTEM_STACK, fontsUrl: null };
  const fit = (w) => Math.min(hand.face.hi, Math.max(hand.face.lo, w));
  const typeScale = d.scale.map((s) => ({ role: s.role, size: s.size, weight: /^(system|mono)/.test(s.note) ? s.weight : fit(s.weight), tracking: s.tracking || '0', note: s.note }));
  const tokens = {};
  for (const mode of ['light', 'dark']) {
    const p = d[mode], i = mode === 'light' ? 0 : 1;
    const accent = modeAccent(d, hand.accent, mode);
    tokens[mode] = { ground: p.ground, raised: p.raised, ink: p.ink, 'ink-2': p.ink2, line: p.line, accent, 'on-accent': onAccent(d, accent), positive: d.pos[i], negative: d.neg[i] };
  }
  const iconKey = platform === 'android' ? 'material' : d.icons;
  const icons = { ...ICONS[iconKey], native: platform === 'ios' ? 'Native build: SF Symbols' : platform === 'android' ? 'Native build: Material Symbols' : 'Native builds: SF Symbols on iOS, Material Symbols on Android' };
  return {
    seed, niche, platform, reroll,
    direction: { id: hand.id, name: d.name, refs: d.refs },
    appearance: `${appearance}-first`, typeface, typeScale, tokens, accentName: hand.accent.n,
    radii: d.radii, density: d.density, icons, imagery: d.imagery,
    signature: { chosen: d.signatures[hand.sig], all: d.signatures }, bad: d.bad, rules: d.rules, layout: LAYOUT,
  };
}

// --- output ---
function render(h) {
  const L = [];
  const row = (k, v) => L.push(`${k.padEnd(13)}${v}`);
  L.push(`Direction for "${h.seed}" (${h.niche}, ${h.platform}${h.reroll ? `, reroll ${h.reroll}` : ''})`, '');
  row('Direction', `${h.direction.id}: ${h.direction.name}`);
  row('References', h.direction.refs.join(', '));
  row('Appearance', `${h.appearance} (the other follows the system)`);
  const tf = h.typeface;
  row('Typeface', tf.family === 'system' ? 'system: no web font' : `${tf.family} (${tf.note})`);
  row('  stack', tf.stack);
  if (tf.fontsUrl) row('  fonts', tf.fontsUrl);
  if (tf.ui) row('  UI face', `system: ${tf.ui.stack}`);
  if (tf.mono) row('  readouts', `${tf.mono.family}: ${tf.mono.stack}${tf.mono.fontsUrl ? `\n${''.padEnd(13)}  ${tf.mono.fontsUrl}` : ''}`);
  L.push('', 'Type scale (size/weight/tracking)');
  for (const s of h.typeScale) L.push(`  ${s.role.padEnd(13)}${s.size}/${s.weight}/${s.tracking}${s.note ? `  ${s.note}` : ''}`);
  L.push('', `Colour${''.padEnd(7)}${'light'.padEnd(10)}dark`);
  for (const k of Object.keys(h.tokens.light)) L.push(`  ${k.padEnd(11)}${h.tokens.light[k].padEnd(10)}${h.tokens.dark[k]}`);
  row('Accent', h.accentName);
  row('Radii', h.radii);
  row('Density', h.density);
  L.push('', `Icons        ${h.icons.v}`, `  css        ${h.icons.css.join('\n             ')}`, `  markup     ${h.icons.markup}`, `  native     ${h.icons.native}`);
  L.push('', `Imagery      ${h.imagery}`, `Signature    ${h.signature.chosen}`, `  or         ${h.signature.all.filter((s) => s !== h.signature.chosen).join('\n             ')}`, `Bad version  ${h.bad}`);
  if (h.rules.length) L.push('Rules        ' + h.rules.join('\n             '));
  L.push('', h.layout, '', 'The direction is binding. One reroll (--reroll 1) is allowed when it contradicts the brief; say why. A brand colour the brief gives replaces the accent.');
  return L.join('\n');
}

// --- self-test ---
function selfTest() {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'references');
  const nicheIds = Object.keys(NICHES);
  assert.deepStrictEqual({ ...deal('Pano', 'fintech'), seed: '' }, { ...deal(' pano ', 'fintech'), seed: '' }, 'same product, same hand');
  assert.notDeepStrictEqual(deal('Pano', 'fintech'), deal('Pano', 'fintech', 'ios', 1), 'a reroll changes the hand');
  for (let i = 0; i < 60; i++) for (const n of ['kids', 'fintech']) assert.notStrictEqual(JSON.stringify(deal('r' + i, n)), JSON.stringify(deal('r' + i, n, 'ios', 1)), 'a reroll always changes something');
  for (const id of nicheIds) {
    assert.ok(existsSync(join(root, `niche-${id}.md`)), `niche file missing for ${id}`);
    for (const d of NICHES[id]) assert.ok(DIRECTIONS[d], `niche ${id} names unknown direction ${d}`);
    assert.ok(NICHES[id].length >= 1 && NICHES[id].length <= 3, `niche ${id} needs 1-3 directions`);
  }
  if (existsSync(root)) for (const f of readdirSync(root)) { const m = /^niche-(.+)\.md$/.exec(f); if (m) assert.ok(NICHES[m[1]], `${f} has no niche mapping`); }
  const valid = (h) => typeof h === 'string' && /^#[0-9A-F]{6}$/.test(h);
  let checked = 0;
  for (const [id, d] of Object.entries(DIRECTIONS)) {
    assert.ok(nicheIds.some((n) => NICHES[n].includes(id)), `${id} is used by no niche`);
    assert.ok(d.signatures.length === 3 && d.faces.length >= 2, `${id}: incomplete`);
    for (const [f] of d.faces) assert.ok(!OVERUSED.includes(f.n), `${f.n} is on the overused list`);
    if (d.mono) assert.ok(!OVERUSED.includes(PLEX_MONO.n));
    for (const s of d.scale) assert.ok(s.size > 0 && s.weight >= 100 && s.weight <= 900, `${id}: bad scale row ${s.role}`);
    for (const mode of ['light', 'dark']) {
      const p = d[mode];
      for (const [k, v] of Object.entries(p)) assert.ok(valid(v), `${id} ${mode} ${k} is not a hex: ${v}`);
      assert.ok(contrast(p.ink, p.ground) >= 7, `${id} ${mode}: ink on ground ${contrast(p.ink, p.ground).toFixed(2)} < 7`);
      assert.ok(contrast(p.ink2, p.ground) >= 4.5, `${id} ${mode}: ink-2 on ground ${contrast(p.ink2, p.ground).toFixed(2)} < 4.5`);
      for (const a of d.accents) {
        if (a[mode] == null) { assert.ok(d.accents[d.fallback ?? 0][mode] != null, `${id}: fallback accent has no ${mode} value`); continue; }
        assert.ok(valid(a[mode]), `${id} accent ${a.n} ${mode} is not a hex`);
        assert.ok(contrast(a[mode], p.ground) >= 3, `${id} ${mode}: accent ${a.n} ${a[mode]} on ground ${contrast(a[mode], p.ground).toFixed(2)} < 3`);
        const oa = onAccent(d, a[mode]);
        assert.ok(contrast(oa, a[mode]) >= 4.5, `${id} ${mode}: on-accent on ${a.n} ${a[mode]} ${contrast(oa, a[mode]).toFixed(2)} < 4.5`);
        checked++;
      }
    }
    for (const v of [...d.pos, ...d.neg]) assert.ok(valid(v), `${id}: semantic colour ${v} is not a hex`);
    ['light', 'dark'].forEach((mode, i) => [d.pos[i], d.neg[i]].forEach((v) => assert.ok(contrast(v, d[mode].ground) >= 3, `${id} ${mode}: semantic colour ${v} on ground < 3`)));
  }
  const seen = { d: new Set(), f: new Set() };
  for (let i = 0; i < 300; i++) { const h = deal('seed' + i, 'food-delivery'); seen.d.add(h.direction.id); seen.f.add(h.typeface.family); }
  assert.ok(seen.d.size >= 2, 'food-delivery should reach at least 2 directions');
  assert.ok(seen.f.size >= 3, 'food-delivery should reach at least 3 faces');
  for (const n of nicheIds) for (const p of ['ios', 'android', 'both']) assert.ok(render(deal('x', n, p)).length > 200);
  console.log(`self-test ok (${Object.keys(DIRECTIONS).length} directions, ${nicheIds.length} niches)`);
  return 0;
}

function list() {
  console.log('DIRECTIONS (niche weights 3 / 2 / 1 in the order listed)');
  for (const [id, d] of Object.entries(DIRECTIONS)) {
    const niches = Object.keys(NICHES).filter((n) => NICHES[n].includes(id)).map((n) => `${n}${NICHES[n].indexOf(id) ? `(${NICHES[n].indexOf(id) + 1})` : ''}`);
    console.log(`  ${id}: ${d.name}\n    refs:   ${d.refs.join(', ')}\n    faces:  ${d.faces.map(([f]) => f.n).join(', ')}\n    niches: ${niches.join(', ')}`);
  }
  console.log(`\nOVERUSED (never dealt, slop-scan flags them)\n  ${OVERUSED.join(', ')}`);
  return 0;
}

function main(argv) {
  const opt = (n, d) => { const i = argv.indexOf(n); return i < 0 ? d : argv[i + 1]; };
  if (argv.includes('--help') || argv.includes('-h')) { console.log('usage: node deal.mjs --seed "Product name" --niche <niche-id> [--platform ios|android|both] [--reroll N] [--json] [--list] [--self-test]'); return 0; }
  if (argv.includes('--self-test')) return selfTest();
  if (argv.includes('--list')) return list();
  const seed = opt('--seed'), niche = opt('--niche');
  if (!seed) { console.error('give --seed "Product name"'); return 2; }
  if (!niche || !NICHES[niche]) { console.error(`${niche ? `unknown niche "${niche}"` : 'give --niche <niche-id>'}. Valid ids: ${Object.keys(NICHES).join(', ')}`); return 2; }
  let hand;
  try { hand = deal(seed, niche, opt('--platform', 'ios'), Number(opt('--reroll', 0)) || 0); } catch (e) { console.error(e.message); return 2; }
  console.log(argv.includes('--json') ? JSON.stringify(hand, null, 2) : render(hand));
  return 0;
}
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop())) process.exitCode = main(process.argv.slice(2));
