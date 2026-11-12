# Direction: a coherent look that is not the model's

Read this before designing or building any screen. A screen still needs one idea of its own. But two things make generated interfaces recognisable: the model's own taste (the same few typefaces, drawn pictures and icons, a coloured field with a rounded sheet, soft glows, metadata strung on middle dots), and the opposite cure, random choices that do not belong together (a serif running summary in purple on black, a maroon music player). So the look is dealt from a researched direction that fits the niche, and real material replaces what you would draw.

## Contents

- Why directions
- Deal the direction
- Layout is conventional
- Real material, never grey
- Wow: one signature moment, done properly
- Type
- Colour and effects
- Copy
- The fingerprint check
- Building it natively

## Why directions

- Taste is a tell, and dice are incoherent. Celebrated apps start from the subject and derive one system: a white or near-black ground, one rationed accent, usually one type family (often the system font), an imagery rule and one signature interaction.
- Of the apps whose type is documented, almost all use one family, and hierarchy comes from size and weight. Colour is rationed. Imagery comes from the content or is commissioned.
- No celebrated app shows grey placeholder boxes. They derive the visual from the content, or show no hero image.
- A longer ban list is the next fingerprint: a model that is told not to do X moves to the next most likely choice. So the skill derives the look from the direction and the product, and keeps only a short floor.

## Deal the direction

```
node scripts/deal.mjs --seed "<product name>" --niche <niche-id> --platform ios
```

`--platform` takes `ios`, `android` or `both`. The niche id is the name of a niche file without `niche-` and `.md` (the index in the main workflow lists them). The niche has a shortlist of two or three fitting directions; the seed picks one, then a face, an accent and a signature moment inside it. The same product name always gives the same result.

What is binding:

