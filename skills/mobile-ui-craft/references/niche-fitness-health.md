# Niche: fitness and health tracking

**Preset:** D3 · E4 · W3 — energetic and data-rich, friendly without being childish. The live-workout screen drops to D1.
**Stakes:** trust 4/5 (body data, health claims). Bad defaults can push users toward unsafe behaviour.
**Session:** a glance at the day's progress, plus an active workout of 20–90 minutes where the phone is barely looked at.

## The user in the moment

Two different people. Before and after a workout: curious, motivated, or quietly ashamed if they missed a day. During a workout: sweaty, out of breath, one-handed, possibly in sunlight, wanting one number and no decisions. Beginners are shame-prone; enthusiasts want depth.

## Structure

- **Navigation:** 4–5 tabs (for example Today, Workouts, Trends, Community if it exists, Profile). The watch and widgets are first-class surfaces, not extras.
- **First screen answers:** "How is my day going?" Rings or a few cards for the day, then the next suggested action. Nothing that scolds.
- **Key screens:** today summary · live workout (huge numbers) · workout summary · trends · goals · sensor and permission setup.
- **Live workout:** one primary metric very large, two or three secondary, big pause and stop controls, voice or haptic cues. No menus, no scrolling.
- **Sensitive actions:** sharing an activity publicly is an explicit choice, never a default.

## Look and feel

- **Cliché to avoid:** neon gradients on black with flame icons and "crush it" slogans.
- **Over-correction to avoid:** a grey clinical dashboard with tiny labels that looks like a lab report and gives a beginner no encouragement at all.
- **Colour:** an energetic accent on a neutral base. High contrast, because the screen is read outdoors. Use colour to separate metrics, but add icons or labels so meaning does not depend on hue.
- **Type:** big tabular numerals for live metrics so they do not shift as values change. Labels small but readable.
- **Shape:** medium-to-round radii on cards. Rings and charts may be expressive; keep list rows plain.
- **Motion and haptics:** rich haptics for intervals, laps and milestones. A ring-closing animation is allowed once. No looping guilt animations or "you are falling behind" pulses.

## Trust signals

- Say plainly what data is collected, who it is shared with, and that the user owns it.
- Show where each reading comes from (watch, phone, manual entry).
- Include a short medical disclaimer where advice appears, and do not present estimates as diagnosis.
- Safe defaults for calorie and weight goals, with an explanation when a target looks extreme.

## States you must design

GPS searching or sensor lost · permission denied (Health, Motion, Location) with a path to fix · no data yet · workout paused · offline with sync pending · rest or injury mode · missed days (neutral wording) · goal changed · a workout that ended unexpectedly, with recovery.

## Refuse to build

Streak-loss guilt and "you broke your streak" pushes; calorie shaming; auto-publishing activities to a public feed; locking a user's own history behind a paywall (Strava drew anger for this); defaults that suggest unrealistically low calorie targets; gamified calorie counting, which research links to obsessive use and eating-disorder symptoms; a paywall before the first successful workout.

## Learn from

- **Gentler Streak** — Apple Design Award for Social Impact. Its tone suggests rest as readily as effort. Borrow the rest-aware voice and the refusal to punish a missed day.
- **Strava** — Apple Watch App of the Year 2025 for real-time segment tracking on the wrist. Borrow the live wrist experience. Do not copy its habit of moving long-free features behind a paid tier.
- **Train Fitness** — a 2025 Inclusivity finalist. Borrow the attention to accessible workout use.

## What users complain about here

Features that were free for years moved behind a subscription (Strava segment tools, and its year-in-review recap placed behind a paywall); obsessive calorie tracking and its link to disordered eating; paywalls early in onboarding, which are common in this category. A complaint about a paid barcode scanner in a popular food logger was not confirmed, so do not cite it.

## Accessibility specifics

- Live-workout targets are large enough for wet or gloved hands. The most-used control is the biggest.
- Provide voice and haptic cues so progress does not rely on looking at the screen.
- Give rings an audio or text alternative ("Move, 72 percent of goal").
- Use the system "differentiate without colour" setting: add shapes or labels to chart series.
