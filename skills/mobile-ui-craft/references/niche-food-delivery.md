# Niche: food delivery and restaurants

**Preset:** D4 · E3 · W4 — image-rich dense cards, lively but quick, warm and round.
**Stakes:** trust 3/5 (payment, address, fees, order accuracy). Money at stake is small per order but the anger over surprise fees is large.
**Session:** a 2–5 minute order, then repeated glances at a live tracker for 20–40 minutes.

## The user in the moment

Hungry, impatient, often in the evening and often deciding for several people. Price-aware, and quick to notice when the total at checkout is higher than the menu suggested. After ordering, they check the tracker again and again and want an honest arrival time.

## Structure

- **Navigation:** 3–4 tabs (for example Home or Browse, Search, Orders, Account). The cart is a persistent bar that appears once an item is added.
- **First screen answers:** "What can I eat soon, from where, for how much?" Open restaurants with arrival time, delivery cost and rating. An active order, if any, sits on top.
- **Key screens:** restaurant list · menu with modifiers · cart and checkout · live tracking · support and refund.
- **Menu:** modifiers mark required and optional choices clearly, and the running price updates as the user chooses. Allergen information is visible, not hidden in a link.
- **Sensitive actions:** placing the order shows an itemised total (food, fees, tax, tip) on one screen before the user commits.

## Look and feel

- **Cliché to avoid:** orange and red everywhere, with emoji-stuffed copy and cartoon food.
- **Over-correction to avoid:** a muted grey list of text rows with tiny thumbnails, which removes the appetite appeal that helps people choose and makes restaurants hard to tell apart.
- **Colour:** warm, appetite-friendly photography leads. One brand accent for actions. Status colours (open, closed, delayed) always have a label.
- **Type:** clear and compact. Prices are legible and consistent; arrival time is easy to find on every card.
- **Shape:** medium-to-round radii on image cards. Menu lists stay compact.
- **Motion and haptics:** smooth tracker transitions and subtle updates when the arrival time changes. A success haptic when the order is placed. No celebration that delays the tracker.

## Trust signals

- The fee breakdown is visible before checkout, and ideally all-in price is visible from the list.
- Arrival time is honest, and delays are reported as soon as they are known.
- A clear refund and support path for wrong or missing items.
- Allergen and dietary information is easy to find.

## States you must design

Restaurant closed · item sold out mid-order · courier delayed or reassigned · payment failure · address out of range · refund pending · order cancelled by the restaurant · no restaurants nearby · very long wait warning · courier cannot find the address.

## Refuse to build

Service and delivery fees that first appear at checkout; tip prompts that are preselected high, computed on tax and fees, or hard to skip (the skip button should be as clear as the tip buttons); fake "busy right now" urgency; tips requested on purchases with no service; dark-patterned subscription upsells at checkout. Regulators have acted on fee practices: settlements with major delivery companies, and a federal proposal on fee transparency in food and grocery delivery.

## Learn from

- **Commonly cited: DoorDash and Uber Eats** — a clear order state machine and live tracking, one primary action per state. The research marks these as unverified, so use the structure as a pattern, not a model to copy line by line.
- **The regulators' direction** — show the all-in total up front. It is the pricing principle to build in, whichever app you admire.

## Details leading apps get right

- Fee honesty is the lever. Fee, minimum and free-delivery threshold show up front, and the cart says whether the total includes delivery. Baymard reports that 40% of shoppers abandon a cart because of extra costs.
- The header carries name, cuisine, rating with its count, open until, and a strip of time, fee and minimum.
- Sticky category tabs have a scroll-spy that matches the visible section, and a sticky cart bar with count and total sits in thumb reach.
- In-card quantity steppers show the cart state on the menu itself.
- Minimum-order progress reads correctly (an almost-full bar must not look empty), and "Add X for free delivery" matches the cart maths.
- Allergens are listed per dish, a VAT note is present, and every photo matches its dish.
- The cart does not bury the menu: a peek bar first, the sheet on demand.

## What users complain about here

Stacked fees (service, delivery, small-order, and tax lines) that make the final price differ from the menu; tipping prompts with hidden or tiny skip buttons and high presets; and late-revealed charges. Research cites several fee settlements and a 2026 regulatory proceeding, which shows the pressure is real.

## Accessibility specifics

- Arrival time and status are plain text, not only a moving map pin.
- Offer a text tracker alternative to the map-only view.
- Allergen and dietary labels use text, not only icons or colour.
- Modifier lists work with a screen reader and announce required choices.
- Totals update with an announcement when options change.
