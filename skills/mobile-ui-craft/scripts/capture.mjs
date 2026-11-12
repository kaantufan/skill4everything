#!/usr/bin/env node
// Captures an HTML prototype at a real phone viewport, in real time, at several moments.
// Zero dependencies: drives a locally installed Chrome or Edge over the DevTools protocol.
//
//   node capture.mjs <screen.html> <out-prefix> [--size 393x852] [--at 1200,3000,6000] [--scale 2] [--tap x,y@ms] [--dark] [--scroll-end]
//                    [--steps "<step>;<step>;..." | --steps-file <path>]
//
// Writes <out-prefix>-<ms>.png for each moment. --tap sends one tap at viewport point x,y at the given time.
// --scroll-end also scrolls every scrolling area to its end afterwards and writes <out-prefix>-end.png.
// After the load event and before the clock starts it waits (at most 12 s) for fonts, for every <img> to load or fail,
// and, when the page has a .maplibregl-map, for document.documentElement.dataset.mapReady === '1'. The moments in --at
// are measured from the end of that wait, so photos and the map are in place in the first capture.
//
// Step mode: --steps (or --steps-file, one step per line, blank lines and #comments skipped) drives the page instead.
// --at and --tap are then ignored; the steps run in order after the settle wait. Steps do NOT wait on their own: add wait:<ms>.
//   wait:<ms>                      sleep
//   shot:<name>                    writes <out-prefix>-<name>.png
//   tap:x,y | tap:text=<text> | tap:css=<selector>
//                                  real touch tap. text= takes the smallest visible element whose text or aria-label
//                                  contains <text> (case-insensitive), preferring button/a/[role=button]/input/label, and
//                                  scrolls it to the centre first. If Chrome does not synthesise a click, a mouse click follows.
//   scroll:<px> | scroll:end | scroll:top    scrolls the largest scrollable area (document or inner element)
//   drag:x1,y1,x2,y2,<ms>          touch drag in ~16 ms increments (swipe cards, sheets, carousels)
//   key:<Key>                      Escape, Tab, Enter, Space, ArrowDown, a, ...
//   hash:<name>                    sets location.hash (hash:error -> #error; hash: clears it); reload
//   film:<name>,<ms>,<frames>[,raw]
//                                  filmstrip of the animation running now, ONE png <out-prefix>-<name>.png. Slows CSS/WAAPI/
//                                  view transitions to 0.1x (Animation.setPlaybackRate), so <ms> real time shows only <ms>/10
//                                  of animation time: a 300 ms transition needs ~3000 ms. requestAnimationFrame-driven JS
//                                  animations are NOT slowed and may be missed; ,raw takes the frames at normal speed.
//                                  Put film right after the step that starts the animation (tap:...;film:...).
//   motion:reduce | motion:normal  prefers-reduced-motion (pages that read it once at load need a reload step after)
//   log                            prints the focused element and any [aria-live]/role=status/alert text
// Every step prints one line. A step that fails (e.g. tap target not found) prints to stderr, the run continues, exit code 1.
// Page console errors and uncaught exceptions print as "page error: ...". alert/confirm/prompt dialogs are accepted and print "page dialog: <message>".
// Example: node capture.mjs food.html out/food --steps "tap:text=Add Adana;film:add,3000,8;tap:text=View cart;wait:600;shot:cart;key:Escape;wait:600;shot:closed"
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const USAGE = 'usage: node capture.mjs <screen.html> <out-prefix> [--size 393x852] [--at 1200,3000,6000] [--scale 2] [--tap x,y@ms] [--dark] [--scroll-end] [--steps "wait:<ms>;shot:<name>;tap:x,y|text=..|css=..;scroll:<px>|end|top;drag:x1,y1,x2,y2,<ms>;key:<Key>;hash:<name>;reload;film:<name>,<ms>,<frames>[,raw];motion:reduce|normal;log" | --steps-file <path>]';
const argv = process.argv.slice(2);
const opt = (name, def) => { const i = argv.indexOf(name); return i < 0 ? def : argv.splice(i, 2)[1]; };
const flag = (name) => { const i = argv.indexOf(name); return i < 0 ? false : (argv.splice(i, 1), true); };
if (argv.includes('--help') || argv.includes('-h')) { console.log(USAGE); process.exit(0); }
const [w, h] = opt('--size', '393x852').split('x').map(Number);
const times = opt('--at', '1200,3000,6000').split(',').map(Number).sort((a, b) => a - b);
const scale = Number(opt('--scale', '2'));
const tap = opt('--tap', null);
const dark = flag('--dark');
const scrollEnd = flag('--scroll-end');
const stepsArg = opt('--steps', null), stepsFile = opt('--steps-file', null);
const [html, prefix] = argv;
if (!html || !prefix || !existsSync(html) || !w || !h || times.some(Number.isNaN) || (stepsFile && !existsSync(stepsFile))) { console.error(USAGE); process.exit(2); }
const steps = stepsFile ? readFileSync(stepsFile, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith('#'))
  : stepsArg ? stepsArg.split(';').map((s) => s.trim()).filter(Boolean) : null;

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge',
].filter(Boolean);
const chrome = candidates.find((p) => existsSync(p));
if (!chrome) { console.error('No Chrome or Edge found. Set CHROME_PATH to a Chromium-based browser.'); process.exit(2); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// port 0: the OS picks a free port and Chrome writes it to DevToolsActivePort in its own profile. A random fixed port
// let two parallel runs share one browser and drive each other's page.
let port;
const profile = mkdtempSync(join(tmpdir(), 'capture-'));
const proc = spawn(chrome, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--hide-scrollbars', '--mute-audio', '--no-first-run', 'about:blank'], { stdio: 'ignore' });
// Ctrl+C and any exit path must not leave Chrome or its profile behind; retries cover Chrome still releasing files on Windows
process.on('SIGINT', () => process.exit(130));
process.on('exit', () => {
  proc.kill();
  try { rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 }); } catch { /* still locked: the OS temp cleaner will take it */ }
});

