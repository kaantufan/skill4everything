# Review mode: auditing a mobile UI without rewriting it

Use this when the user asks for a review, critique or audit. The output is a short ranked list of real problems with fixes, plus an honest statement of what was and was not checked. Do not edit files unless asked.

## Before you start

Settle these, and ask if you cannot find them:

- **Platforms and minimum OS** the app ships to.
- **Accessibility target.** Do not assume one. If the user has none, review against the platform minimums and WCAG 2.2 AA and say so.
- **Evidence available:** a running build, screenshots, or code only. This decides what you can claim.
- **The existing design system and brand.** They are the standard the app is held to; this skill's preferences are not.

## Procedure

1. **Count tells in the source.** Run `scripts/slop-scan.mjs` on the UI source and note the counts per tier. An empty result does not mean the design is good; it means the code-visible tells are absent.
2. **Get renders.** Capture or request the key screens in light, dark and the largest text size. Without renders, say that visual findings are inferred from code.
3. **Walk the primary task** from launch to done, including one failure and its recovery, one interruption (leave and return), and the back path from the deepest screen.
4. **Check the floor.** Platform structure, touch targets, text scaling, insets, colour and contrast, states, back and dismiss, icons, motion, keyboard, honesty, working controls.
5. **Check fit.** Does the density, energy and warmth of the interface match what this niche and this user need? Does anything on the niche's refuse list appear?
6. **Check consistency across screens.** One header style, one radius family, one icon weight, one voice, tokens from one place.

## What to report

- **Only genuine problems.** A finding needs a user who is hurt or a platform rule that is broken. Taste differences are not findings.
- **At most eight findings**, ranked. If there are more, report the eight that matter most and say how many smaller ones were left out. A list of forty items gets none of them fixed.
- **Do not flag platform idioms**, deliberate brand choices, or anything the brief asked for.
- **Do not propose modernising unrelated code.** A deprecated API is a finding only when it affects what the user sees or will stop working on the target OS.
- **Say what works** in two or three lines, so it survives the fixes.

Severity:

| Level | Meaning |
|---|---|
| Blocker | Stops a task, fails accessibility at the agreed target, is a dark pattern, or risks store rejection |
| Major | Breaks a platform convention users rely on, or is a tier-1 tell |
| Minor | A craft gap that lowers perceived quality |

## Output format

Use exactly this shape so findings can be scanned and tracked.

```
Reviewed:  <app, screens or files> on <platforms>
Evidence:  <device | simulator | screenshots | code only>, <light/dark/large text covered or not>
Scan:      tier1=<n> tier2=<n> tier3=<n>

1. [Blocker] <short title>
   Where:  <screen, or file:line>
   What:   <what is observed, one sentence>
   Why:    <who it hurts, or which rule it breaks>
   Fix:    <the concrete change; before -> after when code is involved>

2. [Major] ...

Working well:   <two or three things to keep>
Not verified:   <what the evidence could not show: motion, haptics, performance, screen reader, real device>
```

## If asked to fix after the review

Fix blockers first, then majors. After each round, re-run the scan and re-render the changed screens, and report the counts before and after. Stop after three rounds and list what remains.
