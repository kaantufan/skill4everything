---
name: mobile-ui-craft
description: >-
  Design, build, restyle and review mobile app UI and UX for iOS (SwiftUI, UIKit), Android (Jetpack Compose, Kotlin), Flutter and React Native or Expo, so each app gets a look of its own that does not read as AI-generated: one concept, a data-carrying hero, and typeface, icons, layout and colour that are dealt and derived instead of left to a model's taste. Use this skill whenever the task touches a mobile screen, flow, component, theme, navigation, onboarding, paywall, animation, haptics, icon set or app mockup or prototype, or the user says an app looks generic, plain, off, cheap or AI-made, even if they never say "design". Not for websites or desktop apps.
license: MIT
metadata:
  version: "3.1.0"
  baseline: "2026-11"
---

# Mobile UI Craft

A mobile screen is remembered when it has an idea: one concept from the product's own world, built into a hero the user can see and touch, on a surface with a point of view. Generated UI fails in the opposite way. Nothing on it is wrong, but nothing was chosen: a neutral background, a rounded card with a big number, a list, a tab bar. It looks like every other app, so nobody says anything about it.

There is a second failure. A model's own taste is recognisable: the same few typefaces, hand-drawn vector pictures and icons, the same coloured field with a rounded sheet, the same glow. A trained eye spots it at once. So this skill gives every screen one idea, takes the taste decisions out of your hands by dealing them from a script, replaces what you would draw with real material, and keeps the floor that makes the result usable.

Two rules outrank everything else here:

- **The brief wins.** An existing design system, brand guideline or explicit user instruction overrides any preference in this skill. Never add a second system next to one that exists.
- **Never invent facts.** No made-up metrics, ratings, testimonials, prices, partner logos or regulatory claims. Use realistic sample data to test layout, say it is sample data, and ask for the real thing.

## 1. Read the situation

Look at the project before designing. Settle four things, and ask the user only for what you cannot find.

**Lane: how much freedom you have**

| Lane | When | What you do |
|---|---|---|
| Full direction | New app, new product area, or a requested redesign | The whole workflow below |
| Inherited | The project already has a theme, tokens, `DESIGN.md` or brand | Skip the creative part of step 2. Extract the existing system, conform to it, and put the ambition into the hero and the motion |
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

Platform files tell you what the system gives you for free and what it expects. At high Expression you may replace the system's look; you still need to know what you are replacing.

**Niche: read exactly one niche file** from the index at the end of this document. It tells you who the user is in the moment, what the screen must answer, which states to design and which patterns to refuse. Where a niche file's look-and-feel advice is quieter than your Expression dial, the dial decides the surface and the niche file still decides behaviour: trust signals, safety, refusals.

**Task: read one or two task files**

| Task | Read |
|---|---|
| Designing or building screens, a mockup or a prototype | `references/signature.md` first, then `references/craft.md` once the structure stands |
| "Looks generic, plain, AI-made, boring", or a restyle | `references/signature.md` and `references/slop-tells.md` |
| Review or audit without edits | `references/review.md` and `references/slop-tells.md` |
| Animation, transitions, gestures, haptics | `references/motion-haptics.md` |
| Onboarding, sign-up, permissions, paywall, forms, navigation structure, empty and error states | `references/ux-flows.md` |
| Rendering, capturing or checking a prototype | `references/preview.md` |

Keep the reading budget: one platform file, one niche file, two task files. Loading everything dilutes the parts that matter for this task.

## 2. Write the brief

**Deal the hand first.** Run `node scripts/deal.mjs --seed "<product name>" --platform ios` (or `android`, `both`) from this skill's folder. It fixes the typeface, icon set, layout skeleton, navigation, shape, ground, palette structure, effects budget, voice, hero type, hue sector and first appearance. The hand is binding: `references/signature.md` says how to use it and when one reroll is allowed.

