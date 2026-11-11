# Slop tells: what makes a mobile app look generated

A tell is a default nobody chose. It is not proof of who wrote the code, and most tells existed before language models did. What people actually object to is sameness: surveys of complaint threads put "it all looks the same" far ahead of any single feature such as purple or gradients. So the fix is never "remove the tell". The fix is "make the decision the tell was hiding".

The hardest tells are the model's own taste. Measured over this skill's earlier output: one serif display face on five screens of eight, a web font on every screen, every icon drawn by hand from vector paths, metadata chained with middle dots on every screen, a radial gradient used as lighting on seven of eight. None of these is wrong. Together they say who made the screen. The cure is not a better choice by the same chooser, and not random choices either, which are incoherent: the direction (typeface, colour tokens, icon set, imagery rule, signature moment) is dealt by `scripts/deal.mjs` from the niche, and pictures are real photos, covers, maps or data.

How to use this file: find hits (by eye, or with `scripts/slop-scan.mjs`), and for each one ask whether it was chosen for this product. If yes and you can say why, keep it. If not, apply the replacement.

## Contents

- Tier 1: anyone notices
- Tier 2: a designer or developer notices
- Tier 3: craft gaps
- The second wave: over-corrections
- Not tells
- Code signatures by stack

## Tier 1: anyone notices

Fix these first. A layperson reads each one as "template" within a second.

| # | Tell | What it looks like | Do instead |
|---|---|---|---|
| 1 | **Template colour** | Purple-to-blue gradient; or the framework's seed colour left as shipped (the Flutter demo purple, the Compose template purples, Material baseline purple, default blue buttons) | Take one dominant colour and one accent from the product's own world, generate the platform's colour roles from them, and delete the template colours |
| 2 | **Emoji as icons** | Emoji in tab bars, list rows, buttons, empty states; a sparkle glyph for anything "AI" | One icon family per platform, one weight. No emoji unless the brand voice explicitly uses them in copy |
| 3 | **Website in a phone frame** | Hero banner, centred max-width column, testimonials, FAQ, pricing grid or footer inside the app; hamburger menu as primary navigation; hover styles | Open on the task. Tab bar or navigation stack. Single column built from lists and sheets |
| 4 | **Gradient everything** | Gradient header, gradient buttons, gradient cards, gradient text | Colour fields with a reason. A gradient is light falling from one direction, or it is data; it is never the idea itself |
| 5 | **Fake life** | "Welcome back, Alex" with a wave, avatar and bell; stat tiles with invented numbers; stock avatar services; "John Doe", "Item 1", lorem | Lead with the user's real last state ("Resume chapter 3"). Realistic, varied sample data. Every number on screen is computed from the app's real state; a hard-coded figure is removed, not restyled, even when the task is "keep the features" |
| 6 | **Template residue** | Default app icon and splash; starter text from the project template; "Flutter Demo", "Hello World" | Replace every asset and string the template shipped |
| 7 | **The slideshow** | Three illustrated onboarding slides with dots and Skip before the user has seen anything | Drop them. The first screen is the product, with a first-run empty state that offers the real first action |
| 8 | **Grey placeholder slot** | A flat grey box, sometimes labelled, where a photo, cover, map or portrait belongs; the screen reads as unfinished | Real material from the imagery list in a slot with a coloured fallback near the photo's dominant colour. No celebrated app ships placeholder boxes |

## Tier 2: a designer or developer notices

