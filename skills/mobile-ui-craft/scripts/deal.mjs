#!/usr/bin/env node
// Deals the choices a model should not make by taste: typeface, icon set, layout skeleton, shape, ground,
// effects, voice and hero type. The same seed always gives the same hand, so a product keeps its look;
// different products get different hands. Zero dependencies.
//
//   node deal.mjs --seed "Product name" [--platform ios|android|both] [--reroll N] [--json] [--list] [--self-test]
import assert from 'node:assert';

// Faces models reach for when left to choose. Never dealt; slop-scan flags them.
export const OVERUSED = ['Inter', 'Fraunces', 'Instrument Serif', 'Instrument Sans', 'Playfair Display', 'Space Grotesk', 'DM Sans',
  'DM Serif Display', 'Bricolage Grotesque', 'Plus Jakarta Sans', 'Manrope', 'Sora', 'Outfit', 'Syne', 'Poppins', 'Montserrat', 'Geist',
  'Figtree', 'Barlow Condensed', 'Cormorant', 'Newsreader', 'Lora'];

// Open families available from common font services. w = relative weight in the deal (serifs are rare on purpose).
const FACES = [
  ...['Hanken Grotesk', 'Schibsted Grotesk', 'Familjen Grotesk', 'Host Grotesk', 'Albert Sans', 'Onest', 'Golos Text', 'Geologica',
    'Wix Madefor Display', 'Reddit Sans', 'Radio Canada', 'Red Hat Display', 'Public Sans', 'Be Vietnam Pro', 'Readex Pro', 'Sofia Sans',
    'Gantari', 'Afacad', 'Rethink Sans', 'Hubot Sans', 'Mona Sans', 'Parkinsans', 'SUSE', 'Funnel Display', 'Urbanist', 'Epilogue',
    'Chivo', 'Libre Franklin', 'Work Sans', 'Karla', 'Rubik', 'Barlow', 'Encode Sans', 'Fira Sans', 'IBM Plex Sans', 'Source Sans 3',
    'Mulish', 'Assistant', 'Heebo', 'Commissioner', 'Inclusive Sans', 'Atkinson Hyperlegible', 'Ysabeau', 'Alegreya Sans', 'Cabin',
    'Hind', 'Kumbh Sans', 'Bai Jamjuree', 'Jost', 'League Spartan', 'Lexend', 'Anybody', 'Darker Grotesque', 'Tomorrow'].map((n) => ({ n, k: 'sans', w: 3 })),
  ...['Sofia Sans Condensed', 'Archivo Narrow', 'Big Shoulders Display', 'Oswald', 'Antonio', 'Saira Condensed', 'Encode Sans Condensed',
    'IBM Plex Sans Condensed', 'Fira Sans Condensed', 'Roboto Condensed'].map((n) => ({ n, k: 'condensed sans', w: 2 })),
  ...['Nunito', 'Quicksand', 'Varela Round', 'M PLUS Rounded 1c', 'Baloo 2', 'Fredoka'].map((n) => ({ n, k: 'rounded sans', w: 2 })),
  ...['Roboto Slab', 'Zilla Slab', 'Arvo', 'Bitter', 'Aleo', 'Besley'].map((n) => ({ n, k: 'slab', w: 1 })),
  ...['Source Serif 4', 'Literata', 'Roboto Serif', 'Crimson Pro', 'Spectral', 'Gelasio', 'Brygada 1918', 'Petrona', 'Piazzolla',
    'Libre Caslon Text', 'Vollkorn', 'IBM Plex Serif', 'Faustina', 'Merriweather'].map((n) => ({ n, k: 'serif', w: 1 })),
];

