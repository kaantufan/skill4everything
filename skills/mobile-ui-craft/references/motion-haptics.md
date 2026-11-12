# Motion, gestures and haptics

Motion on a phone is felt more than seen. The right answer for most interactions is the platform default or nothing; a small number of moments deserve design. This file is platform-neutral: it gives the decisions and the numbers. API names for your stack are in the platform file.

The primary action gets one designed consequence on the hero, and the dealt signature moment is the screen's one memorable interaction. Entrance choreography and perpetual loops need Energy 4 or 5 and something truly in progress. The gates below decide everything else on the screen, and Reduce Motion applies to all of it.

## Contents

- The signature: real content that travels
- Motion slop
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

## The signature: real content that travels

The one memorable interaction is a morph of real content that carries the task forward: the add button becomes the stepper and the item flies into the cart bar; the mini player grows into Now Playing with the cover as the shared element; the map pin grows into the listing sheet; a profile card is thrown with velocity and the next one scales up; a card flips in 3D to show its back. Wow here is continuity, physics and real material, not effects. One per flow. Everything else is press feedback and a short ease-out.

1. **Continuity.** Morph the same object between states. Never cross-fade two different things when one can travel: the tapped thing is the thing that grows.
2. **Interruptible and reversible.** The user can grab it mid-flight. A retargeted spring starts from the current position and velocity.
3. **Finger first.** While dragging, the element follows the finger 1:1 (or rubber-bands at a limit). On release a spring carries the release velocity.
4. **Spring tokens** (Material 3 Expressive, mass 1, stiffness / damping ratio). Spatial default 380 / 0.8 settles in about 420 ms with about 1.5% overshoot; fast 800 / 0.6 about 240 ms, about 9.5%; slow 200 / 0.8 about 570 ms. Effects (opacity, colour) 1600 / 1.0, about 220 ms, never overshoot. Apple's scale: bounce 0 by default, 0.15 snappy, 0.3 playful at the end of a gesture, nothing above about 0.4.
5. **Timing still rules.** The table below holds: 100 ms feedback, 200-300 ms screen changes, up to 400 ms for large travel, exits shorter than entrances. Transform and opacity only. Keyboard-started actions do not animate.
6. **3D only for physical objects and gestures:** card flip and tilt, a coverflow of covers or posters, a depth stack, a product or globe viewer. It answers the user's hand (drag, tilt, scroll), carries state (flipped, selected) and has a flat fallback. Use CSS perspective and preserve-3d first; WebGL only for a real lit viewer. Tilt no more than about 10 degrees.
7. **Coverflow and helix are showcase surfaces** (library, collections, my trips), never list navigation. No celebrated app uses a helix as its primary navigation.
8. **Shape morphs:** one or two shapes per screen. The shapes need the same command or point structure to interpolate. A breathing shape is allowed only where it paces something real, such as an exercise.
9. **Gyro tilt** needs HTTPS and, on iOS, a tap that grants permission. Ship the pointer fallback.
10. **Delight scales with rarity.** Celebration only at real milestones; none on money moves, trades or health readings.
11. **Reduce Motion:** movement becomes a fade, 3D shows the flat view, nothing loops.

## Motion slop

These read as generated. Each is allowed only when the motion shows a state change.

- Staggered fade-up on sections or list rows; scroll reveal on every block.
- The same bounce on every control.
- Perpetual float, bob, pulse or glow on icons, hero objects or buttons; drifting gradient orbs.
- Typewriter headlines; count-up on every stat at load; shimmer as decoration.
- Hover lift on cards that do nothing; parallax on every layer; looped Lottie in cards.

Test: does the motion tell the user where something went or what changed? If not, remove it. The slop scan flags the detectable ones.

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
| 4 | Faster, larger motion on primary actions. Shared-element morph between list and detail, and the primary action's consequence travelling |
| 5 | Gesture physics (throw with velocity, flip, tilt), 3D on physical objects, character animation, shape changes and overshoot on gestures. Celebration at real milestones |

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
