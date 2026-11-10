# Niche: real estate

**Preset:** D3 · E2 · W2 — photo-led, map-aware, quiet and precise.
**Stakes:** trust 4/5 (the largest purchase or rental of a person's life). Stale or wrong listing data wastes days and money.
**Session:** long consideration spread over weeks, with frequent short re-checks and alert-driven visits.

## The user in the moment

Emotionally invested and cautious. They browse photos, scan maps, compare prices and commutes, and check again whenever an alert arrives. They fear missing a new listing, and they get annoyed when a saved home vanishes or the list resets after they look at a listing.

## Structure

- **Navigation:** 3–5 tabs (for example Search with map and list, Saved, Alerts or Inbox, Account). A map and list toggle is the core control.
- **First screen answers:** "What is new or changed near where I am looking?" The last search with updates, then the map or list.
- **Key screens:** map search with filters · listing detail (photos, price history, commute) · saved homes and saved searches · tour scheduling · contacting an agent.
- **Search:** filters are dense but progressive. The map and list stay in sync, and the position and filters are restored when the user returns from a listing.
- **Saved:** saved homes and saved searches are clearly different, with plain labels.
- **Sensitive actions:** contacting an agent and sharing contact details state what will be shared and with whom.

## Look and feel

- **Cliché to avoid:** teal and gold "luxury" on dark backgrounds.
- **Over-correction to avoid:** a text-only spreadsheet of listings with no strong photo, which is efficient but removes the emotional pull and makes homes hard to tell apart.
- **Colour:** a neutral frame so photos lead. Clear status chips (new, price drop, pending, sold) with labels, not colour alone.
- **Type:** price is the clearest element on every card; address and key facts follow.
- **Shape:** small-to-moderate radii. Large, consistent photo areas.
- **Motion and haptics:** smooth map-to-list sync. A subtle haptic on save. No decorative motion.

## Trust signals

- Show data freshness: when the listing was last updated and where it comes from.
- Pins are accurate, and the exact or approximate location is labelled.
- Estimates are labelled as estimates, with how they are made.
- Honest availability: sold and off-market homes are marked, not removed silently.

## States you must design

Listing sold or off-market · price changed · new-match alert (and its delay) · saved search versus saved home · position restored after viewing a listing · no results (with advice to widen filters) · map cluster of many listings · photos loading · tour requested or confirmed · offline browsing of saved homes.

## Refuse to build

Pushing agent leads as the default button on every listing; hiding that a listing is unavailable; fake "hot home" urgency; resetting the list scroll and filters after the user looks at a listing; estimates presented as facts.

## Learn from

The research found thin evidence in this niche and could not verify praise for specific apps. One lead with a documented caveat:

- **Zillow** — map-first search is the pattern most often discussed in design critiques and rankings. A dated critique found that going back from a saved home jumped to the top of the list, and users confuse saved searches with saved homes. Borrow the map-first model; fix those two problems.

## What users complain about here

Inaccurate map pins; delayed notifications for new listings; confusion between saved searches and saved homes; and lost scroll position after viewing a listing. Some of this evidence is old (a 2016 critique) or comes from a vendor ranking, so describe it as a pattern.

## Accessibility specifics

- Every map action has a list alternative.
- Photos have alt text, and key facts are text, not only image overlays.
- Pins and clusters have large tap areas and clear labels.
- Status chips use words and icons, not colour alone.
- Filters work with large text and with screen readers, with a clear apply action.
