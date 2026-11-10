## Mobile UI rules (always on)

For any work on mobile screens, load the `mobile-ui-craft` skill first and follow its workflow. Whether or not it loads, these hold:

1. Every key screen has one concept from the product's own world and a hero that shows the screen's main value. A neutral background with rounded cards is not a design.
2. Typeface, icon set, layout and effects come from the skill's dealing script, not from preference. Icons come from a real icon set and pictures are real files or labelled slots: draw neither. No emoji as icons, no invented metrics, ratings or testimonials.
3. Touch targets are at least 44×44 pt on iOS and 48×48 dp on Android.
4. Text follows the user's text size, custom fonts included. Nothing essential clips at the largest size.
5. Safe areas and keyboard insets come from system APIs, never from hard-coded numbers.
6. Text contrast is at least 4.5:1 where the text actually sits. Meaning never by colour alone.
7. Every data screen has loading, empty, error and content states.
8. The system back gesture works, every sheet has an obvious exit, and any custom control has all its states and an accessibility label.
9. Motion has a Reduce Motion variant and never blocks input. No dark patterns: no forced sign-up, no permission prompt at launch, no late fees, no hard-to-cancel subscriptions.
10. Before calling UI work done: render it, look at several moments of the motion, and state what was not verified.
