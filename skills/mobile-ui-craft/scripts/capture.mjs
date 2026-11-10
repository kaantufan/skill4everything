#!/usr/bin/env node
// Captures an HTML prototype at a real phone viewport, in real time, at several moments.
// Zero dependencies: drives a locally installed Chrome or Edge over the DevTools protocol.
//
//   node capture.mjs <screen.html> <out-prefix> [--size 393x852] [--at 1200,3000,6000] [--scale 2] [--tap x,y@ms] [--dark]
//
// Writes <out-prefix>-<ms>.png for each moment. --tap sends one tap at viewport point x,y at the given time.
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const USAGE = 'usage: node capture.mjs <screen.html> <out-prefix> [--size 393x852] [--at 1200,3000,6000] [--scale 2] [--tap x,y@ms] [--dark]';
const argv = process.argv.slice(2);
const opt = (name, def) => { const i = argv.indexOf(name); return i < 0 ? def : argv.splice(i, 2)[1]; };
const flag = (name) => { const i = argv.indexOf(name); return i < 0 ? false : (argv.splice(i, 1), true); };
if (argv.includes('--help') || argv.includes('-h')) { console.log(USAGE); process.exit(0); }
const [w, h] = opt('--size', '393x852').split('x').map(Number);
const times = opt('--at', '1200,3000,6000').split(',').map(Number).sort((a, b) => a - b);
const scale = Number(opt('--scale', '2'));
const tap = opt('--tap', null);
const dark = flag('--dark');
const [html, prefix] = argv;
if (!html || !prefix || !existsSync(html) || !w || !h || times.some(Number.isNaN)) { console.error(USAGE); process.exit(2); }

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
const port = 9300 + Math.floor(Math.random() * 600);
const profile = mkdtempSync(join(tmpdir(), 'capture-'));
const proc = spawn(chrome, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--hide-scrollbars', '--mute-audio', '--no-first-run', 'about:blank'], { stdio: 'ignore' });

let exit = 0;
try {
  let target;
  for (let i = 0; i < 50 && !target; i++) {
    await sleep(200);
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page'); } catch { /* browser still starting */ }
  }
  if (!target) throw new Error('browser did not start');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((ok, fail) => { ws.onopen = ok; ws.onerror = () => fail(new Error('devtools socket failed')); });
  let id = 0;
  const waiting = new Map(), events = [];
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && waiting.has(msg.id)) { waiting.get(msg.id)(msg); waiting.delete(msg.id); } else if (msg.method) events.push(msg.method);
  };
  const send = (method, params = {}) => new Promise((ok) => { waiting.set(++id, ok); ws.send(JSON.stringify({ id, method, params })); });

  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: scale, mobile: true });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true });
  // pin the scheme: otherwise a host in dark mode silently captures every page dark
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: dark ? 'dark' : 'light' }] });
  await send('Page.enable');
  await send('Page.navigate', { url: pathToFileURL(resolve(html)).href });
  for (let i = 0; i < 100 && !events.includes('Page.loadEventFired'); i++) await sleep(100);
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
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    if (!shot.result?.data) throw new Error('screenshot failed');
    const out = `${prefix}-${String(t).padStart(5, '0')}.png`;
    writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
    console.log(out);
  }
  ws.close();
} catch (e) {
  console.error('capture failed:', e.message);
  exit = 1;
} finally {
  proc.kill();
  await sleep(300);
  try { rmSync(profile, { recursive: true, force: true }); } catch { /* profile still locked: the OS temp cleaner will take it */ }
}
process.exit(exit);
