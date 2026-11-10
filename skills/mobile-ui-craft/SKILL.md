---
name: mobile-ui-craft
description: >-
  Design, build, restyle and review mobile app UI and UX for iOS (SwiftUI, UIKit), Android (Jetpack Compose, Kotlin), Flutter and React Native or Expo, so the result feels native, fits the app's niche and does not look AI-generated. Use this skill whenever the task touches a mobile screen, flow, component, theme, navigation, onboarding, paywall, animation, haptics, icon set or app mockup, or the user says an app looks generic, off, cheap or not native, even if they never say "design". Not for websites or desktop apps.
license: MIT
metadata:
  version: "1.0.0"
  baseline: "2026-11"
---

# Mobile UI Craft

A mobile screen reads as made by a person when three things hold: it obeys its platform, it fits its product, and every visible choice was decided instead of defaulted. Generated UI usually fails the third. Nothing on screen is wrong, but nothing was chosen, so it looks like every other generated app. This skill routes you to the knowledge for each of the three.

Two rules outrank everything else here:

- **The brief wins.** An existing design system, brand guideline or explicit user instruction overrides any preference in this skill. Never add a second system next to one that exists.
- **Never invent facts.** No made-up metrics, ratings, testimonials, prices, partner logos or regulatory claims. Use realistic sample data to test layout, say it is sample data, and ask for the real thing.

## 1. Read the situation

Look at the project before designing. Settle four things, and ask the user only for what you cannot find.

**Lane: how much freedom you have**

| Lane | When | What you do |
|---|---|---|
| Full direction | New app, new product area, or a requested redesign | The whole workflow below |
| Inherited | The project already has a theme, tokens, `DESIGN.md` or brand | Skip the creative part of step 2. Extract the existing system and conform to it |
| Local polish | "Fix this screen", "make this feel better" | No new direction. Steps 4 and 5 only |

**Stack: read exactly one platform file**

| Signal in the project | Read |
|---|---|
| `.xcodeproj`, `Package.swift`, `.swift` views | `references/ios.md` |
| `build.gradle(.kts)` with Compose, `.kt` composables | `references/android.md` |
| `pubspec.yaml` | `references/flutter.md` |
| `react-native` or `expo` in `package.json` | `references/react-native.md` |
| One codebase shipping to both iOS and Android (Flutter, React Native, Compose Multiplatform) | also `references/cross-platform.md` |
| No project yet, only a mockup or concept is wanted | `references/preview.md` and the file for the intended platform |

**Niche: read exactly one niche file** from the index at the end of this document.

**Task: read one or two task files**

| Task | Read |
|---|---|
| Designing or building screens | `references/craft.md` once the structure stands |
| "Looks generic, AI-made, cheap, off", or a restyle | `references/slop-tells.md`, then `references/craft.md` |
| Review or audit without edits | `references/review.md` and `references/slop-tells.md` |
| Animation, transitions, gestures, haptics | `references/motion-haptics.md` |
| Onboarding, sign-up, permissions, paywall, forms, navigation structure, empty and error states | `references/ux-flows.md` |
| Mockup, preview image, or checking a render | `references/preview.md` |

Keep the reading budget: one platform file, one niche file, one or two task files. Loading everything dilutes the parts that matter for this task.

## 2. Write the brief

Before any UI code, write this brief. It is the mechanism that makes a banking app and a meditation app come out different, so do not skip it and do not fill it with adjectives. "Clean", "modern" and "premium" describe every generated app; replace each with a choice someone could check.

```
Product:    who uses it, for what job, in what moment (where, how long, one hand or two)
Platform:   stack, minimum OS, existing design system (yes / no)
Niche:      primary niche -> stakes (trust 1-5), vulnerable users?, session (glance / short / immersive)
Dials:      D_ E_ W_  (niche preset, then what you changed and why)
Direction:  a 2-4 word name + one sentence on what it should feel like
Source:     what in the product's own world the colours, shapes and type come from
Appearance: light and dark are both designed; light leads unless the product is used mostly at night or in low light
Signature:  the one memorable thing (an interaction, a data visual, a typographic move), or "none"
Avoiding:   the niche cliché AND the over-correction (both are in the niche file)
Borrowing:  1-2 real apps and the specific behaviour taken from each
Refusing:   dark patterns this niche tempts that will not be built
```

