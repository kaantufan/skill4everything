#!/usr/bin/env node
// Counts "generated-UI tells" in mobile source so a person or agent can review them.
// Deterministic regex scan, no network. Signatures mirror references/slop-tells.md.
// Rules marked block: true are the type and symbol fingerprints (italic headings, eyebrows, edge bars, dot labels, glyph icons, arrow buttons, 01 02 03,
// icon tiles, stock-metaphor icons). Their hits print first, in their own group, and make the exit code 1: fix them before reporting.
// Exit codes: 0 no blocking hit, 1 a blocking hit (or a tier-1 hit with --strict), 2 usage error.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import assert from 'node:assert/strict';

const USAGE = `Usage: node slop-scan.mjs <dir-or-file>... [--json] [--strict] [--max N] [--help] [--self-test]
  --json       print hits as a JSON array only
  --strict     also exit 1 when there is at least one tier-1 hit
  --max N      sample lines shown per rule (default 5)
  --self-test  check every rule against its own sample lines
Blocking hits (rules with block: true) are printed first and always exit 1.
Exit codes: 0 ok, 1 blocking hit or tier-1 hit with --strict, 2 usage error.`;

const SKIP_DIRS = new Set(['node_modules', '.git', 'build', 'dist', 'Pods', '.dart_tool', '.gradle', 'DerivedData', '.expo', '.next', 'vendor']);
// html: mockups get the cross-stack rules only
const STACKS = { '.swift': 'swift', '.kt': 'kotlin', '.dart': 'dart', '.tsx': 'rn', '.jsx': 'rn', '.ts': 'rn', '.js': 'rn', '.html': 'html', '.htm': 'html' };
const THEME_HINTS = ['theme', 'color', 'colour', 'token', 'typography', 'palette', '/type'];
const TIERS = ['', 'Tier 1 - anyone notices', 'Tier 2 - a designer or developer notices', 'Tier 3 - craft gaps'];