// One DevTools connection; onEvent gets every protocol event. Used for the page and for the throwaway film-composing tab.
async function connect(url, onEvent) {
  const ws = new WebSocket(url);
  await new Promise((ok, fail) => { ws.onopen = ok; ws.onerror = () => fail(new Error('devtools socket failed')); });
  let id = 0;
  const waiting = new Map();
  // a dead socket or a command Chrome never answers must reject, or the run would hang forever
  const drain = (why) => { for (const w of waiting.values()) w.no(new Error(why)); waiting.clear(); };
  ws.onclose = () => drain('devtools socket closed');
  ws.onerror = () => drain('devtools socket failed');
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && waiting.has(msg.id)) { waiting.get(msg.id).ok(msg); waiting.delete(msg.id); } else if (msg.method) onEvent?.(msg);
  };
  const send = (method, params = {}) => new Promise((ok, no) => {
    if (ws.readyState !== WebSocket.OPEN) return no(new Error('devtools socket closed'));
    const n = ++id, timer = setTimeout(() => { waiting.delete(n); no(new Error(`${method} timed out after 30 s`)); }, 30000);
    waiting.set(n, { ok: (m) => { clearTimeout(timer); ok(m); }, no: (e) => { clearTimeout(timer); no(e); } });
    ws.send(JSON.stringify({ id: n, method, params }));
  });
  return { ws, send };
}

// Helpers injected into the page (functions are sent as source text, so they must only use their args and PAGE_LIB).
const PAGE_LIB = `
  const name = (e) => (e.getAttribute('aria-label') || e.innerText || e.value || e.placeholder || '').trim().replace(/\\s+/g, ' ').slice(0, 50).trim();
  const desc = (e) => !e ? 'nothing' : e.tagName.toLowerCase() + (name(e) ? ' "' + name(e) + '"' : e.classList[0] ? '.' + e.classList[0] : '');
  const mainScroller = () => {
    const se = document.scrollingElement;
    return [se, ...document.querySelectorAll('*')].filter((e) => e && e.clientHeight > 0 && e.scrollHeight > e.clientHeight + 4 && (e === se || /auto|scroll/.test(getComputedStyle(e).overflowY)))
      .sort((a, b) => b.clientWidth * b.clientHeight - a.clientWidth * a.clientHeight)[0];
  };`;

