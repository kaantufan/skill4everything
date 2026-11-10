# Niche: enterprise and field-work apps

**Preset:** D4 · E1 · W1 — high information, no decoration, formal and sharp, but with large targets.
**Stakes:** trust 4/5 (work records, audit trails, safety, customer data). Silent data loss or a lost form costs real time and sometimes compliance.
**Session:** a glance at the job list, then a task of 1–10 minutes, repeated all day in poor conditions.

## The user in the moment

At work, not at leisure. They are standing, wearing gloves, in sunlight or a warehouse, often with weak signal, and they are told to use the app. They do not forgive slowness. Adoption lives or dies on how quickly a job can be done with one hand.

## Structure

- **Navigation:** a role-based home, such as today's jobs. Minimal tabs. Search and barcode scanning are first-class.
- **First screen answers:** "What do I have to do next?" A short job list in order, with status and location.
- **Key screens:** job list · job detail · checklist or form with photos · signature · sync status · time and expense.
- **Forms:** one step per screen, progressive disclosure, camera and scanner in place of typing, voice input where it helps.
- **Density:** the information is rich, but each step shows only what the current action needs, with large controls.
- **Sensitive actions:** submitting, approving and signing show a clear summary and an explicit result.

## Look and feel

- **Cliché to avoid:** a desktop admin screen shrunk to a phone, with tiny table columns and small controls.
- **Over-correction to avoid:** a consumer-style app with soft pastel cards and playful animation that wastes screen space and makes status hard to spot in sunlight.
- **Colour:** high contrast that works in sunlight. Strong status colours always paired with an icon and a word.
- **Type:** large and plain. Key facts (job, address, status) are the biggest items.
- **Shape:** sharp or small radii, thick dividers, large buttons with good spacing.
- **Motion and haptics:** functional only. Strong haptic confirmation for scans and saves, which works with gloves.

## Trust signals

- Always-visible sync state showing what is saved and what is waiting.
- An audit trail of who did what and when.
- Clear role permissions: what the user can and cannot do.
- No silent data loss; the user is told what happened and how to recover.

## States you must design

Offline queue with a count of waiting items · sync conflict · forced update · permission restricted · low battery · session expiry that preserves the work in progress · camera or scanner unavailable · photo upload failed · shift ended with items unsent · wrong job selected.

## Refuse to build

Mandatory online for core tasks; re-login that wipes a half-finished form; desktop-shaped tables; tiny controls; blocking work because of a failed non-critical sync; hiding what has and has not been sent.

## Learn from

No named app in the research has sourced or award-backed praise for this niche. Vendor guidance, which is weaker evidence, agrees on the following points:

- Build offline-first, so work continues without signal and syncs later.
- Use large targets and progressive disclosure.
- Prefer voice and camera input over typing.
- A portfolio claim that most field users struggle with gloves is anecdotal, so use it only as a prompt to test with gloves yourself.

## What users complain about here

No user complaint data was retrieved for this niche. The cross-niche complaints that clearly apply: lost state and lost progress after interruptions or session expiry; tiny and crowded targets; slow performance on older devices; and forced re-onboarding after updates.

## Accessibility specifics

- Targets are large enough for gloved hands, larger than a standard consumer app.
- Offer voice input and hardware button support for key actions.
- Readable in bright light: high contrast, no thin type.
- Status uses icon and text as well as colour.
- Scanner and camera flows give audio or haptic confirmation.
