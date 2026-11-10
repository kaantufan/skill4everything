# Signature: an identity that is not the model's

Read this before designing or building any screen. A screen still needs one idea of its own. But a model's taste is itself recognisable, and people who look at generated interfaces every day spot it in a second: the same few typefaces, pictures and icons drawn from vector paths, a coloured field with a rounded sheet rising from the bottom, soft glows, headers with attitude, metadata strung on middle dots. Measured across this skill's own earlier output, one serif display face appeared on five screens out of eight.

So the choices where taste shows are not yours to make. A script deals them, and real material replaces what you would otherwise draw.

## Contents

- Deal the hand
- What you still decide
- The hero
- Type
- Colour and effects
- Icons and imagery
- Copy
- Motion
- The fingerprint check
- Building it natively

## Deal the hand

```
node scripts/deal.mjs --seed "<product name>" --platform ios
```

Use `android` or `both` as the platform when that applies. The hand fixes the type scheme and family, the icon set, the layout skeleton, the navigation, the shape family, the ground, the palette structure, the effects budget, the voice and the kind of hero. The same product name always gives the same hand, so a product keeps its look across sessions and two products do not share one.

- **The hand is binding.** Do not swap a card for something you prefer. That preference is the fingerprint.
- **One reroll** (`--reroll 1`) when a card contradicts the brief: a deep ground for a daytime utility, a layout that cannot hold what was asked for or that no leading app in the niche uses for this screen (a timeline spine on a music player), a hero type the data cannot feed. Say which card and why.
- **A brand or existing design system outranks the hand.** In the Inherited lane, take only the cards the brand leaves open.
- **Without Node:** open the script; its lists are plain arrays. For each list, take the sum of the character codes of the product name modulo the list length.

## What you still decide

- **The concept:** one idea from the product's own world, said in a sentence with no interface words. It now shows through structure, data and words: what the hero measures, what things are called, what order they come in. It does not show through a picture.
- **The hue,** taken from the product's world, inside the dealt ground and palette structure.
- **The content:** real, specific and a little uneven.
- **The behaviour:** everything in the niche file.

## The hero

The hero is the largest thing on the first screen and it shows the screen's main value. Its kind comes from the hand.

- **Conventional unless the hand says otherwise.** When the hand deals the conventional hero, use the form the niche's leading apps use for this value: a route map for a run, a balance figure for money, artwork for music. A clever new chart for a value that already has a familiar form reads as a model showing off. A new form is allowed only when it is the product's core feature and the brief names it.
- **It is made of data or of real material.** A figure set in type, a chart, a bar, a ring, steps, a route line: geometry the platform's shapes or a charting library would produce. Or a real photo, artwork or map in a designed frame.
- **You do not draw pictures.** No objects, scenes, landscapes, characters, mascots or decorative shapes built from vector paths. Model-drawn illustration is the most recognisable thing on a generated screen.
- **When the product needs imagery** (food, places, people, artwork, maps), leave a slot with a flat neutral fill and nothing written in it: no label, no icon, no note. Name what belongs there in the accessibility label and under Open in the report, and use real files when the project has them. A note like "Map tiles here" or "Photo needed" on screen is a builder talking to itself, and it is the first thing a reviewer reads.
- **Sized by Density.** At Density 1 and 2 up to half the screen, at 3 about 40 percent, at 4 and 5 a quarter to a third.
- **It does not eat the brief.** Everything the user asked for stays on the first screen or one obvious scroll away, uncut.
- **It does not repeat** a figure that a bar or a row already shows.

## Type

- Follow the dealt scheme exactly. Most hands give one family or the system font. Do not add a second face for contrast: a serif headline over a sans body is a reflex, not a decision.
- Hierarchy comes from size, weight, spacing and position. Three sizes on a screen are usually enough.
- **Numbers are set as one string.** No dimmed or shrunken decimals, no superscript currency sign, no tiny unit beside a giant figure, unless the platform's own app for this job does it. A giant figure with a small grey unit, repeated across screens, is one of the first habits a reviewer spots.
- Never use a face from the script's overused list (`--list` prints it), dealt or not.
- Check that the family has every glyph the product needs, including currency signs and letters such as ğ, ş, ı and İ, and a tabular figure option for numbers that change. Measure it: render "0000" and "1111" and compare widths. A family that fails either check on a screen whose numbers change in place is a reason for the one reroll, not for a second face.
- In a native app the family is bundled, licensed and follows the user's text size.