// Resolves a tap spec ({x,y} | {css} | {text}) to a viewport point and describes what is there.
const locate = (spec) => {
  let el;
  if (spec.css) el = document.querySelector(spec.css);
  else if (spec.text) {
    const norm = (s) => String(s || '').replace(/\s+/g, ' ').toLowerCase();
    const q = norm(spec.text.trim());
    // what a finger could reach: rendered, not hidden or transparent, not inside an inert or aria-hidden subtree (a closed sheet)
    const vis = (e) => {
      const r = e.getBoundingClientRect();
      if (!(r.width > 0 && r.height > 0) || e.closest('[inert],[aria-hidden="true"]')) return false;
      for (let a = e; a && a !== document.documentElement; a = a.parentElement) {
        const s = getComputedStyle(a);
        if (s.visibility === 'hidden' || Number(s.opacity) === 0 || s.pointerEvents === 'none') return false;
      }
      return true;
    };
    const hits = [...document.body.querySelectorAll('*')].filter((e) => vis(e) && [e.innerText, e.getAttribute('aria-label'), e.value, e.placeholder].some((s) => norm(s).includes(q)));
    const area = (e) => { const r = e.getBoundingClientRect(); return r.width * r.height; };
    const pref = hits.filter((e) => e.matches('button,a,[role=button],input,label'));
    el = (pref.length ? pref : hits).sort((a, b) => area(a) - area(b))[0];
  }
  if (spec.css || spec.text) {
    if (!el) return null;
    // scroll only when the target is off screen: a finger never scrolls to tap something it can already see
    const b = el.getBoundingClientRect();
    if (b.top < 0 || b.left < 0 || b.bottom > innerHeight || b.right > innerWidth) el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' }); // 'instant': page CSS may set scroll-behavior:smooth
  }
  const r = el?.getBoundingClientRect();
  const x = el ? r.left + r.width / 2 : spec.x, y = el ? r.top + r.height / 2 : spec.y;
  const hit = document.elementFromPoint(x, y);
  const ok = el && hit && (el.contains(hit) || hit.contains(el));
  return { x: Math.round(x), y: Math.round(y), desc: el ? desc(el) + (ok ? '' : ` (covered by ${desc(hit)})`) : desc(hit) };
};
const scrollMain = (to) => {
  const el = mainScroller() || document.scrollingElement;
  const max = el.scrollHeight - el.clientHeight;
  el.scrollTo({ top: to === 'end' ? max : to === 'top' ? 0 : el.scrollTop + Number(to), behavior: 'instant' });
  return `${desc(el)} scrollTop=${Math.round(el.scrollTop)}/${max}`;
};
const logState = () => {
  const a = document.activeElement;
  const live = [...document.querySelectorAll('[aria-live],[role=status],[role=alert]')].filter((e) => e.getClientRects().length).map((e) => (e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 80)).filter(Boolean); // role=status/alert are implicit live regions
  return `focus=${a === document.body ? 'none (body)' : desc(a)} | live: ${live.length ? live.map((t) => `"${t}"`).join(' | ') : '-'}`;
};
// Runs inside a blank tab: lays the frames side by side with a 1-based index badge.
const stitch = async (frames, fw, fh) => {
  const imgs = await Promise.all(frames.map((f) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = 'data:image/png;base64,' + f; })));
  const g = 8, c = document.createElement('canvas');
  c.width = imgs.length * (fw + g) + g; c.height = fh + 2 * g;
  const x = c.getContext('2d');
  x.fillStyle = '#1b1b1f'; x.fillRect(0, 0, c.width, c.height);
  x.font = 'bold 14px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
  imgs.forEach((im, i) => {
    const ox = g + i * (fw + g);
    x.drawImage(im, ox, g, fw, fh);
    x.fillStyle = 'rgba(0,0,0,.75)'; x.beginPath(); x.arc(ox + 16, g + 16, 12, 0, 7); x.fill();
    x.fillStyle = '#fff'; x.fillText(String(i + 1), ox + 16, g + 16);
  });
  return c.toDataURL('image/png');
};

const KEYS = { Escape: 27, Tab: 9, Enter: 13, Backspace: 8, Space: 32, ' ': 32, ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40 };
const pageError = (m) => {
  if (m.method === 'Runtime.exceptionThrown') console.log('page error:', (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text).split('\n')[0]);
  else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') console.log('page error:', m.params.args.map((a) => a.value ?? a.description).join(' '));
};

