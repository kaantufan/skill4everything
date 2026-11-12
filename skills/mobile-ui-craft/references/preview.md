# Preview and verification

Design quality cannot be judged from source code. This file is the loop that turns "I wrote it" into "I looked at it": render, look, fix, and say honestly what the evidence was.

## Contents

- Evidence ladder
- The matrix
- Looking at a render
- HTML mockups
- Prototype techniques (tested in Chromium)
- Self usability test
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
3. Build the screen with the dealt direction's tokens, face and icon set. Use real material (photos, covers, portraits, a map) from `assets/imagery.md`; draw no icons and no pictures yourself. Meet the prototype requirements of the UX pass (the task carried one step further, states by URL hash, pressed states, undo, honest totals, nothing that acts by itself, accessibility). Build the dealt signature motion with the motion kit and the techniques below; it is a morph of real content, interruptible, with a Reduce Motion version. The dealt typeface may load from a web font service in a prototype; say that the native build must bundle and license it. Do not add marketing sections, hover states or anything a phone app would not have.
4. Capture it in real time with the bundled script, which drives a local Chrome or Edge at a true phone viewport and writes one image per moment. It waits (at most 12 seconds) for fonts, every image and the map before the clock starts, so photos are in place in the first capture:

```
node scripts/capture.mjs screen.html shots/screen --size 393x852 --at 1200,3000,6500 --scroll-end
```

Add `--tap x,y@ms` to tap a point at a given time, `--dark` for the dark appearance, and `--scroll-end` for one more image with every scrolling area at its end. Without Node, plain headless Chrome or Edge works but does not wait for images: `chrome --headless=new --hide-scrollbars --force-device-scale-factor=2 --window-size=393,852 --virtual-time-budget=3000 --screenshot=screen.png file:///ABSOLUTE/PATH/screen.html` (Android frame `412,915`; on Windows use Windows paths). Motion that starts after load does not always advance there. Use the step mode of the capture script (see the self usability test), or list what you did not see.

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

Styles: `positron` (light), `dark`, `bright` (colour), `liberty`, all at `https://tiles.openfreemap.org/styles/<name>`. For a street-following route, ask the OSRM demo server once (`https://router.project-osrm.org/route/v1/foot/lon,lat;lon,lat?overview=full&geometries=geojson`) and paste the coordinates in as a constant, in the dealt accent. To draw it live, grow a slice of `route` in the source from a frame loop.

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

Crossfade two stacked layers when the artwork changes. In a static prototype precompute the hex per image next to the URL; it doubles as the never-grey `--c`. Check text contrast on the tint.

**Motion kit.** `assets/motion-kit.js` is plain JavaScript with no dependencies. Paste it into one `<script>` of the prototype so the file stays self-contained. It defines `MK`:

| Call | Does |
|---|---|
| `MK.spring(k, zeta)` | A spring as a `linear()` easing: `{easing, ms}` |
| `MK.ease` | `spatial` (380, .8), `fast` (800, .6), `slow` (200, .8), `effects` (1600, 1), each `{easing, ms}`. `MK.out` is the ease-out for fades |
| `MK.morph(update, opts)` | View transition with the spatial spring on named groups; runs `update` directly where unsupported. Under Reduce Motion only the page crossfades |
| `MK.flip(els, mutate)` | FLIP from where the elements are on screen |
| `MK.drag(el, {axis, onStart, onMove, onEnd})` | Pointer drag; `onEnd` gets `dx, dy, vx, vy` (px/ms) |
| `MK.fling(el, {from, to, v, k, zeta})` | Spring on x, y, r, s seeded with the release velocity; returns the Animation. `MK.freeze(el)` grabs it mid-flight |
| `MK.tilt(el, {max})`, `MK.tilt.gyro(btn, el)` | Pointer tilt, spring back; gyro from a tap, HTTPS only |
| `MK.roll(el, text)` | Digit roll for tabular figures; sets `aria-label` |
| `MK.haptic(kind)` | `navigator.vibrate`; iOS Safari ignores it, never the only feedback |