## Colour and effects

- Ground, palette structure, hue sector, chroma and the default appearance come from the hand; inside the sector, the exact hue comes from the product. Do not move to a neighbouring sector because you prefer it.
- **The dealt appearance is the one you design and show first.** A dark first appearance with one pink or coral accent on near-black is itself a recognisable generated look.
- **Some combinations give generated work away whatever the product:** a cream or beige ground with a clay, terracotta or burnt-orange accent; deep navy or near-black with amber or gold; deep teal with coral. If the subject leads you to one, shift the hue or the ground until it is no longer that.
- **The effects budget is literal.** "Flat" means no gradients, no glow, no blur, no grain, no inner highlights and no decorative shadows. Shipped apps are mostly flat; their depth comes from the system's own bars and sheets.
- Check contrast where the text actually sits.

## Icons and imagery

- Icons come from the dealt set in a prototype and from the platform set in a native build. Never write the paths of an icon yourself. If the set has no fitting glyph, use the nearest real one or a text label.
- Render and look: an icon name that does not exist shows as a blank or as raw text.
- One weight throughout; a filled variant only to mark selection.
- No sparkle, star-burst or magic-wand glyphs, as decoration or as a sign for anything "smart".
- Photos, artwork and avatars are real files or labelled slots. No gradient standing in for a photo, no silhouette people, no avatar services.

## Copy

- Write in the dealt voice.
- **Label, do not narrate.** Shipped apps name things and show figures; they rarely explain them in sentences. At most one explanatory sentence on a screen, and only where a decision depends on it (a fee, a deadline, a consequence). No sentences that retell the data ("You held between 5:24 and 5:31 from km 2 to km 4"), no reassurance ("Fees are in the total below"), no instructions for what the phone will do.
- **Labels are short.** "Avg pace", not "Average pace against your average"; "Fee", not "Delivery fee for this order".
- **Sample data is ordinary.** Use what real accounts contain: default names the app itself would generate ("Morning Run", "Tuesday 7:12"), common merchants and clients, everyday places. Crafted micro-stories (a named coastal route to a lighthouse, a fire lookout with 41 steps, a client called Northfold Ltd) are the specificity a model reaches for to look real. Places are named at the level the app would show, a district or a city, not a neighbourhood, street and district in one line.
- Section titles are the plain nouns people expect: "Reviews", "Splits", "Menu". Not lines with attitude.
- Do not chain metadata with middle dots. Use what the platform uses: a second line, a column, a comma, a secondary label. One separator in a row at most.
- Sample data is uneven and locally plausible, and includes one long value, one missing value and one zero.
- No exclamation marks, no emoji, no tracked uppercase labels above headings.

## Motion

- Navigation uses the platform's own transitions.
- The primary action has one clear consequence on the hero, quick and without overshoot unless Energy is 4 or 5.
- No entrance choreography and no perpetual decorative loop unless the effects budget and Energy both allow it. A loop is for something that is really in progress.
- Ship the Reduce Motion variant with the animation.

## The fingerprint check

Look at the render, scrolled to the top and to the bottom, and answer each. Any "yes" is fixed before the work is done.

1. Is there a typeface, icon, colour pair or layout here that I chose because I like it, not because the hand or the product gave it?
2. Did I draw anything pictorial, or any icon?
3. Is this a coloured field with a large object and a rounded sheet rising under it, when the hand dealt something else?
4. Is there any glow, blur, grain or gradient beyond the budget?
5. Are there middle-dot chains, headers with attitude, eyebrow labels or sparkles?
6. Is there a pill-shaped thing that is neither a control nor a real state?
7. Placed next to the other screens I have made, does this one share their skeleton, their type pairing or their palette?
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
| Real imagery | Asset catalog, `AsyncImage` with a designed placeholder | Image resources or the image loader the project uses | Assets or the image package the project uses | The image component the project uses |
