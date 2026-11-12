# Niche: travel, booking, maps, transport

**Preset:** D3 · E3 · W3 — image-led planning, status-led travel day; friendly but clear. Day-of-travel screens rise to D4.
**Stakes:** trust 4/5 (large bookings, cancellation terms, missing a flight). A wrong or stale time can cost a trip.
**Session:** two modes. Planning is long and relaxed. On the travel day it is a glance, a notification, or a lock-screen update, often with poor signal and low battery.

## The user in the moment

While planning: dreaming and comparing, wary of extra charges. On the travel day: hurried, carrying bags, one-handed, with little battery, and needing one fact: gate, platform, time, delay. They want the app to tell them what changed before they have to look.

## Structure

- **Navigation:** 4–5 tabs (for example Trips, Search, Saved, Messages, Profile). The trip timeline is the organising model, not a list of bookings.
- **First screen answers:** in planning, "Where am I going and what is booked?" On the travel day, "What is my next step and is it on time?" The upcoming item leads.
- **Key screens:** search and results with filters · detail · booking · itinerary timeline · live status · offline documents and tickets.
- **Day-of screens:** dense status with the critical facts (gate, time, platform, seat) very large. Secondary details are one tap away.
- **Sensitive actions:** booking shows the full price with fees, and the cancellation terms, before the pay button.

## Look and feel

- **Cliché to avoid:** stock sunset photos with cursive headings and a "wanderlust" tone.
- **Over-correction to avoid:** an airport-board look applied to the planning stage, which makes browsing a holiday feel like reading a timetable and strips out the inspiration.
- **Colour:** clear semantic colours for on time, delayed and cancelled, always paired with a label or icon. Readable in sunlight.
- **Type:** tabular figures for times, big type for gates and departures. A warmer voice is fine while planning.
- **Shape:** moderate radii. Planning cards are photo-led; travel-day cards are compact and structured.
- **Motion and haptics:** live updates through lock-screen and Dynamic Island style surfaces. Subtle haptics for a gate change. No decorative motion on status screens.

## Trust signals

- Total price, including fees, is shown from the results list.
- Cancellation terms are visible before payment.
- Show where flight or train data comes from and when it was last updated.
- State clearly which tickets and documents work without signal.

## States you must design

Offline tickets and documents · delay or cancellation (with next best options) · rebooking · partial itinerary · time-zone clarity · no signal · gate or platform change · sold out while booking · payment pending · itinerary shared with someone else.

## Refuse to build

Drip pricing where fees are added step by step; fake scarcity such as "2 rooms left" that is not true; pre-ticked insurance or add-ons; confusing add-on ladders (a well-known budget airline's booking flow drew a very large forum thread calling every page a dark pattern); map-only information with no text alternative.

## Learn from

- **Flighty** — Apple Design Award, per a design write-up, for an airport-board-inspired data display and state-aware screens. Borrow the lock-screen and Dynamic Island updates for gate, delay and baggage at the right moment. It now competes with built-in tracking, so the differentiator is how timely its states are.
- **Airbnb (2025 redesign)** — warm, playful imagery and a broader services scope. Borrow the friendly tone for planning screens. Reception was mixed, with scepticism about the wider scope.
- **Tide Guide** — Apple Design Award 2026 for visuals. Borrow the idea that colour should encode the real environment in a data screen.

## Details leading apps get right

- The total price for the selected dates comes with its breakdown (nightly rate times nights, cleaning, service fee, total) and tax status. Airbnb made the all-fee total price its global default in April 2025; almost 17 million guests had used the earlier toggle.
- Choosing dates visibly changes the sticky total, through per-night price chips or a small bar chart.
- Honest constraints come early ("No running water", no step-free access), with "What makes it special" near the top.
- The cancellation rule gives the exact deadline and amount.
- Photos carry a counter. Baymard notes that missing photos make basics such as the bathroom impossible to check.
- A sticky bar holds the total, the dates and a large Reserve, with no second tab bar stacked under it on a detail page.
- The host card and trust cues sit high, and "No reviews yet" is shown as a fact, not left as a hole.
- The map shows an approximate location with "exact address after booking".

## What users complain about here

Hidden fees and add-on tricks in booking flows; fake scarcity; forced account creation before showing prices. Wide-scope redesigns that make familiar tasks harder to find draw scepticism.

## Accessibility specifics

- Times, gates and platforms use large, high-contrast text readable outdoors.
- Updates are available as spoken or notification text, not only visual changes.
- A map is never the only way to see a location or route.
- Delay and cancellation status uses text and icons, not only red and green.
- Time zones are written out where a booking crosses them.