Before any UI code, write this brief. It is the mechanism that makes a banking app and a meditation app come out different, so do not skip it and do not fill it with adjectives. "Clean", "modern" and "premium" describe every generated app; replace each with a choice someone could check.

```
Product:    who uses it, for what job, in what moment (where, how long, one hand or two)
Platform:   stack, minimum OS, existing design system (yes / no)
Niche:      primary niche -> stakes (trust 1-5), vulnerable users?, session (glance / short / immersive)
Dials:      D_ E_ W_ X_  (niche preset, then what you changed and why)
Concept:    the one idea, in a sentence with no interface words
Hand:       the dealt cards, one line each; any reroll and the reason
Hero:       the dealt hero type, and which real value it shows
Source:     what in the product's own world the hue and the wording come from
Motion:     what the primary action does to the hero
Avoiding:   the niche cliché AND the over-correction (both are in the niche file)
Refusing:   dark patterns this niche tempts that will not be built
```

**The four dials** turn the brief into numbers. Each niche file gives a preset for D, E and W; adjust it for this product and say why.

| Dial | 1 | 3 | 5 |
|---|---|---|---|
| **D Density** | One job per screen. Rows 64+ tall, 32-40 between sections | Rows 52-60, 24 between sections | Rows at the platform minimum, 16 between sections, dividers instead of cards |
| **E Energy** | Near-monochrome, fades, no overshoot, no celebration | Strong colour with jobs, springs, one authored moment | Several hues, overshoot on what a finger started, celebration at real milestones |
| **W Warmth** | Small radii (4-8), hairlines, precise neutral copy | Medium radii (10-14), plain friendly copy | Large radii (20-28), conversational copy, a character with a job |
| **X Expression** | System components and the platform's look. Only the hue and the content are the product's | Native skeleton with the dealt hand applied in full | Custom navigation and controls built for the product, a custom data-driven hero, choreographed motion |

Values 2 and 4 sit between the columns. Sizes are in pt on iOS and dp on Android.

**Expression defaults to 3.** Go to 4 or 5 only when the brief asks for a fully bespoke product, and drop to 1 or 2 when the brief asks for a quiet or strictly native result, or the product is a work tool where speed matters more than feeling (field work, enterprise, civic, clinical). From Expression 3 up, a concept is required, not optional.

**Deal what taste would decide; derive the rest.** The hand settles typeface, icons, layout and effects, because left to choose you return to the same few. The concept, the hue and the words come from the product's own world: its objects, places, instruments, printed matter, even its name.

**One idea, carried everywhere.** The concept decides what the hero measures, the hue, what things are called, the order they come in and the copy. Do not reuse the concept of another product, and do not reuse the previous project's.

For Full direction work, save the brief as `DESIGN.md` in the project root (or add it to the existing design doc) so later sessions inherit the direction instead of deriving a different one. Ask first if the user did not ask for files.

## 3. Check the plan against defaults

Before building, answer these in one line each and revise the brief if any answer is "no":

1. **One-sentence test.** Can you describe the first screen without naming an interface component? "This month as a statement that ends in what is safe to spend" passes. "A card with the balance and a list" does not.
2. **Thumbnail test.** Shrunk among ten competing apps' screenshots, would yours be the one a person can pick out?
3. **Any-app test.** Would this plan come out the same for a different product in this niche? Name three choices that exist only because of this product.
4. **Cliché test.** Does it match the niche cliché, or the over-correction, from the niche file?
5. **Job test.** Does the hero answer what the user came for within a few seconds, and is the exact figure still readable?
6. **Brief test.** Is everything the brief asked for on the first screen or one obvious scroll away, with the hero in place? A hero that pushes the requested content out of sight has failed the brief.

## 4. Build

The dealt skeleton first, then the hero, then everything else.

1. **Lay out the dealt skeleton and its hero before anything else** and look at them alone, with the dealt typeface and icon set already loaded. If that does not carry the screen, no amount of polish on the list will.
2. **Tokens in one place.** Colour roles, type roles, spacing steps, radii by role and motion timings live in one theme file in the stack's own idiom. Screens import tokens; they contain no raw colours or one-off sizes.
3. **Real states and real content** while building, not after.