const TYPE_SCHEMES = [
  { w: 35, v: 'System only', how: 'The platform system font for everything. Hierarchy comes from size, weight and spacing alone. This is what most shipped apps do.' },
  { w: 35, v: 'One family', how: 'One dealt family for titles, numerals, body and controls. No second face. Most branded apps use a single family.' },
  { w: 30, v: 'Display plus system', how: 'The dealt family for titles and hero numerals only; the platform system font for body and controls.' },
];
const ICONS = [
  { w: 3, v: 'Phosphor, regular weight', web: '<script src="https://unpkg.com/@phosphor-icons/web"></script> then <i class="ph ph-house"></i>' },
  { w: 2, v: 'Phosphor, bold weight', web: '<script src="https://unpkg.com/@phosphor-icons/web"></script> then <i class="ph-bold ph-house"></i>' },
  { w: 2, v: 'Phosphor, fill weight', web: '<script src="https://unpkg.com/@phosphor-icons/web"></script> then <i class="ph-fill ph-house"></i>' },
  { w: 3, v: 'Tabler Icons, outline', web: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"> then <i class="ti ti-home"></i>' },
  { w: 3, v: 'Remix Icon, line', web: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.css"> then <i class="ri-home-5-line"></i>' },
  { w: 2, v: 'Remix Icon, fill', web: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.css"> then <i class="ri-home-5-fill"></i>' },
  { w: 3, v: 'Material Symbols, rounded', web: '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded"> then <span class="material-symbols-rounded">home</span>' },
  { w: 2, v: 'Material Symbols, sharp', web: '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp"> then <span class="material-symbols-sharp">home</span>' },
  { w: 2, v: 'Bootstrap Icons', web: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"> then <i class="bi bi-house"></i>' },
];
const LAYOUTS = [
  ['Edge-to-edge list', 'A title bar, then content from the very top. The key figure is the first row group, not a banner above the list.'],
  ['Split header', 'The top third is one solid block holding the key figure; below it a plain list. A hard horizontal edge between them, no rounded sheet.'],
  ['Card stack', 'Three or four large full-width cards with tight gaps, each a different kind of object. No hero banner.'],
  ['Canvas with HUD', 'The content itself (map, media, chart, camera, photo) fills the screen; small controls sit at the edges over it.'],
  ['Timeline spine', 'A vertical axis on the leading edge; entries hang off it in time order. The current moment is the anchor.'],
  ['Uneven grid', 'A two-column grid of tiles in two or three sizes. Importance sets the size. No hero.'],
  ['Editorial scroll', 'Large type blocks and full-bleed media alternate down one long scroll, with generous margins.'],
  ['Table first', 'Dense rows with numerically aligned columns. A pinned summary row carries the key figure.'],
  ['Bottom-heavy', 'The top half shows; the bottom half holds every control and the key figure within thumb reach. No tab bar on this screen.'],
  ['Segmented workspace', 'A segmented control under the title swaps one single-purpose main area.'],
  ['Top tabs with pager', 'Text tabs at the top; swipe between full pages. Each page is a simple list or view.'],
  ['Single focus', 'One object in the middle with at most three controls. Everything else is one level away.'],
  ['Mixed feed', 'One continuous feed where modules of different kinds interleave. No global hero.'],
  ['Pinned summary', 'A compact summary stays pinned at the top; detail scrolls beneath it.'],
  ['Ledger', 'A single ruled column like a statement or receipt: lines, subtotals, a total.'],
].map(([v, how]) => ({ w: 1, v, how }));
const NAVS = [
  { w: 5, v: 'Tab bar with text labels, platform style' }, { w: 2, v: 'No tab bar on this screen: it is a pushed or single-purpose screen' },
  { w: 1, v: 'Top segmented control instead of a tab bar' },
];
const SHAPES = [
  { w: 2, v: 'Square: radii 0 to 2' }, { w: 3, v: 'Tight: radii 4 to 6' }, { w: 3, v: 'Soft: radii 10 to 12' }, { w: 2, v: 'Round: radii 16 to 20' },
  { w: 2, v: 'Mixed: square containers, fully round controls' }, { w: 1, v: 'Mixed: round containers, square controls' },
  { w: 3, v: 'Platform default: the system\'s own continuous corners, untouched' },
];
const GROUNDS = [
  { w: 35, v: 'System background: white in light, system dark in dark. Colour lives in content and one action tint' },
  { w: 20, v: 'Lightly tinted ground from the subject, low chroma, not cream and not beige' },
  { w: 20, v: 'One saturated mid-tone field behind the key area; plain system background elsewhere' },
  { w: 15, v: 'Media-led: photos, artwork or map carry the colour; the chrome is neutral' },
  { w: 10, v: 'Deep ground, only if the product is used at night or is media playback; otherwise reroll' },
];
const PALETTES = [
  { w: 4, v: 'One hue plus neutrals' }, { w: 2, v: 'Two opposed hues plus neutrals' }, { w: 3, v: 'Neutrals only, plus semantic colours for state' }, { w: 2, v: 'Two neighbouring hues plus neutrals' },
];
const EFFECTS = [
  { w: 50, v: 'Flat: no gradients, no glows, no blur, no shadows beyond what the system draws' },
  { w: 25, v: 'One elevation level for things that float; nothing else' },
  { w: 15, v: 'One system material (bar or sheet translucency); nothing else' },
  { w: 10, v: 'One gradient that encodes data or time; nothing else' },
];
const VOICES = [
  { w: 6, v: 'Terse and utilitarian: labels and figures, almost no sentences' }, { w: 3, v: 'Plain and warm: short sentences, second person' },
  { w: 2, v: 'Formal and exact' }, { w: 1, v: 'Dry, with one light line allowed in an empty state only' },
];
const HUES = [
  ['red', 0, 15], ['orange', 20, 40], ['yellow', 45, 65], ['yellow-green', 70, 100], ['green', 110, 150], ['teal', 160, 185],
  ['cyan', 190, 205], ['blue', 210, 235], ['indigo', 240, 260], ['violet', 265, 290], ['magenta', 295, 325], ['rose', 330, 355],
].map(([v, a, b]) => ({ w: 1, v: `${v} (${a} to ${b} degrees)` }));
const CHROMAS = [
  { w: 3, v: 'muted: low chroma, closer to grey than to paint' }, { w: 4, v: 'mid: clearly coloured, not neon' }, { w: 2, v: 'vivid: saturated, used sparingly' },
];
const LIGHTS = [
  { w: 7, v: 'Light appearance first; dark follows the system' }, { w: 3, v: 'Dark appearance first; light follows the system' },
];
const HEROES = [
  { w: 8, v: 'Conventional: the form the niche\'s leading apps use for this value, executed exactly' },
  { w: 4, v: 'Typographic: the figure itself, set large with deliberate spacing' }, { w: 2, v: 'A standard chart type (bar, line, area) drawn from the data' },
  { w: 3, v: 'Progress geometry: a bar, ring, track or steps' }, { w: 3, v: 'The list is the hero: the first rows carry the screen' },
  { w: 3, v: 'A real asset (photo, artwork, map) in a designed frame, with an honest labelled placeholder until the asset exists' },
  { w: 1, v: 'A diagram or route line drawn from the data' },
];

function rng(seed) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}
function pick(list, r) {
  let x = r() * list.reduce((s, i) => s + i.w, 0);
  for (const i of list) if ((x -= i.w) < 0) return i;
  return list[list.length - 1];
}

export function deal(seed, platform = 'ios', reroll = 0) {
  const r = rng(`${seed.trim().toLowerCase()}#${reroll}`);
  const scheme = pick(TYPE_SCHEMES, r);
  const face = pick(FACES, r);
  const icons = pick(ICONS, r);
  const layout = pick(LAYOUTS, r);
  const sys = platform === 'android' ? 'the Android system font' : platform === 'both' ? 'each platform\'s system font' : 'the iOS system font';
  return {
    seed, platform, reroll,
    typeface: scheme.v === 'System only' ? `${scheme.v}: ${sys}` : `${scheme.v}: ${face.n} (${face.k})`,
    typeRule: scheme.how,
    icons: platform === 'ios' ? `Native build: SF Symbols. Prototype: ${icons.v}` : platform === 'android' ? `Native build: Material Symbols. Prototype: ${icons.v}` : `Native builds: SF Symbols on iOS, Material Symbols on Android. Prototype: ${icons.v}`,
    iconsWeb: icons.web,
    layout: `${layout.v}. ${layout.how}`,
    navigation: pick(NAVS, r).v,
    shape: pick(SHAPES, r).v,
    ground: pick(GROUNDS, r).v,
    palette: pick(PALETTES, r).v,
    effects: pick(EFFECTS, r).v,
    voice: pick(VOICES, r).v,
    hero: pick(HEROES, r).v,
    ...colour(pick(HUES, r).v, pick(CHROMAS, r).v, pick(LIGHTS, r).v),
  };
}

// one vivid warm accent on a dark ground is itself a generated look, so that pairing never comes out of the deck
function colour(hue, chroma, appearance) {
  const warmVivid = /^(red|orange|magenta|rose)\b/.test(hue) && chroma.startsWith('vivid');
  return { hue: `${hue}, ${chroma}`, appearance: warmVivid && appearance.startsWith('Dark') ? LIGHTS[0].v : appearance };
}

function main(argv) {
  const opt = (n, d) => { const i = argv.indexOf(n); return i < 0 ? d : argv[i + 1]; };
  if (argv.includes('--help') || argv.includes('-h')) { console.log('usage: node deal.mjs --seed "Product name" [--platform ios|android|both] [--reroll N] [--json] [--list] [--self-test]'); return 0; }
  if (argv.includes('--self-test')) {
    assert.deepStrictEqual({ ...deal('Pano'), seed: '' }, { ...deal('pano '), seed: '' }, 'same product, same hand');
    assert.notDeepStrictEqual(deal('Pano'), deal('Pano', 'ios', 1), 'a reroll changes the hand');
    const faces = new Set(Array.from({ length: 400 }, (_, i) => deal('p' + i).typeface));
    assert.ok(faces.size > 40, 'hands are varied');
    assert.ok(new Set(Array.from({ length: 200 }, (_, i) => deal('h' + i).hue)).size > 20, 'hues are varied');
    for (let i = 0; i < 400; i++) { const h = deal('w' + i); assert.ok(!(/^(red|orange|magenta|rose)\b/.test(h.hue) && h.hue.includes('vivid') && h.appearance.startsWith('Dark')), 'no vivid warm accent on a dark-first hand'); }
    for (const f of FACES) assert.ok(!OVERUSED.includes(f.n), `${f.n} is on the overused list`);
    console.log(`self-test ok (${FACES.length} faces, ${LAYOUTS.length} layouts)`);
    return 0;
  }
  if (argv.includes('--list')) {
    for (const [name, list] of Object.entries({ FACES: FACES.map((f) => `${f.n} (${f.k})`), LAYOUTS: LAYOUTS.map((l) => l.v), ICONS: ICONS.map((i) => i.v), SHAPES: SHAPES.map((s) => s.v), GROUNDS: GROUNDS.map((g) => g.v), EFFECTS: EFFECTS.map((e) => e.v), VOICES: VOICES.map((v) => v.v), HEROES: HEROES.map((h) => h.v), HUES: HUES.map((h) => h.v), OVERUSED })) console.log(`${name}\n  ${list.join('\n  ')}\n`);
    return 0;
  }
  const seed = opt('--seed');
  if (!seed) { console.error('give --seed "Product name"'); return 2; }
  const hand = deal(seed, opt('--platform', 'ios'), Number(opt('--reroll', 0)) || 0);
  if (argv.includes('--json')) { console.log(JSON.stringify(hand, null, 2)); return 0; }
  console.log(`Hand for "${hand.seed}" (${hand.platform}${hand.reroll ? ', reroll ' + hand.reroll : ''})\n`);
  for (const [k, label] of [['typeface', 'Typeface'], ['typeRule', ''], ['icons', 'Icons'], ['iconsWeb', ''], ['layout', 'Layout'], ['navigation', 'Navigation'], ['shape', 'Shape'], ['ground', 'Ground'], ['palette', 'Palette'], ['effects', 'Effects'], ['voice', 'Voice'], ['hero', 'Hero'], ['hue', 'Hue sector'], ['appearance', 'Appearance']]) console.log(label ? `${label.padEnd(11)} ${hand[k]}` : `${''.padEnd(11)} ${hand[k]}`);
  console.log('\nThe hand is binding. You may reroll once (--reroll 1) if it contradicts the brief, and say why. Inside the hue sector, the exact hue comes from the product; the content comes from the product.');
  return 0;
}
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop())) process.exitCode = main(process.argv.slice(2));
