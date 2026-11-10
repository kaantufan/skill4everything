# Niche: AI chat and assistant apps

**Preset:** D2 · E2 · W3 — readable long answers, quiet motion, neutral-friendly voice.
**Stakes:** trust 4/5 (accuracy, privacy, personal data). A confident wrong answer can mislead, and users worry about what happens to their data.
**Session:** short questions of under a minute, and longer back-and-forth sessions. Latency varies, so the waiting state matters.

## The user in the moment

Curious, or under a deadline. They type, talk or show the camera, then wait for an answer of uncertain quality. They want to know whether to trust it, how to stop it, and how to fix a bad answer. They also worry about privacy and about being sold something.

## Structure

- **Navigation:** chat first. A history drawer or sidebar, a way to organise projects or tools, and a visible voice entry.
- **First screen answers:** "What do you want to ask?" A composer with text, voice, attachments and camera, and a few honest example prompts. History is one gesture away.
- **Key screens:** composer · streaming response · citations and sources · history · settings and memory · upgrade.
- **Response:** readable long-form text, code blocks that scroll sideways, tables that stay legible, and clear controls to stop, copy, regenerate or edit.
- **Sensitive actions:** memory and data controls are plain. Deleting history is clear about what is removed.

## Look and feel

- **Cliché to avoid:** a purple and blue gradient, sparkle icons and a glowing orb.
- **Over-correction to avoid:** a bare, cold text box with no visible sign of what the assistant is doing, no source links and no stop button, which looks transparent but leaves users guessing.
- **Colour:** a neutral canvas and one accent. Keep colour for state, such as errors and sources, not decoration.
- **Type:** a readable face for long text; monospace for code. Comfortable line length and spacing.
- **Shape:** moderate radii. Message bubbles are optional; clear separation between user and assistant is what matters.
- **Motion and haptics:** text streams with a subtle cursor, and "thinking" is calm and short. Haptics only on send and stop.

## Trust signals

- Clear disclosure that the answer comes from an AI.
- Source citations that the user can open to verify claims.
- Easy stop, regenerate and edit controls.
- Memory and data-use controls that are easy to find.
- The assistant says when it is not sure.

## States you must design

Streaming · stopped by the user · failed with retry · rate-limited (with a clear reset time) · offline · very long output · tool running (searching, reading a file) · empty history · attachment too large · voice mode listening and speaking · content the assistant declines, with a plain reason.

## Refuse to build

Sparkle upsells on every screen; hidden message limits that cut off a task midway; engagement hooks that flatter the user; ads disguised as answers (a case of ads appearing inside a chatbot's output has been reported); dark-patterned downgrade or cancel paths; unlabelled AI content mixed into human content.

## Learn from

The research found thin evidence for named apps in this niche, and none of the praise could be verified, so this file names none. Use the patterns that vendor design guides agree on:

- Switch between text, voice and camera easily, and give voice mode a clear exit and a transcript.
- Show citations next to claims.
- Keep fallbacks for failure, uncertainty and refusal.

## What users complain about here

No user complaint data was retrieved for this niche. The cross-niche complaints that clearly apply: paywalls and hidden limits that appear mid-task; subscription cancel friction; forced accounts before any value; notification permission requested on first launch.

## Accessibility specifics

- Streaming text must not make a screen reader read every partial word. Announce completion instead.
- Voice mode has a transcript and a clear way to stop.
- The composer is large and keeps working with large text sizes.
- Code and tables are reachable by keyboard and screen reader.
- State such as "thinking" is shown in text, not only an animation.
