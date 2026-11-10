# UX flows: structure, first run, permissions, paywalls, forms

These rules come from what users and usability research complain about most in mobile apps: subscription traps, hidden fees, forced sign-up, permission prompts at launch, hidden navigation, sheet abuse, lost state, and redesigns that move things. Each section gives the rule and the reason.

## Contents

- Navigation structure
- Sheets and modals
- First run
- Permissions and notifications
- Paywalls and subscriptions
- Prices, fees and tips
- Forms and keyboard
- Lists, search and filters
- Ratings prompts and engagement mechanics
- Destructive actions
- Interruptions and saved state
- Changing an existing interface

## Navigation structure

Decide in this order:

1. **List the top-level destinations** as nouns the user would say. Actions ("add", "scan", "compose") are not destinations and do not get a tab.
2. **Two to five destinations:** a visible tab bar (iOS) or navigation bar (Android). Visible navigation is found and used; navigation hidden behind a menu icon measurably lowers discovery and slows tasks.
3. **More than five:** the information architecture is not finished. Merge, demote to a section inside another destination, or move rare items to settings. A "More" tab is the last resort.
4. **Going deeper into one thing:** push onto a stack, with the system back gesture intact.
5. **A self-contained task with a clear end** (compose, edit, pay): present it modally with explicit cancel and done.
6. **Wide windows** (tablet, unfolded, desktop): the same destinations move to a rail or sidebar; never both a bar and a rail.

Keep each tab's own stack and scroll position when the user switches away and back. Tapping the current tab returns to its root. The primary creation action lives in a toolbar or a floating button, not in the middle of the tab bar.

## Sheets and modals

- Sheets are for short, contextual tasks that keep the screen behind relevant.
- One level only. Never open a sheet from a sheet; promote the flow to a full screen.
- Always a visible close control, and the back gesture closes the sheet.
- Long content, multi-step flows and anything with its own navigation belong on a full screen.
- Alerts are for rare, important, usually irreversible moments. Anything reversible gets undo instead of a question.

## First run

- **No slideshow.** Tutorial cards do not improve task performance and users skip them on reflex. Open on the product, with a first-run empty state that offers the real first action.
- **Value before account.** Let people use the app as a guest or locally. Ask for an account at the first moment it gives them something: saving, syncing, buying. Banking and similar products that truly need identity are the exception, and they say why.
- **Ask only for what changes the product.** A setup question earns its place if the next screen is different because of the answer. Appearance choices belong in settings.
- **Never ask for a rating, a notification permission or a payment during setup.**
- If a short setup is needed, show progress, allow back, and make every step skippable unless it is required to function.

## Permissions and notifications

- **Never at cold start.** Ask when the user does something that needs the permission, and say in one line what they get.
- On iOS the system prompt can be shown once, so precede it with your own explanation when the benefit is not obvious from the action. On Android, request at the action and handle "don't ask again".
- **Denied is a designed state:** say what will not work and link to the system setting. Do not re-prompt in a loop or block unrelated features.
- Request the narrowest scope: approximate location before precise, selected photos before the whole library, while-in-use before always.
- Notifications: opt in from a meaningful action ("remind me at 9"), per-category toggles, a frequency people can predict. Never send guilt ("you broke your streak") or bait ("someone looked at you").

## Paywalls and subscriptions

Subscription traps are the most-reported dark pattern in app reviews and the subject of large regulatory settlements. Build the honest version:

- **After value.** Show the paywall after the first real success, not before the user has seen the product.
- **Mark what is locked before the tap**, with a lock and a label. Never let a tap lead to a surprise paywall.
- **State the offer in plain text:** price, billing period, what happens when the trial ends and on what date, and that it renews, all visible before the purchase button.
- **The close control is visible immediately**, full-size, in the expected corner. No delayed or faint close.
- **Decline is neutral** ("Not now") with equal visual clarity. No guilt copy.
- **Cancelling is as short as subscribing.** Provide a "Manage subscription" entry in settings that goes straight to the place where it can be cancelled, and a "Restore purchases" action.
- **Never lock away data the user already created** or features they already had for free. Removing something long-free is the surest way to a backlash.
- No countdown timers that reset, no invented "most popular" claims, no weekly price presented to hide a high yearly cost.
- Where users expect a free tier (social, productivity, news), have a real one.

## Prices, fees and tips

- Show the all-in price from the first list or card, not only at checkout.
- Itemise every fee on one screen before the user commits. Never add a fee on the last step.
- Tip screens: "no tip" has the same visual weight as the suggestions, nothing is preselected at the highest value, and the base for the percentage is stated.
- Pre-ticked add-ons are not allowed. Extras are opt-in.

## Forms and keyboard

- One column. One question per row. Labels stay visible while typing.
- The right keyboard for each field, the right return key, and autofill hints for names, emails, addresses, one-time codes and cards.
- Use the device instead of typing where it can: scan a card or code, use location for address, biometric for sign-in, paste detection for codes.
- Validate when the user leaves a field, not on every keystroke, and say how to fix it next to the field.
- **Never lose input.** Keep everything on error, on rotation, on app switch, and after a failed submit.
- The primary button stays above the keyboard. The focused field is never covered.
- Never block paste. Offer show-password. Do not move focus automatically on touch devices unless the screen exists only to type.
- Quantity and stepper controls have large targets and accept typing.

## Lists, search and filters

- **Going back restores the exact scroll position and filters.** Losing the place in a long list is a top complaint.
- Applied filters stay visible above the results and can be removed one by one.
- Inside a filter, allow several values at once; show the live result count on the apply button.
- Offer the sorts people expect for the content (price, rating, newest, nearest).
- No results: say what was searched, and offer the nearest fix (remove a filter, check spelling, broaden).
- Pull to refresh for content that updates; do not hijack it for anything else.
- Search sits where the platform puts it, and keeps recent searches.

## Ratings prompts and engagement mechanics

- Ask for a rating only after a success moment, through the system prompt, at most once per version. Never before payment, never as a gate ("enjoying the app?" that routes only happy users to the store).
- Streaks, points and badges only where they serve the user's own goal. In health, money and mental-health products they are opt-in, with rest days and no loss framing.
- Rewards for doing the thing, never pressure for not doing it.
- Every feed has a natural stopping point or a clear "you are caught up".

## Destructive actions

- Prefer undo to confirmation. A snackbar or banner with undo is faster and safer than a dialog people tap through.
- When confirmation is needed (irreversible, costly), the dialog names the object ("Delete 3 invoices?") and the destructive button repeats the verb.
- Keep destructive controls away from the primary action and outside the easy thumb zone.

## Interruptions and saved state

Mobile sessions are short and constantly interrupted.

- Save drafts continuously. Returning to the app returns to the same screen, scroll position and half-typed text.
- A deep link or notification opens the exact item, with a working back path to its parent.
- Long operations continue in the background and report completion.
- A session timeout warns first and keeps the user's work.

## Changing an existing interface

- Do not move or remove a control people use every day without evidence that the new place is better. Muscle memory is a feature, and relocations are remembered as regressions.
- Change one thing at a time where you can, and keep the old path working for a release.
- New capability goes where users already look for related things.
