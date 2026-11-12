#!/usr/bin/env node
// Deals a coherent, researched direction for a product: one surface, type, colour, imagery and motion system
// that celebrated apps share, picked from the niche, plus one signature motion from the niche (real content that travels)
// and one small detail motion from the direction. The seed only chooses inside the niche's own shortlist,
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
    // no system-like blue here: judges read it as "stock iOS"
    accents: [acc('teal', '#0E7C6B'), acc('red', '#D4442E'), acc('orange', '#B85C00'), acc('green', '#2E7D46')],
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

// Signature motion per niche: what travels into what, and the technique. Each one moves real content, explains a state change,
// can be interrupted, is rare, and has a Reduce Motion variant (a crossfade, or the flat version). The kit is assets/motion-kit.js (MK.*).
// An entry starting with "Showcase" is a surface that shows off a collection; it is listed but never dealt as the signature.
export const MOTION = {
  fintech: [
    'The card flips in 3D to show its number on press-and-hold (CSS 3D preserve-3d with backface-visibility, MK.tilt while held); a flat reveal under Reduce Motion.',
    'The typed amount travels into the confirmation sheet and becomes its headline figure (MK.morph shared element).',
    'When a payment lands, only the digits that changed roll in the balance and the row (MK.roll), with a receipt line saying why.',
  ],
  'crypto-trading': [
    'The price rolls digit by digit on each tick and flashes its sign colour once (MK.roll); nothing counts up on load.',
    'The Buy button grows into the order ticket and becomes its confirm button (MK.morph shared element).',
    'Scrubbing the chart: a crosshair and the readout follow the finger 1:1 (MK.drag), the value rolls (MK.roll).',
  ],
  'fitness-health': [
    'The ring arc draws once to the measured value, with a spring on the last stretch (SVG stroke-dashoffset, MK.ease.spatial).',
    'The finished run\'s route shrinks into its row in the history list (MK.morph, the route line is the shared element).',
    'Scrubbing the pace chart moves a marker along the route on the map (MK.drag, no easing).',
  ],
  'wellness-meditation': [
    'A breathing shape morphs from circle to rounded blob paced to the real exercise, 4 s in and 6 s out (clip-path shape()), and stops when paused; a static ring under Reduce Motion.',
    'The recommended session card grows into the full-screen player while the ground dims toward night (MK.morph, MK.ease.slow).',
  ],
  'productivity-habits': [
    'Checking a task strikes it, collapses its row and updates the count in under 150 ms (MK.flip on the rows below).',
    'Drag to reorder: the row follows the finger and the gap opens live (MK.drag plus MK.flip).',
    'A tapped row lifts into its detail card (MK.morph shared element).',
  ],
  'notes-writing': [
    'A note row expands into the editor with its title as the shared element (MK.morph); back collapses it to the same row.',
    'Search narrows the list in place: rows that stay slide to their new position, the rest leave (MK.flip).',
  ],
  'social-messaging': [
    'A sent message flies from the composer into the thread and settles in its bubble (MK.flip), with a visible failed state and retry.',
    'A reaction grows out of the pressed message and lands as a chip under the bubble (MK.morph).',
    'Swipe to reply: the bubble follows the finger and springs back (MK.drag, MK.fling) while the quote slides into the composer.',
  ],
  dating: [
    'The card expands into the full profile with the main photo as the shared element (MK.morph).',
    'Liking a prompt sends the heart from that prompt to the Likes tab and the count rolls (MK.flip, MK.roll).',
  ],
  ecommerce: [
    'The product photo expands from the grid into the detail hero (MK.morph shared element).',
    'Add to cart: the product thumbnail flies into the cart bar and the count rolls (MK.flip, MK.roll).',
    'A turntable built from real angle photos rotates under the finger (MK.drag); a flat gallery under Reduce Motion.',
  ],
  'food-delivery': [
    'Add morphs into the quantity stepper and the dish thumbnail flies into the cart bar, whose price rolls (MK.flip, MK.roll), under 300 ms; the menu list is never staggered.',
    'The cart bar grows into the cart sheet with every fee itemised (MK.morph).',
    'When the arrival estimate changes, the time rolls and the tracker step updates in place (MK.roll).',
  ],
  'travel-transport': [
    'The map pin grows into the listing card and the card into a sheet, and the listing photo is the shared element into detail (MK.morph); dragging the sheet down returns it to the pin.',
    'Picking dates rolls the sticky total and lifts the chosen nights (MK.roll, CSS transform).',
    'The ticket flips in 3D to its barcode side (CSS 3D preserve-3d, tap or drag); a flat swap under Reduce Motion.',
  ],
  education: [
    'The answer tile travels into the feedback sheet, which gives the reason; right and wrong differ by icon and text as well as colour (MK.morph).',
    'Lesson complete: the progress bar fills once to the real score with a small overshoot and the next-lesson card rises from it (MK.ease.spatial); no confetti.',
    'The flashcard flips in 3D to its translation (CSS 3D, tap); a fade under Reduce Motion.',
  ],
  kids: [
    'A tapped activity tile grows to full screen and shrinks back to its place on exit (MK.morph).',
    'A piece follows the finger and springs into its slot, or back if it is wrong (MK.drag, MK.fling).',
  ],
  'media-streaming': [
    'The mini player grows into Now Playing; the cover is the shared element (MK.morph) and the ground crossfades to the cover\'s sampled colour.',
    'Showcase, never navigation: the library as a coverflow of real covers (scroll-snap with animation-timeline view(inline), rotateY up to 55deg); a flat list under Reduce Motion.',
    'Skip: the next cover slides in and the old one leaves, title and time swap, and the up-next count rolls (MK.flip, MK.roll).',
  ],
  'news-reading': [
    'An article card expands into the reader (MK.morph); the large headline shrinks into the nav title as you scroll (animation-timeline: scroll()).',
    'Saving an article flies its thumbnail to the Saved tab (MK.flip).',
  ],
  'ai-assistant': [
    'The sent prompt rises out of the composer and becomes the first message (MK.flip).',
    'Send morphs into Stop while an answer is running and back when it ends (MK.morph).',
    'A source chip expands into its source card (MK.morph).',
  ],
  utilities: [
    'The captured frame shrinks into the result card and the result figure rolls in (MK.morph, MK.roll).',
    'Swapping units trades the two values\' places and rolls the result (MK.flip, MK.roll).',
  ],
  'creative-tools': [
    'A control becomes a detented dial: ticks pass the marker and a loupe above the finger shows the value (MK.drag, a haptic tick at each detent).',
    'A project thumbnail expands into the editor canvas (MK.morph); export collapses back to a progress ring on the same thumbnail.',
    'A before and after divider reveals the original as you drag it (MK.drag, clip-path inset).',
  ],
  'smart-home': [
    'The device tile expands into its control surface; the dimmer arc fills to the lamp\'s real brightness and the glow takes its real colour (MK.morph, SVG arc).',
    'A sent command shows the status chip as pending, then settled or failed in place (MK.morph on the chip).',
  ],
  healthcare: [
    'The next appointment card expands into its details with the join button pinned (MK.morph shared element).',
    'A result\'s range marker settles on the value once, with no overshoot (CSS transition, MK.ease.effects).',
  ],
  'real-estate': [
    'The map pin grows into the listing card and sheet, and the photo is the shared element into detail (MK.morph); dragging the sheet down returns it to the pin.',
    'Saving a listing fills the heart and flies its photo to the Saved tab (MK.flip).',
    'The photo pager shows a count and the header collapses as you scroll (animation-timeline: scroll()).',
  ],
  'games-companion': [
    'A reward flies from the result into the inventory counter, which rolls (MK.flip, MK.roll), only at a real milestone.',
    'A card is thrown to its slot on release velocity and springs back if it misses (MK.drag, MK.fling).',
    'The collectible flips in 3D to its back with a tilt highlight (CSS 3D, MK.tilt); a flat swap under Reduce Motion.',
  ],
  'b2b-field': [
    'Completing a job moves its row to Done and the list closes the gap in under 150 ms (MK.flip); the sync count rolls (MK.roll).',
    'A captured photo shrinks into the job\'s attachment strip with a visible queued then sent state (MK.morph).',
  ],
  'government-civic': [
    'A tapped service card expands into its first step (MK.morph); status steps fill in order when the real state changes (CSS transition).',
    'The ID card flips in 3D to its back on tap (CSS 3D); a fade under Reduce Motion.',
  ],
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
  // a night product never gets an electric blue or a signal orange (the UX check bans glare at bedtime)
  const accents = d.accents.filter((a) => a[app] != null && (niche !== 'wellness-meditation' || !/blue|orange/.test(a.n) || /mist/.test(a.n)));
  const accent = accents[Math.floor(r() * accents.length)];
  const sig = Math.floor(r() * d.signatures.length);
  const pool = MOTION[niche].map((m, i) => i).filter((i) => !MOTION[niche][i].startsWith('Showcase'));
  const mot = pool[Math.floor(r() * pool.length)]; // drawn last, so the direction, face, accent and detail of earlier versions stay the same
  return { id, face, accent, sig, mot, key: `${id}|${face.n}|${accent.n}|${sig}|${mot}` };
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
    signature: { chosen: MOTION[niche][hand.mot], all: MOTION[niche] }, detail: { chosen: d.signatures[hand.sig], all: d.signatures }, bad: d.bad, rules: d.rules, layout: LAYOUT,
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
  L.push('', `Imagery      ${h.imagery}`, `Signature    ${h.signature.chosen}`, `  or         ${h.signature.all.filter((s) => s !== h.signature.chosen).join('\n             ')}`,
    `Detail       ${h.detail.chosen}`, `  or         ${h.detail.all.filter((s) => s !== h.detail.chosen).join('\n             ')}`, `Bad version  ${h.bad}`);
  if (h.rules.length) L.push('Rules        ' + h.rules.join('\n             '));
  L.push('', 'Signature: the one morph of real content that carries the task. Inline assets/motion-kit.js, make it interruptible, give it a Reduce Motion variant. Detail: the small motion character; it is not a second signature.');
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
  const tech = /MK\.|CSS|shape\(|animation-timeline|SVG|clip-path/;
  for (const id of nicheIds) {
    const m = MOTION[id];
    assert.ok(Array.isArray(m) && m.length >= 2 && m.length <= 3, `${id}: needs 2 or 3 motions`);
    for (const t of m) assert.ok(typeof t === 'string' && t.length > 40 && tech.test(t), `${id}: motion names no technique: ${t}`);
  }
  assert.deepStrictEqual(Object.keys(MOTION).sort(), [...nicheIds].sort(), 'MOTION and NICHES list the same niches');
  const motSeen = new Set();
  for (let i = 0; i < 200; i++) { const h = deal('m' + i, 'dating'); assert.ok(MOTION.dating.includes(h.signature.chosen) && h.detail.all.includes(h.detail.chosen)); motSeen.add(h.signature.chosen); }
  assert.strictEqual(motSeen.size, MOTION.dating.length, 'every dating motion is reachable');
  for (let i = 0; i < 100; i++) assert.ok(!deal('s' + i, 'media-streaming').signature.chosen.startsWith('Showcase'), 'a showcase is never the signature');
  const seen = { d: new Set(), f: new Set() };
  for (let i = 0; i < 300; i++) { const h = deal('seed' + i, 'food-delivery'); seen.d.add(h.direction.id); seen.f.add(h.typeface.family); }
  assert.ok(seen.d.size >= 2, 'food-delivery should reach at least 2 directions');
  assert.ok(seen.f.size >= 3, 'food-delivery should reach at least 3 faces');
  for (const n of nicheIds) for (const p of ['ios', 'android', 'both']) assert.ok(render(deal('x', n, p)).length > 200);
  console.log(`self-test ok (${Object.keys(DIRECTIONS).length} directions, ${nicheIds.length} niches, ${nicheIds.reduce((n, id) => n + MOTION[id].length, 0)} niche motions)`);
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
