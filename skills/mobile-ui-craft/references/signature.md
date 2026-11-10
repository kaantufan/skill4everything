# Signature: making a screen people remember

Read this before designing or building any screen at Expression 3 or higher. It is the difference between a screen that is correct and a screen someone shows to a friend. A correct screen is a list of well-spaced cards; a remembered screen has one idea you can see.

## Contents

- Start from one idea
- Build the hero
- Surface: colour, type, material
- Motion as identity
- Bespoke navigation and controls
- Character and illustration
- The wow test
- Building it natively

## Start from one idea

Timid is the default failure. Left alone, a model produces a neutral background, a rounded card with a big number, a list and a tab bar. Nothing is wrong and nothing is there.

1. **Name what the user comes for:** the one number, state or object this screen exists to show.
2. **List the product's physical world:** its objects, materials, places, instruments, rituals, printed matter, even its name. A tide app has water, a harbour wall, a moon, a printed tide table.
3. **Ask what in that world already shows this kind of value.** The table gives ways the physical world displays common kinds of value. Use it to get unstuck, then replace the generic answer with one from the product's own world.

| The screen's main value is | The physical world shows it as |
|---|---|
| An amount that goes down or up | A vessel filling or draining, a stack, a flame, a gauge, sand |
| Progress toward a goal | A path travelled, a climb, something growing, an eclipse closing |
| A time or a schedule | A sky, a sun arc, a shadow, a dial, a tide |
| A rhythm (breath, pace, pulse) | A wave, a pendulum, a swell, a metronome |
| A collection | A shelf, a deck, a wall, a garden, a constellation |
| A place or a route | Terrain, a line on a map, a horizon, a transit diagram |
| A choice among people or things | Cards in a hand, a table, a stage, a window display |
| A conversation or a stream | A thread, a ribbon, a page being written |

4. **Say it in one sentence with no interface words.** "A tide line climbing a harbour wall at dusk" is a concept. "A clean card showing the balance" is not.
5. **One idea, carried everywhere.** The same concept decides the hero, the palette, the icon style, the motion and the copy. Five ideas on one screen read as none.

Do not reuse a concept from another product, and do not take the table's first row as the answer. A tide app shows a tide; a coffee subscription shows a cup going cold.

## Build the hero

The hero is the concept made visible. It is the first thing the eye lands on and the thing a user would describe to someone else.

- **It is the largest thing on the first screen, sized by Density.** At Density 1 and 2 it may take half the screen or more. At Density 3 about 40 percent. At Density 4 and 5 a quarter to a third, and it then has to carry more of the data itself. Never a strip, never a card among cards.
- **It does not eat the brief.** Everything the user asked for stays on the first screen or one obvious scroll away: at least the first rows of every requested section show above the fold, uncut.
- **It does not repeat.** If the hero shows a figure that a bar or a row also shows, merge them.
- **It carries the screen's main data.** The level, angle, length, count or colour is the real value, mapped truthfully. A decorative illustration next to a number is not a hero.
- **It is drawn, not assembled.** Vector paths, canvas or shaders, built for this product. Rounded rectangles with text inside are layout, not a hero.
- **The number lives in it,** on it or behind it, not in a label beside it. Keep the exact figure readable; the object gives the feeling, the digits give the fact.
- **It has depth:** a light direction, a highlight, a shadow, layers that overlap.
- **It is alive:** a slow loop that never stops the eye from reading (see Motion).
- **It answers the main action.** When the user does the primary thing, something happens to the hero first.

Everything else on the screen gets quieter so the hero can be loud: one content sheet, one list, one set of controls.

## Surface: colour, type, material

**Colour**
- Drench the screen. A full-bleed coloured field with the hero on it reads as a brand; white with a small accent reads as a template.
- Two or three strong colours with jobs, plus one neutral family. Take them from the concept's world.
- Neither white nor near-black is a default ground. Both are what a screen looks like before anyone chose.
- A gradient is light falling on a surface from one direction, or it is data. It is never a rainbow and never the idea itself.
- Check contrast where text actually sits: on the gradient, on the liquid, on the photo.

**Type**
- Pick a display face with a voice that fits the concept, and set the hero numerals and titles in it: large, tight, confident. Hero numerals usually sit between 56 and 96.
- Requirements for the face: distinctive numerals with a tabular option, every glyph the product's languages and currency need, enough weights or a variable axis to tune.
- Shortlist three faces from different families and test them with the real words and numbers. Whatever face is fashionable this season is not a reason.
- Body text and controls stay in a quiet, highly legible face. The system font is a good one.
- In a native app the font is bundled and licensed, and it follows the user's text size.

