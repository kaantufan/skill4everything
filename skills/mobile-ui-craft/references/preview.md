# Preview and verification

Design quality cannot be judged from source code. This file is the loop that turns "I wrote it" into "I looked at it": render, look, fix, and say honestly what the evidence was.

## Contents

- Evidence ladder
- The matrix
- Looking at a render
- HTML mockups
- Prototype techniques (tested in Chromium)
- Showing directions side by side
- What a render cannot show

## Evidence ladder

Use the highest rung you can reach, and name it in the report.

| Rung | Evidence | Good for | Blind to |
|---|---|---|---|
| 1 | Release or profile build on a real device | Everything, including feel | Nothing |
| 2 | Simulator or emulator screenshots and recordings | Layout, colour, text scaling, dark mode, states | Haptics, real performance, true gesture feel |
| 3 | The framework's preview tool (Xcode previews, Compose previews, Flutter widget previews) | Single screens and components in many configurations | Navigation, real data, system bars |
| 4 | HTML mockup in a phone-sized frame | Direction, hierarchy, density, palette, copy | Native controls, fonts, materials, scroll physics |
| 5 | Code only | Structure and the source scan | How it looks |

Rungs 4 and 5 are sketches. Never describe a mockup or unrendered code as verified UI. A prototype with real photos, a real map and working states is still a rung 4 sketch.

## The matrix

Check at least these four, and add the rest when they apply:

| Always | When it applies |
|---|---|
| Light appearance | Right-to-left layout, if the app is or will be localised |
| Dark appearance | A language with long words (text about 40% longer) |
| Largest accessibility text size | Tablet, unfolded or landscape window, if supported |
| Smallest supported phone | Increased contrast and reduced transparency |

Use realistic content in every capture: a long name, an empty list, an error. A matrix of happy-path screens proves little.

## Looking at a render

Open the image and answer, in this order:

1. **Five-second test.** What is this screen for, and what is the one thing to do? If the answer takes longer, hierarchy is wrong.
2. **Squint.** Blurred or at a quarter size, is there one dominant element and a clear order?
3. **Platform test.** Would a fluent user of this platform pause at any control, bar or gesture? Could the screenshot pass for a website in a phone frame?
4. **Any-app test.** Cover the logo. Could this be a different product in another category without changing colour or type?
5. **Edges.** Is anything under the status bar, the home indicator, a cutout or the keyboard? Does anything touch the screen edge without a margin?
6. **Text.** Any clipping, overlap or ellipsis on essential content at the largest size?
7. **Contrast.** Secondary text, placeholder text and icons on their real background.
8. **Targets.** Any tappable element visibly smaller than a fingertip, or two closer than a few points apart?

List the defects, fix them in one batch, render again. Stop after three rounds and report what remains; endless polishing loops produce churn, not quality.

When a vision model reviews a screenshot, keep the long edge at or under about 1500 px so small text stays legible after downscaling. Capture at a lower scale factor or crop the region you are judging.

## HTML mockups

Use a mockup when there is no project yet, no toolchain to build with, or the user wants to see a direction before any native code. It is a sketch of a native app, not a web page.

1. Copy `assets/phone-frame.html` from this skill. It provides the screen size, status bar, home indicator, safe-area variables and the platform system font stack, and nothing else. Set `data-platform` to `ios` or `android` and `data-theme` to the dealt appearance. The prototype opens in that appearance whatever the viewer's system setting, because the dealt one is what was designed; reach the other with a `?theme=light` or `?theme=dark` query, not with `prefers-color-scheme`. A dark-first screen that silently follows a light system shows a reviewer a look nobody designed.
2. Put the product's tokens in the marked style block and the screen's markup inside `#screen`.
3. Build the screen with the dealt direction's tokens, face and icon set. Use real material (photos, covers, portraits, a map) from `assets/imagery.md`; draw no icons and no pictures yourself. Meet the prototype requirements of the UX pass (the task carried one step further, states by URL hash, pressed states, undo, honest totals, the auto-demo, accessibility). Build the direction's signature moment with the techniques below. The dealt typeface may load from a web font service in a prototype; say that the native build must bundle and license it. Do not add marketing sections, hover states or anything a phone app would not have.
4. Capture it in real time with the bundled script, which drives a local Chrome or Edge at a true phone viewport and writes one image per moment. It waits (at most 12 seconds) for fonts, every image and the map before the clock starts, so photos are in place in the first capture:

```
node scripts/capture.mjs screen.html shots/screen --size 393x852 --at 1200,3000,6500 --scroll-end
```

Add `--tap x,y@ms` to tap a point at a given time, `--dark` for the dark appearance, and `--scroll-end` for one more image with every scrolling area at its end. Without Node, use plain headless Chrome or Edge (it does not wait for images; add a virtual time budget):

```
chrome --headless=new --hide-scrollbars --force-device-scale-factor=2 --window-size=393,852 --screenshot=screen.png file:///ABSOLUTE/PATH/screen.html
```

Use `412,915` for the Android frame. On Windows pass a Windows path to `--screenshot` and a `file:///C:/...` URL. Add `--virtual-time-budget=3000` to capture the screen three seconds in, and repeat with other values to see several moments. Animations that start after load do not always advance in headless capture, so check the interaction in a real browser when you can and say so when you cannot.

Size everything relative to the frame, never the viewport: no `vw` or `vh` units and no `position: fixed`. Some headless browsers enforce a minimum window wider than a phone, lay the page out at that width and crop the screenshot, which cuts off anything anchored to the viewport's right edge. If a capture looks cropped or off-centre, that is the cause.

5. In the report, label it: "HTML mockup. Fonts, materials, controls and scrolling are approximations of the native ones."

Moving from mockup to native: carry over the tokens, hierarchy, copy and content. Rebuild every control, bar, sheet and transition from platform components. Do not translate CSS line by line.

## Prototype techniques (tested in Chromium)

These use a recent Chromium (View Transitions, scroll-driven animations, `linear()`, `@starting-style`, `color-mix()`). Safari and Firefox parity is not promised: wrap the newest features in `@supports` and keep a static end state as the fallback. Everything is sized to the frame, as above.

**Never-grey image.** Every image slot has a coloured fallback close to the photo's dominant colour, a fade-in, and removal on error (a deleted photo returns 404). Hard-code the colour per photo, never a grey.

```html
<div class="ph" style="--c:#c9a27a">
  <img src="https://images.unsplash.com/photo-1580069491658-8220b0e8722d?w=800&q=80&auto=format&fit=crop"
       alt="Sucuk and eggs" loading="lazy" crossorigin="anonymous"
       onload="this.classList.add('in')" onerror="this.remove()">
</div>
<style>
.ph{position:relative;overflow:hidden;background:var(--c,#222)}
.ph img{width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .4s ease-out;display:block}
.ph img.in{opacity:1}
</style>
```

Set `object-fit: cover` and an explicit aspect ratio. Text on a photo sits on a scrim, `linear-gradient(transparent, rgb(0 0 0 / .6))`, and passes contrast.

**Real map (MapLibre 5.9.0, OpenFreeMap).** No key and no signup. Pin 5.x: 6.x is ESM-only and its `dist/maplibre-gl.js` does not exist. The attribution control comes from the style; keep it visible (`compact: true`), never remove it. Software GL needs about 10 seconds to go idle, so the page sets `data-map-ready` and `scripts/capture.mjs` waits for it.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/maplibre-gl@5.9.0/dist/maplibre-gl.css">
<script src="https://cdn.jsdelivr.net/npm/maplibre-gl@5.9.0/dist/maplibre-gl.js"></script>
<div id="map" style="position:absolute;inset:0"></div>
<script>
const route=[[28.9784,41.0082],[28.9850,41.0125],[28.9930,41.0160],[29.0045,41.0230],[29.0262,41.0344]];
const map=new maplibregl.Map({container:'map',style:'https://tiles.openfreemap.org/styles/positron',
  center:[28.995,41.02],zoom:12.6,attributionControl:{compact:true},interactive:false});