Everything except the tilt smoothing runs on WAAPI and view transitions, which `film:` slows down; build nothing that must be filmed on `requestAnimationFrame`. Springs are for what a finger moved or what travels; fades use `MK.out`. `MK.spring(300, .42)` overshoots about 23%: Energy 5 only. Reduce Motion is handled inside the kit (flip crossfades, fling does not overshoot, tilt and roll stand still); wrap your own CSS motion in `@media (prefers-reduced-motion: no-preference)`.

**Shared element.** The tapped thing is the thing that grows. A `view-transition-name` must be unique: set it on the source before the call, move it to the destination inside `update`, clear it after. Close with the reverse.

```js
function openDetail(card){
  const src=card.querySelector('img'), dst=detail.querySelector('img');
  src.style.viewTransitionName='hero';
  MK.morph(()=>{ src.style.viewTransitionName=''; dst.style.viewTransitionName='hero'; list.hidden=true; detail.hidden=false; })
    .then(()=>{ dst.style.viewTransitionName=''; });
}
```
```css
::view-transition-old(hero),::view-transition-new(hero){height:100%;object-fit:cover}
```

Name the picture or the container that travels, never a text block: two different texts in one group cross through each other mid-morph, which reviewers read as broken. The kit fades the old page out before the new one comes in. A view transition takes taps for its duration, so keep frequent actions (add, like, skip) on `MK.flip` or a plain transform and save `MK.morph` for opening a view. Groups sit above the page, so parent clipping does not apply. For many cards use `view-transition-name: match-element` or `view-transition-class`. A morph runs about 420 ms: film it, or wait 700 ms before a screenshot.

**Coverflow.** For covers, posters or trips: a showcase, never a list. The centre card is flat, the neighbours turn.

```css
.cf{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;perspective:900px;padding:0 calc(50% - 70px);scrollbar-width:none}
.cf>.c{flex:none;width:140px;height:140px;margin:34px 0;scroll-snap-align:center}
@media (prefers-reduced-motion:no-preference){@supports (animation-timeline:view()){
  .cf>.c{animation:cf linear both;animation-timeline:view(inline);animation-range:cover 0% cover 100%}
  @keyframes cf{0%{transform:translateX(30%) rotateY(55deg) scale(.8);opacity:.6}50%{transform:none}100%{transform:translateX(-30%) rotateY(-55deg) scale(.8);opacity:.6}}}}
```

**Card flip.** A physical object with two faces. Tilt the outer wrapper, flip the inner one, and add a button. Under Reduce Motion swap the faces with a fade.

```css
.card3d{perspective:700px}.inner{position:relative;transform-style:preserve-3d}
.face{position:absolute;inset:0;backface-visibility:hidden}.back{transform:rotateY(180deg)}
```
```js
let on=false; MK.tilt(card3d,{max:8});
flipBtn.onclick=()=>{ const e=MK.ease.spatial, to=on?0:180; on=!on;
  inner.animate([{transform:`rotateY(${on?0:180}deg)`},{transform:`rotateY(${to}deg)`}],{duration:e.ms,easing:e.easing})
    .finished.then(()=>{ inner.style.transform=`rotateY(${to}deg)`; }); };
```

**Throw a card.** It follows the finger, release velocity decides, the next card scales up as this one leaves. Visible like and dismiss buttons run the same fling.

```js
let base={x:0,y:0};
const pose=()=>{ const m=new DOMMatrix(getComputedStyle(card).transform); return {x:m.e,y:m.f,r:Math.atan2(m.b,m.a)*57.3}; };
MK.drag(card,{
  onStart:()=>{ base=pose(); },
  onMove:(dx,dy)=>{ card.style.transform=`translate(${base.x+dx}px,${base.y+dy}px) rotate(${(base.x+dx)/14}deg)`; },
  onEnd:({vx,vy})=>{ const p=pose(), gone=Math.abs(p.x)>110||Math.abs(vx)>.6;
    if(gone){ const s=Math.sign(vx||p.x); MK.haptic('light');
      MK.fling(card,{from:p,to:{x:s*520,y:p.y+vy*160,r:s*28},v:{x:vx,y:vy},k:120,zeta:1}); showNext(); }
    else MK.fling(card,{from:p,to:{},v:{x:vx,y:vy}}); } });
```