**Material**
- Choose one material story (glass, glazed ceramic, paper, metal, cloth, light) and render every surface in it: the same light direction, the same highlight and shadow logic, the same grain.
- Stack the screen in layers: field, hero, content sheet, floating controls. Overlap them; a sheet that slides over the field has more depth than two flat halves.
- Icons belong to the material too: drawn in one style, sitting on tiles or objects that look made of the same stuff.
- A quiet pattern from the subject can sit in the field at very low contrast.

## Motion as identity

- **One choreographed entrance,** once: field, then hero, then sheet, then rows, then controls, all within about 1.2 seconds. Not the same fade on every element.
- **A living loop on the hero:** slow (4 to 8 seconds), small, continuous. Water moves, a flame flickers, a star field drifts. It pauses off screen and under Reduce Motion.
- **The signature interaction:** the primary action has a physical consequence in the hero within a tenth of a second. A breath starts and the shape swells; a page turns and the stack shifts. The number follows with a small tick, and a haptic lands with it.
- **Springs with character:** at Expression 4 and 5 the consequence of a tap may overshoot a little. Routine navigation still uses the platform's timing.
- **Shared elements between screens:** the hero travels into the detail screen instead of being replaced by it.
- Reduce Motion gets a designed still version, not a broken one.

## Bespoke navigation and controls

At Expression 4 and 5 the navigation and controls may be designed for the product: a floating dock, a central action, a dial, a gesture surface. A custom part is allowed when it is finished:

- Every destination is still visible and labelled for assistive technology.
- Pressed, selected, disabled and focused states exist.
- Targets meet the size floor and sit clear of the home indicator and screen edges.
- The system back gesture still works, and every modal still has an exit.
- A gesture always has a visible alternative.

If you cannot finish a custom control to that standard, use the system one. A half-built custom tab bar is worse than the plain system bar.

## Character and illustration

Use a character when Warmth is 4 or 5 or the brand has one. Give it four to six states tied to real app states (idle, happy, waiting, worried, asleep, celebrating), draw it in the screen's material, and let it react to what the user does. A mascot that only decorates is clip art.

## The wow test

Run these before calling a screen done. Fail one and go back to the concept, not to the padding.

1. **Thumbnail:** shrunk among ten competing apps' screenshots, can you pick yours out?
2. **One sentence:** can you describe it without naming an interface component?
3. **Removal:** delete the hero in your head. If the screen still looks finished, the hero was decoration.
4. **Stillness:** pause all motion. Does a single frame still hold?
5. **Share:** is there one thing here a user would screenshot to show someone? Name it.
6. **Truth:** does the hero show the real value correctly, and can the exact figure still be read?
7. **Brief:** is every item the brief asked for still on the screen, uncut and not covered by anything that floats?
8. **Floor:** do the usability checks in the main workflow still pass?

## Building it natively

A prototype proves the idea; the native build has to keep it. Use what the project already has, and check each API against the project's SDK before relying on it.

| Need | SwiftUI | Jetpack Compose | Flutter | React Native |
|---|---|---|---|---|
| Drawn hero | `Canvas`, custom `Shape` with `animatableData` | `Canvas`, `drawWithCache`, `Path` | `CustomPainter` | A Skia canvas library if the project has one, otherwise SVG |
| Living loop | `TimelineView(.animation)`, `PhaseAnimator` | `rememberInfiniteTransition` | `AnimationController` with `repeat` | Reanimated shared values on the UI thread |
| Tap consequence | `withAnimation(.spring)`, `KeyframeAnimator` | `Animatable`, `spring()` | `AnimationController`, `SpringSimulation` | Reanimated `withSpring` |
| Light, glass, grain | Materials, `MeshGradient`, shader effects | `graphicsLayer`, `RuntimeShader` on recent Android | `FragmentProgram` shaders, `BackdropFilter` | Skia shaders if available |
| Hero travels between screens | `matchedGeometryEffect`, zoom navigation transition | Shared element transitions if your version has them | `Hero` | The navigation library's shared transition if it has one |
| Display font | Bundle it, register it, use it through a scaled text style | Bundle it in the font resources, expose it in `Typography` | Declare it in `pubspec.yaml`, expose it in `TextTheme` | Load it with the font tooling the project uses |

Blur, shaders and large shadows cost frames. Measure the hero on a mid-range phone; if it drops frames, simplify the effect before you ship the stutter.