let exit = 0;
try {
  let target;
  for (let i = 0; i < 50 && !target; i++) {
    await sleep(200);
    try {
      port ??= Number(readFileSync(join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0]) || undefined;
      if (port) target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page');
    } catch { /* browser still starting */ }
  }
  if (!target) throw new Error('browser did not start');
  const events = [];
  const { ws, send } = await connect(target.webSocketDebuggerUrl, (m) => {
    events.push(m.method); pageError(m);
    if (m.method === 'Page.javascriptDialogOpening') { // an open dialog freezes the page, so every later command would hang
      console.log('page dialog:', m.params.message);
      send('Page.handleJavaScriptDialog', { accept: true }).catch(() => {});
    }
  });
  const page = async (fn, ...args) => {
    const r = await send('Runtime.evaluate', { awaitPromise: true, returnByValue: true, expression: `(() => { ${PAGE_LIB}; return (${fn})(...${JSON.stringify(args)}); })()` });
    if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || 'page script failed');
    return r.result?.result?.value;
  };
  const grab = async () => {
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    if (!shot.result?.data) throw new Error('screenshot failed');
    return shot.result.data;
  };
  let motion = null;
  const media = () => send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: dark ? 'dark' : 'light' }, ...(motion ? [{ name: 'prefers-reduced-motion', value: motion }] : [])] });

  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: scale, mobile: true });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true });
  // pin the scheme: otherwise a host in dark mode silently captures every page dark
  await media();
  await send('Page.enable');
  if (steps) await send('Runtime.enable');
  await send('Page.navigate', { url: pathToFileURL(resolve(html)).href });
  const loaded = async () => { for (let i = 0; i < 100 && !events.includes('Page.loadEventFired'); i++) await sleep(100); };
  // fonts, photos and the map settle first; a missing photo (404) counts as settled so the wait cannot hang
  const settle = () => send('Runtime.evaluate', { awaitPromise: true, expression: `(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    await Promise.race([wait(12000), (async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((img) => { img.loading = 'eager'; return img.decode().catch(() => 0); }));
      if (document.querySelector('.maplibregl-map')) while (document.documentElement.dataset.mapReady !== '1') await wait(100);
    })()]);
  })()` });
  await loaded();
  await settle();

  if (steps) {
    const touch = async (type, pts) => send('Input.dispatchTouchEvent', { type, touchPoints: pts });
    const out = (name) => `${prefix}-${name}.png`;
    const run = async (cmd, a) => {
      switch (cmd) {
        case 'wait': await sleep(Number(a)); return 'ok';
        case 'shot': writeFileSync(out(a), Buffer.from(await grab(), 'base64')); return out(a);
        case 'tap': {
          const m = /^(text|css)=(.*)$/s.exec(a), xy = /^(-?[\d.]+),(-?[\d.]+)$/.exec(a);
          if (!m && !xy) throw new Error('tap target must be x,y or text=... or css=...');
          const loc = await page(locate, m ? { [m[1]]: m[2] } : { x: +xy[1], y: +xy[2] });
          if (!loc) throw new Error(`tap target not found: ${a}`);
          await page(() => { window.__tapClicks = 0; addEventListener('click', () => window.__tapClicks++, { capture: true, once: true }); });
          await touch('touchStart', [{ x: loc.x, y: loc.y }]); await sleep(40); await touch('touchEnd', []);
          await sleep(80);
          let note = '';
          if (await page(() => window.__tapClicks) === 0) { // touch emulation gave no click (undefined means the page navigated, which is a click): mouse click at the same point
            const mouse = (type) => send('Input.dispatchMouseEvent', { type, x: loc.x, y: loc.y, button: 'left', clickCount: 1 });
            await mouse('mouseMoved'); await mouse('mousePressed'); await mouse('mouseReleased');
            note = ' [no click from touch, used mouse click]';
          }
          return `${loc.desc} at ${loc.x},${loc.y}${note}`;
        }
        case 'scroll': { const r = await page(scrollMain, a); await sleep(150); return r; }
        case 'drag': {
          const [x1, y1, x2, y2, ms] = a.split(',').map(Number);
          if ([x1, y1, x2, y2, ms].some(Number.isNaN)) throw new Error('drag needs x1,y1,x2,y2,ms');
          const n = Math.max(1, Math.round(ms / 16));
          await touch('touchStart', [{ x: x1, y: y1 }]);
          for (let i = 1; i <= n; i++) { await sleep(16); await touch('touchMove', [{ x: x1 + (x2 - x1) * i / n, y: y1 + (y2 - y1) * i / n }]); }
          await touch('touchEnd', []);
          return `${x1},${y1} -> ${x2},${y2} in ${n} moves`;
        }
        case 'key': {
          const key = a === 'Space' ? ' ' : a, printable = key.length === 1; // the protocol names the space bar ' ', not 'Space'
          const k = { key, code: key === ' ' ? 'Space' : printable ? (/[a-z]/i.test(key) ? 'Key' + key.toUpperCase() : key) : key, windowsVirtualKeyCode: KEYS[key] ?? key.toUpperCase().charCodeAt(0) };
          if (!printable && !(key in KEYS)) throw new Error(`unknown key ${a}`);
          await send('Input.dispatchKeyEvent', { type: 'keyDown', ...k, ...(printable ? { text: key } : key === 'Enter' ? { text: '\r' } : {}) });
          await send('Input.dispatchKeyEvent', { type: 'keyUp', ...k });
          await sleep(50); return 'ok';
        }
        case 'hash': await page((v) => { location.hash = v; }, a); await sleep(400); return `#${a}`;
        case 'reload': events.length = 0; await send('Page.reload'); await loaded(); await settle(); return 'ok';
        case 'motion':
          if (a !== 'reduce' && a !== 'normal') throw new Error('motion:reduce or motion:normal');
          motion = a === 'reduce' ? 'reduce' : 'no-preference'; await media(); return motion;
        case 'log': return await page(logState);
        case 'film': {
          const [name, ms, n, raw] = a.split(',').map((s) => s.trim());
          if (!name || !(+ms > 0) || !(+n >= 1) || (raw && raw !== 'raw')) throw new Error('film needs <name>,<ms>,<frames>[,raw]');
          if (!raw) { await send('Animation.enable'); await send('Animation.setPlaybackRate', { playbackRate: 0.1 }); }
          const frames = [], t0 = Date.now();
          try {
            for (let i = 0; i < +n; i++) { await sleep(Math.max(0, (+n > 1 ? i * ms / (n - 1) : 0) - (Date.now() - t0))); frames.push(await grab()); }
          } finally { if (!raw) await send('Animation.setPlaybackRate', { playbackRate: 1 }); }
          // compose in a throwaway blank tab so the prototype under test is never touched
          const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
          const c = await connect(tab.webSocketDebuggerUrl);
          const r = await c.send('Runtime.evaluate', { awaitPromise: true, returnByValue: true, expression: `(${stitch})(${JSON.stringify(frames)}, ${w}, ${h})` });
          c.ws.close(); fetch(`http://127.0.0.1:${port}/json/close/${tab.id}`).catch(() => 0);
          const url = r.result?.result?.value;
          if (!url) throw new Error('film composition failed');
          writeFileSync(out(name), Buffer.from(url.split(',')[1], 'base64'));
          return `${out(name)} (${n} frames over ${ms} ms${raw ? ', normal speed' : ', animations at 0.1x'})`;
        }
        default: throw new Error(`unknown step "${cmd}"`);
      }
    };
    for (const s of steps) {
      const i = s.indexOf(':'), cmd = i < 0 ? s : s.slice(0, i), a = i < 0 ? '' : s.slice(i + 1);
      const label = `${cmd}${a ? ' ' + a : ''}`;
      try { console.log(`${label} -> ${await run(cmd, a)}`); } catch (e) { console.error(`${label} -> error: ${e.message}`); exit = 1; }
    }
  } else {
    const start = Date.now();
    const [tx, ty, tms] = tap ? tap.split(/[,@]/).map(Number) : [];
    let tapped = !tap;
    for (const t of times) {
      if (!tapped && tms <= t) {
        await sleep(Math.max(0, tms - (Date.now() - start)));
        for (const type of ['touchStart', 'touchEnd']) await send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchStart' ? [{ x: tx, y: ty }] : [] });
        tapped = true;
      }
      await sleep(Math.max(0, t - (Date.now() - start)));
      const out = `${prefix}-${String(t).padStart(5, '0')}.png`;
      writeFileSync(out, Buffer.from(await grab(), 'base64'));
      console.log(out);
    }
  }
  if (scrollEnd) {
    await send('Runtime.evaluate', { expression: "for (const el of [document.scrollingElement, ...document.querySelectorAll('*')]) if (el && el.scrollHeight > el.clientHeight + 4 && (el === document.scrollingElement || /auto|scroll/.test(getComputedStyle(el).overflowY))) el.scrollTop = el.scrollHeight;" });
    await sleep(700);
    writeFileSync(`${prefix}-end.png`, Buffer.from(await grab(), 'base64'));
    console.log(`${prefix}-end.png`);
  }
  ws.close();
} catch (e) {
  console.error('capture failed:', e.message);
  exit = 1;
} finally {
  proc.kill();
  await sleep(300);
}
process.exit(exit);
