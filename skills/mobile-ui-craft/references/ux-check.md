# UX check: the task carried forward, with real states

A pretty screen shows visual design. UX shows in what happens next: the task moves one step, a state changes, a tap answers, a mistake can be undone. Use this file before building a screen, to know what the first viewport must answer, and after building, to check that it does. Findings about complaints come from vendor review analyses and regulator actions; read them as themes, not as numbers.

## Contents

- First screen: the question per niche
- Single-screen pass
- Flow pass
- Demonstrate UX in a prototype
- Conflicts and nuances

## First screen: the question per niche

The first viewport (roughly the top 600 px) answers the one question the user opened the app with, without a scroll. If it answers a different question, it is a landing page.

| Niche | The first viewport answers | Primary task | Critical states | Refuse |
|---|---|---|---|---|
| fintech | How much do I have, and is anything wrong? Available balance, recent activity, any alert | See the balance, move money with confidence, control the card | Pending, failed, declined with reason and next step, offline (cached balance with an "as of" time), card frozen, fraud hold, session timeout that keeps input | Urgency timers on credit, pre-checked upsells, fees first shown at confirm, a cancel path longer than sign-up, "available vs current" confusion |
| crypto-trading | What is my portfolio worth and what changed? | Place a trade with the fees and risk shown | Pending (step n of m), failed, price stale, market closed, insufficient funds, offline with timestamp | Gamified trading, leverage preselected, fees hidden until confirm, fake "people bought" counters, confetti on risky actions |
| fitness-health | Fitness (run): can I start now? Start button, GPS status, activity type, last run. Daily tracking: how is my day going? | Start and finish a session; read pace, distance, time mid-run | GPS searching or lost, permission denied (with the fix), paused, auto-pause, finish confirmation (hold to finish), unsynced, crash recovery | Streak-loss guilt, paywalled own history, auto-posting publicly, calorie shaming |
| wellness-meditation | What should I do right now? One session for this time of day, one-tap resume, sleep timer | Start tonight's session in 2 taps or fewer | Playing with the screen locked, timer ending (fade out), interrupted audio (resume only after resumable interruptions), headphones unplugged (pause), offline downloads, a week with no data (no shame) | Hidden renewal after a "free" trial, countdown sales, streak anxiety, clinical claims, loud upsell audio |
| productivity-habits | What do I do today? Today list, overdue separated and quiet | Add and complete an item | Empty inbox (calm), overdue, offline queue, recurring-task edge cases, undo after complete | Streak anxiety, nagging escalation, core capture behind a pro tier |
| notes-writing | Where is my last note, and can I start a new one now? | Write and find a note | Offline save, sync conflict (show both versions), draft recovery after a crash, empty search | Cloud-only lock-in without export, silent overwrite, AI rewrite with no undo |
| social-messaging | Who wrote to me, and what is new? | Read and reply; post | Sending, sent, delivered, failed with retry, offline queue, empty inbox, message from a stranger | Infinite scroll with no stopping cue, "someone viewed you" bait, forced notification opt-in, block and report buried in menus |
| dating | Who is here for me right now? One profile card, clear like and pass, verified badge | Decide on a profile, then talk | No more profiles (honest copy), match, message failed, location off, blocked, photo failed verification | Blurred "likes" bait, fake "people nearby", scarcity timers on boosts, hidden cancel, shaming copy on pass, slot-machine loops |
| ecommerce | What am I looking for, and what did I look at last? | Find, compare, buy | Out of stock with alternatives, price changed in cart, payment declined with reason, empty cart, return in progress | Fake countdowns and stock counts, drip pricing, pre-ticked add-ons, confirmshaming, unsubscribe mazes |
| food-delivery | Can I get food from here soon, and what will it cost? Name, ETA window, delivery fee and minimum order, rating and count, open or closed, a cart bar with item count and total once something is added | Find a dish, build the cart with options, pay and track | Closed or busy, sold out (said before add), required modifier, minimum not met (how much more), out of range, payment failed, tracking, delay, cancelled by the restaurant | Drip pricing, pre-checked tip or membership, fake "x people viewing", default high tip, hidden membership cancel |
| travel-transport | Planning: where and when? Search is the main thing on the first viewport. On the day: what is my next step, and is it on time? | Search by place, dates, guests; compare on total price; book | No availability (suggest nearby), price changed since search, sold out mid-checkout, payment failed, delay with next options, offline tickets | Fabricated scarcity ("1 room left"), resetting countdowns, fees at the last step, pre-checked insurance, default to the dearest plan |
| education | What is my next lesson? One dominant continue card, streak and goal secondary, review due count | Do today's lesson in one tap from open | Wrong answer (explain, not just red), lesson complete, out of lives (honest refill), offline, mic denied (typing alternative), resume mid-lesson | Streak freeze sold as a panic purchase, guilt mascot notifications, a pay wall at the moment of failure, shaming "No thanks" |
| kids | What can I play? A handful of large, recognisable choices | Pick and do an activity | Offline play, locked content (calm redirect to the parent), time limit reached (calm), parent gate failed | Ads in the child area, purchases a child can reach, begging characters, contact with strangers |
| media-streaming | What am I listening to, and what is next? Persistent mini-player above the tab bar, continue listening, search | Play something now, control playback one-handed, save | Buffering (controls stay), unavailable track (reason, skip), offline (show downloads), queue empty, ad break, download failed | Ads disguised as tracks, hidden forced shuffle, autoplay with no off switch, unlabeled recommendations in saved lists |
| news-reading | What matters today? A short ranked list with source and time | Scan, open, save an article | Paywalled (marked before the tap), offline cache, updated story, reading position restore, article failed to load | A paywall after the tap, alarmist push, layout-shifting ads, interstitials on launch or back |
| ai-assistant | What do you want to ask? Composer with text, voice, attachments; honest example prompts | Ask and get an answer with sources | Streaming, stopped by the user, failed with retry, rate-limited (reset time), offline, tool running, declined with a plain reason | Hidden message limits mid-task, flattery hooks, ads disguised as answers, unlabelled AI content |
| utilities | Do the one job. The camera opens, the input and result show, the answer for now | Capture or compute, then export | Permission denied (with the fix), nothing detected, poor light, scan in progress, export failed, trial ended (core still works) | Weekly subscription on first launch, gated basic function, hidden cancel, fake system alerts |
| creative-tools | Start making: the camera or the last project, a clear new-project action | Capture, edit, export | Autosave and recover, export progress with cancel, low storage, unsupported format, undo history | Watermark ransom, export paywall after hours of work, locking own projects, glass over the preview |
| smart-home | What is the state of my home? Favourite devices with live state and last-seen, problems first | Control a device, see if it worked | Offline device or hub, pairing failed (next step), command pending or failed, partial group failure (3 of 5 responded), automation did not run | Forced cloud account, showing a device as controlled when the command failed, silent feature removal |
| healthcare | What is next, and is anything waiting for me? Next appointment, new message or result | Book, join a visit, read a result | Result pending, result out of range (careful wording, next step), video failure with phone fallback, timeout that keeps typed text | Dark-pattern upsells, unreviewed medical claims, alarming results with no context, hiding the way to a human |
| real-estate | What is new or changed near where I am looking? Last search with updates, then map or list | Search, save, schedule a tour | Sold or off-market, price changed, no results (widen filters), position restored after a listing, photos loading | Agent lead as the default button, hiding unavailability, fake "hot home" urgency, resetting scroll and filters |
| games-companion | What can I play or do right now? Resume, pick a mode, see what changed | Play, collect, check the companion view | Offline play, save and resume, purchase confirmation and failure, reward pending, event ended, connection lost mid-match | Pay-to-continue pressure on children, hidden currencies, fake scarcity timers, undisclosed odds, guilt characters |
| b2b-field | What do I have to do next? A short job list in order, with status and location | Work a job, capture photos and signature, sync | Offline queue with a count, sync conflict, session expiry that keeps the form, camera unavailable, photo upload failed | Mandatory online for core tasks, re-login that wipes a form, tiny controls, hiding what has and has not been sent |
| government-civic | What do I need to do, and what is the status of what I started? | Start or follow a service, show a credential | Identity check failed (recovery route), service unavailable, pending decision, offline basics, incomplete application, session expired without losing data | Dark patterns of any kind, data beyond the stated purpose, vague errors, hiding the non-digital alternative |