**The three dials** turn a niche into numbers. Each niche file gives a preset; adjust it for this product and say why.

| Dial | 1 | 3 | 5 |
|---|---|---|---|
| **D Density** | One job per screen. Rows 64+ tall, 32-40 between sections | Rows 52-60, 24 between sections | Rows at the platform minimum, 16 between sections, dividers instead of cards, secondary text one step smaller |
| **E Energy** | Near-monochrome with one accent on a small share of the screen. Fades, no overshoot, no celebration | One accent plus one supporting hue. Springs without overshoot. One authored moment | Several hues, each with a job. Overshoot only on motion a finger started. Celebration only at rare milestones |
| **W Warmth** | Small radii (4-8), hairlines, precise neutral copy, no illustration | Medium radii (10-14), plain friendly copy | Large radii (20-28) and capsule buttons, conversational copy, characters or illustration that do a job |

Values 2 and 4 sit between the columns. Sizes are in pt on iOS and dp on Android. Whatever the dials say, the floor in step 4 still applies.

**Derive, do not pick.** Take colour, shape and type from the product's own world: its materials, places, instruments, printed matter. A tide app can take its palette from water at different hours; a ledger app from paper and ink. This is why the skill ships no palettes and no font lists. A menu of "good" choices becomes the next default, and a banned list only moves the model to the nearest neighbour (purple gradient becomes cream, serif and terracotta).

**Spend boldness once.** One signature tied to the subject, everything else quiet. A screen where every element is special has no hierarchy.

For Full direction work, save the brief as `DESIGN.md` in the project root (or add it to the existing design doc) so later sessions inherit the direction instead of deriving a different one. Ask first if the user did not ask for files.

## 3. Check the plan against defaults

Before building, answer these in one line each and revise the brief if any answer is "no":

1. **Any-app test.** Would this plan come out the same for a different product in this niche? Name three choices that exist only because of this product.
2. **Swap test.** Would the colour and type treatment fit a competitor in another category unchanged? If yes, it has no identity yet.
3. **Cliché test.** Does it match the niche cliché, or the over-correction, from the niche file?
4. **Job test.** Can you say what the first screen answers for the user within five seconds?

## 4. Build

Structure first, then theme, then detail.

1. **Tokens in one place.** Colour roles, type roles, spacing steps, radii by role (control, container, sheet) and motion timings live in one theme file in the stack's own idiom. Screens import tokens; they contain no raw colours or one-off sizes. Drift between screens is the most reliable sign of generated UI, and it only shows when screens sit side by side.
2. **Native structure.** Choose the navigation model, then lists, sheets and controls from the platform. Identity goes into the layers the platform leaves open: tint, type moments, icon weight, motion, imagery, copy and empty states.
3. **Real states and real content** while building, not after.

**The floor.** These hold for every screen in every lane. They are the checks most often skipped, which is why they live here and not in a reference.

