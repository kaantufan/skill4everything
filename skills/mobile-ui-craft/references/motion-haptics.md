# Motion, gestures and haptics

Motion on a phone is felt more than seen. The right answer for most interactions is the platform default or nothing; a small number of moments deserve design. This file is platform-neutral: it gives the decisions and the numbers. API names for your stack are in the platform file.

The primary action gets one designed consequence on the hero. Entrance choreography and perpetual loops need both the dealt effects budget and Energy 4 or 5. The gates below decide everything else on the screen, and Reduce Motion applies to all of it.

## Contents

- Gate 1: should it animate at all
- Gate 2: what is it for
- Timing
- Curves and springs
- What to animate
- Interruption and gestures
- The Energy dial
- Reduce Motion
- Haptics
- Judging the result

## Gate 1: should it animate at all

How often the user triggers it decides.

| How often | Examples | Decision |
|---|---|---|
| Hundreds of times a day | Tab switches, typing, scrolling, toggles in settings | No custom animation. Platform default or nothing |
| Tens of times a day | Press feedback, selecting a row, expanding a section | Under 150 ms, or nothing |
| Occasionally | Sheets, dialogs, toasts, moving between steps | The platform's standard transition |
| Rarely or once | First success, finishing a setup, a real milestone | This is where designed motion belongs |

Zero lines of animation code is a valid result. An animation the user sees two hundred times a day is a delay they pay two hundred times.

## Gate 2: what is it for

Name the purpose in one word. If none fits, remove the animation.

- **Feedback**: the app heard the touch.
- **Continuity**: this thing came from there, so the user keeps their place.
- **State**: something is on, loading, selected, failed.
- **Change**: a value or list changed and a jump would be missed or jarring.
- **Explanation**: showing how a gesture or feature works, once.
- **Delight**: a rare moment that earns it.

## Timing

| Motion | Duration |
|---|---|
| Press feedback | 100-150 ms |
| Small state changes (toggle, checkbox, chip) | 150-200 ms |
| Menus, popovers, tooltips | 150-250 ms |
| Sheets, drawers, large surfaces | 250-400 ms |
| Screen push and pop | Leave the platform's own timing alone |

Keep interface motion under about 300 ms unless a large surface is travelling. Exits are faster and quieter than entrances.

## Curves and springs

- **Entering or leaving the screen:** ease-out. Fast start, gentle stop.
- **Moving while staying on screen:** ease-in-out.
- **Progress and continuous rotation:** linear.
- **Never ease-in** for interface motion; a slow start reads as lag.
- **Anything a finger moved uses a spring**, started with the finger's release velocity.
- **Overshoot follows the Energy dial.** At Energy 1 and 2 use critically damped springs with no bounce. From Energy 3 a small overshoot is right where a gesture carried momentum or a tap has a physical consequence in the hero. Bounce on every control reads as a toy at any setting.
- **Never grow from nothing.** Elements appear from 90-97% scale with opacity, not from zero scale.

## What to animate

- Position, scale, rotation and opacity are cheap. Animate those.
- Do not animate layout properties (width, height, padding, margins), shadow or elevation, or blur radius every frame; they force the system to redo layout or rendering and drop frames on mid-range phones.
- Lists and feeds appear instantly. No staggered entrance for rows.
- Tab switches do not slide; tabs are peers, and sliding implies a hierarchy that is not there.
- Actions started from the keyboard do not animate.
- Numbers change with a short cross-fade or digit roll at most. Counting up from zero on every visit is theatre.
- Loops (pulses, shimmer) only while something is truly in progress, and they stop when off screen.

## Interruption and gestures

- Never block touches during a transition. The user can reverse or grab a moving element at any point.
- Start every animation from the element's current on-screen position, not from where the last animation was meant to end.
- A drag-to-dismiss completes on distance (roughly past the halfway point) or on velocity (a quick flick), whichever comes first.
- At a limit, resist instead of stopping dead: the element follows the finger at a fraction of its speed and springs back.
- Every gesture has a visible alternative. Swipe actions also exist in a menu; drag-to-reorder also exists as move up and move down. Some users cannot drag.
- Do not override system gestures: edge-swipe back, pull down for system panels, the home gesture.

## The Energy dial

| E | Motion character |
|---|---|
| 1 | Cross-fades and platform defaults only. Nothing draws attention to itself. Breathing-pace motion (several seconds per cycle) only where calm is the product |
| 2 | Platform defaults plus quiet feedback on press and on state change |
| 3 | Springs without overshoot on designed moments. One authored transition per flow |
| 4 | Faster, larger motion on primary actions. Shared-element continuity between list and detail |
| 5 | Character animation, shape changes and overshoot on gesture-driven motion. Celebration at real milestones |

Whatever the dial says: no celebration on risky or sensitive actions (moving money, placing a trade, logging a health reading), and no motion that pressures the user (countdowns, shaking prompts).

## Reduce Motion

Ship the reduced version together with the animation, not later.

- Replace movement, scaling, parallax and overshoot with a cross-fade.
- Keep opacity and colour changes; they carry state.
- Stop auto-playing and looping motion.
- Screen transitions fall back to a fade.

Reduced does not mean none: the user still needs to see that something changed.

## Haptics

A haptic confirms something that happened. It fires in the same frame as the visual change; even a tenth of a second late feels wrong.

| Moment | Haptic |
|---|---|
| A value ticks through steps (picker, slider detent, segmented control) | Selection |
| Something snaps, docks or commits (toggle, pull-to-refresh trigger, drop) | Light impact |
| A heavy or destructive commit (delete confirmed, long-press menu opens) | Medium or rigid impact |
| A task finished well, needs attention, or failed | Success, warning or error notification |

- One haptic per user action. Never on scroll, never on entrance animations, never in a loop.
- Never the only feedback: pair it with a visible change, because haptics can be off or absent.
- System controls already carry haptics. Do not add a second one on top.
- Respect the system haptics setting. Android hardware varies widely, so keep patterns short and light there.
- Sensitive niches: a success haptic on a completed transfer is fine; a celebratory pattern is not.

## Judging the result

- Feel cannot be judged from a screenshot or a debug build. Use a release or profile build on the slowest phone you support, and record short clips.
- Watch the clip at reduced speed: anything that jumps, overlaps or arrives late will show.
- Then turn on Reduce Motion and the largest text size and run the flow again.
- In the report, say whether motion was judged on a device, a simulator, or not at all.
