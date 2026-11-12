---
name: mobile-ui-craft
description: >-
  Design, build, restyle and review mobile app UI and UX for iOS (SwiftUI, UIKit), Android (Jetpack Compose, Kotlin), Flutter and React Native or Expo, so each app gets a coherent look of its own that does not read as AI-generated: a researched direction dealt from the niche, real photos and maps instead of drawn or empty slots, and UX that carries the task one step further with real states. Use this skill whenever the task touches a mobile screen, flow, component, theme, navigation, onboarding, paywall, animation, haptics, icon set or app mockup or prototype, or the user says an app looks generic, plain, off, cheap or AI-made, even if they never say "design". Not for websites or desktop apps.
license: MIT
metadata:
  version: "5.0.0"
  baseline: "2026-11"
---

# Mobile UI Craft

A mobile screen is remembered when it has an idea: one concept from the product's own world, built into a hero the user can see and touch, on a surface with a point of view. Generated UI fails the other way: nothing on it is wrong, but nothing was chosen: a neutral background, a rounded card with a big number, a list, a tab bar. It looks like every other app.

Two more failures: a model's own taste is recognisable (the same few typefaces, hand-drawn pictures and icons, a coloured field with a rounded sheet, a glow), and random choices are incoherent (a serif running summary in purple on black, a maroon music player). So this skill deals a researched direction from the niche (surface, type, colour, imagery rule and motion, taken from how celebrated apps are built), puts real material where you would draw or leave an empty slot, and asks for a prototype that demonstrates the task, not a static picture.

Two rules outrank the rest:

- **The brief wins.** An existing design system, brand guideline or explicit user instruction overrides any preference in this skill. Never add a second system next to one that exists.
- **Never invent facts.** No made-up metrics, ratings, testimonials, prices, partner logos or regulatory claims. Use realistic sample data to test layout, say so, and ask for the real thing.

## 1. Read the situation

Look at the project first. Settle four things, and ask only for what you cannot find.

**Lane: how much freedom you have**

| Lane | When | What you do |
|---|---|---|
| Full direction | New app, new product area, or a requested redesign | The whole workflow below |
| Inherited | The project already has a theme, tokens, `DESIGN.md` or brand | Skip the creative part of step 2. Extract the existing system, conform to it, put the ambition into the hero and motion |
| Local polish | "Fix this screen", "make this feel better" | No new direction. Steps 4 and 5 only |

**Stack: read exactly one platform file**

| Signal in the project | Read |
|---|---|
| `.xcodeproj`, `Package.swift`, `.swift` views | `references/ios.md` |
| `build.gradle(.kts)` with Compose, `.kt` composables | `references/android.md` |
| `pubspec.yaml` | `references/flutter.md` |
| `react-native` or `expo` in `package.json` | `references/react-native.md` |
| One codebase shipping to both iOS and Android | also `references/cross-platform.md` |
| No project yet, only a mockup or prototype is wanted | `references/preview.md` |

Platform files say what the system gives for free. At high Expression you may replace its look; know what you replace.

**Niche: read exactly one niche file** from the index at the end of this document. It says who the user is in the moment, what the screen must answer, which states to design and what to refuse. Where a niche file's look advice is quieter than your Expression dial, the dial decides the surface; the niche file still decides behaviour: trust signals, safety, refusals.

**Task: read one or two task files**

| Task | Read |
|---|---|
| Designing or building screens, a mockup or a prototype | `references/signature.md` and `references/ux-check.md`; a prototype also `references/motion-haptics.md`. `references/craft.md` is for native builds and polish once the structure stands |
| "Looks generic, plain, AI-made, boring", or a restyle | `references/signature.md` and `references/slop-tells.md` |
| Review or audit without edits | `references/review.md`, `references/slop-tells.md` and `references/ux-check.md` |
| Animation, transitions, gestures, haptics | `references/motion-haptics.md` |
| Onboarding, sign-up, permissions, paywall, forms, navigation structure, empty and error states | `references/ux-flows.md` |
| Rendering, capturing or checking a prototype | `references/preview.md` |

Reading budget: one platform file, one niche file, two task files. A prototype task reads `references/preview.md`, one niche file, `references/signature.md`, `references/ux-check.md` and `references/motion-haptics.md`. Loading everything dilutes it.

## 2. Write the brief

