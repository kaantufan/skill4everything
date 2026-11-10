# Niche: healthcare, telemedicine, patient portals

**Preset:** D2 · E1 · W3 — plain, quiet and reassuring, with a human voice.
**Stakes:** trust 5/5 (health data, results, legal privacy duties). Alarming or unclear information can cause real distress or wrong decisions.
**Session:** a short task of a few minutes (book, message, read a result), plus a video visit of 10–30 minutes.

## The user in the moment

Often unwell, stressed or caring for someone. Many are older adults or caregivers who are less comfortable with technology. They may be reading a test result alone and worried. They need plain language, a simple login, and a clear route to a human.

## Structure

- **Navigation:** 4–5 tabs (for example Home, Appointments, Messages, Records or Results, Account). Proxy access lets a caregiver act for someone else.
- **First screen answers:** "What is next, and is anything waiting for me?" The next appointment and any new message or result.
- **Key screens:** appointment booking · video visit · test results with context · messaging · medications · forms and consent.
- **Results:** show the value with plain-language context and what happens next, not a bare number or alarming colour.
- **Video visit:** a simple join screen, a device check, and a phone fallback if the connection fails.
- **Sensitive actions:** login and recovery are secure but not punishing. Consent and sharing show who will see the data.

## Look and feel

- **Cliché to avoid:** blue and white with stethoscope stock images.
- **Over-correction to avoid:** a trendy, tight, minimalist design with small grey text and icon-only buttons, which looks modern but excludes older users.
- **Colour:** calm, high contrast. Blue and green are never the only status indicators. Use text and icons for normal, pending and abnormal.
- **Type:** large, readable and plain. Short sentences, no jargon without an explanation.
- **Shape:** moderate-to-round radii, generous spacing, large targets.
- **Motion and haptics:** minimal. Explicit confirmations after actions such as booking or sending.

## Trust signals

- State privacy and compliance duties plainly where they apply, and who can see the user's data.
- Secure sign-in with a clear recovery path.
- Clinician identity shown in messages and visits.
- Visible escalation paths: how to reach a person, and what to do in an emergency.

## States you must design

Test result pending · result outside the normal range (careful wording and next step) · connection failure in a video visit, with a phone fallback · session timeout warning that preserves what was typed · no access or proxy limits · appointment rescheduled or cancelled · message awaiting a reply · prescription refill status · forms incomplete · login recovery.

## Refuse to build

Dark-pattern upsells; medical claims that no one has reviewed; collecting more data than needed; showing alarming results without context; hiding the way to reach a human; timeouts that wipe a half-finished form.

## Learn from

Evidence on named apps is limited. Use these lessons instead:

- **Patient portal research on older adults** — log-in, colour and font choices, and some features created friction. Make sign-in and text the first things you test with older users.
- **Speechify** — Apple Design Award 2025 for Inclusivity. Borrow its full support for large text and screen readers.
- **Guitar Wiz** — Apple Design Award 2026 for Inclusivity. Borrow spoken instructions and support for increased contrast, as a model for guidance without relying on sight.

## What users complain about here

Login problems and trouble viewing results among older adults, documented in patient-portal research. No data specific to telemedicine was found. Cross-niche complaints that apply: forced accounts and permissions before value, and sessions that expire and lose work.

## Accessibility specifics

- This niche has the highest bar. Large text support is complete, with no clipping at the largest sizes.
- Plain language throughout, and a way to translate or switch language.
- Video visits have captions and a phone-in alternative.
- Colour never carries meaning alone; results use text and icons.
- Sign-in supports biometrics, password managers and an assisted recovery path.