**The floor.** These thirteen hold for every screen at every Expression level. Bold design that fails them is not finished.

1. **Touch.** Every target is at least 44×44 pt on iOS or 48×48 dp on Android, with 8 between neighbours.
2. **Text scales.** Text follows the user's text size, custom fonts included. At the largest size content reflows or scrolls; essentials never clip.
3. **Insets.** Safe areas, status bar, home indicator, cutouts and keyboard come from system inset APIs, never from a hard-coded number.
4. **Contrast.** At least 4.5:1 for body text and 3:1 for large text and icons, measured where the text actually sits: on the gradient, the glass, the photo. The hero's own words and figures are the most important text on the screen and get the strongest contrast, never the faintest. Meaning never rests on colour alone.
5. **States.** Every data screen has loading, empty, error and content. Add offline and permission-denied where they can happen.
6. **Nothing hidden.** Content never sits under a floating bar, button or toast. A scrolling area ends with padding as tall as whatever floats over it, and a toast never covers the thing it describes.
7. **Back and dismiss.** The system back gesture works even under custom navigation. Every sheet and modal has an obvious exit.
8. **Custom parts are finished.** A bespoke control or navigation element has pressed, selected, disabled and focused states, an accessibility label and role, and a non-gesture alternative. If you cannot finish it, use the system one.
9. **Motion respects the person.** A Reduce Motion variant exists. Nothing blocks input while it animates. Nothing loops behind text someone is reading.
10. **Keyboard.** The primary action is never under the keyboard. Each field has the right keyboard type, return key and autofill hint.
11. **Honesty.** No dark patterns: no forced sign-up before value, no permission prompt at first launch, no fee that first appears at the last step, no cancel path longer than the sign-up path, no fake urgency, no guilt copy on decline. If asked for one, say so and build the honest equivalent.
12. **Working controls.** Every enabled control does what it says, and its icon means what users expect it to mean. A destructive control sits apart from the primary action and offers undo or asks first. Sample numbers on a screen agree with each other.
13. **Frame rate.** The hero's effects hold full frame rate on a mid-range phone, or they get simpler.

## 5. Verify, then report

1. **Render it.** Build and screenshot in a simulator or emulator when you can. Otherwise use the stack's preview tool, and otherwise an animated HTML prototype. `references/preview.md` has the commands. Look at several moments of the motion, not one frame.
2. **Run the fingerprint check** in `references/signature.md`: ten questions about whether anything on the screen is there because you like it, talks to a builder, or shows off.
3. **Stress the content.** A 40-character name, an empty list, a thousand items, a zero and a negative number, text 40% longer than English, the largest text size.
4. **Scan the source.** Run `node scripts/slop-scan.mjs <source-dir>` from this skill's folder. Each hit is a prompt to check intent, not an automatic failure. Without Node, grep the signatures listed in `references/slop-tells.md`.
5. **Stop after three fix rounds** and report what remains instead of looping.

Close with this report. The last two lines are required: stating what was not checked is what makes the rest believable.

```
Concept:       <one sentence> · D_ E_ W_ X_
Built:         <screens and files>
Decisions:     <3-5 choices specific to this product, each with its reason>
Verified:      <what was rendered or run, and on what: device, simulator, preview tool, HTML prototype, code only>
Not verified:  <what could not be checked>
Open:          <facts or assets needed from the user>
```

## Gotchas

