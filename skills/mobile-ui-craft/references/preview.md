# Preview and verification

Design quality cannot be judged from source code. This file is the loop that turns "I wrote it" into "I looked at it": render, look, fix, and say honestly what the evidence was.

## Contents

- Evidence ladder
- The matrix
- Looking at a render
- HTML mockups
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

Rungs 4 and 5 are sketches. Never describe a mockup or unrendered code as verified UI.

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

1. Copy `assets/phone-frame.html` from this skill. It provides the screen size, status bar, home indicator, safe-area variables and the platform system font stack, and nothing else. Set `data-platform` to `ios` or `android` and `data-theme` to `light` or `dark`.
2. Put the product's tokens in the marked style block and the screen's markup inside `#screen`.
3. Make it a prototype, not a picture: the primary action works and changes the hero. The first three seconds show the resting state a user sees on opening. After that, run the main interaction once automatically so the screen explains itself, and skip that under `prefers-reduced-motion`. The dealt typeface may be loaded from a web font service in a prototype; say that the native build must bundle and license it. Load the dealt typeface and the dealt icon set; draw no icons and no pictures yourself. Do not add marketing sections, hover states or anything a phone app would not have.
4. Capture it in real time with the bundled script, which drives a local Chrome or Edge at a true phone viewport and writes one image per moment:

```
node scripts/capture.mjs screen.html shots/screen --size 393x852 --at 1200,3000,6500
```

Add `--tap x,y@ms` to tap a point at a given time. Without Node, use plain headless Chrome or Edge:

```
chrome --headless=new --hide-scrollbars --force-device-scale-factor=2 --window-size=393,852 --screenshot=screen.png file:///ABSOLUTE/PATH/screen.html
```

Use `412,915` for the Android frame. On Windows pass a Windows path to `--screenshot` and a `file:///C:/...` URL. Add `--virtual-time-budget=3000` to capture the screen three seconds in, and repeat with other values to see several moments. Animations that start after load do not always advance in headless capture, so check the interaction in a real browser when you can and say so when you cannot.

Size everything relative to the frame, never the viewport: no `vw` or `vh` units and no `position: fixed`. Some headless browsers enforce a minimum window wider than a phone, lay the page out at that width and crop the screenshot, which cuts off anything anchored to the viewport's right edge. If a capture looks cropped or off-centre, that is the cause.

5. In the report, label it: "HTML mockup. Fonts, materials, controls and scrolling are approximations of the native ones."

Moving from mockup to native: carry over the tokens, hierarchy, copy and content. Rebuild every control, bar, sheet and transition from platform components. Do not translate CSS line by line.

## Showing directions side by side

When the lane is Full direction and the user has not fixed a look, show two or three directions of the same key screen before building everything. Make them differ on the dials (for example D4 E2 W2 against D3 E3 W3) and on the source of the palette, not only on accent colour. Same content in each, so the comparison is fair. Name each direction, say in one line what it optimises for, and let the user choose or mix.

## What a render cannot show

Motion, haptics, scroll and gesture feel, performance on slow hardware, screen-reader order and labels, and behaviour under interruption. For each, either test it on a device or list it under "Not verified".
