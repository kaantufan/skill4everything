# Niche: education and language learning

**Preset:** D2 · E4 · W5 — one question at a time, lively feedback, very friendly and round.
**Stakes:** trust 3/5 (honest outcomes, data of young learners). The main risk is manipulation of motivation, not money.
**Session:** short daily sessions of 5–15 minutes, repeated over months.

## The user in the moment

Motivated at the start, then uneven. They want to feel progress and not feel stupid when they make mistakes. Some come back every day out of habit or fear of losing a streak, which can be good for retention but bad for learning. Many are on a commute or in a spare minute.

## Structure

- **Navigation:** 3–4 destinations (for example Path or Home, Practice, Progress, optional Community). The lesson itself is a linear, modal-free flow.
- **First screen answers:** "What is my next lesson?" One clear continue action, with a small view of progress.
- **Key screens:** placement test · lesson · answer feedback · review and spaced repetition · progress · subscription page.
- **Lesson:** one question per screen, one primary action, instant feedback that explains the mistake, and easy exit that saves progress.
- **Onboarding:** let the learner start a real lesson first, and ask for a profile later. Short, skippable placement.

## Look and feel

- **Cliché to avoid:** a green owl-style mascot clone and confetti on every tap.
- **Over-correction to avoid:** a plain quiz form with grey text and no feedback character, which feels like an exam and loses the beginner who needs encouragement.
- **Colour:** friendly, high-contrast, with saturated colour used for feedback (right, wrong, hint). Always pair feedback colour with an icon and text.
- **Type:** large, clear, with a characterful voice for headings and feedback. Target-language text is large and unambiguous.
- **Shape:** large radii, round buttons, character art in empty states, notifications and errors.
- **Motion and haptics:** instant feedback with a distinct haptic and sound for correct and incorrect. Reward animations are short and skippable. Respect reduce-motion.

## Trust signals

- Honest claims about outcomes. Do not promise fluency in a few weeks.
- Describe how the curriculum was made and reviewed, and say when AI generates content.
- Clear handling of learners' data, especially minors.
- The price and what is free are explained before the paywall.

## States you must design

Offline lessons · mistake review · streak freeze or rest day · session resume after interruption · placement skipped · finished unit · no review due · lesson failed to load · listening exercise in a noisy place (text alternative) · account for a minor under parental control.

## Refuse to build

Loss-aversion guilt notifications; heart or energy walls that push payment in the middle of learning; overpromising fluency; timed-only exercises with no alternative; replacing human-made content with AI in ways that hurt trust (Duolingo's AI-first announcement drew a strong backlash); streak mechanics that reward opening the app rather than learning.

## Learn from

- **Duolingo** — widely studied. Borrow play-first onboarding and the mascot appearing in empty states, errors and notifications. Do not copy streak pressure that rewards chasing the streak without learning, or clutter from engagement-first screens. Critics note shallow depth beyond beginner levels.
- **CapWords** — Apple Design Award 2025 for Delight. Borrow the idea of learning words from photos of real objects.
- **Speechify** — Apple Design Award 2025 for Inclusivity. Borrow the full support for large text and screen readers for dyslexia, attention differences and low vision.
- **Pingo AI** — a Google Play Hidden Gem of 2025 in this category.

## Details leading apps get right

- All three jobs sit above the fold: today's lesson, course progress (a unit stepper and percent done) and weak words with a Practise button.
- The lesson card gives its honest scope (time, new words, "0 of 8 exercises") and a sample phrase with audio.
- One lesson is enough to keep the streak. In one analysis of streak designs, users who needed only one lesson were more than 40% more likely to keep a seven-day streak, and streak freezes brought 200,000 more daily returners; the same article warns a streak count can eclipse learning.
- After a lesson the next lesson stays a filled primary action, not an outline.
- The correct or incorrect sheet has audio replay and a short reason, then a full-width Continue.
- Numbers agree everywhere: minutes, exercise counts, unit numbers.
- Weak words use a strength meter that is explained, not punitive miss counts, and the Practise button is not hidden behind a tab badge.

## What users complain about here

Streak chasing without real learning; shallow depth past beginner level; cluttered, engagement-first interfaces; AI-first replacement of human content. Paywalls in onboarding are very common in education apps.

## Accessibility specifics

- Every exercise has both audio and text, and speaking exercises have a skip option.
- Offer a dyslexia-friendly font option.
- No timed-only exercises. Give a way to remove the time pressure.
- Feedback is never only a colour change; use icon and text.
- Mascot animation respects reduce-motion.
