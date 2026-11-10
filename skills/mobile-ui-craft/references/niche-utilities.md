# Niche: utilities (scanner, calculator, weather, QR, converters)

**Preset:** D2 · E2 · W3 — one task per screen, instant, friendly and plain.
**Stakes:** trust 3/5 (camera and file access, subscription honesty). The category has a bad name for trick billing.
**Session:** a glance or a single task of under a minute.

## The user in the moment

Wants one thing done now: scan this, convert that, check the rain. Has little patience for setup, an account or a plan screen. If a utility asks for money before it has done its job, they delete it.

## Structure

- **Navigation:** a single screen, or two tabs at most. The result is the home screen.
- **First screen answers:** "Do the one job." A scanner opens the camera, a converter shows the input and result, a weather app shows the answer for now.
- **Key screens:** capture or compute · result · export and share · history · optional pro features.
- **Result:** large and readable, with copy and share one tap away.
- **Sensitive actions:** camera and file permissions are requested only when the user starts scanning, with a short reason. Saving or sharing scanned documents is clear about where they go.

## Look and feel

- **Cliché to avoid:** a "limited-time offer" paywall as the first screen.
- **Over-correction to avoid:** an unstyled calculator-grey utility with no feedback on success, no history and no sign that the app is capable, so users doubt it works.
- **Colour:** neutral with a single accent. In data utilities such as weather or tides, let colour encode the real environment (sky, water), always with text or numbers as well.
- **Type:** large, readable results. Weather and data screens can be denser, with a clear primary figure.
- **Shape:** moderate radii. Keep controls simple and obvious.
- **Motion and haptics:** instant response. A satisfying haptic on a successful scan or capture. Weather may use environment-driven animation, which respects reduce-motion.

## Trust signals

- A one-time or clearly stated price, and a plain list of what is free.
- On-device processing is stated if true.
- Permissions are requested only at the moment of use.
- The paywall never gates the basic function the app is named after.

## States you must design

Permission denied (with a path to settings) · nothing detected · poor light · history empty · offline weather cache with a timestamp · scan in progress · export failed · unsupported file · low storage · trial ended (core function still works).

## Refuse to build

Weekly subscriptions with a short trial presented on first launch (a security vendor documented iPhone apps charging roughly nine dollars a week this way); gating basic function; data harvesting; hidden cancel; fake system-style alerts that push purchase. Academic work has found a large share of Android subscription apps with fleeceware traits.

## Learn from

- **Carrot Weather** — Apple Design Award 2021. Borrow the user-configurable layout and the humour as a brand voice in a commodity utility.
- **Tide Guide** — Apple Design Award 2026 for Visuals. Borrow hour-by-hour data and a palette that matches the real sky and water.
- **Moonlitt** — Apple Design Award 2026 for Interaction. Borrow its easy onboarding and wide platform support.
- **Guitar Wiz** — Apple Design Award 2026 for Inclusivity. Borrow spoken instructions and support for large text and increased contrast.

## What users complain about here

Fleeceware: short trials that roll into expensive weekly charges; paywalls placed before the first result; and forced accounts. Weekly pricing buried under a headline of "free" is the repeated pattern.

## Accessibility specifics

- Results are large and read aloud correctly by a screen reader.
- Camera guidance has audio or haptic cues, not only on-screen framing.
- Data colours (sky, rain, tide) always have a number or label.
- Controls are large with generous spacing.
- Works with large text sizes without cutting off the result.