Drive like and nope stamps from the drag distance, not from time.

**Velocity-aware sheet.** It follows the finger, resists above the top, commits from the projected position and can be grabbed mid-animation. It also gets a close button and an Esc and back route.

```js
let y=0;
MK.drag(sheet,{axis:'y', onStart:()=>{ y=new DOMMatrix(getComputedStyle(sheet).transform).f; },
  onMove:(_,dy)=>{ const t=y+dy; sheet.style.transform=`translateY(${t<0?t*.35:t}px)`; },  // rubber band above the top
  onEnd:({dy,vy})=>{ const t=y+dy, to=(t+vy*180>200)?400:0; MK.fling(sheet,{from:{y:t<0?t*.35:t},to:{y:to},v:{y:vy}}); } });
```

**Shape morph.** `clip-path: shape()` interpolates when both shapes have the same command sequence (Chrome 135+, Safari 18.4+, Firefox 148+). Use it for a button to pill or a breath that paces an exercise; one or two per screen. Fallback: `border-radius`.

```css
.blob{clip-path:shape(from 50% 0%, curve to 100% 50% with 77% 0% / 100% 23%, curve to 50% 100% with 100% 77% / 77% 100%, curve to 0% 50% with 23% 100% / 0% 77%, curve to 50% 0% with 0% 23% / 23% 0%, close);transition:clip-path 600ms ease-in-out}
.blob.on{clip-path:shape(from 50% 0%, curve to 100% 50% with 95% 0% / 100% 5%, curve to 50% 100% with 100% 95% / 95% 100%, curve to 0% 50% with 5% 100% / 0% 95%, curve to 50% 0% with 0% 5% / 5% 0%, close)}
```

Only when the point counts differ, interpolate SVG paths with flubber 0.4.2 (`https://cdn.jsdelivr.net/npm/flubber@0.4.2/build/flubber.min.js`): `flubber.interpolate(a,b,{maxSegmentLength:4})(t)` returns the path. It needs a frame loop, so `film:` cannot slow it.

**Collapsing header (scroll-driven, no JS).** The large title shrinks as the frame's own scroller moves; `scroll(nearest)` finds it. Parallax on every layer is slop: at most the one hero photo, inside an `overflow: hidden` box with a large source (`w=1200`).

```css
@media (prefers-reduced-motion:no-preference){@supports (animation-timeline:scroll()){
  .title{animation:shrink linear both;animation-timeline:scroll(nearest);animation-range:0 120px;transform-origin:left bottom}
  @keyframes shrink{to{transform:scale(.55) translateY(-8px)}}}}
```

**Press and entry micro-motion.** Press feedback is `scale(.97)` within one frame. Never grow from zero: start entries at 0.94 or more, from the trigger's origin.

```css
button,.tap{transition:transform .12s cubic-bezier(.22,1,.36,1);touch-action:manipulation}
button:active,.tap:active{transform:scale(.97)}
.pop{transform-origin:var(--ox,50%) var(--oy,0%);transition:opacity .16s ease-out,transform .16s ease-out,display .16s allow-discrete}
@starting-style{.pop{opacity:0;transform:scale(.94)}}
@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}
```

**Number roll.** A changing figure rolls only the digits that changed: `MK.roll(el, '1.248,50')`, the whole formatted string in the product's locale and currency, in tabular figures. Count-up from zero is for one first reveal at most, never on every visit.

