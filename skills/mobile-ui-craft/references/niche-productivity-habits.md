# Niche: productivity, habits, to-do

**Preset:** D3 · E2 · W3 — calm and focused, with a light, friendly voice.
**Stakes:** trust 3/5 (the user's plans and reminders). Losing a task or missing a reminder breaks trust fast.
**Session:** a 5-second capture, a 1-minute plan of the day, and repeated checks all day.

## The user in the moment

Busy and a little overwhelmed. They want to get a thought out of their head before it vanishes, then see what matters today. They return many times a day for seconds at a time. Anything that adds anxiety (guilt, red counters, nagging) makes them quit the app.

## Structure

- **Navigation:** 3–5 destinations (for example Inbox, Today, Upcoming, Projects), plus one global add button reachable on every screen.
- **First screen answers:** "What do I do today?" A short list for today, with overdue items clearly separated and not shouting.
- **Key screens:** today list · quick add (natural language, share sheet) · item detail · calendar or timeline · notification settings.
- **Quick add:** opens instantly with the keyboard up. Title first; date, tag and project are optional and parsed from text when possible.
- **Sensitive actions:** deleting a project with many items needs confirmation and an undo.

## Look and feel

- **Cliché to avoid:** every list item as a pastel pill, a checkmark that explodes into confetti, a rainbow of project colours.
- **Over-correction to avoid:** a bare text file with no hierarchy, where today, overdue and someday items all look the same and the user must read everything.
- **Colour:** a neutral canvas, one accent, and category colour used sparingly. Overdue is marked by label and icon, not by a wall of red.
- **Type:** a good system or humanist font with a clear hierarchy. Titles read at a glance; metadata is quiet.
- **Shape:** moderate radii. Rows are separated by space or hairlines.
- **Motion and haptics:** tiny, fast, satisfying completion. Drag uses spring physics. No long celebrations, and no animation that delays the next action.

## Trust signals

- Sync status is visible, and changes made offline are clearly queued.
- Export and local backup exist and are easy to find.
- Reminders fire predictably and respect the user's focus settings.
- Capture stays free. The core act of adding a task is never locked behind an upgrade.

## States you must design

Empty inbox (a positive, calm message) · overdue items · offline queue · recurring-task edge cases (skipped, moved, completed early) · sync conflict · undo after complete or delete · a day with nothing planned · very long lists.

## Refuse to build

Streak anxiety; notification escalation that nags harder each day; locking core capture behind a pro tier; red overdue counters that grow every day; rating prompts before the user has finished a task.

## Learn from

- **Things 3** — a long-standing Apple Design Award winner. Borrow direct manipulation (drag to organise) and the add button reachable from anywhere. Note that users find its filtering lighter than power-user tools.
- **Tiimo** — Apple iPhone App of the Year 2025. Borrow the visual day timeline, small steps and short timers that reduce overwhelm. Note the complaint that a membership is needed despite a free listing.
- **Focus Friend** — Google Play Best App 2025. Borrow gamification aimed at leaving the phone alone, not at opening it more.

## What users complain about here

Subscription pricing compared with one-time purchases; a membership required after the app was presented as free; paywalls that lock features once the user depends on them. From the wider evidence: forced accounts before any value, and notification spam.

## Accessibility specifics

- Every drag action has a non-drag alternative (move menu, buttons).
- Voice quick-add works and is not a hidden feature.
- Reminders respect system focus modes and offer quiet delivery.
- Completion state is not shown by colour alone; use a shape or label as well.
- Lists keep working at large text sizes without clipping task titles.