## Single-screen pass

Run it on every screen before calling it done. Items in bold block the work; fix the others when cheap.

1. **First-viewport answer.** The top of the screen answers the niche question above, with no scroll.
2. One primary action, labelled with a verb. Secondary actions are visibly quieter, and at most two buttons are prominent.
3. **Every tappable is at least 44 pt (iOS) or 48 dp (Android) with 8 between neighbours.** Icon-only buttons have an aria-label, and a visible label when the icon is ambiguous.
4. Every interactive element has default, pressed (within 100 ms), focus-visible, and disabled-with-reason states. Anything that can fail has a loading and an error state.
5. **No action lives only in a swipe, a long-press or an overflow menu.** A visible equivalent exists.
6. Navigation: 3 to 5 tabs, labelled, the active one marked by more than colour (`aria-current`, filled icon), back or close always visible.
7. **Data states exist:** loading (skeleton for a page, spinner for a module), empty (what belongs here and the one action that fills it), error (cause, retry, input kept), offline, permission denied.
8. Forms: labels above the field, the right `type`, `inputmode` and `autocomplete`, required and optional marked, no placeholder as a label, validation on blur, errors specific and next to the field.
9. Text: body at least 16 px, nothing under 11 px, nothing lighter than 400 at small sizes, 4.5:1 contrast, lines under about 70 characters, wrapping rather than truncating.
10. Meaning never rests on colour alone: a status or chart series also has an icon, label, shape or pattern.
11. Copy: verb-first buttons, specific headings. No "Submit", "OK", "Learn more", "Oops", "Are you sure?". Errors say what to do.
12. **Honest totals.** The full price and every recurring cost are visible before commitment. No fake urgency, scarcity or social proof. The cancel path is as visible as sign-up.
13. **Reversible means undo.** A reversible action gets an undo snackbar. An irreversible one gets a named confirmation ("Delete 3 photos"), never a bare "Are you sure?".
14. Motion: UI transitions at most about 300 ms, interruptible, a Reduce Motion variant, no looping decoration.
15. **Safe areas and keyboard.** Nothing under the notch, the home indicator or a floating bar. A bar over scrolling content is opaque or a real blur material, so text under it never reads through. The last row clears the bar at the end of the scroll. The primary input is never hidden by the keyboard.

