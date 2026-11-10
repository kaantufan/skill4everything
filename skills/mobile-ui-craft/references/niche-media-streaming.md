# Niche: media, streaming, podcasts, music

**Preset:** D3 · E3 · W3 — artwork-led, smooth motion, neutral-friendly. Chrome recedes so the content leads.
**Stakes:** trust 3/5 (subscription billing, offline entitlement, a library the user has built). Loss of a saved library or download hurts.
**Session:** long and often passive, with control through the lock screen, car, headphones and a small mini-player.

## The user in the moment

Relaxed, or busy doing something else. They want to start something quickly, pause it with one thumb, and trust that their library and queue are as they left them. Fans also spend time organising playlists and downloads, and they hate it when familiar controls move.

## Structure

- **Navigation:** 3–4 tabs (for example Home, Search, Library, plus Podcasts or Radio where relevant). A persistent mini-player sits above the tab bar. Now Playing opens as a full-screen sheet with predictable controls.
- **First screen answers:** "What was I listening to, and what is next?" Resume the last item first, then recommendations.
- **Key screens:** home recommendations · search · now playing (artwork and transport) · queue · library · downloads.
- **Now playing:** artwork, title, scrub bar, play and pause, skip, and the queue. Repeat, shuffle and queue stay where users expect them.
- **Sensitive actions:** cancelling or downgrading explains what happens to downloads before it takes effect.

## Look and feel

- **Cliché to avoid:** neon gradients with glassy overlays on top of the artwork.
- **Over-correction to avoid:** a flat grey library that hides the artwork, so the user cannot recognise albums or shows at a glance and the app feels like a file manager.
- **Colour:** dark is conventional here, and colours can be drawn from the current artwork. Keep text on a solid or scrimmed layer, not directly on busy artwork or glass.
- **Type:** strong, readable titles; secondary text calmer. Library rows are compact and scannable.
- **Shape:** medium radii. Artwork has a consistent crop.
- **Motion and haptics:** smooth artwork transitions and an animated now-playing view are fine. Light haptics on scrubbing and chapter jumps. Keep the controls from shifting during animation.

## Trust signals

- Show clearly what is included in the plan and what is paid.
- Downloaded content is marked, and the user can see what works offline.
- Explain regional or rights blocks instead of silently greying items.
- Do not cut off playback without warning when a subscription lapses.

## States you must design

Buffering · offline with downloaded items · region or rights block · ad break · expired or paused subscription · empty queue · download failed or storage full · playback error with retry · episode finished · connection switched (car, headphones).

## Refuse to build

Moving core transport controls without strong evidence (Spotify moved repeat and the queue away from Now Playing and reversed the change after backlash); hiding downloads behind an upsell without warning; ads that change the controls; shuffle that is forced on free users in a way the user cannot see; glass over artwork that makes titles hard to read.

## Learn from

- **HBO Max** — Apple TV App of the Year 2025, with content offering ASL interpretation. Borrow the attention to inclusive content.
- **SoundCloud** — Google Play Best for Cars 2025. Borrow large, simple transport controls for in-car use.
- **Spotify (as a caution)** — a clear case of backlash when familiar Now Playing controls moved, and of an anniversary icon change that was reverted.
- **Commonly cited: Pocket Casts** — a clear library and queue model with themes. The research marks this as unverified, so treat it as a lead to study.

## What users complain about here

Layout changes that hide frequently used controls, such as a repeat button that moved; a changed app icon that users disliked and which was reverted; surprise upsells. These are documented in tech press coverage rather than review aggregates.

## Accessibility specifics

- Provide lyrics, transcripts or captions where content allows.
- Transport controls are large and have clear labels.
- The scrub bar works with a screen reader and exposes the current time in words.
- Honour reduce-motion for animated artwork.
- Do not rely on colour from artwork for text contrast; check contrast on every artwork.