| # | Tell | What it looks like | Do instead |
|---|---|---|---|
| 9 | **Card for everything** | Every row its own rounded, shadowed card; cards inside cards; a hairline border and a soft shadow on the same surface | Lists with separators for homogeneous data. One level of containment. Choose a defined edge or elevation, not both |
| 10 | **One number everywhere** | The same padding at every nesting level; the same corner radius on buttons, cards, images and sheets | Rhythm: gap inside a group is smaller than between groups, which is smaller than between sections. Radius by role |
| 11 | **Half-built chrome** | A custom header, tab bar or sheet that dropped what the system gave for free: the back gesture, safe areas, labels, pressed and selected states | Either the system part, or a bespoke part designed for this product and finished to the floor's standard |
| 12 | **Wrong uniform** | iOS switches, chevrons and action sheets on Android; floating action button, ripple and snackbar on iOS; the other platform's font | Per-platform components. On a shared codebase, branch by platform for navigation, controls, dialogs and icons |
| 13 | **Reinvented controls** | Custom toggle, checkbox, segmented control, date picker, dropdown | The system control in the product's colours, or a bespoke control that belongs to the concept and has every state |
| 14 | **Hard-coded device** | Status-bar padding as a literal number; layout computed from screen width; fixed font sizes; white and black colour literals | System insets, flexible layout, text styles, semantic colours |
| 15 | **Grand entrance** | Every list row fades and slides in with a stagger; bounce on everything; the same press-squish on every touchable; shimmer and pulse loops; numbers that count up | One choreographed entrance, a living hero, a real consequence for the main action, and stillness everywhere else |
| 16 | **Dashboard reflex** | Home is a grid of big-number tiles with a green delta; rainbow charts, donuts and progress rings used as decoration | Show what the user acts on. Charts use one hue plus neutrals, with the accent on the point being made |
| 17 | **Side stripe** | A coloured bar on the left edge of cards, alerts or rows (the "fingernail" card) | Weight, background or position. Reserve edge colour for a real status system applied consistently |
| 18 | **Icon chips** | A pastel rounded square behind every icon in every row | Remove the chip, or make it one consistent system where colour means something |
| 19 | **Badge soup** | "NEW", "PRO", "Beta" pills and status chips on most elements | A chip only for a real state that changes. A status chip that can never change ("Live", "Verified", a pulsing dot) is fake life |
| 20 | **Dead ends** | Buttons that do nothing; a success alert with no action behind it; a spinner that flashes for a tenth of a second; the empty state visible during first load; "Oops! Something went wrong"; the keyboard covering the main button | Wire it or remove it. Skeleton for first load. Errors say what failed and what to do |
| 21 | **Paywall clone** | Small delayed X, three checkmark bullets, "Most popular" ring, trial toggle, weekly price, shown before any value | Structure follows the real offer. Price and period in plain text. Shown after the first success, dismissible at once |
| 22 | **Filler copy** | "Seamless", "effortless", "unlock", "supercharge", "elevate"; buttons labelled "Submit", "Continue", "Get started" | A verb and an object for what this app literally does. If the sentence fits five hundred products, rewrite it |
| 23 | **Lucide by default** | The same thin line icons at default size and stroke (the sparkle, arrow, zap, rocket and shield glyphs), often mixed with another set | The direction's icon set at one weight, filled only for the selected state |
| 24 | **Happy path only** | Every screen shows full content; no loading, empty, error or offline version, no second step of the task | Design the states, and build the next step of the primary task |
| 25 | **Drift between screens** | Radius, header, icon weight or accent change from one screen to the next | One direction, tokens in one place, checked side by side |

## Tier 3: craft gaps

Not tells by themselves, but they separate finished from unfinished: digits that jitter because they are not tabular; no truncation plan for long names; mixed icon families or weights; a type scale whose steps are too close to read as hierarchy; grey text that fails contrast; dark mode produced by inverting light mode; translucent material placed under body content.

## The second wave: over-corrections

Telling a model to avoid the first wave produces a second look that is now just as recognisable: ask for something less generated and you get the next same page, a warm cream ground with a terracotta accent, or near-black with one acid-green signal, mono labels, one coloured word in the headline and 01 02 03 markers. Bans alone do not stop this drift; the choice has to be derived from a direction and the product. Each of these is fine when the product earns it and a tell when it appears by reflex:

- Cream background, high-contrast serif headings, terracotta or clay accent.
- Near-black background, one acid or lime accent, monospace labels.
- Newspaper styling: hairline rules, zero radius, dense columns.
- A tracked all-caps eyebrow above every heading; `A · B · C` strings of metadata; arrows appended to button labels; numbered `01 02 03` labels on things that are not a sequence.
- One italic or coloured word inside a headline.
- The current fashionable free typeface, whichever it is this season.
- Sage or emerald green as the "not purple" accent.
- Paper grain, doodles and hand-drawn type added to look human.
- Translucent glass on every surface.
- One oversized "signature" element on every screen, by formula.

Inverting a tell lands in one of these clusters. Do not invert; derive the choice from the product's own world, as the brief requires.

## Not tells

Do not "fix" these:

- Anything the dealt direction or an existing brand specifies.
- The platform system font, tab bars, large titles, and the large corner radius of system sheets. They are the platform.
- Coloured glyph tiles in a settings-style list, when they form one consistent system.
- A card, a gradient, a serif or a cream background that the brief or the subject calls for. Judge combinations and intent, never a single hit.
- Anything specified by an existing brand or design system.

## Code signatures by stack

Signals for review, never automatic failures. `scripts/slop-scan.mjs` runs these; without Node, grep them. Add `slop-ok` in a comment on a line to mark a deliberate choice.

**All stacks**