**Deal the direction first.** Run `node scripts/deal.mjs --seed "<product name>" --niche <niche-id> --platform ios` (or `android`, `both`) from this skill's folder; the niche ids are in the index below. It fixes the direction, typeface, accent, colour tokens for light and dark, icon set, imagery rule, one signature motion from the niche and a small detail motion. The direction is binding: `references/signature.md` says how to use it and when one reroll is allowed.

Before any UI code, write this brief. It is the mechanism that makes a banking app and a meditation app come out different, so do not skip it or fill it with adjectives. "Clean", "modern" and "premium" describe every generated app; replace each with a choice someone could check.

```
Product:    who uses it, for what job, in what moment (where, how long, one hand or two)
Platform:   stack, minimum OS, existing design system (yes / no)
Niche:      primary niche -> stakes (trust 1-5), vulnerable users?, session (glance / short / immersive)
Dials:      D_ E_ W_ X_  (niche preset, then what you changed and why)
Concept:    the one idea, in a sentence with no interface words
Direction:  the dealt direction, face, accent and detail motion; any reroll and the reason
Signature motion:  the dealt niche motion, and the real content that travels
First screen answers:  the niche question from the UX check (what the first viewport tells the user)
Next step built:  the second view of the primary task (a cart sheet, a review sheet, the next profile)
Material:   which real photos, covers, map or data fill every slot
Avoiding:   the niche cliché AND the over-correction (both are in the niche file)
Refusing:   dark patterns this niche tempts that will not be built
```

**The four dials** turn the brief into numbers. Each niche file gives a preset for D, E and W; adjust it for this product and say why.

| Dial | 1 | 3 | 5 |
|---|---|---|---|
| **D Density** | One job per screen. Rows 64+ tall, 32-40 between sections | Rows 52-60, 24 between sections | Rows at the platform minimum, 16 between sections, dividers instead of cards |
| **E Energy** | Near-monochrome, fades, no overshoot, no celebration | Strong colour with jobs, springs, one authored moment | Several hues, overshoot on what a finger started, celebration at real milestones |
| **W Warmth** | Small radii (4-8), hairlines, precise neutral copy | Medium radii (10-14), plain friendly copy | Large radii (20-28), conversational copy, a character with a job |
| **X Expression** | System components and the platform's look. Only the accent and the content are the product's | Native skeleton with the dealt direction applied in full | Custom navigation and controls built for the product, a custom data-driven hero, choreographed motion |

Values 2 and 4 sit between the columns. Sizes are in pt on iOS and dp on Android.

**Expression defaults to 3.** Go to 4 or 5 only when the brief asks for a fully bespoke product, and drop to 1 or 2 for a quiet or strictly native brief, or a work tool where speed matters more than feeling (field work, enterprise, civic, clinical). From Expression 3 up, a concept is required, not optional.

**The direction decides the surface; the product decides the content.** The direction settles typeface, colour, icons, imagery rule and motion character, because left to choose you return to the same few. The concept, the words and the real material come from the product's own world: its objects, places, instruments, printed matter, even its name.

**One idea, carried everywhere.** The concept decides what the hero measures, what things are called, the order they come in and the copy. Do not reuse another product's concept, or the previous project's.

For Full direction work, save the brief as `DESIGN.md` in the project root (or add it to the existing design doc) so later sessions inherit the direction instead of deriving another. Ask first if the user did not ask for files.

## 3. Check the plan against defaults

Before building, answer each in one line and revise the brief on any "no":

1. **One-sentence test.** Can you describe the first screen without naming an interface component? "This month as a statement that ends in what is safe to spend" passes. "A card with the balance and a list" does not.
2. **Thumbnail test.** Shrunk among ten competing apps' screenshots, would yours be the one a person can pick out?
3. **Any-app test.** Would this plan come out the same for a different product in this niche? Name three choices drawn from this product's content, copy and signature moment.
4. **Cliché test.** Does it match the niche cliché, or the over-correction, from the niche file?
5. **Job test.** Does the hero answer what the user came for within a few seconds, and is the exact figure still readable?
6. **Brief test.** Is everything the brief asked for on the first screen or one obvious scroll away, with the hero in place? A hero that pushes requested content out of sight fails.
7. **UX test.** Does the first viewport answer the niche question, and is the next step of the primary task built?

## 4. Build

The conventional niche layout with real material first, then the signature moment, then the states.

