# Niche: notes and writing

**Preset:** D2 · E1 · W2 — airy, almost motionless, plain and precise. The text is the interface.
**Stakes:** trust 4/5 (the user's own words). Losing a note, or being unable to get it out, is the worst failure.
**Session:** a 10-second capture, or a long writing session at a keyboard that can last an hour or more.

## The user in the moment

Thinking, not operating. When capturing, they need the editor open at once. When writing, they want nothing to move, flash or ask for attention. They quietly worry that the text might vanish, fail to sync, or become locked in a format they cannot leave.

## Structure

- **Navigation:** note list to editor. Search is prominent. Folders or tags are available but not forced. The editor is the hero screen.
- **First screen answers:** "Where is my last note, and can I start a new one now?" Recent notes and a new-note action, nothing else.
- **Key screens:** note list and search · editor with a toolbar above the keyboard · outline or links · export and share · version history.
- **Editor:** generous margins, a comfortable line length, and a toolbar that stays attached to the keyboard. Formatting is available but never in the way.
- **Sensitive actions:** deleting a note goes to a recoverable trash. Emptying it needs confirmation.

## Look and feel

- **Cliché to avoid:** purple AI sparkle buttons everywhere, and skeuomorphic paper or leather textures.
- **Over-correction to avoid:** a raw monospace text box with no hierarchy, no headings, no visible list structure, which makes long notes hard to scan and looks unfinished.
- **Colour:** neutral and low in saturation. Dark mode that avoids pure black behind pure white text, so long reading does not tire the eyes.
- **Type:** typography is the product. Choose the body face with care, set it at a comfortable reading size with generous line spacing, and keep headings clearly different but not loud.
- **Shape:** minimal. Few borders, few cards. Structure comes from space and type weight.
- **Motion and haptics:** nearly none. The cursor and selection must feel precise. No animation on typing, saving or syncing.

## Trust signals

- Local-first: notes open and save with no network.
- Version history and a visible, quiet sync status.
- Export in open formats that is free and easy to find.
- Claim end-to-end encryption only if it is true.

## States you must design

Offline save · sync conflict (show both versions, never overwrite silently) · empty note · unsaved-draft recovery after a crash · storage full · import failure with a reason · search with no results · very long note · shared note with a changed permission.

## Refuse to build

Cloud-only lock-in with no export; ads inside the editor; an export paywall after the user has written for months; sync conflicts resolved by silent overwrite; AI features that rewrite text without a visible undo.

## Learn from

- **iA Writer** — a 2025 Apple Design Award finalist for Interaction. Borrow the focus on writing and the restraint in chrome.
- **Goodnotes** — Google Play Best for Large Screens 2025. Borrow the large-screen and stylus-first layout when you design for tablets.

## What users complain about here

No niche-specific complaint data was gathered. The cross-niche complaints that clearly apply: features or export moved behind a subscription after users depend on them; forced accounts before any value; redesigns that move frequently used controls; lost drafts and lost position after an interruption.

## Accessibility specifics

- Text size follows the system setting inside the editor, not just in menus.
- Headings are exposed so screen-reader users can jump between them.
- Provide a clearly visible caret and selection, and support larger caret options where the platform allows.
- The keyboard toolbar is reachable by screen reader and keyboard users.
- Dark and light themes both meet the contrast needs for long reading.