## Flow pass

For two to five screens that make one task.

1. **Task clarity.** State the goal in one sentence. Count the taps from open to goal; more than three for the primary task is a flag.
2. **Orientation.** Each screen has a clear title or a step count. Back keeps the input. Leaving halfway keeps progress.
3. **Deferral.** Sign-up, permissions and the paywall come after the first value, at the point of need. A guest path is visible.
4. **Consistency.** The same word for the same thing, the same component for the same role, the primary button in the same place.
5. **Exits.** Every decision screen has a way out. Every irreversible step has a review screen with edit links.
6. **Peak and end.** The confirmation says what happened, what is next and how to undo, cancel or find it later. It does not end on an upsell.
7. **State coverage.** At least one failure path (declined payment, offline, invalid code) and one empty state appear in the flow.
8. **Cumulative cost.** Count the fields across the flow. Justify each one, and prefill what can be derived.
9. **Interruption.** Leave and come back: the state is restored.
10. **Dark-pattern scan.** When the price is revealed, what is pre-checked, whether accept is loud and reject grey, countdowns, shaming copy, the length of the cancel path.
11. **Keyboard traversal.** Tab through the flow: focus order, focus returning after a sheet closes, labels, announcements of errors and toasts.

## Demonstrate UX in a prototype

Every HTML prototype carries these seven. A reviewer should be able to feel at least three of: a state change, a transition, tap feedback, a reversible action, a validation moment.