1. **Lay out the screen the way the niche's leading apps do, with real photos, covers or data in every slot,** and look at it alone, with the dealt face and icon set loaded. If that does not carry the screen, polish will not.
2. **Then the signature**: the dealt morph of real content, built with `assets/motion-kit.js`, interruptible, with a Reduce Motion variant.
3. **Tokens in one place.** Colour roles, type roles, spacing steps, radii by role and motion timings live in one theme file, in the stack's idiom. Screens import tokens; they contain no raw colours or one-off sizes.
4. **Real states and content** while building, not after: loading, empty, error, offline.

**The floor.** These thirteen hold for every screen at every Expression level. Bold design that fails them is unfinished.

1. **Touch.** Every target is at least 44×44 pt on iOS or 48×48 dp on Android, with 8 between neighbours.
2. **Text scales.** Text follows the user's text size, custom fonts included. At the largest size content reflows or scrolls; essentials never clip.
3. **Insets.** Safe areas, status bar, home indicator, cutouts and keyboard come from system inset APIs, never from a hard-coded number.
4. **Contrast.** At least 4.5:1 for body text and 3:1 for large text and icons, measured where the text actually sits: on the gradient, the glass, the photo. The hero's own figures get the strongest contrast, never the faintest. Meaning never rests on colour alone.
5. **States.** Every data screen has loading, empty, error and content. Add offline and permission-denied where they can happen.
6. **Nothing hidden.** Content never sits under a floating bar, button or toast. A scrolling area ends with padding as tall as whatever floats over it; a toast never covers what it describes.
7. **Back and dismiss.** The system back gesture works even under custom navigation. Every sheet and modal has an obvious exit.
8. **Custom parts are finished.** A bespoke control or navigation element has pressed, selected, disabled and focused states, an accessibility label and role, and a non-gesture alternative. If you cannot finish it, use the system one.
9. **Motion respects the person.** A Reduce Motion variant exists. Nothing blocks input while it animates. Nothing loops behind text someone is reading.
10. **Keyboard.** The primary action is never under the keyboard. Each field has the right keyboard type, return key and autofill hint.
11. **Honesty.** No dark patterns: no forced sign-up before value, no permission prompt at first launch, no fee that first appears at the last step, no cancel path longer than the sign-up path, no fake urgency, no guilt copy on decline. If asked for one, say so and build the honest equivalent.
12. **Working controls.** Every enabled control does what it says, and its icon means what users expect it to mean. A destructive control sits apart from the primary action and offers undo or asks first. Sample numbers on a screen agree with each other.
13. **Frame rate.** The hero's effects hold full frame rate on a mid-range phone, or they get simpler.

## 5. Verify, then report

1. **Render it.** Build and screenshot in a simulator or emulator when you can. Otherwise use the stack's preview tool, and otherwise an animated HTML prototype. `references/preview.md` has the commands; rendering waits for images and the map. Look at several moments of the motion.
2. **Run the UX check** in `references/ux-check.md`: the single-screen pass on every screen, the flow pass across the task and, for a prototype, the self usability test in `references/preview.md` scored against the 9 bar.
3. **Run the fingerprint check** in `references/signature.md`: ten questions about whether anything on the screen is there because you like it, talks to a builder, or shows off.
4. **Stress the content.** A 40-character name, an empty list, a thousand items, a zero and a negative number, text 40% longer than English, the largest text size.
5. **Scan the source.** `node scripts/slop-scan.mjs <source-dir>` from this skill's folder: the blocking group must be clean before reporting; check other hits for intent. No Node: grep `references/slop-tells.md`.
6. **Stop after three fix rounds** and report what remains.

Close with this report. The first line is `Concept:` and the last two are required: stating what was not checked makes the rest believable.

```
Concept:       <one sentence> · D_ E_ W_ X_
Built:         <screens and files>
UX:            <9-bar score, checks and any cap; first-screen answer, next step built, states covered>
Motion:        <signature built and technique, Reduce Motion variant, filmed or not>
Decisions:     <3-5 choices specific to this product, each with its reason>
Verified:      <what was rendered or run, and on what: device, simulator, preview tool, HTML prototype, code only>
Not verified:  <what could not be checked>
Open:          <facts or assets needed from the user>
```

## Gotchas