**Hand-drawn SVG charts.** For one to three hero charts, rings, bars or sparklines, inline SVG beats a chart library: it matches the type and animates with CSS. Derive the series from a seeded generator plus a trend, never `Math.random()` per render. One hue plus neutrals, the accent on the point being made, labels on the data. If a library is unavoidable (uPlot, Chart.js), switch off legend, axes and points and set the dealt font. A scrub (finger down, readout follows) is pointer events on the SVG.

```html
<svg viewBox="0 0 300 100" width="100%" preserveAspectRatio="none" role="img" aria-label="Last 7 days">
  <path class="ln" pathLength="1" d="M0 80 C40 70 60 30 100 40 S170 85 210 45 S270 10 300 20"
        fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
</svg>
<style>.ln{stroke-dasharray:1;stroke-dashoffset:1;animation:draw 1.1s cubic-bezier(.22,1,.36,1) .2s forwards}
@keyframes draw{to{stroke-dashoffset:0}}</style>
```

A gradient fill under a line is allowed only when it is the data's own area, in the accent at low opacity.

## Self usability test

Dead controls, covered content and missing states only show when the prototype is used. Before reporting, drive it with the capture script's step mode:

```
node scripts/capture.mjs screen.html out/t --steps "wait:300;shot:open;wait:8000;shot:idle;tap:text=Add;film:primary,3000,8;tap:text=View cart;wait:700;shot:next;key:Escape;wait:600;log;shot:back;tap:text=Library;wait:500;shot:tab-library;scroll:end;shot:end;hash:error;shot:error;motion:reduce;reload;wait:500;tap:text=Add;wait:700;shot:reduced"
```

1. **Open** (shot). Every job named in the brief is visible with its action in the first viewport.
2. **Idle** (shot after 8 s with no input). It matches the open shot, except real time (a clock, a playing track). Nothing was added, liked, skipped, started or opened by itself.
3. **Primary action** (film). The tapped thing travels and lands on its result; the stateful control and the total show the new state. The receipt and Undo sit in the docked bar or inline, never in a toast over content. No two texts overlap in any frame.
4. **Next step** (shot). The cart, player or detail opens from what was tapped, and the page behind it did not scroll.
5. **Escape or back, then `log`.** Focus returns to the control that opened it, the page is where it was, and anything committed is still committed; the live region says what happened.
6. **Each tab and every other visible control** (shot). A tab opens a simple real view built from the same material; every header button, row, chip and link does something sensible. List any control you left inert, and remove it rather than leave it dead. Also tap once on plain content (a description, lyrics, a caption): nothing may happen.
7. **Undo at the end of the page** (shot after `scroll:end`, the action, then Undo). The header, the tab bar and the docked bar are still where they were, and the page did not jump.
8. **`scroll:end`** (shot). Nothing sits under the bars.
9. **Each state by hash** (shot): loading, empty, error, offline, whatever the prototype has.
10. **`motion:reduce`, reload, primary action** (shot). The consequence is still visible without movement.

`film:` slows animations to 0.1x, so 300 ms of motion needs about 3000 ms of film. A `tap:` step already waits 80 ms; after a `drag:` add `wait:50` before `film:`, or an animation still starting stays on its first frame. Frame loops (`requestAnimationFrame`) are not slowed.

Run `node scripts/slop-scan.mjs` on the prototype: its blocking group must be clean before you report.

Open every image. Fix every collision, dead control and missing state in one batch, then drive it again, three rounds at most. Then score the prototype against the 9 bar of the UX pass, fix anything under 9, and put the score and any cap that still applies in the report.

## Showing directions side by side

When the lane is Full direction and the user has not fixed a look, show two or three looks of the same key screen before building everything. Take them from the niche's own shortlist: the dealt direction, its reroll, and the niche's second direction. Same content and the same real material in each, so the comparison is fair. Name each one, say in one line what it optimises for, and let the user choose or mix. Do not mix tokens from two directions in one screen.

## What a render cannot show

Motion, haptics, scroll and gesture feel, performance on slow hardware, screen-reader order and labels, and behaviour under interruption. For each, either test it on a device or list it under "Not verified".
