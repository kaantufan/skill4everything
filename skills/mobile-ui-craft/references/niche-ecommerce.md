# Niche: e-commerce and marketplaces

**Preset:** D4 · E2 · W3 — dense lists and clear prices, quiet motion, approachable.
**Stakes:** trust 4/5 (payment, personal address, delivery promises). The user hands over money and expects the item.
**Session:** short browse-and-compare visits of a few minutes, often interrupted, often on the move.

## The user in the moment

Price-sensitive and cautious. They are comparing, checking delivery dates and returns, and being interrupted by life. They abandon quickly when a form fights them or a price changes late. They notice when an app is pushing them.

## Structure

- **Navigation:** 4–5 tabs (for example Home, Search or Categories, Cart, Orders, Account). Search is the front door.
- **First screen answers:** "What am I looking for, and what did I look at last?" Search at the top, then recently viewed or resumed items, then picks. Promotions do not cover the search.
- **Key screens:** search and filters · product list · product detail (gallery, price, delivery, reviews) · cart · checkout · order tracking · returns.
- **Product list:** image-led cards with price, rating and delivery. A sticky row of applied filters, multi-select inside each filter, a live result count on the apply button, and the common sorts (price, rating, best-selling, newest).
- **Checkout:** address lookup, saved cards, inline validation, input kept after an error, and the primary button above the keyboard.

## Look and feel

- **Cliché to avoid:** red "SALE" badges and countdown timers on every card.
- **Over-correction to avoid:** a stripped, luxury-boutique grid with no visible prices, no ratings and no delivery information, forcing a tap into every product just to compare.
- **Colour:** a neutral canvas so product photos lead. One action colour reserved for add to cart and checkout.
- **Type:** legible price typography with a clear hierarchy: current price first, old price quiet, savings plain.
- **Shape:** moderate radii. Product photos are consistent in crop and ratio.
- **Motion and haptics:** fast and tactile. A quick cart-add response and a light haptic. No animation that blocks the next action.

## Trust signals

- Total price including tax and shipping appears early, not for the first time at checkout.
- Returns policy sits near the price.
- Reviews are labelled as verified purchases where true.
- Delivery date is stated with certainty, and secure payment is visible without clutter.

## States you must design

Out of stock (with alternatives) · price changed in cart · address validation failure · payment declined (with the reason and next step) · order delayed · offline browsing with cached items · empty cart · quantity limit reached · return in progress · item unavailable in the user's region.

## Refuse to build

Fake countdown timers and fake stock counts; drip pricing; pre-ticked add-ons (the large Amazon Prime settlement involved enrolment and cancellation practices); confirmshaming on declines; unsubscribe mazes; promo emails with a hidden unsubscribe; asking for a rating before payment.

## Learn from

- **Baymard-aligned patterns** — research-backed filtering, sorting and address lookup. Borrow these as defaults for any shop.
- **Airbnb (2025 redesign)** — warm, playful, browse-first discovery. Borrow the friendly imagery. Reports of its all-in-price default come from a single blog, so verify before you claim it.
- **Taobao on Vision Pro** — Apple Design Award for Interaction, with 3D models and side-by-side comparison. Little of the spatial design transfers to a phone, so borrow only the comparison idea.

## What users complain about here

Mobile product lists and filters are weak on most sites: research found a large majority rated mediocre or worse, many lacked the core sorts, and filters hidden in a separate screen force back-and-forth. Checkout flaws are common: many lack automatic address lookup, many lose card details after an error, and many lack inline validation. Fake urgency and hidden fees are also named repeatedly.

## Accessibility specifics

- Colour swatches carry a text name, not colour alone.
- Product images are zoomable and have alt text.
- Form errors are linked to the field and announced.
- Quantity steppers work with a screen reader and have large targets.
- Price changes and stock changes are announced, not only coloured.