- **There are two failures, not one.** Timid: identical cards on a neutral background, which any app could own. Decorated: a drawn scene, a glow and a display face, which any model could have made. The way out of both is the dealt hand plus the product's own data and words.
- **Your favourites are the tell.** The typeface you would reach for, the picture you would draw, the glow you would add: other people have seen them a thousand times. Use the hand, use real icons, draw nothing pictorial.
- **An honest slot beats a drawn stand-in.** Where a photo or artwork belongs, a labelled neutral frame reads as unfinished; a gradient or a vector scene in its place reads as generated.
- **A hero shows data.** An illustration beside a number is decoration. The level, angle or length is the value.
- **Bold costs clarity unless you pay it back.** In blind judging, screens built with this skill won on identity and impact and lost on clarity whenever the hero crowded out what the brief asked for or a floating control covered content. Size the hero by the Density dial and check the brief test.
- **Check the glyphs.** The dealt face must contain every character the product needs, including currency signs and letters such as ğ, ş, ı and İ. A fallback glyph in the middle of a headline ruins it.
- **A phone-sized web page is not an app.** Hero banners with marketing copy, max-width wrappers, hover states and footers inside an app are still the strongest generated tell.
- **Models invent API names.** If an API named in a reference does not exist in the project's SDK, trust the SDK and its documentation.
- **References carry a baseline date.** When the project targets something newer than `metadata.baseline`, prefer current platform documentation where it disagrees.
- **A single good screen proves nothing.** Check several screens side by side: the concept, the material and the voice must hold on all of them.

## Always-on rules

Skills load only when a task triggers them, and agents skip them often: measured in a real project, this skill loaded in about one run in five by itself and in every run once the block below was present. If the project has an `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` or rules file, offer to append the block in `assets/always-on.md`.

## Niche index

Pick the niche by the job of the screen you are working on. For a hybrid product, read the primary niche and take the stakes from the more sensitive one. If nothing fits, set the dials from three questions: how costly is a mistake (lower E, lower W), how long is a session (glance means lower D per screen), and how vulnerable is the user (calmer, plainer, more exits).

| File in `references/` | Covers | Preset |
|---|---|---|
| `niche-fintech.md` | banking, budgeting, payments, invoicing | D4 E2 W2 |
| `niche-crypto-trading.md` | exchanges, wallets, brokerage | D5 E3 W1 |
| `niche-fitness-health.md` | workouts, activity and nutrition tracking | D3 E4 W3 |
| `niche-wellness-meditation.md` | meditation, sleep, mood, mental health | D1 E1 W4 |
| `niche-productivity-habits.md` | to-do, planners, habits, focus | D3 E2 W3 |
| `niche-notes-writing.md` | notes, journals, documents | D2 E1 W2 |
| `niche-social-messaging.md` | feeds, communities, chat | D4 E4 W4 |
| `niche-dating.md` | dating and matching | D2 E3 W4 |
| `niche-ecommerce.md` | shops, marketplaces | D4 E2 W3 |
| `niche-food-delivery.md` | delivery, restaurants, ordering | D4 E3 W4 |
| `niche-travel-transport.md` | booking, itineraries, maps, transit | D3 E3 W3 |
| `niche-education.md` | courses, language learning | D2 E4 W5 |
| `niche-kids.md` | apps for children, with a parent area | D1 E4 W5 |
| `niche-media-streaming.md` | video, music, podcasts | D3 E3 W3 |
| `niche-news-reading.md` | news, articles, read-later | D4 E1 W1 |
| `niche-ai-assistant.md` | chat and voice assistants | D2 E2 W3 |
| `niche-utilities.md` | scanner, calculator, weather, converters | D2 E2 W3 |
| `niche-creative-tools.md` | photo, video, drawing, audio editors | D3 E2 W2 |
| `niche-smart-home.md` | device control, automation | D3 E2 W3 |
| `niche-healthcare.md` | telemedicine, patient portals | D2 E1 W3 |
| `niche-real-estate.md` | property search, rentals | D3 E2 W2 |
| `niche-games-companion.md` | casual games, game companion apps | D3 E5 W5 |
| `niche-b2b-field.md` | enterprise, field work, inventory | D4 E1 W1 |
| `niche-government-civic.md` | public services, identity, alerts | D2 E1 W1 |
