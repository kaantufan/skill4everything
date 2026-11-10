# Craft: the details that show someone decided

Use this file once the structure of a screen stands. Every rule here is checkable in a render. Units are pt on iOS and dp on Android unless stated.

## Contents

- Hierarchy
- Spacing
- Shape and depth
- Typography
- Colour and dark mode
- Touch and feedback
- States
- Copy
- Icons and imagery
- Final pass

## Hierarchy

- **One dominant element per screen.** If you cannot name the one thing the screen is for and why everything else is quieter, the screen is not done.
- **Squint test.** Blur the render or shrink it to a quarter. The primary element, the secondary group and the order between them must still read.
- **Steps you can see.** Neighbouring type roles differ by at least 1.25× in size, or clearly in weight. Three similar sizes read as no hierarchy at all.
- **Left-align reading content.** Centre only symmetric moments: an empty state, a confirmation, a splash.
- **Dim what is not now.** Past and future steps, secondary metadata and disabled paths take the secondary or tertiary text colour, not a smaller size alone.

## Spacing

- Start from the platform's default margins and default spacing; they are already right for the system font. Add your own steps on a base of 4: 4, 8, 12, 16, 24, 32, 48.
- **Rhythm, not uniformity.** The gap inside a group is smaller than the gap between groups, which is smaller than the gap between sections. A useful ratio is 1 : 2 : 3 or more. One padding value at every nesting level is the most common generated-UI signature.
- More space above a heading than below it, so the heading belongs to what follows.
- Keep the same side gutter for full-width content and for the start of horizontal scrollers. Let scrollers bleed to the edge on the trailing side so content looks continuous.
- On tablets and wide windows cap the line length of reading text; do not stretch a phone column across the screen.

## Shape and depth

- **Radius by role.** At most three radii: control, container, sheet. One global radius flattens everything.
- **Concentric corners.** An inner radius equals the outer radius minus the padding between them. Equal radii on nested shapes look pinched.
- Use the platform's continuous corner curve for rounded rectangles where the stack offers one. Capsules for pill shapes.
- **Edge or elevation, never both** on the same surface. Hairline plus soft shadow on every card is a generated look.
- **Shadows are for things that float**: sheets, menus, floating buttons. Content cards sit flat or on a tonal surface. One light direction for every shadow; larger elevation means larger offset and blur and lower opacity.
- On Android prefer tonal elevation (a lighter or tinted surface) to drop shadows. In dark mode on both platforms, raise surfaces by making them lighter; shadows disappear on dark backgrounds.
- **Hairlines are one physical pixel**, in the semantic separator colour, and in lists they start at the text's leading edge, not at the screen edge.
- Photos and maps get a faint inner stroke (around a tenth opacity) so light images do not bleed into a light background.

## Typography

- Use the platform text styles and let them scale. The default body size on both platforms is already tuned; do not shrink body text to fit more.
- Get character from the system face's own range before importing a font: weights, widths, and its rounded, serif and mono variants. A custom face belongs in display moments, never in body or controls, unless the brand requires it.
- **Tabular figures** for every number that changes or lines up: prices, timers, counters, tables. Otherwise digits jitter.
- For big numbers, make the unit and the decimals quieter than the integer part.
- **Truncation is designed.** Names and titles: one line, tail ellipsis. Paths, IDs and file names: middle truncation. Descriptions: two or three lines with a way to expand. Money, times and codes never truncate.
- Avoid a single short word alone on the last line of a heading; shorten the copy.
- Avoid weights lighter than regular; they fail in sunlight and at small sizes.
- Do not change font weight between selected and unselected states. The width changes and the layout shifts.

## Colour and dark mode

- **Jobs for colours.** One neutral family carries most of the screen, one supporting colour marks structure, one accent marks action or the single most important thing. An accent on everything is not an accent.
- Tint the neutrals slightly toward the brand hue instead of using flat grey. Avoid pure black text on pure white; step each in a little.
- Semantic colours (success, warning, error) are for state only, and always come with an icon or label.
- **Light leads unless the scene is dark.** Lead with dark only when the product is used mostly at night or in low light (sleep, media playback, cockpit-like tools). Everything else leads with light, including products with one evening use among many. Dark makes any screen look finished, which is why it hides weak hierarchy. Design both and say which one you are showing.
- **Dark mode is designed, not inverted.** Separate values per role; accents slightly less saturated; elevation by lighter surface; images and illustrations checked on the dark background.
- Check contrast on the real background, including text over photos (add a scrim) and text over translucent material while content scrolls behind it.
- Charts: one hue plus neutrals, the accent on the series or point being discussed, labels on the data instead of a legend where space allows.

## Touch and feedback

- Feedback begins on press-down, within about 100 ms, and the action commits on release. Feedback that waits for release feels broken.
- Buttons respond with a small scale or tint; full-width list rows respond with a background highlight, not a scale.
- The visible glyph may be smaller than the touch target; extend the hit area instead of enlarging the icon.
- Destructive actions sit apart from the primary action and either confirm or offer undo. Prefer undo for anything reversible.
- Put primary actions where the thumb rests: the lower half of the screen on phones.
- Optimistic updates for actions that almost always succeed, with a visible rollback and message when they do not.
- Hover does not exist on touch. Anything revealed on hover needs a long-press menu or a visible control.

## States

- **Loading:** a skeleton that mirrors the final layout (same row heights, image sizes, line counts) for first load; a small spinner or progress for short actions. Do not show a spinner for work that finishes in a blink.
- **Empty:** say what belongs here and offer the one action that fills it. First-run empty, filtered-to-nothing and error are three different screens.
- **Error:** what failed, what the user can do, and their input preserved. Never dismiss a form before the save succeeds.
- **Offline:** show cached content with its age; queue what can be queued and say so.
- **Permission denied:** explain what will not work and link to the system setting. Do not re-prompt in a loop.
- **Partial:** one failed section does not blank the whole screen.

## Copy

- Sentence case. No exclamation marks and no emoji unless the brand voice is written down and asks for them.
- Buttons name the action and its object: "Save changes", "Send 40 €". The same verb continues through the flow: "Publish" becomes "Published".
- Decline options are neutral: "Not now", never guilt.
- Write a three-line voice card for the product (who is speaking, what they never say, how they sound when something fails) and check every string against it.
- Sample data is realistic and varied: one long name, one missing photo, a zero, a negative, uneven numbers. Round numbers and "John Doe" read as fake.

## Icons and imagery

- One family, one weight, matched to the weight of adjacent text. Filled and outlined variants only to show selection.
- Icons inside buttons need optical, not geometric, centring: arrows and play triangles sit slightly off-centre; reduce padding on the icon side of an icon-and-label button.
- Images: real photography, specific commissioned art, or nothing. A grey placeholder beats a generic illustration.
- Avatars: photo, then initials on a restrained deterministic colour, then a generic glyph.
- The launch screen matches the first screen's background so the app appears to open instantly.

## Final pass

Run this on the rendered screens, side by side:

1. Same header style, radius family, icon weight and voice on every screen?
2. Anything on screen that was not chosen for this product? Name the reason or remove it.
3. Largest text size: does every screen still work?
4. Dark mode: any shadow doing nothing, any image glowing, any text below contrast?
5. Longest realistic content in every field: what breaks?
6. One screen with the brand removed: would you still know which app it is?