map.on('load',()=>{
  map.addSource('r',{type:'geojson',data:{type:'Feature',geometry:{type:'LineString',coordinates:route}}});
  map.addLayer({id:'rc',type:'line',source:'r',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':'#fff','line-width':9}});
  map.addLayer({id:'r',type:'line',source:'r',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':'#FC5200','line-width':5}});
});
map.on('idle',()=>{document.documentElement.dataset.mapReady='1'});
</script>
```

Styles: `positron` (light), `dark`, `bright` (colour), `liberty`, all at `https://tiles.openfreemap.org/styles/<name>`. For a street-following route, ask the OSRM demo server once (`https://router.project-osrm.org/route/v1/foot/lon,lat;lon,lat?overview=full&geometries=geojson`) and paste the coordinates into the file as a constant. Use the route colour from the dealt accent. To draw the route live, update the source with a growing slice of `route` inside `requestAnimationFrame`.

**Colour sampled from content.** For washes, tints and a player background that follows the artwork. The image needs `crossorigin="anonymous"` (Unsplash, Wikimedia and the Met allow it; Cleveland does not, so hard-code its hex).

```js
async function dominant(img){
  await img.decode(); const c=document.createElement('canvas'); c.width=c.height=24;
  const x=c.getContext('2d',{willReadFrequently:true}); x.drawImage(img,0,0,24,24);
  const d=x.getImageData(0,0,24,24).data, bins={};
  for(let i=0;i<d.length;i+=4){ const r=d[i],g=d[i+1],b=d[i+2], mx=Math.max(r,g,b), mn=Math.min(r,g,b);
    if(mx<40||mn>225||mx-mn<28) continue;                      // skip near-black, near-white, grey
    const k=(r>>4)+','+(g>>4)+','+(b>>4); (bins[k]??=[0,0,0,0]); const v=bins[k]; v[0]++; v[1]+=r; v[2]+=g; v[3]+=b; }
  const top=Object.values(bins).sort((a,b)=>b[0]-a[0])[0]||[1,90,90,90];
  return `rgb(${top[1]/top[0]|0} ${top[2]/top[0]|0} ${top[3]/top[0]|0})`;
}
dominant(cover).then(col=>player.style.setProperty('--tint',col));
// .player{background:linear-gradient(180deg,color-mix(in oklab,var(--tint) 85%,#000),#0b0b0d 70%);transition:background 600ms ease-out}
```

Crossfade between two stacked layers when the artwork changes. In a static prototype, precompute the hex per image and store it next to the URL; it doubles as the `--c` of the never-grey slot. Check text contrast on the tinted ground.

**Springs.** A spring for what a finger moved, as a CSS `linear()` easing. The generator returns the easing and the duration.

```js
function spring(k=170,c=14,m=1,pts=40){
  const w0=Math.sqrt(k/m), z=c/(2*Math.sqrt(k*m)), wd=w0*Math.sqrt(Math.max(1e-6,1-z*z));
  const x=t=>z<1?1-Math.exp(-z*w0*t)*(Math.cos(wd*t)+(z*w0/wd)*Math.sin(wd*t)):1-Math.exp(-w0*t)*(1+w0*t);
  let T=.02; while(T<10){ if(Math.abs(1-x(T))<.001&&Math.abs(1-x(T+.1))<.001)break; T+=.02; }
  const v=[]; for(let i=0;i<=pts;i++) v.push(+x(T*i/pts).toFixed(4)); v[pts]=1;
  return {css:`linear(${v.join(',')})`, ms:Math.round(T*1000)};
}
const s=spring(220,18); el.style.setProperty('--spring',s.css); el.style.setProperty('--ms',s.ms+'ms');
// .card{transition:transform var(--ms) var(--spring)}
```

A ready preset with about 25% overshoot, for Energy 4 or 5 only: `linear(0,0.009,0.035 2.1%,0.141,0.281 6.7%,0.723 12.9%,0.938 16.7%,1.017,1.077,1.121,1.149 24.3%,1.159,1.163,1.161,1.154 29.9%,1.129 32.8%,1.051 39.6%,1.017 43.1%,0.991,0.977 51%,0.974 53.8%,0.975 57.1%,0.997 69.8%,1.003 76.9%,1.004 83.8%,1)`. For fades and menus use `cubic-bezier(.22,1,.36,1)` at 250 ms or less.

**Shared-element photo expand.** The list photo becomes the detail photo. Only one element may own the `view-transition-name` at a time. Close by running the same function in reverse.

```js
function open(card){
  const img=card.querySelector('img'); img.style.viewTransitionName='hero';
  const go=()=>{ detail.hidden=false; list.hidden=true; detail.querySelector('img').style.viewTransitionName='hero'; img.style.viewTransitionName=''; };
  document.startViewTransition ? document.startViewTransition(go) : go();
}
```
```css
::view-transition-group(hero){animation-duration:520ms;animation-timing-function:var(--spring)}
::view-transition-old(hero),::view-transition-new(hero){object-fit:cover;height:100%}
::view-transition-old(root),::view-transition-new(root){animation-duration:240ms}
```

Match radii by animating `border-radius` on the group. Wait about 700 ms before a screenshot, or call `skipTransition()` for a deterministic end frame.

**Header collapse and parallax (scroll-driven, no JS).** Use the frame's own scroller; `scroll(nearest)` finds the nearest scrolling ancestor.

```css
@supports (animation-timeline: scroll()) {
  .hero img{animation:par linear both;animation-timeline:scroll(nearest);animation-range:0 320px}
  @keyframes par{to{transform:translateY(80px) scale(1.12);filter:brightness(.7)}}
  .title{animation:shrink linear both;animation-timeline:scroll(nearest);animation-range:0 120px;transform-origin:left bottom}
  @keyframes shrink{to{transform:scale(.55) translateY(-8px)}}
}
```

Keep the photo inside an `overflow: hidden` box and use a large source (`w=1200`). Do not use scroll-linked rise-in for every row.

**Velocity-aware sheet.** It follows the finger at once, resists above the top, commits on release from the projected position, and can be grabbed mid-animation. Uses `spring()` above.

```js
let y=0,vy=0,last=0,lastT=0;
sheet.onpointerdown=e=>{sheet.setPointerCapture(e.pointerId);sheet.getAnimations().forEach(a=>a.cancel());last=e.clientY;lastT=e.timeStamp;};
sheet.onpointermove=e=>{ if(!sheet.hasPointerCapture(e.pointerId))return;
  const dy=e.clientY-last; y+=(y+dy<0)?dy*.35:dy;              // rubber band
  vy=dy/(e.timeStamp-lastT||1); last=e.clientY; lastT=e.timeStamp; sheet.style.transform=`translateY(${y}px)`; };
sheet.onpointerup=()=>{ const target=(y+vy*180>200)?400:0, sp=spring(260,22);
  const a=sheet.animate([{transform:`translateY(${y}px)`},{transform:`translateY(${target}px)`}],{duration:sp.ms,easing:sp.css,fill:'forwards'});
  a.onfinish=()=>{y=target;sheet.style.transform=`translateY(${y}px)`;a.cancel();}; };
```

Give the sheet a visible close button and an Esc and back route as well; a drag is never the only way out.

**Press and entry micro-motion.** Press feedback is `scale(.97)` within one frame. Never grow from zero: start entries at 0.94 or more, from the trigger's origin.

```css
button,.tap{transition:transform .12s cubic-bezier(.22,1,.36,1);touch-action:manipulation}
button:active,.tap:active{transform:scale(.97)}
.pop{transform-origin:var(--ox,50%) var(--oy,0%);transition:opacity .16s ease-out,transform .16s ease-out,display .16s allow-discrete}
@starting-style{.pop{opacity:0;transform:scale(.94)}}
.pop[hidden]{opacity:0;transform:scale(.94)}
@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}
```

**Number roll and count-up.** A changing figure rolls its digits (tabular figures, one string). Count-up is for one first reveal only, never on every visit.

```css
.roll{display:inline-flex;height:1em;line-height:1;overflow:hidden;font-variant-numeric:tabular-nums}
.roll .d{display:block;height:1em;overflow:hidden}
.roll .col{display:flex;flex-direction:column;transition:transform var(--ms,300ms) var(--spring,cubic-bezier(.22,1,.36,1))}
.roll i{display:block;height:1em;font-style:normal}
```
```js
function roll(el,text){                       // text is the whole formatted string, e.g. "1.248,50"
  el.setAttribute('role','img'); el.setAttribute('aria-label',text);
  if(el.dataset.len!==String(text.length)){ el.dataset.len=text.length;
    el.innerHTML=[...text].map(c=>/\d/.test(c)?'<span class="d" aria-hidden="true"><span class="col">'+[...'0123456789'].map(n=>'<i>'+n+'</i>').join('')+'</span></span>':'<span aria-hidden="true">'+c+'</span>').join(''); }
  let k=0; const cols=el.querySelectorAll('.col');
  for(const c of text) if(/\d/.test(c)) cols[k++].style.transform='translateY(-'+c+'em)';
}
function count(el,to,ms=900,locale='tr-TR'){ const t0=performance.now();
  (function f(t){ const p=Math.min(1,(t-t0)/ms), e=1-Math.pow(1-p,4); el.textContent=Math.round(to*e).toLocaleString(locale); if(p<1) requestAnimationFrame(f); })(t0); }
```

Use the product's locale and currency in the string. Under Reduce Motion set the transition to none.

**Hand-drawn SVG charts.** For one to three hero charts, rings, bars or sparklines, inline SVG beats a chart library: it matches the type and animates with CSS. Derive the series from a seeded generator plus a trend, never `Math.random()` per render, so captures are identical. Use one hue plus neutrals, with the accent on the point being made, and labels on the data. If a library is unavoidable (uPlot for dense time series, Chart.js otherwise), switch off the legend, the axes and the points, round the line caps, and set the font to the dealt family. A chart scrub (finger down, readout follows) is built with pointer events on the SVG.

```html
<svg viewBox="0 0 300 100" width="100%" preserveAspectRatio="none" role="img" aria-label="Last 7 days">
  <path class="ln" pathLength="1" d="M0 80 C40 70 60 30 100 40 S170 85 210 45 S270 10 300 20"
        fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
</svg>
<style>.ln{stroke-dasharray:1;stroke-dashoffset:1;animation:draw 1.1s cubic-bezier(.22,1,.36,1) .2s forwards}
@keyframes draw{to{stroke-dashoffset:0}}</style>
```

A gradient fill under a line is allowed only when it is the data's own area, in the accent at low opacity.

## Showing directions side by side

When the lane is Full direction and the user has not fixed a look, show two or three looks of the same key screen before building everything. Take them from the niche's own shortlist: the dealt direction, its reroll, and the niche's second direction. Same content and the same real material in each, so the comparison is fair. Name each one, say in one line what it optimises for, and let the user choose or mix. Do not mix tokens from two directions in one screen.

## What a render cannot show

Motion, haptics, scroll and gesture feel, performance on slow hardware, screen-reader order and labels, and behaviour under interruption. For each, either test it on a device or list it under "Not verified".