| Signal | Pattern |
|---|---|
| Template purples | hex `6366F1`, `8B5CF6`, `7C3AED`, `A855F7`, `4F46E5`, `667EEA`, `764BA2`, `6750A4`, `6650A4`, `D0BCFF` |
| Emoji in UI source | emoji code points inside string literals |
| Placeholder data | `Lorem`, `John Doe`, `Jane Smith`, `Item 1`, `pravatar`, `dicebear`, `picsum` |
| Filler and fake-life copy | `seamless`, `effortless`, `supercharge`, `Welcome back`, `Good morning`, `Oops`, `Something went wrong` |
| Typeface models reach for | `Inter`, `Fraunces`, `Instrument Serif`, `Space Grotesk`, `DM Sans`, `Bricolage Grotesque`, `Manrope`, `Poppins` and the rest of the list in `scripts/deal.mjs` |
| Middle-dot chains | ` · ` four or more times in a file |
| Hand-drawn icons (prototypes) | twelve or more inline `<svg` elements (icon paths; a few hand-drawn charts are fine) |
| Lucide by default | `lucide` in a script or link URL, `data-lucide=` |
| Gradient text (prototypes) | `background-clip: text` |
| Fingernail cards (prototypes) | `border-left: 3px` to `6px solid`, two or more times in a file |
| Grey slot (prototypes, heuristic) | a neutral grey `background` (`#ccc`, `#ddd`, `#d1d1d6`, `#e5e5ea`, `#e0e0e0`, or a variable holding one) on a rule or element named photo, img, image, cover, art, thumb, avatar, hero or map |
| Avatar services | `randomuser.me`, `ui-avatars.com` (`pravatar` is caught as placeholder data) |
| Lighting effects (prototypes) | `filter: blur(` with a large radius, repeated `radial-gradient(`, `feTurbulence` grain |

**SwiftUI / Swift**

| Signal | Pattern |
|---|---|
| Fixed font size | `.font(.system(size:` |
| Hard-coded device | `UIScreen.main`, `.padding(.top, 44)` and the like (47, 50, 54, 59) |
| Colour literals | `Color.white`, `Color.black`, `Color(red:` outside the theme file |
| Gradient decoration | `LinearGradient(` more than twice in a file; `foregroundStyle(LinearGradient` |
| Hand-rolled chrome | `navigationBarBackButtonHidden(true)`, `.toolbar(.hidden, for: .navigationBar)` |
| Sparkle icon | `systemName: "sparkles"`, `"wand.and.stars"` |
| Tap on a non-button | `.onTapGesture` where a `Button` would do |

**Jetpack Compose / Kotlin**

| Signal | Pattern |
|---|---|
| Template colours | `Purple40`, `Purple80`, `PurpleGrey40`, `Pink40` |
| Fixed font size | `fontSize = 14.sp` and the like outside the typography file |
| Colour literals | `Color.White`, `Color.Black`, `Color(0xFF` outside the theme |
| Gradient decoration | `Brush.linearGradient`, `Brush.verticalGradient`, `Brush.horizontalGradient` more than twice in a file |
| One radius | many `RoundedCornerShape(16.dp)` |
| Sparkle icon | `Icons.Default.AutoAwesome`, `Icons.Filled.AutoAwesome` |

**Flutter / Dart**

| Signal | Pattern |
|---|---|
| Template colours | `Colors.deepPurple`, `seedColor: Colors.` with a stock swatch |
| Fixed font size | `TextStyle(fontSize:` in widget files |
| Colour literals | `Colors.white`, `Colors.black`, `Colors.grey`, `Color(0xFF` outside the theme |
| Gradient decoration | `LinearGradient(` more than twice in a file |
| One radius | many `BorderRadius.circular(16)` |
| Wrong uniform | `CupertinoSwitch(`, `CupertinoAlertDialog(` used unconditionally |
| Bare tap target | `GestureDetector(` used as a button |
| Bounce | `Curves.bounce`, `Curves.elastic` |
| Template residue | `Flutter Demo`, `You have pushed the button` |
| Sparkle icon | `Icons.auto_awesome` |

**React Native / Expo**

| Signal | Pattern |
|---|---|
| Web press model | `TouchableOpacity`, `TouchableHighlight`, `onMouseEnter` |
| Hard-coded device | `paddingTop: 44` and the like, `StatusBar.currentHeight`, `Dimensions.get(` |
| Hand-rolled chrome | `headerShown: false`, `createDrawerNavigator` |
| Colour literals | `backgroundColor: '#fff'`, `'#ffffff'`, `'#000'` |
| Gradient decoration | `LinearGradient` more than twice in a file |
| Side stripe | `borderLeftWidth`, `borderLeftColor` |
| Grand entrance | `FadeInDown`, `FadeInUp`, `.delay(index` |
| Dead control | `onPress={() => {}}` |
| Web font reflex | `fontFamily: 'Inter'` |
| Template residue | `Open up App`, `Welcome to React Native` |

What code cannot show and only a render can: whether one colour dominates, whether the hierarchy reads when blurred, whether screens share a silhouette with every other app, whether the empty and error states look designed.