// A neutral light grey (#ccc, #ddd, #eee, #d1d1d6, #e5e5ea, #e0e0e0): a placeholder colour, never a photo's colour.
const NEUTRAL_GREY = /^#[c-e][0-9a-f]{5}$/i;
const SLOT_CLASS = /(?:^|[^a-z])(?:photo|img|image|cover|art(?![a-z])|artwork|thumb|avatar|hero|map)/i;
// Heuristic, not a parser: finds neutral-grey backgrounds in CSS rules and inline styles whose class or id names a slot.
// shortcut: regex over the file text, upgrade to a CSS parser if it misfires on real projects
function greySlots(text) {
  const neutral = (hex) => {
    const h = hex.length === 4 ? '#' + [...hex.slice(1)].map((c) => c + c).join('') : hex;
    if (h.length !== 7 || !NEUTRAL_GREY.test(h)) return false;
    const ch = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    return Math.max(...ch) - Math.min(...ch) <= 8;
  };
  // a custom property holding a grey (--slot: #e3e3e8) counts as that grey wherever var(--slot) is used as a background
  const vars = new Map();
  for (const m of text.matchAll(/(--[\w-]+)\s*:\s*(#[0-9a-f]{3,6})\b/gi)) vars.set(m[1], [...(vars.get(m[1]) ?? []), m[2]]);
  const grey = (decl) => [...decl.matchAll(/background(?:-color)?\s*:\s*(?:(#[0-9a-f]{3,6})\b|var\((--[\w-]+))/gi)].some((m) => (m[1] ? neutral(m[1]) : (vars.get(m[2]) ?? []).some(neutral)));
  const lineOf = (i) => text.slice(0, i).split('\n').length;
  const hits = [];
  // the selector length cap keeps this linear on long runs such as data URIs
  for (const m of text.matchAll(/([^{}<>]{1,300})\{([^{}]*)\}/g)) {
    const sel = m[1].replace(/\/\*[\s\S]*?\*\//g, '').trim();
    if (SLOT_CLASS.test(sel) && grey(m[2])) hits.push({ line: lineOf(m.index + m[1].length), text: `${sel} { ${m[2].trim()} }`.replace(/\s+/g, ' ').slice(0, 100) });
  }
  for (const m of text.matchAll(/<[a-z][^>]*>/gi)) {
    const attr = (name) => (m[0].match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, 'i')) || [])[1] || '';
    const style = attr('style');
    if (style && SLOT_CLASS.test(`${attr('class')} ${attr('id')}`) && grey(style)) hits.push({ line: lineOf(m.index), text: m[0].replace(/\s+/g, ' ').slice(0, 100) });
  }
  return hits;
}

// Motion rules. Loading states (spinners, skeletons, progress, typing dots) may loop and stagger; everything else is slop unless it shows a state change.
// shortcut: regex over CSS blocks and JS lines, no parser or data flow; upgrade if it misfires on real projects
const LOADING = /skel|\bsk\b|spin|load|busy|progress|indeterminate|breath|typing|record/i;
const cssBlocks = (text) => [...text.matchAll(/([^{}<>]{1,300})\{([^{}]*)\}/g)].map((m) => ({
  sel: m[1].replace(/\/\*[\s\S]*?\*\//g, '').trim(), body: m[2], line: text.slice(0, m.index + m[1].length).split('\n').length,
}));
const blockHit = (b) => ({ line: b.line, text: `${b.sel} { ${b.body.trim()} }`.replace(/\s+/g, ' ').slice(0, 100) });
const lineHits = (text, re) => [...text.matchAll(re)].map((m) => ({ line: text.slice(0, m.index).split('\n').length, text: m[0].replace(/\s+/g, ' ').slice(0, 100) }));

// Delay computed from an index, three or more nth-child delays, or three or more inline delays: a list entering one row after another.
function staggerScan(text) {
  const blocks = cssBlocks(text).filter((b) => !LOADING.test(b.sel));
  const computed = blocks.filter((b) => /(?:animation|transition)(?:-delay)?\s*:[^;]*calc\([^;]*(?:var\(--[\w-]+\)[^;]*\*|\*[^;]*var\(--[\w-]+\))/i.test(b.body));
  const nth = blocks.filter((b) => /:nth-(?:child|of-type)\(\s*\d+\s*\)/.test(b.sel) && /(?:animation|transition)-delay\s*:\s*(?!0(?:s|ms)?\s*(?:;|$))\S/i.test(b.body.trim()));
  const inline = lineHits(text, /<[a-z][^>]*style\s*=\s*"[^"]*(?:animation|transition)-delay\s*:[^"]*"/gi);
  return [...computed.map(blockHit), ...(nth.length >= 3 ? nth.map(blockHit) : []), ...(inline.length >= 3 ? inline : [])];
}
// Infinite animation outside a loading state. Spin and rotate keyframes are exempt as spinners.
function infiniteScan(text) {
  return [
    ...cssBlocks(text).filter((b) => !LOADING.test(b.sel) && /animation(?:-iteration-count)?\s*:[^;]*\binfinite\b/i.test(b.body) && !/animation(?:-name)?\s*:[^;]*\b(?:spin|rot|rotate)\b/i.test(b.body)).map(blockHit),
    ...lineHits(text, /iterations\s*:\s*Infinity/g),
  ];
}
// Typewriter: steps() on a clipped box, a keyframe named for typing, or text built one character at a time.
function typewriterScan(text) {
  return [
    ...cssBlocks(text).filter((b) => !LOADING.test(b.sel) && /animation[^;]*steps\(\s*\d+/i.test(b.body) && /overflow\s*:\s*hidden|white-space\s*:\s*nowrap|border-right/i.test(b.body)).map(blockHit),
    ...lineHits(text, /@keyframes\s+(?:typewriter|typing|type)\b/gi),
    ...lineHits(text, /(?:textContent|innerText|innerHTML)\s*(?:\+=\s*[\w.]+(?:\[|\.charAt\()|=\s*[\w.]+\.(?:slice|substring)\(\s*0\s*,\s*(?:\+\+\w+|\w+\+\+|\w+\s*\+\s*1))/g),
  ];
}
// Count-up: a figure written from a frame or interval loop as Math.round(target * progress), or the CSS @property counter trick.
function countUpScan(text) {
  const loop = lineHits(text, /(?:textContent|innerText|innerHTML|\.value)\s*=\s*[^;\n]*Math\.(?:round|floor|trunc|ceil)\([^;\n]*\*[^;\n]*\)/g)
    .filter((h) => /requestAnimationFrame|setInterval/.test(text.split('\n').slice(Math.max(0, h.line - 8), h.line + 4).join('\n')));
  return [...loop, ...lineHits(text, /counter-(?:reset|set)\s*:\s*[\w-]+\s*var\(--/g)];
}

// Type and symbol rules. A tiny HTML tree plus a simple CSS matcher (last compound of each selector only): enough to ask "is this text inside a heading",
// "what is this element's text-transform" or "is this icon inside a tinted round box". Hits keep the line of the offending element.
// shortcut: no combinators, specificity or cascade order beyond source order; upgrade to a real parser if it misfires on real projects
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const ICON_CLASS = /(?:^|\s)(?:ph|ph-[\w-]+|ti|ti-[\w-]+|bi|bi-[\w-]+|fa[a-z]?|fa-[\w-]+|icon|icon-[\w-]+|material-[\w-]+|lucide|iconify)(?:\s|$)/;
const ENT = { rarr: '\u2192', larr: '\u2190', uarr: '\u2191', darr: '\u2193', times: '\u00d7', minus: '\u2212', hellip: '\u2026', bull: '\u2022', rsaquo: '\u203a', lsaquo: '\u2039', raquo: '\u00bb', laquo: '\u00ab', check: '\u2713', starf: '\u2605', star: '\u2606', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decode = (s) => s.replace(/&(?:#(\d+)|#x([0-9a-f]+)|(\w+));/gi, (m, d, h, n) => {
  const c = d ? +d : h ? parseInt(h, 16) : -1;
  return c < 0 ? ENT[n.toLowerCase()] ?? m : c <= 0x10FFFF ? String.fromCodePoint(c) : m; // fromCodePoint throws above U+10FFFF
});
// Markup built in scripts: backtick or quoted strings that contain a tag are parsed as extra fragments (nested templates may pair up wrongly)
function fragments(text) {
  const out = [];
  for (const sm of text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)) {
    const base = text.slice(0, sm.index + sm[0].indexOf('>') + 1).split('\n').length;
    for (const m of sm[1].matchAll(/`(?:[^`\\]|\\.)*`|'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"/g)) {
      if (!/<[a-z][\w-]*[\s>/]/i.test(m[0])) continue;
      out.push({ s: m[0].slice(1, -1).replace(/\$\{[^}]*\}/g, ' ').replace(/\\(["'`])/g, '$1'), line: base + sm[1].slice(0, m.index).split('\n').length - 1 });
    }
  }
  return out;
}
function parseHtml(text) {
  const clean = text.replace(/<!--[\s\S]*?-->|<(script|style)\b[\s\S]*?<\/\1\s*>/gi, (m) => m.replace(/[^\n]/g, ' '));
  const root = { tag: '#root', attrs: {}, cls: [], kids: [], parent: null, line: 1, depth: 0 };
  const all = [];
  const tokenize = (str, line0) => {
    let cur = root;
    const lineAt = (i) => line0 + str.slice(0, i).split('\n').length - 1;
    for (const m of str.matchAll(/<(\/?)([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>|([^<]+)/g)) {
      if (m[4] !== undefined) { cur.kids.push({ text: decode(m[4]), parent: cur, line: lineAt(m.index) }); continue; }
      const tag = m[2].toLowerCase();
      if (m[1]) {
        for (let p = cur; p && p !== root; p = p.parent) if (p.tag === tag) { cur = p.parent; break; }
        continue;
      }
      const attrs = {};
      for (const a of m[3].matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) attrs[a[1].toLowerCase()] = a[2] ?? a[3] ?? a[4] ?? '';
      const el = { tag, attrs, cls: (attrs.class || '').split(/\s+/).filter(Boolean), kids: [], parent: cur, line: lineAt(m.index), depth: cur.depth + 1 };
      cur.kids.push(el);
      all.push(el);
      if (!VOID.has(tag) && !m[3].trimEnd().endsWith('/') && el.depth < 400) cur = el; // deeper elements stay siblings, so the recursive walks cannot overflow the stack
    }
  };
  tokenize(clean, 1);
  for (const f of fragments(text)) tokenize(f.s, f.line);
  const rules = [], pseudo = [], vars = new Map();
  for (const m of text.matchAll(/(--[\w-]+)\s*:\s*([^;}]+)/g)) vars.set(m[1], m[2].trim());
  const decls = (body) => {
    const d = {};
    for (const part of body.split(';')) {
      const i = part.indexOf(':');
      if (i < 0) continue;
      let v = part.slice(i + 1).replace(/!important/i, '').trim();
      v = v.replace(/var\(\s*(--[\w-]+)[^)]*\)/g, (s, n) => vars.get(n) ?? s);
      d[part.slice(0, i).trim().toLowerCase()] = v;
    }
    return d;
  };
  for (const b of cssBlocks(text)) {
    if (b.sel.startsWith('@')) continue;
    for (const part of b.sel.split(',')) {
      const last = part.trim().split(/[\s>+~]+/).pop();
      const pm = /^(.*?)::(before|after)$/.exec(last);
      if (!pm && last.includes(':')) continue;
      const cm = /^([a-z][\w-]*)?((?:[.#][\w-]+)*)$/i.exec(pm ? pm[1] : last);
      if (!cm) continue;
      const classes = [...cm[2].matchAll(/\.([\w-]+)/g)].map((x) => x[1]);
      const id = (cm[2].match(/#([\w-]+)/) || [])[1];
      const rule = { sel: part.trim(), tag: cm[1]?.toLowerCase(), classes, id, d: decls(b.body), line: b.line };
      if (pm) pseudo.push({ ...rule, which: pm[2] }); else rules.push(rule);
    }
  }
  return { root, all, rules, pseudo, decls };
}
let parsedMemo;
const parsed = (text) => (parsedMemo?.text === text ? parsedMemo.p : (parsedMemo = { text, p: parseHtml(text) }).p);
const styleOf = (p, el) => {
  const s = {};
  for (const r of p.rules) if ((!r.tag || r.tag === el.tag) && r.classes.every((c) => el.cls.includes(c)) && (!r.id || r.id === el.attrs.id)) Object.assign(s, r.d);
  if (el.attrs.style) Object.assign(s, p.decls(el.attrs.style));
  return s;
};
const textOf = (n) => (n.text !== undefined ? n.text : n.kids.map(textOf).join(' ')).replace(/\s+/g, ' ').trim();
const elKids = (el) => el.kids.filter((k) => k.tag);
const ancestors = (el, n = 99) => { const out = []; for (let p = el.parent; p && p.tag !== '#root' && out.length < n; p = p.parent) out.push(p); return out; };
const nextEl = (el) => { const k = el.parent.kids; for (let i = k.indexOf(el) + 1; i < k.length; i++) { if (k[i].tag) return k[i]; if (k[i].text.trim()) return null; } return null; };
const ctx = (el) => `${el.cls.join(' ')} ${el.attrs['aria-label'] || ''} ${el.attrs.title || ''} ${el.attrs.role || ''} ${el.attrs['data-state'] || ''}`;
const hitOf = (el, text) => ({ line: el.line, text: `<${el.tag}${el.cls.length ? ` class="${el.cls.join(' ')}"` : ''}> ${text ?? textOf(el)}`.slice(0, 100) });
const px = (v) => { const m = /^(-?[\d.]+)(px|em|rem|%)?$/.exec((v || '').trim()); if (!m) return null; return m[2] === 'em' || m[2] === 'rem' ? Number(m[1]) * 16 : Number(m[1]); };
const isIcon = (el) => ((el.tag === 'i' || el.tag === 'span') && ICON_CLASS.test(el.cls.join(' '))) || el.tag === 'svg' || el.tag === 'ion-icon';

const HEADING = (el) => /^h[1-4]$/.test(el.tag) || el.cls.some((c) => /(?:^|-)(?:title|heading|headline|display|h[1-4])(?:-|$)/i.test(c));
const LABELISH = (el) => el.cls.some((c) => /(?:^|-)(?:label|chip|pill|badge|tab|btn|button|eyebrow|kicker|overline|tag|cta)(?:-|$)/i.test(c));
const QUOTEISH = /quote|review|testimonial|lyric|transcript|bubble|message|comment/i;

// font-style italic (or a default-italic em, i, cite) inside a heading, title class or UI label
function italicScan(text) {
  const p = parsed(text), hits = [], hit = new Set();
  for (const el of p.all) {
    if (el.tag === 'i' && (isIcon(el) || !textOf(el))) continue;
    if (!textOf(el)) continue;
    const fs = styleOf(p, el)['font-style'];
    const italic = fs ? /italic|oblique/.test(fs) : ['em', 'i', 'cite'].includes(el.tag);
    if (!italic) continue;
    const chain = [el, ...ancestors(el)];
    if (chain.some((a) => QUOTEISH.test(a.cls.join(' ')) || ['blockquote', 'q'].includes(a.tag))) continue;
    if (!chain.some((a) => HEADING(a) || LABELISH(a))) continue;
    if (chain.slice(1).some((a) => hit.has(a))) continue;
    hit.add(el);
    hits.push(hitOf(el));
  }
  return hits;
}

const EYEBROW_CLASS = /(?:^|-)(?:eyebrow|kicker|overline|supertitle|pretitle|preheading|surtitle)(?:-|$)/i;
// A small label above a heading that is tracked uppercase or named eyebrow/kicker/overline; or those class names used twice
function eyebrowScan(text) {
  const p = parsed(text), hits = [], named = [];
  for (const el of p.all) {
    const t = textOf(el);
    if (!t || t.length > 40 || elKids(el).some((k) => textOf(k) && !isIcon(k))) continue;
    const named1 = el.cls.some((c) => EYEBROW_CLASS.test(c));
    if (named1) named.push(el);
    const s = styleOf(p, el), size = px(s['font-size']), ls = s['letter-spacing'] || '';
    const upper = /uppercase/.test(s['text-transform'] || '') || (/[A-Z]{3}/.test(t) && !/[a-z]/.test(t));
    const tracked = /^[\d.]+em$/.test(ls) ? parseFloat(ls) >= 0.04 : /^[\d.]+px$/.test(ls) ? parseFloat(ls) >= 0.5 : false;
    const heading = nextEl(el);
    if (heading && HEADING(heading) && (named1 || (upper && tracked && (size === null || size <= 14)))) hits.push(hitOf(el));
  }
  return named.length >= 2 ? [...new Map([...hits, ...named.map((e) => hitOf(e))].map((h) => [h.line + h.text, h])).values()] : hits;
}

const TEXTISH = /(?:^|[^a-z])(?:h[1-6]|title|heading|headline|label|stat|metric|figure|quote|blockquote|pull|caption|eyebrow|kicker|subtitle|lede|callout|note)(?:[^a-z]|$)/i;
const CONNECTOR = /(?:^|[^a-z])(?:timeline|step|connector|rail|divider|separator|thread|progress|track|route|leg|segment)/i;
// A thin vertical bar on one edge: border-left/right of 2px or more, an inset shadow, or a narrow ::before/::after. Split into text (heading, label, stat, quote) and card.
function sideBars(text) {
  const p = parsed(text), out = [];
  const edge = (d) => {
    for (const k of ['border-left', 'border-right', 'border-inline-start', 'border-inline-end']) {
      const m = /^([\d.]+)px\s+solid\b/.exec((d[k] || '').trim());
      if (m && Number(m[1]) >= 2) return k;
    }
    return /inset\s+-?[2-9]px\s+0\s+0\s+\S/.test(d['box-shadow'] || '') ? 'box-shadow' : null;
  };
  for (const r of p.rules) {
    const k = edge(r.d);
    if (!k || CONNECTOR.test(r.sel)) continue;
    out.push({ kind: TEXTISH.test(r.sel) ? 'text' : 'card', line: r.line, text: `${r.sel} { ${k} }` });
  }
  for (const r of p.pseudo) {
    const w = px(r.d.width), h = px(r.d.height);
    const bar = w !== null && w >= 2 && w <= 6 && (h === null ? /top|bottom|inset/.test(Object.keys(r.d).join(' ')) : h >= 10 || /%/.test(r.d.height));
    if (bar && /^["']{2}$/.test(r.d.content || '""') && !CONNECTOR.test(r.sel) && (TEXTISH.test(r.sel) || /card|row|item|panel|tile|alert|banner|sheet/i.test(r.sel))) out.push({ kind: TEXTISH.test(r.sel) ? 'text' : 'card', line: r.line, text: `${r.sel} { bar ${r.d.width} }` });
  }
  for (const el of p.all) {
    const k = el.attrs.style && edge(p.decls(el.attrs.style));
    if (k && !CONNECTOR.test(ctx(el))) out.push({ kind: TEXTISH.test(ctx(el) + el.tag) ? 'text' : 'card', line: el.line, text: `<${el.tag} style> ${k}` });
  }
  return out;
}

const DOT_OWNER = /(?:^|[^a-z])(?:eyebrow|kicker|overline|label|tag|chip|pill|badge|caption|section|heading|title|meta|live|now)(?:[^a-z]|$)/i;
const DOT_OK = /unread|online|presence|notif|legend|swatch|(?:^|-)key(?:-|$)|rating|step|marker|indicator|radio|check|toggle|switch|avatar|tab|page|pin|map|route|stop|timeline|progress|record|status|series|open|closed|avail/i;
const BULLET = /^["'][\u2022\u25cf\u25e6\u2219\u25cb\u2b24]["']$/;
// A decorative dot or bullet in front of (or after) a small label
function dotLabelScan(text) {
  const p = parsed(text), hits = [];
  // a dot whose colour changes with a state (open and closed, unread and read) or is a semantic colour marks a real state
  const base = (r) => r.sel.replace(/^.*[\s>+~]/, '');
  const stateful = (r) => /positive|negative|success|danger|warn|error|green|red/i.test(r.d.background || '') || p.pseudo.some((o) => o !== r && base(o) === base(r) && o.d.background !== r.d.background);
  for (const r of p.pseudo) {
    const w = px(r.d.width), h = px(r.d.height), round = /50%|999/.test(r.d['border-radius'] || '');
    const dot = (/^["']{2}$/.test(r.d.content || '') && w !== null && w <= 10 && h !== null && h <= 10 && round) || BULLET.test(r.d.content || '');
    if (dot && DOT_OWNER.test(r.sel) && !DOT_OK.test(r.sel) && !stateful(r)) hits.push({ line: r.line, text: `${r.sel} { dot }` });
  }
  for (const el of p.all) {
    if (!el.cls.some((c) => /^(?:dot|bullet|pip|blip)$/i.test(c)) || textOf(el) || el.parent.tag === '#root' || /background/.test(el.attrs.style || '')) continue;
    const par = el.parent, firstKid = par.kids.find((k) => k.tag || k.text.trim());
    if (firstKid !== el || !textOf(par) || textOf(par).length > 30 || par.tag === 'li') continue;
    if (DOT_OWNER.test(ctx(par)) && !DOT_OK.test(ctx(par))) hits.push(hitOf(par));
  }
  return hits;
}

const GLYPH = '\u2713\u2714\u2715\u2716\u2717\u2718\u2726\u2727\u2605\u2606\u25c6\u25c7\u25c8\u25a0\u25a1\u25b2\u25bc\u25b3\u25bd\u25b6\u25c0\u25b8\u25c2\u26a1\u266a\u266b\u2219\u22ef\u2304\u2303\u2191\u2193\u2197\u2198\u2190\u2192\u21bb\u27f3\u23f5\u23f8\u2261\u22ee\u271a\u2733\u2734\u2756\u00bb\u00ab\u203a\u2039\u279c\u2794\u27a4\u27f6';
const ARROW_END = /[\u2192\u2197\u2198\u279c\u2794\u27a4\u27f6\u00bb\u203a\u25b8\u25b6]$/;
const ARROW_START = /^[\u2190\u2039\u00ab\u25c2\u25c0]/;
const DONE = /(?:^|[^a-z])(?:selected|checked|done|complete|completed|receipt|delivered|paid|picked|chosen)(?:[^a-z]|$)/i;
const RATING = /rating|stars?(?:[^a-z]|$)|review|score|rated/i;
const CTA = (el) => ['button', 'a'].includes(el.tag) || el.attrs.role === 'button' || el.cls.some((c) => /(?:^|-)(?:cta|btn|button|link|more|action)(?:-|$)/i.test(c));
// Classify every text node that starts or ends with a symbol glyph: arrows on call-to-action text, dots, and glyphs standing in for icons
function glyphScan(text) {
  const p = parsed(text), cta = [], icons = [], dots = [], trend = [];
  const walk = (n) => {
    if (n.text === undefined) { n.kids.forEach(walk); return; }
    const t = n.text.replace(/\s+/g, ' ').trim(), par = n.parent;
    if (!t || par.tag === '#root') return;
    const first = t[0], last = t[t.length - 1], rest = [ctx(par), ...ancestors(par, 3).map(ctx)].join(' ');
    const h = { line: n.line, text: `<${par.tag}> ${t}`.slice(0, 100) };
    const sole = [...t].length <= 3 && [...t].every((c) => GLYPH.includes(c) || '\u00d7\u2212\u2026'.includes(c));
    const ratingOk = (c) => '\u2605\u2606'.includes(c) && (RATING.test(rest) || /^[\u2605\u2606]+\s*\d|\d[.,]?\d?\s*[\u2605\u2606]+$/.test(t));
    const doneOk = (c) => '\u2713\u2714'.includes(c) && DONE.test(rest);
    if (/^[\u2022\u25cf\u25cb\u25e6\u2b24]/.test(t) && !sole) { if (par.tag !== 'li') dots.push(h); return; }
    if (sole) {
      const c = t[0];
      if ('\u2212\u00d7\u2026'.includes(c) && !CTA(par)) return;
      const sib = par.parent ? par.parent.kids.filter((k) => k.tag || k.text.trim()) : [], at = sib.indexOf(par);
      if ('\u2192\u2190'.includes(c) && at > 0 && at < sib.length - 1 && textOf(sib[at - 1]) && textOf(sib[at + 1])) return;
      if (!ratingOk(c) && !doneOk(c)) icons.push(h);
      return;
    }
    if ((ARROW_END.test(t) || ARROW_START.test(t)) && CTA(par)) { cta.push(h); return; }
    if (GLYPH.includes(first)) {
      if (ratingOk(first) || doneOk(first)) return;
      if (/^[\u25b2\u25bc\u2191\u2193\u2197\u2198]\s*[+\u2212-]?\s*\d/.test(t)) trend.push(h); else icons.push(h);
      return;
    }
    if (GLYPH.includes(last) && !ratingOk(last) && !doneOk(last)) icons.push(h);
  };
  walk(p.root);
  return { cta, dots, icons: [...icons, ...(trend.length >= 3 ? trend : [])] };
}
const glyphMemo = { text: null, r: null };
const glyphs = (text) => (glyphMemo.text === text ? glyphMemo.r : ((glyphMemo.text = text), (glyphMemo.r = glyphScan(text))));

// 01 02 03 as labels. A leading zero is almost never a real quantity; two or more, or an 01/04 counter, is decoration.
function numberedScan(text) {
  const p = parsed(text), hits = [];
  const walk = (n) => {
    if (n.text === undefined) { n.kids.forEach(walk); return; }
    const t = n.text.trim();
    if (n.parent.tag === '#root') return;
    if (/^0[1-9]$/.test(t) && !/time|clock|date|score|amount|price/i.test(ctx(n.parent))) hits.push({ line: n.line, text: `<${n.parent.tag}> ${t}`, n: Number(t) });
    else if (/^0[1-9]\s*\/\s*0?[1-9]\d?$/.test(t)) hits.push({ line: n.line, text: `<${n.parent.tag}> ${t}`, n: 99 });
  };
  walk(p.root);
  return hits.some((h) => h.n === 99) || (hits.some((h) => h.n === 1) && hits.some((h) => h.n === 2)) ? hits : [];
}

const SETTINGS = /settings|prefs|preferences|grouped|inset-?list|menu-?list/i;
// An icon alone inside a tinted rounded box that is not a control; the rule asks for three of them
function iconTileScan(text) {
  const p = parsed(text), hits = [];
  for (const el of p.all) {
    if (!['div', 'span'].includes(el.tag) || el.attrs.onclick || el.attrs.role === 'button' || el.attrs.tabindex !== undefined) continue;
    const kids = elKids(el);
    if (kids.length !== 1 || !isIcon(kids[0]) || el.kids.some((k) => k.text !== undefined && k.text.trim())) continue;
    if (/btn|button|play|fab|ctrl|action|close|back|share|speak|toggle/i.test(el.cls.join(' '))) continue;
    if (ancestors(el).some((a) => ['button', 'a', 'nav', 'summary'].includes(a.tag) || SETTINGS.test(a.cls.join(' ')) || /tab-?bar|tabs|toolbar/i.test(a.cls.join(' ')))) continue;
    const s = styleOf(p, el), bg = s.background || s['background-color'] || '', r = s['border-radius'] || '';
    if (!bg || /^(?:none|transparent|inherit)$/.test(bg.trim()) || !(/%|999/.test(r) || px(r.split(/\s+/)[0]) >= 8)) continue;
    hits.push(hitOf(el, `icon ${kids[0].cls.join(' ') || kids[0].tag}`));
  }
  return hits;
}

const STOCK = /(?:^|[-_])(?:sparkles?|magic(?:[-_]wand)?|wand|rocket(?:[-_]launch)?|lightning|zap|bolt|flame|fire|leaf|leaves|seedling|shield[-_]check|shield[-_]checkmark|trend(?:ing)?[-_]up|chart[-_]line[-_]up|auto[-_]awesome|flash[-_]on|local[-_]fire[-_]department|eco|verified[-_]user)(?:[-_]|$)/i;
// An icon that depicts the thing named beside it is not a metaphor: a fire for a wood stove, a leaf for a vegan dish, a bolt for charging
const HEAT = /stove|fire|heat|grill|bbq|barbecue|kcal|calor|energy/i, VOLT = /charg|electric|power|flash|battery/i, GREEN = /vegan|vegetarian|salad|herb|garden|plant|tree|leaf/i;
const LITERAL = { fire: HEAT, flame: HEAT, leaf: GREEN, leaves: GREEN, seedling: GREEN, bolt: VOLT, lightning: VOLT, zap: VOLT };
// A stock-metaphor icon used as decoration, outside a control or navigation
function stockIconScan(text) {
  const p = parsed(text), hits = [];
  for (const el of p.all) {
    if (!isIcon(el) && !el.attrs['data-lucide']) continue;
    const names = [...el.cls, el.attrs['data-lucide'] || '', el.cls.some((c) => c.startsWith('material-')) ? textOf(el) : ''].filter((c) => c && !/^(?:ph|ti|bi|fa[a-z]?|icon|material-[\w-]+|ph-fill|ph-bold|ph-duotone)$/.test(c));
    const stem = names.map((c) => STOCK.exec(c.replace(/^(?:ph|ti|bi|fa)-/, ''))).find(Boolean);
    if (!stem) continue;
    const near = [el.parent, el.parent.parent].filter((a) => a && a.tag !== '#root').map(textOf).find((s) => s && s.length <= 120) ?? '';
    if (LITERAL[stem[0].replace(/^[-_]|[-_]$/g, '').toLowerCase()]?.test(near)) continue;
    if (ancestors(el).some((a) => ['button', 'nav', 'summary'].includes(a.tag) || a.attrs.role === 'tab' || a.attrs.role === 'button' || /tab-?bar|tabs|toolbar|(?:^|-)(?:btn|button|nav|fab)(?:-|$)/i.test(a.cls.join(' ')))) continue;
    hits.push(hitOf(el, `icon ${names.join(' ')}`));
  }
  return hits;
}

// min = matching lines a file needs before the rule reports it; yes/no are self-test samples.
// A rule with scan(text) instead of re looks at the whole file (multi-line CSS) and returns [{ line, text }].
const RULES = [
  { id: 'template-purple', tier: 1, stacks: ['all'], re: /(?:#|0x(?:ff)?)(?:6366F1|8B5CF6|7C3AED|A855F7|4F46E5|667EEA|764BA2|6750A4|6650A4|D0BCFF)\b/i,
    msg: 'Template purple left in place', yes: 'val primary = Color(0xFF6750A4)', no: 'val primary = Color(0xFF1B4D3E)' },
  { id: 'emoji-in-ui', tier: 1, stacks: ['all'], re: /(?![\u2605\u2606\u2713-\u2718\u2726\u2727\u266a\u266b])[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u,
    msg: 'Emoji used in UI source (text-style glyphs such as check, cross, star and note belong to unicode-icons)', yes: 'Text("\u{1F680} Launch")', no: 'Text("Launch")' },
  { id: 'placeholder-data', tier: 1, stacks: ['all'], re: /lorem ipsum|john doe|jane doe|jane smith|\bitem 1\b|pravatar|dicebear|picsum\.photos/i,
    msg: 'Placeholder data or stock avatars', yes: 'Text("Lorem ipsum dolor")', no: 'Text("Order summary")' },
  { id: 'build-note', tier: 1, stacks: ['all'], re: /in the (?:native )?build\b|goes here\b|buraya gelir|\(MapKit|\bTODO\b|from catalog\)|asset needed|photo needed/i,
    msg: 'A note for the builder shows on screen: image slots carry no text, notes go in the report', yes: '<span>Map tiles here (MapKit in the build)</span>', no: '<div class="slot" role="img" aria-label="Restaurant photo"></div>' },
  { id: 'fake-greeting', tier: 1, stacks: ['all'], re: /welcome back|good (?:morning|afternoon|evening)/i,
    msg: 'Greeting header instead of content', yes: 'Text("Welcome back, Alex")', no: 'Text("Resume chapter 3")' },
  { id: 'vague-error', tier: 2, stacks: ['all'], re: /\boops\b|something went wrong/i,
    msg: 'Error copy that names neither the problem nor the fix', yes: 'Text("Oops! Try again")', no: 'Text("Could not save. Check your connection.")' },
  { id: 'filler-copy', tier: 2, stacks: ['all'], re: /\b(?:seamless|effortless|supercharge|unlock your|elevate your|all-in-one|next[- ]level)/i,
    msg: 'Filler marketing copy', yes: 'Text("Seamlessly manage money")', no: 'Text("Add expense")' },
  { id: 'model-favourite-font', tier: 1, stacks: ['all'], re: /(?:font-?family|family=|GoogleFonts\.|Font\.custom\(|FontFamily\()[^;\n]{0,80}?(?:Inter\b|Fraunces|Instrument[ +](?:Serif|Sans)|Playfair|Space[ +]Grotesk|DM[ +](?:Sans|Serif)|Bricolage|Plus[ +]Jakarta|Manrope|Sora\b|Outfit\b|Syne\b|Poppins|Montserrat|Geist|Figtree|Barlow[ +]Condensed)/i,
    msg: 'Typeface from the short list models reach for: use the dealt face', yes: "font-family: 'Fraunces', serif;", no: "font-family: 'Literata', serif;" },
  { id: 'middot-chain', tier: 2, stacks: ['all'], min: 4, re: / \u00b7 /,
    msg: 'Metadata chained with middle dots', yes: 'Text("Kafe \u00b7 12:40")', no: 'Text("Kafe, 12:40")' },
  // The threshold leaves room for hand-drawn SVG charts, rings and sparklines; this rule targets icon paths.
  { id: 'drawn-icons', tier: 2, stacks: ['html'], min: 12, re: /<svg\b/,
    msg: 'Many inline SVGs: icons belong to a real icon set, not to hand-written paths (a few hand-drawn charts are fine)', yes: '<svg viewBox="0 0 24 24">', no: '<i class="ph ph-house"></i>' },
  { id: 'lucide-icons', tier: 2, stacks: ['all'], re: /(?:src|href)\s*=\s*["'][^"']*lucide|data-lucide\s*=|from ['"]lucide-react/i,
    msg: 'Lucide is the default icon set of generated UI: use the direction\'s set', yes: '<script src="https://unpkg.com/lucide@latest"></script>', no: '<i class="ph ph-house"></i>' },
  { id: 'gradient-text', tier: 1, stacks: ['html'], re: /background-clip:\s*text/i,
    msg: 'Gradient text', yes: '-webkit-background-clip: text;', no: 'background-clip: border-box;' },
  { id: 'fingernail-card', tier: 2, block: true, stacks: ['html'], scan: (t) => sideBars(t).filter((b) => b.kind === 'card'),
    msg: 'Cards, rows or alerts with a coloured edge bar ("fingernail" cards: border-left/right of 2px or more, inset shadow, narrow pseudo-element): use weight, background or position',
    yes: '.card { border-left: 4px solid #6c5ce7; }', no: '.card { border-left: 1px solid #ddd; }',
    also: [{ t: '.row { border-right: 3px solid red; }', hit: true }, { t: '.row { box-shadow: inset 3px 0 0 #c33; }', hit: true }, { t: '.step { border-left: 2px solid #ccc; }', hit: false }] },
  { id: 'grey-slot', tier: 1, stacks: ['html'], scan: greySlots,
    msg: 'Neutral grey fill on a photo, cover, avatar, hero or map slot (heuristic): use real material and a coloured fallback near the photo', yes: '.cover { background: #ddd; }', no: '.cover { background: #8a5a3c; }' },
  { id: 'random-avatar-service', tier: 2, stacks: ['all'], re: /randomuser\.me|ui-avatars\.com/i,
    msg: 'Avatar service: use a real portrait from the imagery list, cropped to faces', yes: '<img src="https://randomuser.me/api/portraits/women/44.jpg">', no: '<img src="photo.jpg">' },
  { id: 'glow', tier: 2, stacks: ['html'], re: /filter:\s*blur\(\s*(?:[2-9]\d|\d{3,})px/,
    msg: 'Blurred glow', yes: 'filter: blur(46px);', no: 'filter: blur(2px);' },
  { id: 'light-gradient', tier: 2, stacks: ['html'], min: 2, re: /radial-gradient\(/,
    msg: 'Radial gradients used as lighting', yes: 'background: radial-gradient(circle at 20% 0, #fff, #000);', no: 'background: #123456;' },

  { id: 'motion-stagger', tier: 2, stacks: ['html'], scan: staggerScan,
    msg: 'Staggered entrance: rows delayed one after another (a list appears at once; delays only for a real sequence)',
    yes: '.row { animation: rise .4s calc(var(--i) * 60ms) both; }', no: '.row { animation: rise .4s both; }',
    also: [{ t: '.a:nth-child(1){animation-delay:.1s}\n.a:nth-child(2){animation-delay:.2s}\n.a:nth-child(3){animation-delay:.3s}', hit: true },
      { t: '.a:nth-child(1){animation-delay:.1s}\n.a:nth-child(2){animation-delay:.2s}', hit: false },
      { t: '.typing span:nth-child(1){animation-delay:.1s}\n.typing span:nth-child(2){animation-delay:.2s}\n.typing span:nth-child(3){animation-delay:.3s}', hit: false },
      { t: '<i style="animation-delay:.1s"></i><i style="animation-delay:.2s"></i><i style="animation-delay:.3s"></i>', hit: true }] },
  { id: 'motion-stagger-code', tier: 2, stacks: ['all'], re: /(?:animation|transition)Delay\s*=[^;\n]*\*|\.delay\(\s*Double\(\s*(?:index|idx|i)\b|delayMillis\s*=\s*\w*(?:index|idx|i)\s*\*|\bInterval\(\s*(?:index|idx|i)\s*\*|setTimeout\([^;\n]*,\s*(?:index|idx|i)\s*\*\s*\d|\bdelay:\s*(?:index|idx|i)\s*\*|\bstagger\(/,
    msg: 'Delay computed from the item index (staggered entrance)', yes: "row.style.animationDelay = i * 60 + 'ms';", no: "row.style.animationDelay = '0ms';",
    also: [{ t: '.delay(Double(index) * 0.05)', hit: true }, { t: 'delayMillis = index * 50', hit: true }, { t: 'Interval(index * 0.1, 1)', hit: true }] },
  { id: 'motion-infinite', tier: 2, stacks: ['html'], min: 2, scan: infiniteScan,
    msg: 'Perpetual animation outside a loading state (float, pulse, glow, drift): loops only while something is in progress',
    yes: '.orb { animation: float 6s ease-in-out infinite; }', no: '.spinner { animation: spin .7s linear infinite; }',
    also: [{ t: '.skel { animation: pulse 1.4s infinite; }', hit: false }, { t: '[data-state="loading"] .map { animation: pulse 1.4s infinite alternate; }', hit: false },
      { t: '.hero { animation-iteration-count: infinite; }', hit: true }, { t: 'el.animate(k, { duration: 3000, iterations: Infinity });', hit: true }, { t: '.dial { animation: spin 2s infinite; }', hit: false }] },
  { id: 'motion-typewriter', tier: 2, stacks: ['html'], scan: typewriterScan,
    msg: 'Typewriter text', yes: '.h1 { overflow: hidden; white-space: nowrap; animation: typing 2s steps(24) forwards; }', no: '.ring { animation: tick 1s steps(12) infinite; }',
    also: [{ t: 'setInterval(() => { el.textContent += txt[i++]; }, 60);', hit: true }, { t: 'el.textContent = txt.slice(0, n++);', hit: true }, { t: "el.innerHTML = words.slice(0, 3).join('');", hit: false }, { t: '@keyframes typewriter { to { width: 100%; } }', hit: true },
      { t: 'el.textContent = fmt(S.t);', hit: false }] },
  { id: 'motion-count-up', tier: 2, stacks: ['html'], scan: countUpScan,
    msg: 'Count-up on load: a figure counts from zero (count only for one real first reveal, otherwise roll the changed digits)',
    yes: 'function f(t){ el.textContent = Math.round(to * e); requestAnimationFrame(f); }', no: 'el.textContent = Math.round(to * e);',
    also: [{ t: "setInterval(() => { el.textContent = Math.floor(n * p) + '%'; }, 30);", hit: true }, { t: '.n { counter-set: num var(--num); }', hit: true },
      { t: 'setInterval(() => { S.t++; el.textContent = fmt(S.t); }, 1000);', hit: false }] },

  // Type and symbol fingerprints (references/slop-tells.md). block: true rules must be clean before the work is reported.
  { id: 'italic-heading', tier: 2, block: true, stacks: ['html'], scan: italicScan,
    msg: 'Italic in a heading, title or UI label (an italic word, or a whole italic headline): set it roman',
    yes: '<h1>Plan your <em>week</em></h1>', no: '<h1>Plan your week</h1><p>Read <em>Persuasion</em> again</p>',
    also: [{ t: '<style>.hero-title i { font-style: italic; }</style><h1 class="hero-title">Sleep <i>better</i></h1>', hit: true },
      { t: '<h2 style="font-style:italic">Today</h2>', hit: true },
      { t: '<h2>Settings <i class="ph ph-gear"></i></h2>', hit: false },
      { t: '<blockquote class="quote"><h3><em>Quoted</em></h3></blockquote>', hit: false },
      { t: '<style>h1 em { font-style: normal; }</style><h1>One <em>word</em></h1>', hit: false },
      { t: '<span class="chip" style="font-style: italic">New</span>', hit: true }] },
  { id: 'italic-heading-swift', tier: 2, block: true, stacks: ['swift'], re: /\.(?:largeTitle|title[23]?|headline)\.italic\(\)|\.font\([^\n]{0,200}\.(?:largeTitle|title[23]?|headline)[^\n]{0,200}\)[^\n]{0,200}\.italic\(\)|\.italic\(\)[^\n]{0,200}\.font\(\.(?:largeTitle|title[23]?|headline)/,
    msg: 'Italic on a title or headline style', yes: 'Text("Week").font(.largeTitle).italic()', no: 'Text("Week").font(.largeTitle).bold()',
    also: [{ t: '.font(.title.italic())', hit: true }, { t: 'Text(note).font(.footnote).italic()', hit: false }] },
  { id: 'italic-heading-compose', tier: 2, block: true, stacks: ['kotlin'], re: /(?:headline|title|display)\w*[^\n]{0,200}FontStyle\.Italic|FontStyle\.Italic[^\n]{0,200}(?:headline|title|display)/i,
    msg: 'Italic on a headline, title or display text style', yes: 'headlineLarge = TextStyle(fontStyle = FontStyle.Italic),', no: 'headlineLarge = TextStyle(fontWeight = FontWeight.SemiBold),',
    also: [{ t: 'bodySmall = TextStyle(fontStyle = FontStyle.Italic)', hit: false }] },
  { id: 'italic-heading-flutter', tier: 2, block: true, stacks: ['dart'], re: /(?:headline|title|display)\w*[^\n]{0,200}FontStyle\.italic|FontStyle\.italic[^\n]{0,200}(?:headline|title|display)/i,
    msg: 'Italic on a headline, title or display text style', yes: 'headlineLarge: TextStyle(fontStyle: FontStyle.italic),', no: 'headlineLarge: TextStyle(fontWeight: FontWeight.w600),',
    also: [{ t: 'bodySmall: TextStyle(fontStyle: FontStyle.italic)', hit: false }] },
  { id: 'italic-heading-rn', tier: 2, block: true, stacks: ['rn'], re: /(?:title|heading|headline|display|header)\w*[^\n]{0,200}fontStyle:\s*['"]italic['"]|fontStyle:\s*['"]italic['"][^\n]{0,200}(?:title|heading|headline|display|header)/i,
    msg: 'Italic on a title or heading style', yes: "title: { fontSize: 28, fontStyle: 'italic' },", no: "title: { fontSize: 28, fontWeight: '600' },",
    also: [{ t: "caption: { fontStyle: 'italic' }", hit: false }] },
  { id: 'eyebrow-label', tier: 2, block: true, stacks: ['html'], scan: eyebrowScan,
    msg: 'Eyebrow or kicker: a small tracked-uppercase (or eyebrow-named) label above a heading. Drop it; the heading says it',
    yes: '<style>.k { text-transform: uppercase; letter-spacing: .12em; font-size: 11px; }</style><div class="k">Today</div><h1>Plan</h1>', no: '<style>.k { text-transform: uppercase; letter-spacing: .12em; font-size: 11px; }</style><div class="k">Cellular data</div><ul><li>Roaming</li></ul>',
    also: [{ t: '<span class="eyebrow">Sleep</span><h2>Wind down</h2>', hit: true },
      { t: '<p class="eyebrow">A</p><p>x</p><p class="eyebrow">B</p><p>y</p>', hit: true },
      { t: '<p class="eyebrow">A</p><p>x</p>', hit: false },
      { t: '<div style="text-transform:uppercase;letter-spacing:1px;font-size:11px">Tuesday</div><div class="title">Morning run</div>', hit: true },
      { t: '<div style="font-size:11px">Tuesday</div><div class="title">Morning run</div>', hit: false }] },
  { id: 'heading-rule', tier: 2, block: true, stacks: ['html'], scan: (t) => sideBars(t).filter((b) => b.kind === 'text'),
    msg: 'Vertical bar or rule on the edge of a heading, label, stat or quote (border-left/right, inset shadow or a narrow pseudo-element): no bar, use size, weight or position',
    yes: 'blockquote { border-left: 3px solid #c9a; }', no: 'blockquote { border-top: 1px solid #ddd; }',
    also: [{ t: '.stat-label::before { content: ""; position: absolute; left: 0; width: 3px; height: 100%; }', hit: true },
      { t: '.title { border-right: 2px solid red; }', hit: true },
      { t: '.timeline::before { content: ""; width: 2px; height: 100%; }', hit: false },
      { t: '.grab::before { content: ""; width: 36px; height: 5px; }', hit: false },
      { t: '.card { border-left: 3px solid red; }', hit: false }] },
  { id: 'dot-label', tier: 2, block: true, stacks: ['html'], scan: (t) => [...dotLabelScan(t), ...glyphs(t).dots],
    msg: 'Decorative dot or bullet in front of a small label (a "live" dot, a bullet before a kicker): a dot only marks a real state such as unread or online',
    yes: '<style>.tag::before { content: ""; width: 6px; height: 6px; border-radius: 50%; }</style><span class="tag">Now open</span>', no: '<style>.unread::before { content: ""; width: 8px; height: 8px; border-radius: 50%; }</style><span class="unread">Mail</span>',
    also: [{ t: '<div class="eyebrow"><span class="dot"></span> Live now</div>', hit: true }, { t: '<div class="label">\u25cf Live</div>', hit: true },
      { t: '<div class="status"><span class="dot"></span> Online</div>', hit: false }, { t: '<p class="label"><span class="dot" style="background:var(--tax)"></span>Tax</p>', hit: false }, { t: '<style>.open::before { content: ""; width: 8px; height: 8px; border-radius: 50%; background: green; }</style><span class="tag open">Open</span>', hit: false }, { t: '<li>\u2022 Eggs</li>', hit: false }] },
  { id: 'unicode-icons', tier: 2, block: true, stacks: ['html'], scan: (t) => glyphs(t).icons,
    msg: 'Unicode glyph standing in for an icon (check, cross, star, diamond, triangle, arrow, bolt, note): use the dealt icon set. Allowed: a star in a rating, a check in a selected or done state, an arrow between two place names',
    yes: '<li>\u2713 Unlimited rides</li>', no: '<li class="done">\u2713 Booked</li>',
    also: [{ t: '<button>\u2715</button>', hit: true }, { t: '<li>&#10003; Free</li>', hit: true }, { t: '<span class="stars">\u2605\u2605\u2605\u2605\u2606</span>', hit: false }, { t: '<span>4.8 \u2605</span>', hit: false },
      { t: '<div>\u2605 Favourite</div>', hit: true }, { t: '<div class="route">IST \u2192 LHR</div>', hit: false }, { t: '<div>Beta \u2726</div>', hit: true },
      { t: '<p>3 \u00d7 5 km</p>', hit: false }, { t: '<span>\u25b2 4%</span><span>\u25bc 2%</span>', hit: false }, { t: '<div><b>IST</b><span>\u2192</span><b>LHR</b></div>', hit: false }, { t: '<div><span>\u2192</span></div>', hit: true },
      { t: '<span>\u25b2 4%</span><span>\u25bc 2%</span><span>\u25b2 9%</span>', hit: true }, { t: '<a>Back \u203a</a>', hit: false }] },
  { id: 'arrow-cta', tier: 2, block: true, stacks: ['html'], scan: (t) => glyphs(t).cta,
    msg: 'Arrow glyph on a button or link label ("Get started \u2192", "See all \u203a"): the label is a verb and an object, the chevron is an icon from the dealt set',
    yes: '<button>Get started \u2192</button>', no: '<button>Get started</button>',
    also: [{ t: '<a class="more">See all \u203a</a>', hit: true }, { t: '<button>Get started &rarr;</button>', hit: true }, { t: '<button>\u2190 Back</button>', hit: true }, { t: '<div class="route">IST \u2192 LHR</div>', hit: false }] },
  { id: 'numbered-labels', tier: 2, block: true, stacks: ['html'], scan: numberedScan,
    msg: 'Numbered 01 02 03 labels (or an 01/04 counter): use plain numbers for a real sequence, nothing for a list',
    yes: '<span>01</span><h3>Plan</h3><span>02</span><h3>Train</h3>', no: '<span>1</span><h3>Plan</h3><span>2</span><h3>Train</h3>',
    also: [{ t: '<span>01</span><h3>Plan</h3>', hit: false }, { t: '<span class="pager">01 / 04</span>', hit: true }, { t: '<time>07:12</time>', hit: false }] },
  { id: 'icon-tiles', tier: 2, block: true, stacks: ['html'], min: 3, scan: iconTileScan,
    msg: 'Icon in a tinted rounded box beside rows, stats or headings (three or more): drop the box, or keep one consistent system only inside a settings-style list',
    yes: '<style>.ic { background: #e8f0ff; border-radius: 10px; }</style><div class="ic"><i class="ph ph-bell"></i></div>', no: '<style>.ic { background: #e8f0ff; border-radius: 10px; }</style><div class="ic">AB</div>',
    also: [{ t: '<style>.ic { background: #eef; border-radius: 50%; }</style><div class="settings"><div class="ic"><i class="ph ph-bell"></i></div></div>', hit: false },
      { t: '<style>.ic { background: #eef; border-radius: 12px; }</style><button class="ic"><i class="ph ph-x"></i></button>', hit: false },
      { t: '<style>.ic { background: #eef; border-radius: 12px; }</style><div class="ic"><i class="ph ph-x"></i></div><div class="ic"><i class="ph ph-x"></i></div>', hit: true }] },
  { id: 'stock-metaphor-icons', tier: 2, block: true, stacks: ['html'], scan: stockIconScan,
    msg: 'Stock-metaphor icon used as decoration (sparkles for AI, rocket, lightning, flame, leaf, shield-check, trending-up): name the thing in text, or use the platform symbol for the concept. Allowed inside a button, tab or nav',
    yes: '<div class="card"><i class="ph ph-sparkle"></i> Insights</div>', no: '<div class="card"><i class="ph ph-moon"></i> Sleep</div>',
    also: [{ t: '<nav><a><i class="ph-fill ph-flame"></i></a></nav>', hit: false }, { t: '<span class="material-symbols-outlined">auto_awesome</span>', hit: true },
      { t: '<i class="ti ti-trending-up"></i>', hit: true }, { t: '<i data-lucide="rocket"></i>', hit: true }, { t: '<div class="row"><i class="ph ph-fire"></i><b>Wood stove</b></div>', hit: false }, { t: '<div class="row"><i class="ph ph-fire"></i><b>Streak</b></div>', hit: true }, { t: '<div class="row"><i class="ph ph-leaf"></i><b>Vegan</b></div>', hit: false }, { t: '<button><i class="ph ph-lightning"></i></button>', hit: false }] },
  { id: 'unicode-glyph-code', tier: 2, block: true, stacks: ['swift', 'kotlin', 'dart', 'rn'], re: /["'`]\s*[\u2192\u2197\u2198\u2190\u2715\u2716\u2726\u25b2\u25bc\u25b6\u25cf\u25c6\u266a\u203a\u00bb][^"'`\n]*["'`]|["'`][^"'`\n]*[\u2192\u2197\u2198\u2715\u2716\u2726\u25b2\u25bc\u25b6\u25cf\u25c6\u266a\u203a\u00bb]\s*["'`]|>\s*[\u2192\u2197\u2715\u2726\u25cf\u25c6\u203a][^<>\n]*<|>[^<>\n]*[\u2192\u2197\u2715\u2726\u25cf\u25c6\u203a]\s*</,
    msg: 'Unicode glyph at the start or end of a string: use the platform symbol set (SF Symbols, Material Symbols) as an icon',
    yes: 'Text("Get started \u2192")', no: 'Text("Get started")', also: [{ t: 'Text("IST \u2192 LHR")', hit: false }] },
  { id: 'stock-icon-code', tier: 2, block: true, stacks: ['swift', 'kotlin', 'dart'], re: /systemName:\s*"(?:bolt|flame|leaf|brain|bolt\.fill|flame\.fill|leaf\.fill|checkmark\.shield(?:\.fill)?|chart\.line\.uptrend\.xyaxis|arrow\.up\.right)"|Icons\.(?:\w+\.)?(?:Bolt|FlashOn|LocalFireDepartment|Eco|RocketLaunch|VerifiedUser|TrendingUp)\b|Icons\.(?:bolt|flash_on|local_fire_department|eco|rocket_launch|verified_user|trending_up)\b/,
    msg: 'Stock-metaphor symbol (bolt, flame, leaf, shield-check, trending-up, rocket) used as decoration: name the thing in text, or use the platform symbol the system apps use for that concept',
    yes: 'Image(systemName: "flame.fill")', no: 'Image(systemName: "figure.run")', also: [{ t: 'Icon(Icons.Default.TrendingUp, null)', hit: true }, { t: 'Icon(Icons.rocket_launch)', hit: true }] },

  { id: 'swift-fixed-font', tier: 2, stacks: ['swift'], re: /\.font\(\.system\(size:/,
    msg: 'Fixed font size instead of a text style', yes: '.font(.system(size: 14))', no: '.font(.body)' },
  { id: 'swift-screen-bounds', tier: 2, stacks: ['swift'], re: /UIScreen\.main/,
    msg: 'Layout from screen size', yes: 'let w = UIScreen.main.bounds.width', no: 'let w = proxy.size.width' },
  { id: 'swift-hardcoded-inset', tier: 2, stacks: ['swift'], re: /\.padding\(\.top,\s*(?:44|47|50|54|59)\b/,
    msg: 'Hard-coded status bar or safe-area inset', yes: '.padding(.top, 59)', no: '.padding(.top, 16)' },
  { id: 'swift-colour-literal', tier: 2, stacks: ['swift'], themeExempt: true, re: /\bColor\.(?:white|black)\b|\bColor\(red:/,
    msg: 'Colour literal outside the theme', yes: '.background(Color.white)', no: '.background(Color("Surface"))' },
  { id: 'swift-gradient', tier: 1, stacks: ['swift'], min: 3, re: /LinearGradient\(/,
    msg: 'Gradient used more than twice in one file', yes: 'LinearGradient(colors: [a, b], startPoint: .top, endPoint: .bottom)', no: 'RadialGradient(colors: [a, b])' },
  { id: 'swift-gradient-text', tier: 1, stacks: ['swift'], re: /foregroundStyle\(\s*LinearGradient/,
    msg: 'Gradient text', yes: '.foregroundStyle( LinearGradient(colors: c))', no: '.foregroundStyle(.secondary)' },
  { id: 'swift-custom-header', tier: 2, stacks: ['swift'], re: /navigationBarBackButtonHidden\(true\)|\.navigationBarHidden\(true\)|\.toolbar\(\.hidden,\s*for:\s*\.navigationBar/,
    msg: 'Native navigation bar hidden or replaced', yes: '.navigationBarBackButtonHidden(true)', no: '.navigationTitle("Inbox")' },
  { id: 'swift-sparkle', tier: 1, stacks: ['swift'], re: /systemName:\s*"(?:sparkles|sparkle|wand\.and\.stars)"/,
    msg: 'Sparkle icon', yes: 'Image(systemName: "sparkles")', no: 'Image(systemName: "tray")' },
  { id: 'swift-tap-gesture', tier: 3, stacks: ['swift'], re: /\.onTapGesture/,
    msg: 'Tap gesture where a Button may belong', yes: '.onTapGesture { open() }', no: 'Button("Open") { open() }' },
  { id: 'swift-one-radius', tier: 2, stacks: ['swift'], min: 6, re: /cornerRadius(?::\s*|\()16\b/,
    msg: 'Same corner radius repeated across the file', yes: 'RoundedRectangle(cornerRadius: 16)', no: '.cornerRadius(10)' },

  { id: 'compose-template-colours', tier: 1, stacks: ['kotlin'], re: /\b(?:Purple40|Purple80|PurpleGrey40|PurpleGrey80|Pink40|Pink80)\b/,
    msg: 'Compose template colours left in place', yes: 'primary = Purple80,', no: 'primary = Moss600,' },
  { id: 'compose-fixed-font', tier: 2, stacks: ['kotlin'], themeExempt: true, re: /fontSize\s*=\s*\d+(?:\.\d+)?\.sp\b/,
    msg: 'Fixed font size outside the typography file', yes: 'Text("Hi", fontSize = 14.sp)', no: 'style = MaterialTheme.typography.bodyLarge' },
  { id: 'compose-colour-literal', tier: 2, stacks: ['kotlin'], themeExempt: true, re: /\bColor\.(?:White|Black)\b|\bColor\(0x[0-9A-Fa-f]{8}\)/,
    msg: 'Colour literal outside the theme', yes: 'color = Color.White', no: 'color = MaterialTheme.colorScheme.surface' },
  { id: 'compose-gradient', tier: 1, stacks: ['kotlin'], min: 3, re: /Brush\.(?:linear|vertical|horizontal)Gradient/,
    msg: 'Gradient used more than twice in one file', yes: 'Brush.verticalGradient(listOf(a, b))', no: 'SolidColor(a)' },
  { id: 'compose-one-radius', tier: 2, stacks: ['kotlin'], min: 6, re: /RoundedCornerShape\(16\.dp\)/,
    msg: 'Same corner radius repeated across the file', yes: 'shape = RoundedCornerShape(16.dp)', no: 'shape = RoundedCornerShape(8.dp)' },
  { id: 'compose-sparkle', tier: 1, stacks: ['kotlin'], re: /Icons\.(?:Default|Filled|Rounded|Outlined)\.AutoAwesome/,
    msg: 'Sparkle icon', yes: 'Icon(Icons.Default.AutoAwesome, null)', no: 'Icon(Icons.Default.Search, null)' },

  { id: 'flutter-template-colours', tier: 1, stacks: ['dart'], re: /Colors\.deepPurple|seedColor:\s*Colors\.(?:purple|indigo|blue)\b/,
    msg: 'Flutter template seed colour left in place', yes: 'ColorScheme.fromSeed(seedColor: Colors.deepPurple)', no: 'ColorScheme.fromSeed(seedColor: brandMoss)' },
  { id: 'flutter-fixed-font', tier: 2, stacks: ['dart'], themeExempt: true, re: /TextStyle\(.*fontSize:\s*\d/,
    msg: 'Fixed font size outside the theme', yes: 'style: TextStyle(fontSize: 14),', no: 'style: Theme.of(context).textTheme.bodyMedium,' },
  { id: 'flutter-colour-literal', tier: 2, stacks: ['dart'], themeExempt: true, re: /\bColors\.(?:white|black|grey)(?![A-Za-z])|\bColor\(0x[0-9A-Fa-f]{8}\)/,
    msg: 'Colour literal outside the theme', yes: 'color: Colors.white,', no: 'color: scheme.surface,' },
  { id: 'flutter-gradient', tier: 1, stacks: ['dart'], min: 3, re: /LinearGradient\(/,
    msg: 'Gradient used more than twice in one file', yes: 'gradient: LinearGradient(colors: [a, b]),', no: 'color: scheme.surface,' },
  { id: 'flutter-one-radius', tier: 2, stacks: ['dart'], min: 6, re: /BorderRadius\.circular\(16(?:\.0)?\)/,
    msg: 'Same corner radius repeated across the file', yes: 'borderRadius: BorderRadius.circular(16),', no: 'borderRadius: BorderRadius.circular(8),' },
  { id: 'flutter-wrong-uniform', tier: 2, stacks: ['dart'], re: /Cupertino(?:Switch|AlertDialog)\(/,
    msg: 'Cupertino widget: check it is behind a platform branch', yes: 'CupertinoSwitch(value: on, onChanged: set)', no: 'Switch.adaptive(value: on, onChanged: set)' },
  { id: 'flutter-bare-tap', tier: 3, stacks: ['dart'], re: /\bGestureDetector\(/,
    msg: 'GestureDetector where a button or InkWell may belong', yes: 'GestureDetector(onTap: open, child: row)', no: 'InkWell(onTap: open, child: row)' },
  { id: 'flutter-bounce', tier: 2, stacks: ['dart'], re: /Curves\.(?:bounce|elastic)/,
    msg: 'Bounce or elastic curve on UI', yes: 'curve: Curves.elasticOut,', no: 'curve: Curves.easeOutCubic,' },
  { id: 'flutter-template-residue', tier: 1, stacks: ['dart'], re: /Flutter Demo|You have pushed the button/,
    msg: 'Template text left in place', yes: "title: 'Flutter Demo',", no: "title: 'Tidewatch'," },
  { id: 'flutter-sparkle', tier: 1, stacks: ['dart'], re: /Icons\.auto_awesome/,
    msg: 'Sparkle icon', yes: 'Icon(Icons.auto_awesome)', no: 'Icon(Icons.search)' },

  { id: 'rn-touchable', tier: 2, stacks: ['rn'], re: /\bTouchable(?:Opacity|Highlight)\b/,
    msg: 'Legacy Touchable instead of Pressable', yes: '<TouchableOpacity onPress={go}>', no: '<Pressable onPress={go}>' },
  { id: 'rn-hover', tier: 1, stacks: ['rn'], re: /onMouseEnter|cursor:\s*['"]pointer['"]/,
    msg: 'Hover or cursor styling in a touch UI', yes: "style={{ cursor: 'pointer' }}", no: 'onPressIn={() => setPressed(true)}' },
  { id: 'rn-hardcoded-inset', tier: 2, stacks: ['rn'], re: /\b(?:paddingTop|marginTop):\s*(?:44|47|50|54|59)\b|StatusBar\.currentHeight/,
    msg: 'Hard-coded status bar or safe-area inset', yes: 'paddingTop: 44,', no: 'paddingTop: insets.top,' },
  { id: 'rn-screen-bounds', tier: 2, stacks: ['rn'], re: /Dimensions\.get\(/,
    msg: 'Layout from screen size', yes: "const { width } = Dimensions.get('window');", no: 'const { width } = useWindowDimensions();' },
  { id: 'rn-custom-header', tier: 2, stacks: ['rn'], re: /headerShown:\s*false/,
    msg: 'Native header hidden: check it is not rebuilt by hand', yes: 'options={{ headerShown: false }}', no: 'options={{ title: "Inbox" }}' },
  { id: 'rn-drawer', tier: 1, stacks: ['rn'], re: /createDrawerNavigator/,
    msg: 'Drawer as primary navigation', yes: 'const Drawer = createDrawerNavigator();', no: 'const Tab = createBottomTabNavigator();' },
  { id: 'rn-colour-literal', tier: 2, stacks: ['rn'], themeExempt: true, re: /backgroundColor:\s*['"]#(?:fff|ffffff|000|000000)['"]/i,
    msg: 'Colour literal outside the theme', yes: "backgroundColor: '#FFF',", no: 'backgroundColor: colors.surface,' },
  // Opening tags only: counting the import and closing tag would report a single gradient.
  { id: 'rn-gradient', tier: 1, stacks: ['rn'], min: 3, re: /<LinearGradient\b/,
    msg: 'Gradient used more than twice in one file', yes: '<LinearGradient colors={[a, b]} style={s.bg}>', no: '<View style={s.bg}>' },
  { id: 'rn-side-stripe', tier: 2, stacks: ['rn'], re: /borderLeft(?:Width|Color)/,
    msg: 'Coloured side stripe', yes: 'borderLeftWidth: 4,', no: 'borderBottomWidth: 1,' },
  { id: 'rn-grand-entrance', tier: 2, stacks: ['rn'], re: /FadeIn(?:Down|Up)|\.delay\(\s*(?:index|i)\b/,
    msg: 'Staggered entrance animation', yes: 'entering={FadeInDown.delay(index * 80)}', no: 'entering={FadeIn}' },
  { id: 'rn-dead-control', tier: 2, stacks: ['rn'], re: /onPress=\{\s*\(\s*\)\s*=>\s*\{\s*\}\s*\}/,
    msg: 'Control with an empty handler', yes: '<Pressable onPress={() => {}}>', no: '<Pressable onPress={() => save()}>' },
  { id: 'rn-web-font', tier: 2, stacks: ['rn'], re: /fontFamily:\s*['"]Inter['"]/,
    msg: 'Web font reflex: check the platform face is not better', yes: "fontFamily: 'Inter',", no: 'fontFamily: Platform.select({ ios: "System" }),' },
  { id: 'rn-template-residue', tier: 1, stacks: ['rn'], re: /Open up App|Welcome to React Native/,
    msg: 'Template text left in place', yes: '<Text>Open up App.js to start working</Text>', no: '<Text>Tide table</Text>' },
];

const ascii = (s) => s.replace(/[^\x20-\x7e]/gu, (c) => `\\u{${c.codePointAt(0).toString(16)}}`);

function display(abs) {
  const rel = relative(process.cwd(), abs);
  return (rel.startsWith('..') ? abs : rel).replace(/\\/g, '/');
}

function collect(p, out) {
  const st = statSync(p);
  if (st.isDirectory()) {
    for (const e of readdirSync(p, { withFileTypes: true })) {
      if (e.isSymbolicLink() || (e.isDirectory() && SKIP_DIRS.has(e.name))) continue;
      collect(join(p, e.name), out);
    }
  } else if (st.size <= 1024 * 1024 && STACKS[extname(p).toLowerCase()] && !/\.(?:g|freezed)\.dart$/.test(p)) out.add(p);
}

function scanFile(abs, stack) {
  const file = display(abs);
  const exempt = THEME_HINTS.some((h) => `/${file.toLowerCase()}`.includes(h));
  const rules = RULES.filter((r) => (r.stacks[0] === 'all' || r.stacks.includes(stack)) && !(r.themeExempt && exempt));
  const found = rules.map(() => []);
  const text = readFileSync(abs, 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((raw, i) => {
    const t = raw.trim();
    if (!t || t.length > 2000 || t.includes('slop-ok') || t.startsWith('//') || t.startsWith('*')) return;
    rules.forEach((r, k) => {
      if (r.re?.test(t)) found[k].push({ rule: r.id, tier: r.tier, block: !!r.block, file, line: i + 1, text: ascii(t.replace(/\s+/g, ' ').slice(0, 100)) });
    });
  });
  rules.forEach((r, k) => {
    if (r.scan) for (const h of r.scan(text)) if (!lines[h.line - 1]?.includes('slop-ok')) found[k].push({ rule: r.id, tier: r.tier, block: !!r.block, file, line: h.line, text: ascii(h.text) });
  });
  return rules.flatMap((r, k) => (found[k].length >= (r.min ?? 1) ? found[k] : []));
}

function selfTest() {
  try {
    const ids = new Set();
    for (const r of RULES) {
      assert.ok(!ids.has(r.id), `duplicate id ${r.id}`);
      ids.add(r.id);
      assert.ok(r.tier >= 1 && r.tier <= 3, `${r.id}: tier must be 1..3`);
      assert.ok(r.block === undefined || r.block === true, `${r.id}: block is true or absent`);
      if (r.scan) {
        assert.ok(r.scan(r.yes).length > 0, `${r.id}: yes sample must match`);
        assert.ok(r.scan(r.no).length === 0, `${r.id}: no sample must not match`);
        for (const c of r.also ?? []) assert.equal(r.scan(c.t).length > 0, c.hit, `${r.id}: extra sample ${c.hit ? 'must' : 'must not'} match: ${c.t.slice(0, 50)}`);
        continue;
      }
      assert.ok(!r.re.global && !r.re.sticky, `${r.id}: regex must not be global or sticky`);
      assert.ok(r.re.test(r.yes), `${r.id}: yes sample must match`);
      assert.ok(!r.re.test(r.no), `${r.id}: no sample must not match`);
      for (const c of r.also ?? []) assert.ok(r.re.test(c.t) === c.hit, `${r.id}: extra sample ${c.hit ? 'must' : 'must not'} match: ${c.t.slice(0, 50)}`);
    }
    console.log(`self-test ok (${RULES.length} rules)`);
    return 0;
  } catch (e) {
    console.error(`self-test FAILED: ${e.message}`);
    return 1;
  }
}

function usage(msg) {
  console.error(`${msg}\n${USAGE}`);
  return 2;
}

function main(argv) {
  const paths = [];
  let json = false, strict = false, max = 5;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') { console.log(USAGE); return 0; }
    if (a === '--self-test') return selfTest();
    if (a === '--json') json = true;
    else if (a === '--strict') strict = true;
    else if (a === '--max') {
      max = Number(argv[++i]);
      if (!Number.isInteger(max) || max < 0) return usage('--max needs a whole number');
    } else if (a.startsWith('--')) return usage(`unknown option ${a}`);
    else paths.push(a);
  }
  if (!paths.length) return usage('no path given');

  const files = new Set();
  for (const p of paths) {
    if (!existsSync(p)) return usage(`path not found: ${p}`);
    collect(resolve(p), files);
  }
  const counts = { swift: 0, kotlin: 0, dart: 0, rn: 0, html: 0 };
  const hits = [];
  let skipped = 0;
  for (const f of [...files].sort()) {
    const stack = STACKS[extname(f).toLowerCase()];
    counts[stack]++;
    try { hits.push(...scanFile(f, stack)); } catch (e) { skipped++; console.error(`skipped ${display(f)}: ${e.message}`); }
  }

  const tierCount = (t) => hits.filter((h) => h.tier === t).length;
  const blocking = hits.filter((h) => h.block).length;
  if (json) {
    console.log(JSON.stringify(hits, null, 2));
  } else {
    console.log(`Scanned ${files.size} files (swift ${counts.swift}, kotlin ${counts.kotlin}, dart ${counts.dart}, rn ${counts.rn}, html ${counts.html})`);
    for (let tier = 0; tier <= 3; tier++) {
      // tier 0 is the blocking group, printed first whatever the tier of its rules
      const rules = RULES.filter((r) => (tier === 0 ? r.block : !r.block && r.tier === tier) && hits.some((h) => h.rule === r.id));
      if (!rules.length) continue;
      console.log(`\n${tier === 0 ? 'BLOCKING - fix before reporting (type and symbol fingerprints)' : TIERS[tier]}`);
      for (const r of rules) {
        const hs = hits.filter((h) => h.rule === r.id);
        console.log(`  [${r.id}] ${r.msg} - ${hs.length} hits`);
        for (const h of hs.slice(0, max)) console.log(`    ${h.file}:${h.line}: ${h.text}`);
      }
    }
    if (hits.length) {
      console.log(`\nSummary: blocking=${blocking} tier1=${hits.filter((h) => !h.block && h.tier === 1).length} tier2=${hits.filter((h) => !h.block && h.tier === 2).length} tier3=${tierCount(3)}`);
      console.log('Blocking hits are fixed, not checked for intent. Other hits are prompts to check intent: mark a deliberate choice with a "slop-ok" comment on the line.');
    } else {
      console.log('No signatures found. A clean scan does not prove a good design: render the screens and look.');
    }
  }
  if (skipped) return 2; // an unscanned file must not read as a clean scan
  return blocking > 0 || (strict && tierCount(1) > 0) ? 1 : 0;
}

process.exitCode = main(process.argv.slice(2));
