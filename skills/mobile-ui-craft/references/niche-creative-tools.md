# Niche: creative tools (photo, video, drawing)

**Preset:** D3 · E2 · W2 — a sparse canvas, quiet neutral chrome, precise and plain. Tool panels rise to D4.
**Stakes:** trust 3/5 (hours of the user's work, export quality, files). Losing work or being held to ransom at export is the failure.
**Session:** immersive, often 10 minutes to hours, with a finger or pencil, frequently on a tablet.

## The user in the moment

Absorbed in making something. They want the canvas or viewfinder as large as possible, controls that appear when needed, and precision with a finger or pencil. They worry about losing work, about quality loss on export, and about discovering a paywall after hours of effort.

## Structure

- **Navigation:** the canvas or viewfinder dominates. Tool panels slide in and can collapse. Chrome is minimal.
- **First screen answers:** "Start making." Open the camera or the last project, with a clear new-project action.
- **Key screens:** capture · edit canvas · tool inspector · export and share · library.
- **Canvas (D3):** the image or drawing is the centre, with few controls visible at once.
- **Tool panels (D4):** dense but collapsible, grouped by task, with sliders and values readable at a glance. Expert controls can live behind gestures while a simple default surface stays visible.
- **Sensitive actions:** export shows quality, size and any limits before it starts, and edits are non-destructive.

## Look and feel

- **Cliché to avoid:** a neon-gradient "pro mode" and glassy overlays that tint the preview.
- **Over-correction to avoid:** a stark empty canvas with every tool hidden behind unlabelled gestures, so new users cannot discover how to do anything.
- **Colour:** a neutral, often dark interface so the image colour stays true. No saturated chrome near the canvas.
- **Type:** small, precise and quiet. Values are tabular so sliders do not jitter.
- **Shape:** restrained radii and thin lines. Handles are large enough to grab precisely.
- **Motion and haptics:** haptic clicks on dials and steps. Fluid gesture feedback and a fast preview. No decorative animation over the work.

## Trust signals

- Non-destructive editing, with a full undo history.
- Clear export quality and file type, and no surprise watermark.
- Local processing stated when true, and disclosure when AI edits an image.
- Autosave and recovery after a crash.

## States you must design

Autosave and recover · export progress with a way to cancel · low storage · unsupported format · undo and redo history · large file still loading · permission to photos denied · AI edit in progress or failed · project from a newer app version · connection lost while syncing.

## Refuse to build

A watermark ransom where export is blocked until payment; an export paywall that appears after hours of work; a hidden subscription triggered on the first edit; glass or blur over the preview; locking the user's own projects behind a subscription.

## Learn from

- **Halide** — Apple Design Award 2022. Borrow pro controls placed behind gestures with a simple default surface, and one-handed use on every phone size.
- **Detail** — Apple iPad App of the Year 2025, with AI auto-editing. Borrow the way automation speeds common work while leaving control.
- **Luminar** — Google Play Best Multi-device 2025. Borrow consistent behaviour across devices.
- **Procreate Dreams** — Apple Design Award 2024 for Innovation. Borrow its touch-first approach to a complex timeline.

## What users complain about here

No creative-specific complaint data was retrieved. The cross-niche complaints that clearly apply: paywalls that appear after the user has invested effort; subscriptions hidden behind the first action; glass effects that reduce legibility; redesigns that move familiar tools; and lost state after interruptions.

## Accessibility specifics

- Touch handles are large, with fine-adjust alternatives (steppers or numeric entry).
- Parameters and sliders are exposed to a screen reader with values.
- Offer prompts for alt text when exporting images for sharing.
- Provide pencil and finger alternatives and support for larger gestures.
- Do not rely on colour alone to show selection or active tool.