- **Coherence beats novelty.** One direction through every token beats an interesting mix.
- **Grey boxes read as unfinished.** Use real material: a photo, a cover, a map, a chart. A gradient or vector scene in its place reads as generated.
- **A picture is not UX.** Carry the task one step further: the cart sheet, the review step, the next profile, with states.
- **Wow is real content that travels and carries the task:** the add button becomes the stepper and the item flies into the cart. Continuity, physics, real material; not effects, not loops.
- **3D is for objects you could hold:** a card, a cover, a ticket. Always a flat fallback; never for list navigation.
- **Your favourites are the tell.** The typeface you would reach for, the picture you would draw, the glow you would add: everyone has seen them a thousand times. Use the direction, real icons and real photos.
- **A hero shows data.** An illustration beside a number is decoration. The level, angle or length is the value.
- **Bold costs clarity unless you pay it back.** In blind judging, bold screens won on identity and lost on clarity whenever the hero crowded out what the brief asked for or a floating control covered content. Size the hero by the Density dial; check the brief test.
- **Check the glyphs.** The dealt face must contain every character the product needs, including currency signs and letters such as ğ, ş, ı and İ. A fallback glyph mid-headline ruins it.
- **A phone-sized web page is not an app.** Hero banners with marketing copy, max-width wrappers, hover states and footers inside an app are still the strongest generated tell.
- **Models invent API names.** If a referenced API is not in the project's SDK, trust the SDK.
- **References carry a baseline date.** Where the project targets something newer than `metadata.baseline`, prefer current platform documentation.
- **A single good screen proves nothing.** Check several screens side by side: the concept, the material and the voice must hold on all of them.

## Always-on rules

Skills load only when triggered, and agents skip them often: in one real project this skill loaded in about one run in five by itself and in every run with the always-on block present. If the project has an `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` or rules file, offer to append the block in `assets/always-on.md`.

## Niche index

Pick the niche by the job of the screen. The niche id is what `--niche` takes. For a hybrid product, read the primary niche and take the stakes from the more sensitive one. If nothing fits, set the dials from three questions: how costly is a mistake (lower E, lower W), how long is a session (glance means lower D per screen), and how vulnerable is the user (calmer, plainer, more exits).

| File in `references/` | Niche id | Covers | Preset |
|---|---|---|---|
| `niche-fintech.md` | `fintech` | banking, budgeting, payments, invoicing | D4 E2 W2 |
| `niche-crypto-trading.md` | `crypto-trading` | exchanges, wallets, brokerage | D5 E3 W1 |
| `niche-fitness-health.md` | `fitness-health` | workouts, activity and nutrition tracking | D3 E4 W3 |
| `niche-wellness-meditation.md` | `wellness-meditation` | meditation, sleep, mood, mental health | D1 E1 W4 |
| `niche-productivity-habits.md` | `productivity-habits` | to-do, planners, habits, focus | D3 E2 W3 |
| `niche-notes-writing.md` | `notes-writing` | notes, journals, documents | D2 E1 W2 |
| `niche-social-messaging.md` | `social-messaging` | feeds, communities, chat | D4 E4 W4 |
| `niche-dating.md` | `dating` | dating and matching | D2 E3 W4 |
| `niche-ecommerce.md` | `ecommerce` | shops, marketplaces | D4 E2 W3 |
| `niche-food-delivery.md` | `food-delivery` | delivery, restaurants, ordering | D4 E3 W4 |
| `niche-travel-transport.md` | `travel-transport` | booking, itineraries, maps, transit | D3 E3 W3 |
| `niche-education.md` | `education` | courses, language learning | D2 E4 W5 |
| `niche-kids.md` | `kids` | apps for children, with a parent area | D1 E4 W5 |
| `niche-media-streaming.md` | `media-streaming` | video, music, podcasts | D3 E3 W3 |
| `niche-news-reading.md` | `news-reading` | news, articles, read-later | D4 E1 W1 |
| `niche-ai-assistant.md` | `ai-assistant` | chat and voice assistants | D2 E2 W3 |
| `niche-utilities.md` | `utilities` | scanner, calculator, weather, converters | D2 E2 W3 |
| `niche-creative-tools.md` | `creative-tools` | photo, video, drawing, audio editors | D3 E2 W2 |
| `niche-smart-home.md` | `smart-home` | device control, automation | D3 E2 W3 |
| `niche-healthcare.md` | `healthcare` | telemedicine, patient portals | D2 E1 W3 |
| `niche-real-estate.md` | `real-estate` | property search, rentals | D3 E2 W2 |
| `niche-games-companion.md` | `games-companion` | casual games, game companion apps | D3 E5 W5 |
| `niche-b2b-field.md` | `b2b-field` | enterprise, field work, inventory | D4 E1 W1 |
| `niche-government-civic.md` | `government-civic` | public services, identity, alerts | D2 E1 W1 |
