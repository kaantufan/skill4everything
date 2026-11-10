# Niche: crypto and trading

**Preset:** D5 · E3 · W1 — dense market data, restrained motion, formal and sharp.
**Stakes:** trust 5/5 (money, irreversible transactions). A wrong tap can lose funds that cannot be recovered.
**Session:** a 10-second price check, or a 1–3 minute order or transfer. Time-critical, often on the move.

## The user in the moment

Alert and often anxious. Prices are moving, so they want the current number, their position, and a way to act quickly without making a mistake. Non-custodial users also carry a second worry: keys and recovery. They are speculating, not playing, and the interface must not treat it as a game.

## Structure

- **Navigation:** 4–5 tabs (for example Portfolio, Markets or Watchlist, Trade, Activity, Settings). The order ticket is a full screen, not a bottom sheet.
- **First screen answers:** "What is my portfolio worth and what changed?" Total value and profit or loss first, then holdings. No promo banner, no trending-coin carousel above it.
- **Key screens:** portfolio with profit and loss · asset detail with chart · order ticket (type, size, fees, estimate) · confirmation with a risk summary · wallet send and receive with address check · backup and recovery.
- **Sensitive actions:** biometric re-auth, and a review screen before every irreversible step showing amount, recipient, network fee, spread and a readable summary of what the transaction will do.

## Look and feel

- **Cliché to avoid:** the "crypto bro" look: neon on black, rocket and moon emoji, glowing gradients, confetti on a trade.
- **Over-correction to avoid:** a cold, unlabelled terminal grid where every figure has the same weight and a first-time user cannot tell the portfolio total from a ticker row.
- **Colour:** dark is a common default here, but offer a light theme too. Keep one restrained accent for actions. Up and down moves use colour plus an arrow, sign or label, never colour alone.
- **Type:** the platform font with tabular figures everywhere prices appear, so columns do not jitter when values update. Make the position and the total clearly larger than ticker rows.
- **Shape:** small radii, hairline dividers, compact rows. Charts are plain and legible, not decorative.
- **Motion and haptics:** minimal on trading screens. Use two clearly different haptics: order placed and order rejected. No celebration animation after a trade.

## Trust signals

- A plain fee estimate (network fee and spread) before the user signs anything.
- A human-readable preview of what a transaction will do, shown before the final confirm.
- Addresses are checked and the first and last characters are highlighted, so a wrong paste is easy to see.
- Recovery wording explains irreversibility. Some teams soften terms to "recovery code" for newcomers while others keep "seed phrase" on purpose to stress that loss is permanent. Pick one and explain it in context.

## States you must design

Pending or confirming (step n of m) · failed or stuck · price stale · market closed · insufficient funds or gas, with a way to fix it · offline (cached portfolio with a timestamp) · jurisdiction blocked · order rejected with the reason · session timed out (without losing the ticket).

## Refuse to build

Gamified trading; leaderboards of returns; push alerts built on price-spike fear of missing out; leverage or margin preselected by default; spreads and fees hidden until confirmation; fake social-proof counters ("1,200 people bought this now"); confetti or other celebration on risky actions (Robinhood removed its confetti after regulator and press pressure).

## Learn from

- **Robinhood (early design)** — award-winning for clean, content-first screens. Borrow the clarity. Do not borrow the later gamified effects, which it had to withdraw.
- **Phantom** — a single-chain, distraction-free wallet, per design write-ups. Borrow the focus on one job.
- **Coinbase Smart Wallet** — passkey sign-in and no up-front gas handling reduce first-run friction, per design write-ups. Borrow the removal of jargon from onboarding, but keep irreversibility visible.

## What users complain about here

Jargon that newcomers cannot parse; network fees paid in a different token than the one being sent; lost seed phrases with no recovery. From the wider evidence: hidden or late-revealed fees, and notification overload. Statistics on losses in the research come from vendor sources and are not reliable, so do not quote them.

## Accessibility specifics

- Price direction and profit or loss are never conveyed by colour alone.
- Confirm buttons are large and separated from cancel, so a hurried tap does not misfire.
- Do not put a short countdown on confirmation that a screen-reader user could not finish. If a quote expires, say so and offer a one-tap refresh.
- Give prices and changes explicit accessibility labels ("Bitcoin, 64,200 dollars, down 2 percent today").
