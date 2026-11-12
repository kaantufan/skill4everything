# Niche: fintech, banking, budgeting

**Preset:** D4 · E2 · W2 — dense where it lists, quiet everywhere, formal but not cold.
**Stakes:** trust 5/5 (money). A mistake costs the user real money, so clarity beats delight every time.
**Session:** a 5-second glance ("am I okay?"), sometimes a 1–3 minute task (pay, move, freeze a card). Often one-handed, in public.

## The user in the moment

Mildly anxious or purely routine. They open the app to answer one question — how much do I have, did that payment go through, what did I spend — and leave. They move money rarely, and when they do it has to feel impossible to get wrong.

## Structure

- **Navigation:** 4–5 visible tabs (for example Home, Payments, Cards, Insights). Quick actions (send, request, top up) live on Home.
- **First screen answers:** "What is my balance or safe-to-spend, and what just happened?" The number, then recent activity. No carousel, promo or greeting hero above it.
- **Key screens:** balance and recent activity · transaction list with search and filters · transfer review-and-confirm · card controls (freeze, limits) · insights or budget · identity verification.
- **Sensitive actions:** biometric re-auth, and a full review screen before any irreversible step showing amount, recipient, fee and arrival time.

## Look and feel

- **Cliché to avoid:** the "neo-bank" look — purple-to-blue gradient balance card, glassy credit-card mock, confetti on transfer.
- **Over-correction to avoid:** stark black-and-white "terminal" styling that makes everyday banking feel like a trading desk.
- **Colour:** neutral surfaces and one restrained accent for actions. Green and red only for semantic gain and loss, always paired with a sign or icon so the meaning survives colour-blindness and greyscale.
- **Type:** the platform font. Amounts are the hero: large, tabular figures, with the currency symbol and decimals visually quieter than the integer part. Right-align (trailing-align) amounts in lists so digits line up.
- **Shape:** moderate radii. Separate list rows with hairlines or spacing; do not box every row in its own card.
- **Motion and haptics:** calm. A success haptic when a transfer completes, a warning haptic before an irreversible step. A figure rolls only the digits that changed when it changes; nothing counts up on load, nothing loops and nothing celebrates.

## Trust signals

- Fees, exchange rate and arrival time appear *before* the user commits, never for the first time on the last step.
- Pending and settled are always visually distinct. Any balance that may be stale shows when it was last updated.
- Sensitive values (card number, full balance in public) are masked behind an explicit reveal.
- Deposit protection and regulator status are stated early in onboarding, in plain language.

## States you must design

Pending · failed · declined (with the reason and the next step) · offline (read-only cached balance with a timestamp) · fraud hold · verification in review · no transactions or empty budget · session timed out (without losing what the user typed).

## Refuse to build

Gamified spending; celebratory effects on risky actions (trading apps have removed confetti under regulatory pressure); upsell interstitials at login; fees that first appear at confirmation; fake urgency on credit offers; a close-account or cancel path that is harder to find than sign-up.

## Learn from

- **Wise** — total cost, rate and delivery time are visible before any account details are requested.
- **Monzo** — plain-language onboarding that leads with eligibility and protection.
- **Copilot Money** — calm, native-feeling analytics; each chart answers a question instead of decorating.
- **Revolut** — identity verification broken into short single-purpose steps, framed as protection.

## Details leading apps get right

- One number that already nets out commitments: "safe to spend" subtracts upcoming bills, savings and money already spent, so the user does no arithmetic.
- The formula sits beside the number (came in, minus tax, minus bills, equals safe to spend), with a day-rate such as "about X a day through month end".
- A new event is handled in place: a consequence preview ("To tax / Safe to spend"), a button that names the amount ("Set aside $350.00"), then updated figures and a toast with Undo.
- Upcoming bills show as a short window (the next seven days), not a long list.
- An ambiguous state gets a stated default ("counted as taxable until you choose").
- Legend swatches match the bar segments one to one, and no debug rows ("card check $0.00") appear in the activity list.
- A hide-balance toggle, and a forward-looking card with a due date and "On track".
- A sticky header gets a solid or blurred background on scroll, so rows never slide under it.

## What users complain about here

Hidden or late-revealed fees; features moved behind a paid tier after the fact; feature sprawl that buries the balance; unclear pending states.

## Accessibility specifics

- Amounts never truncate at large text sizes. Let them wrap or reflow the layout; do not ellipsize money.
- Give amounts explicit accessibility labels so a screen reader says "minus 12 dollars 40, coffee" instead of reading symbols.
- Never encode gain or loss, status or category by colour alone.