1. **Carry the primary task one step further.** Build the screen asked for, plus the next step of its main task as a second view: a sheet, or a pushed screen with a working back. Examples:
   - add a dish: the cart bar updates with the item count and total; tapping it opens a cart sheet with every fee itemised;
   - reserve: a review sheet with total price, dates and cancellation terms before paying;
   - like or pass: the next profile appears, with an Undo snackbar;
   - start a lesson: the first exercise, with an exit;
   - safe to spend: a breakdown sheet;
   - a queue: a queue sheet with reorder;
   - a run's splits row: a split detail.
2. **Every tappable has a pressed state within one frame**, `touch-action: manipulation`, a visible focus ring, and a 44 pt (iOS) or 48 dp (Android) target.
3. **States are reachable by URL hash.** `#loading`, `#empty`, `#error` and `#offline` render those states. No demo strip is visible in the phone. The default view is the populated content. Each state says what happened and what to do. The second view of item 1 keeps its own state, not the hash.

   ```js
   const states = ['loading', 'empty', 'error', 'offline'];
   const sync = () => { const s = location.hash.slice(1); document.documentElement.dataset.state = states.includes(s) ? s : 'content'; };
   addEventListener('hashchange', sync); sync();
   ```

4. **Undo instead of confirm** for reversible actions (a snackbar above the tab bar, 5 to 8 seconds, and Undo really restores the item in place). A named confirmation for irreversible ones.
5. **Honest totals.** Prices, fees and recurring costs are visible before commitment, not on the last step. A total marked "fees included" shows those fees beside it or one tap away. Every visible total is the sum of the visible prices, before and after the demo; assert it in the script.
6. **The auto-demo.** Between 2 and 3 seconds after load the prototype performs the primary action once (add a dish, like, skip a track, start the session, change the dates), which shows the signature moment, and the changed state stays on screen until at least 9 seconds after load, so a capture at 7 seconds shows it. A demo that only scrolls does not count. Skip it under Reduce Motion. The first 2 seconds show the resting state a user sees on opening.
7. **Accessibility.** Semantic elements (`button`, `nav`, `h1`), aria-labels on icon buttons, `aria-live` for toasts, and focus moved to the new view's heading when it opens.

A sheet has a drag handle, a visible close button, Esc or back closes it, and a tap on the scrim closes a modal sheet. Do not stack sheets. A form shows a spinner and a changed label while sending ("Sending..."), keeps the typed values on error, and validates on blur.

## Conflicts and nuances

- **Skeleton or spinner.** Skeletons suit a full-page load of up to about ten seconds and keep the layout stable. One controlled test found them perceived as slowest. Use a skeleton for a page, a spinner for one module, and nothing under one second.
- **Validation timing.** Hints can update while typing; show the error state when the user leaves the field; show success only for checks that are hard to satisfy.
- **Disabled submit.** Apple keeps Next disabled until required data exists; web guidance says do not disable an incomplete form and explain on tap. Prefer an enabled button that explains. If it is disabled, show what is missing.
- **Tab bar size.** 3 to 5 tabs, 4 preferred. "More" only as the last tab.
- **Thumb zone.** The popular heatmaps were disowned by their author. Use convention and large targets, not a heatmap.
- **Dark mode.** Apple discourages an in-app toggle except for immersive media. A sleep or meditation product can be dark only, but contrast still holds.
- **Review statistics.** Percentages from vendor review analyses are themes. Do not quote them as numbers.
