## Mobile UI rules (always on)

For any work on mobile screens, load the `mobile-ui-craft` skill first and follow its workflow. Whether or not it loads, these hold:

1. Native structure: system navigation, bars, sheets, lists and controls. iOS follows the Human Interface Guidelines, Android follows Material 3. Never one platform's controls on the other.
2. Touch targets are at least 44×44 pt on iOS and 48×48 dp on Android.
3. Platform text styles that follow the user's text size. No fixed font sizes. Nothing essential clips at the largest size.
4. Safe areas and keyboard insets come from system APIs, never from hard-coded numbers.
5. Semantic colours with designed light and dark variants. Text contrast at least 4.5:1. Meaning never by colour alone.
6. Every data screen has loading, empty, error and content states.
7. System back gestures keep working, and every sheet has an obvious exit.
8. One icon family per platform. No emoji as icons. Icon-only buttons have accessibility labels.
9. No invented facts (metrics, ratings, testimonials) and no dark patterns (forced sign-up, permission prompts at launch, late fees, hard-to-cancel subscriptions).
10. Before calling UI work done: render it in light, dark and the largest text size, look at the render, and state what was not verified.