- **The direction:** surface, radii, density, imagery rule and motion character.
- **The face.** Use exactly one family. The one exception is `reading-room`: a dealt text face for reading and the system font for UI. (`pro-tool` may add IBM Plex Mono for numeric readouts only.)
- **The token values.** Copy the hexes for ground, raised, ink, ink-2, line, accent, on-accent, positive and negative, in light and dark. Contrast is already checked. You may move the accent to a brand colour the brief gives.
- **The icon set**, with its CDN link and markup. Never write icon paths yourself.
- **The signature motion** (from the niche: the primary action's consequence travelling as real content) **and the detail** (from the direction: the small motion character). You may swap either for another from its own list when the screen cannot host it; say why. The detail is never a second signature.
- **One reroll** (`--reroll 1`) when the direction contradicts the brief: a night direction for a daytime utility, an imagery rule the product cannot meet. Say why.

A brand or an existing design system outranks the direction. In the Inherited lane take only what the brand leaves open.

What you still decide: the concept (one idea from the product's own world, said with no interface words), the content, the behaviour (the niche file) and which real material goes where.

Without Node: open the script. `NICHES` names the shortlist for each niche, and `DIRECTIONS` holds everything else as plain data. Take the first direction listed, its first face, first accent and first signature moment.

## Layout is conventional

Use the structure the niche's leading apps use for this screen; the niche file names them. The direction changes surface, type, colour, imagery and motion, not where things go. A restaurant page has the photo header, the delivery facts, the menu sections and the cart bar in the order users know. Identity comes from type, colour, real material, copy and the signature moment. A novel layout for a familiar job reads as a model showing off.

## Real material, never grey

Follow the direction's imagery rule.

- **Photos, covers, portraits and maps** come from `assets/imagery.md` and from the map technique in the prototype notes. A native build uses the project's own files.
- **Every image slot uses the never-grey pattern:** a coloured fallback close to the photo's dominant colour, a fade-in, and removal on error. A slot never shows a flat grey, a label or an icon where the picture belongs.
- **Do not draw pictures.** No model-drawn illustrations, scenes, mascots or icons. A gradient or a vector scene in place of a photo reads as generated.
- **Text on a photo sits on a real scrim** and passes contrast.
- **Choose photos that match the content** (a kebab dish for a kebab restaurant, a bedroom for a sleep app), consistent in light and crop across one screen. A photo goes on an item only when the catalogue describes that item; a lahmacun card showing a kebab plate is worse than a card with no photo.
- **Covers are not famous paintings and not blurs.** For album, podcast or book covers use photos with a subject: a person, a place, a street at night, a record or an instrument. A well-known artwork reads as pastiche, and a soft abstract blur reads as a generated gradient; both were called out in blind judging. Track titles stay ordinary, never written to match the picture.
- **No imagery the direction does not want.** The data directions let the chart or a real map be the image; the pro directions let the subject be the image. Where the rule says "no stock photos", add none.

## Wow: one signature moment, done properly

- **The dealt signature motion is the screen's one memorable interaction:** the same object travels from one state to the next (the add button becomes the stepper and the dish flies into the cart bar, the cover grows into Now Playing, the card flips to its back). Build it with `assets/motion-kit.js` and the techniques in the motion file, and finish it: interruptible, springs for what the finger moved, under about 400 ms, with a Reduce Motion variant. 3D only for objects you could hold.
- **Everything else gets press feedback only.** Frequent actions get no animation. No entrance choreography, no perpetual decorative loop. A loop is for something truly in progress.
- **The type scale has real contrast.** The hero size is about 2.5 to 4 times the body size.
- **The hero image or data is large and real.** The hero shows the screen's main value: a figure set in type, a chart, a route, a photo, a cover. It is sized by the Density dial, and it does not eat the brief: everything the user asked for stays on the first screen or one obvious scroll away.
- **Restraint is not absence: give the brand one surface.** In blind judging, screens whose accent lived only on one button were called "clean but generic, a wireframe, no brand identity", and lost on appeal to louder generated screens. Each screen carries the product's name or wordmark once, and one large area where the direction's colour or the content's colour lives: a tinted hero, a brand-coloured balance or summary card, a header wash sampled from the photo, the accent filling the main data mark (the route, the ring, the bar that matters). Everything around it stays quiet.
- **Make the brand surface big enough to own the screen.** In hands-on judging, screens that were correct but quiet were still called "clean but generic, a stock iOS template, system blue" and lost appeal. In the first viewport, the brand surface covers roughly a fifth of the screen or more, and the product's name appears once at title size in the ink colour or on the brand surface. Never set the name alone in the accent colour as a stand-in logo: AI-detection judges called "the app name in the accent colour" a generator's habit. Pick one product-specific visual idea from the concept and repeat it through the screen in type, colour or the content's own shapes (the night band of a sleep app, the receipt rule of a money app, the route colour of a running app), never a drawn picture.
- **Wow comes from real content shown large, one brand surface and one physical interaction,** not from effects.

## Type

- Use the dealt face and the dealt scale. One family; hierarchy comes from size, weight, spacing and position. A serif headline over a sans body is a reflex, not a decision.
- **Tabular figures** for every number that changes or lines up. Measure it: render "0000" and "1111" and compare widths. A family that fails on a screen whose numbers change in place is a reason for the one reroll, not for a second face.
- **Numbers are set as one string.** No dimmed or shrunken decimals, no superscript currency sign, no tiny grey unit beside a giant figure, unless the platform's own app for this job does it.
- **Glyph check:** render ğ ş ı İ ₺ € in the face. A fallback glyph in a headline ruins it.
- Never use a face from the overused list (`--list` prints it), dealt or not.
- In a native app the family is bundled, licensed and follows the user's text size.
- **No italic in headings or UI labels.** No eyebrow or kicker above a heading; the heading says it. No bar, rule or border on the edge of a heading, label, quote, stat or card.

## Colour and effects

- **Use the dealt tokens.** Contrast was checked in code (ink 7:1, secondary ink 4.5:1, the label on the accent 4.5:1, the accent against its ground 3:1). Check it again where the text actually sits.
- **The dealt appearance is the one you design and show first,** set explicitly rather than left to the system. Screens used in the dark (bedtime, now playing) stay dark-first whatever the dial says. The other appearance follows the system in the native build.
- **Effects:** no gradient except a photo scrim or a data-driven ground. No glow, no grain, no coloured shadows, no glass unless it sits over real content and passes contrast. Shipped apps are mostly flat.
- **Pairs that give generated work away,** whatever the product: cream with terracotta; navy or near-black with amber or gold; deep teal with coral; near-black with acid green as a decorative mood (the lime in `austere-dark` is a functional signal, used only on data and the primary action); purple-to-blue gradients; pink or coral on near-black. If the subject leads you to one, shift until it is no longer that.

## Copy

- **Label, do not narrate.** Shipped apps name things and show figures; they rarely explain them in sentences. At most one explanatory sentence on a screen, and only where a decision depends on it (a fee, a deadline, a consequence). No sentences that retell the data, no reassurance, no instructions for what the phone will do, and no caption that explains how a chart, bar or meter works ("Last bar: the final 0.46 km", "Strength drops when..."): judges read those as the model narrating its own design. Mark the odd bar itself (a hatch and "0.46 km" on its axis) instead.
- **Labels are short.** "Avg pace", not "Average pace against your average". "Fee", not "Delivery fee for this order".
- **Sample data is ordinary.** Use what real accounts contain: default names the app itself would generate ("Morning Run", "Tuesday 7:12"), common merchants and clients, everyday places. Crafted micro-stories are the specificity a model reaches for to look real. Places are named at the level the app would show, a district or a city.
- **Sample people have made-up names,** common for the product's locale, never the famous sample sets (Northwind, Contoso, Acme, Globex, Jordan, Alex, Taylor). Sample data stays in the product's language and currency.
- **Selling points are plain facts.** "Terrace", "Stone walls, 1890s", "Sleeps 3", not one-liners with scenery ("Balloons rise past the terrace at sunrise"). Interests and hobbies are ordinary ("Running", "Coffee"), not curated artisanal lists.
- **No sentence above the hero number** explaining what it is; a short label does that ("Sleep window").
- Section titles are the plain nouns people expect: "Reviews", "Splits", "Menu". Not lines with attitude.
- No middle-dot chains: use a second line, a column, a comma or a secondary label. At most one separator in a row.
- Sample data is uneven and includes one long value, one missing value and one zero.
- No exclamation marks, no emoji, no build notes on screen. Notes go in the report.
- **Icons only on controls and navigation,** from the dealt set, never Unicode glyphs (check, cross, star, dot, triangle, arrow). Use the platform's own symbol for a concept: a star only in a rating, a check only for a selected or done state, no arrow on a button, no 01 02 03 on a list, no sparkle, rocket, bolt, flame or leaf as decoration.

## The fingerprint check

Look at the render, scrolled to the top and to the bottom, and answer each. Any "yes" is fixed before the work is done.

1. Is there anything here that did not come from the direction, the product or the content?
2. Did I draw anything pictorial, or any icon?
3. Is there any grey or empty slot where real material belongs?
4. Is there any glow, blur, grain or gradient beyond a photo scrim or a data-driven ground?
5. Are there middle-dot chains, headers with attitude, an italic heading word, eyebrow labels, a bar beside a heading or card, glyphs for icons, arrows on buttons, 01 02 03, icon tiles, sparkles, or a pill that is neither a control nor a real state?
6. Is the accent only on a button, with no brand surface and no product name on screen? (A "yes" reads as a wireframe.)
7. Is the screen's layout one the niche's leading apps would recognise? (A "no" is the problem.)
8. Does any text on screen talk to a builder, explain the data in a sentence, or tell a crafted little story where a real account would hold something ordinary?
9. Is the hero a clever new form for a value that already has a familiar one?
10. Does any text, row or control run under a bar, a floating button or the home indicator at any scroll position?

Then run `scripts/slop-scan.mjs` on the source, and check the brief test and the floor in the main workflow.

## Building it natively

Check each API against the project's SDK before relying on it.

| Need | SwiftUI | Jetpack Compose | Flutter | React Native |
|---|---|---|---|---|
| Data-drawn hero | Swift Charts, `Canvas`, custom `Shape` | `Canvas`, `drawWithCache`, a charting library the project has | `CustomPainter`, a charting package the project has | A charting or Skia library the project has, otherwise SVG |
| Tap consequence | `withAnimation(.spring)` | `Animatable`, `spring()` | `AnimationController`, implicit animations | Reanimated `withSpring` |
| Icons | SF Symbols | Material Symbols | The platform sets, or the dealt set's package | The platform sets, or the dealt set's package |
| Dealt typeface | Bundle it, register it, use it through a scaled text style | Font resources, exposed in `Typography` | `pubspec.yaml`, exposed in `TextTheme` | The font tooling the project uses |
| Real imagery / content colour | Asset catalog, `AsyncImage` with a coloured placeholder from the photo's dominant colour; sample the colour once at load (`CIAreaAverage`) | Image resources or the image loader the project uses, with a coloured placeholder; the Palette API for the sampled colour | Assets or the image package the project uses, with a coloured placeholder; `palette_generator` for the sampled colour | The image component the project uses, with a coloured placeholder; a colour-sampling library the project has |