1. **Platform structure.** System navigation, bars, sheets, lists, pickers, switches and menus. A custom control needs a reason the system one cannot serve. iOS follows the Human Interface Guidelines, Android follows Material 3; never dress one platform as the other.
2. **Touch.** Every target is at least 44×44 pt on iOS or 48×48 dp on Android, with 8 between neighbours. Enlarge the hit area invisibly when the glyph is small.
3. **Text scales.** Platform text styles only (Dynamic Type, `sp`). No fixed font sizes, no fixed-height boxes around text. At the largest accessibility size content reflows or scrolls; essentials never clip or truncate.
4. **Insets.** Safe areas, status bar, home indicator, cutouts and keyboard come from system inset APIs. Never from a hard-coded number.
5. **Colour.** Semantic roles with a designed light and dark variant. Contrast at least 4.5:1 for body text and 3:1 for large text, icons and control boundaries. Meaning never rests on colour alone.
6. **States.** Every data screen has loading, empty, error and content. Add offline and permission-denied where they can happen. Never show the empty state while the first load is pending.
7. **Back and dismiss.** Edge-swipe back on iOS and predictive back on Android keep working. Every sheet and modal has an obvious exit.
8. **Icons.** One icon family per platform (SF Symbols, Material Symbols) at one weight. No emoji as icons. Icon-only controls carry an accessibility label.
9. **Motion.** Frequency decides. Actions done hundreds of times a day do not animate; frequent feedback stays under 150 ms; occasional transitions use the platform default. Honour Reduce Motion.
10. **Keyboard.** The primary action is never under the keyboard. Each field has the right keyboard type, return key and autofill hint.
11. **Honesty.** No dark patterns: no forced sign-up before value, no permission prompt at first launch, no fee that first appears at the last step, no cancel path longer than the sign-up path, no fake urgency, no guilt copy on decline. If asked for one, say so and build the honest equivalent.
12. **Working controls.** Every enabled control does what it says. No dead buttons, no success message without the action. A destructive control sits apart from the primary action and offers undo or asks first.

## 5. Verify, then report

1. **Render it.** Build and screenshot in a simulator or emulator when you can. Otherwise use the stack's preview tool, and otherwise an HTML mockup. `references/preview.md` has the commands. Cover light, dark, the largest text size and the smallest supported phone.
2. **Judge the render, not the code.** Squint until the text blurs: is there one dominant element and a clear order? Could a screenshot pass for a website in a phone frame? Would a fluent user of this platform pause at anything?
3. **Stress the content.** A 40-character name, an empty list, one item, a thousand items, a missing image, a zero and a negative number, text 40% longer than English.
4. **Scan the source.** Run `node scripts/slop-scan.mjs <source-dir>` from this skill's folder. Each hit is a prompt to check intent, not an automatic failure. Without Node, grep the signatures listed in `references/slop-tells.md`.
5. **Stop after three fix rounds** and report what remains instead of looping.

Close with this report. The last two lines are required: stating what was not checked is what makes the rest believable.

```
Direction:     <name> · D_ E_ W_ · <one line>
Built:         <screens and files>
Decisions:     <3-5 choices specific to this product, each with its reason>
Verified:      <what was rendered or run, and on what: device, simulator, preview tool, HTML mockup, code only>
Not verified:  <what could not be checked>
Open:          <facts or assets needed from the user>
```

## Gotchas

- **The system font is correct on native.** Web advice to avoid system fonts does not transfer. On a phone, the platform face in its own variants (weights, widths, rounded, serif, mono) with a real hierarchy reads as native; an imported display font for body text reads as a website.
- **Stock-default native is also a failure.** Template seed colours left as shipped, an unstyled list, system blue on everything: these read as a tutorial. Native structure, plus identity in the open layers.
- **Translucent materials belong to the floating control layer** (bars, sheets, toolbars). Never under body content, never one glass surface on another, and text on them needs primary contrast.
- **A phone-sized web page is not an app.** Hero sections, max-width wrappers, hamburger menus, hover states, marketing blocks and footers inside an app are the strongest mobile tell.
- **Models invent API names.** If an API named in a reference does not exist in the project's SDK, trust the SDK and its documentation. Do not guess a spelling; check it.
- **References carry a baseline date.** Platforms move every year. When the project targets something newer than `metadata.baseline`, prefer current platform documentation where it disagrees.
- **A single good screen proves nothing.** Check several screens side by side for one header style, one radius family, one icon weight and one voice.

## Always-on rules

Skills load only when a task triggers them, and agents skip them more often than users expect. If the project has an `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` or rules file, offer to append the ten-line block in `assets/always-on.md` so the floor applies in every session.

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
