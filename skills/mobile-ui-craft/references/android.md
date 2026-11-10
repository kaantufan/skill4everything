# Android: Material 3 and Jetpack Compose

Baseline: checked on 2026-11-10 against Android 16 and 17 behaviour notes, Compose `material3` 1.4.0 (stable) and 1.5.0-rc01, and Compose UI 1.12.1.
When the project's SDK or library versions are newer, or an API does not compile, the SDK and Google's documentation win.

## Contents

- Numbers
- Structure
- Type, colour and shape
- Icons, motion and haptics APIs
- Stale API to current API
- Commonly wrong in generated Compose
- Verify on Android

## Numbers

| Item | Value |
|---|---|
| Touch target | 48 x 48 dp, with 8 dp between neighbours. Compose enforces it with `minimumInteractiveComponentSize` |
| Text contrast | 4.5:1 for body text, 3:1 for large text |
| Icon and control-edge contrast | 3:1 |
| Font scale | Support 200%. Use `sp` and no fixed text heights |
| Navigation bar | 3 to 5 destinations |
| Collapsed navigation rail | 80 dp wide |
| FAB menu | 2 to 6 actions, one size, not combined with an extended FAB |

Library versions (stable / newest pre-release, as checked):

| Artifact | Stable | Pre-release |
|---|---|---|
| `androidx.compose.material3:material3` | 1.4.0 | 1.5.0-rc01 |
| Compose UI and Foundation | 1.12.1 | 1.13.0-rc01 |
| `material3-adaptive` | 1.3.0 | 1.4.0-alpha03 |
| `navigation3` | 1.2.1 | 1.3.0-alpha04 |

Read the project's own versions first. Expressive APIs need `material3` 1.5.x.

Material 3 type scale (size / line height in sp, tracking, weight). The emphasized variant is new with M3 Expressive.

| Style | Size / line / tracking | Weight | Emphasized |
|---|---|---|---|
| Display Large | 57 / 64 / -0.2 | Regular | Medium, tracking 0 |
| Display Medium | 45 / 52 / 0 | Regular | Medium |
| Display Small | 36 / 44 / 0 | Regular | Medium |
| Headline Large | 32 / 40 / 0 | Regular | Medium |
| Headline Medium | 28 / 36 / 0 | Regular | Medium |
| Headline Small | 24 / 32 / 0 | Regular | Medium |
| Title Large | 22 / 28 / 0 | Regular | Medium |
| Title Medium | 16 / 24 / 0.2 | Medium | Bold, 0.15 |
| Title Small | 14 / 20 / 0.1 | Medium | Bold |
| Body Large | 16 / 24 / 0.5 | Regular | Medium, 0.15 |
| Body Medium | 14 / 20 / 0.2 | Regular | Medium, 0.25 |
| Body Small | 12 / 16 / 0.4 | Regular | Medium |
| Label Large | 14 / 20 / 0.1 | Medium | Bold |
| Label Medium | 12 / 16 / 0.5 | Medium | Bold |
| Label Small | 11 / 16 / 0.5 | Medium | Bold |

Shape scale (dp): None 0, Extra Small 4, Small 8, Medium 12, Large 16, Large Increased 20, Extra Large 28, Extra Large Increased 32, Extra Extra Large 48, Full (pill). The three "Increased" and 48 sizes are new in Expressive.

Window size classes:

| Width class | Range | Height class | Range |
|---|---|---|---|
| Compact | under 600 dp | Compact | under 480 dp |
| Medium | 600 to 839 dp | Medium | 480 to 899 dp |
| Expanded | 840 to 1199 dp | Expanded | 900 dp and up |
| Large | 1200 to 1599 dp | | |
| Extra-large | 1600 dp and up | | |

## Structure

- **Navigation by window size.** Use a navigation bar on compact width, a rail from medium up, and an expanded rail (`WideNavigationRail`) where a drawer used to go. Do not stack bar, rail and drawer. `NavigationSuiteScaffold` picks bar or rail for you: bar when width or height is compact, rail otherwise.
- **Navigation drawer** is being deprecated in the Expressive direction. Do not choose it for new designs.
- **Top app bars:** the options are small, medium flexible and large flexible. The title is leading-aligned. Use icons plus an overflow menu for actions. Search lives in the app bar and expands to a docked or full-screen search view.
- **Bottom actions:** the bottom app bar is being replaced by the docked toolbar. A floating toolbar (`HorizontalFloatingToolbar`) suits contextual actions. The `BottomAppBar` API still exists, so this is design direction, not a compile error.
- **FAB:** one per screen, for the primary action only. Use an extended FAB when the label helps. Use a FAB menu when the primary action has 2 to 6 related choices.
- **Buttons:** one dominant filled button per group. Do not put a card around every row.
- **Tabs** only for peer views of the same content, because tabs are not navigation between destinations.
- **Bottom sheet** for supporting content or a short task: a drag handle, and Back dismisses it. Use a full-screen dialog for a long form, and a side sheet at large widths.
- **Dialog vs snackbar:** use a dialog when the user must decide. Dialog text buttons put the confirm action on the right and dismiss to its left. Use a snackbar for brief feedback that needs no decision, with an undo action when the change can be reversed.
- **Predictive back:** with target API 36 on Android 16 and later, predictive back animations are on by default and `onBackPressed()` is not called. Use `BackHandler`, `PredictiveBackHandler` or `OnBackInvokedCallback`. Android's own guidance names `NavigationBackHandler` from `androidx.navigationevent` for SDK 36 and later. Use what your library versions support. Never trap Back. `android:enableOnBackInvokedCallback="false"` is only a temporary opt-out.
- **Edge-to-edge** is enforced. The opt-out attribute `windowOptOutEdgeToEdgeEnforcement` is disabled for target API 36. Call `enableEdgeToEdge()` before `setContent`, draw behind the bars, and handle insets.
- **Insets: apply each inset once.** Pick one route: `Scaffold` `innerPadding` with `consumeWindowInsets`, or the built-in insets of M3 components, or `safeDrawingPadding()`. Never pad the parent of an app bar, or its background will stop drawing under the status bar. Adaptive scaffolds do not pass padding on, so pad each screen, list or FAB inside them. Use `WindowInsets.safeDrawing` to keep content clear of bars, cutout and keyboard.
- **IME:** set `adjustResize` for activities with text fields. Prefer `Modifier.fitInside(WindowInsetsRulers.Ime.current)`. If you use `imePadding()`, place it before `verticalScroll`, and not when `contentWindowInsets` already includes the IME.
- **Lists:** use `LazyColumn` for long lists and give every item a `key` and `contentType`. Do not nest scrollables on the same axis. Do not use a lazy list for a few fixed items.
- **Large screens and foldables:** from API 36, `screenOrientation`, `resizeableActivity` and aspect-ratio limits are ignored at sw 600 dp and up, and the opt-out is removed at API 37. Never lock orientation. Use list-detail, supporting-pane and feed layouts, and `GridCells.Adaptive` for grids. Hide the bottom bar on scroll down in content views. Save state continuously so fold, rotate and resize keep it. Add keyboard shortcuts, tooltips and cursors for desktop windows.

## Type, colour and shape

**Type**
- Use roles, not sizes: `MaterialTheme.typography.bodyMedium`. Never write `fontSize = 14.sp` in a screen.
- The Brand roles (display, headline, title large) and Plain roles (the rest) resolve to the theme font. Set the theme font once.
- Use emphasized styles for selection, actions and headlines, not for body copy.

**Colour**
- Use colour roles, never raw hex in screens.
- Dynamic colour (Material You, Android 12 and up) builds roles from the wallpaper. Use the dynamic colour scheme functions in `material3` (check exact names in your version). Define a full static light and dark scheme from the product as the fallback for older devices, and for brands that must stay fixed.
- Replace template seed colours. A theme left at its template values reads as a tutorial.

**Depth and shape**
- Use tonal elevation: `surfaceContainer*` roles for layers. Do not use drop shadows for depth.
- Pick shape by role from the scale (one size per kind of component, not per screen). Use `Full` for pills. Keep one corner family, rounded or cut.

**M3 Expressive**
- It ships in `material3` 1.5.x (1.5.0-rc01 was out 2026-11-04). Stable 1.4.0 removed the `@ExperimentalMaterial3ExpressiveApi` APIs, so do not expect expressive APIs there. If your version has `MaterialExpressiveTheme`, it is the opt-in wrapper. `MaterialShapes` and `LoadingIndicator` stay experimental in 1.5.0.
- It adds: spring-based motion (`MotionScheme.expressive()`), the larger shape sizes, emphasized type, button groups (`ButtonGroup`), `SplitButton`, toggle buttons with shape morph, the FAB menu, a loading indicator for short waits (use wavy progress indicators for determinate progress), docked and floating toolbars, flexible app bars, `ShortNavigationBar`, `WideNavigationRail`.
- Being deprecated in design direction: the bottom app bar (use the docked toolbar) and the navigation drawer (use the expanded rail).
- Rule: spend expressive size, shape and motion on the one or two primary actions. Keep text labels on buttons and keep the dense list variants, so scanning stays fast.

## Icons, motion and haptics APIs

- **Icons:** use Material Symbols as vector XML or the variable font, at one weight across the app. `material-icons-extended` and the core icon set are no longer recommended. Give `Icon` and `Image` a `contentDescription`, or `null` when decorative.
- **Motion scheme:** `MotionScheme.standard()` and `MotionScheme.expressive()`, read through `MaterialTheme.motionScheme`. Material components use the scheme since `material3` 1.4.0. Do not use `tween(300)` for everything.

| Spring (damping, stiffness) | Standard | Expressive |
|---|---|---|
| Fast spatial | 0.9, 1400 | 0.6, 800 |
| Default spatial | 0.9, 700 | 0.8, 380 |
| Slow spatial | 0.9, 300 | 0.8, 200 |
| Fast effects | 1.0, 3800 | 1.0, 3800 |
| Default effects | 1.0, 1600 | 1.0, 1600 |
| Slow effects | 1.0, 800 | 1.0, 800 |

- Spatial springs move position and size and may overshoot. Effects springs change colour and opacity and never overshoot. Use fast for small parts (switch, button), default for partial-screen parts (sheets), slow for full-screen changes.
- **Which animation API:** `animate*AsState` for one value, `AnimatedVisibility` for enter and exit, `AnimatedContent` for swapping content. Defer state reads to layout or draw (`graphicsLayer {}`, lambda offsets) so scrolling stays smooth.
- **Haptics:** `LocalHapticFeedback.current.performHapticFeedback(HapticFeedbackType.*)`. Newer semantic types exist. Check which constants your Compose version has before using one.
- **Reduced motion:** honour the system animation setting and shorten or skip non-essential motion. The sources here did not confirm a specific API, so look up the current one in the Android docs.

## Stale API to current API

| Models emit | Use instead |
|---|---|
| `fitsSystemWindows`, `setDecorFitsSystemWindows(false)` alone, manual status-bar padding | `enableEdgeToEdge()`, `Scaffold` `innerPadding`, `WindowInsets.safeDrawing` |
| `accompanist-systemuicontroller`, `SystemUiController` | `enableEdgeToEdge(SystemBarStyle...)` |
| Overriding `onBackPressed()` | `OnBackInvokedCallback`, `BackHandler`, `PredictiveBackHandler`, or Navigation 3 |
| `ModalNavigationDrawer` as main tablet navigation | `NavigationSuiteScaffold`, expanded `WideNavigationRail` |
| `BottomAppBar` as the action bar in new designs | Docked or floating toolbar |
| `Icons.Filled.*` from material-icons-extended | Material Symbols vector XML |
| `android:screenOrientation="portrait"`, `resizeableActivity=false` | Adaptive layouts with window size classes |
| `fontSize = 14.sp` and fixed text heights | `MaterialTheme.typography.*` |
| `tween(300)` on every animation | `MaterialTheme.motionScheme` springs |
| `shadow` or elevation for depth | `surfaceContainer*` roles |
| `rememberModalBottomSheetState`, `rememberStandardBottomSheetState` | `rememberBottomSheetState` (1.5.0) |
| `Slider(value, onValueChange)` | `Slider(state = SliderState(...))`. `onValueChange` is required in 1.5.0 |
| `TopAppBarDefaults.pinnedScrollBehavior()` with no argument | `pinnedScrollBehavior(scrollableState)` (1.5.0) |
| `SplitButtonLayout` | `SplitButton` |
| Old single `SearchBar` | `SearchBar` (collapsed) with `ExpandedFullScreenSearchBar` or `ExpandedDockedSearchBar` (1.4.0) |

## Commonly wrong in generated Compose

- **Template colours left in place.** Replace the seed scheme with roles built from the product, in light and dark.
- **Insets applied twice.** Padding on the `Scaffold` and again on its children, or `imePadding()` on top of IME-aware `contentWindowInsets`. Apply each inset once.
- **Padding on the parent of an app bar.** Pad the content instead.
- **Padding a scaffold built for adaptive layouts.** Pad the screens inside it.
- **Missing lazy-list keys.** Add `key` and `contentType`. Do not use the index or `hashCode()` as a key. Keys must be saveable (strings and primitives).
- **Heavy work in item lambdas** or `indexOf` and `find` inside items. Prepare data outside.
- **Forced portrait or a locked window.** Build adaptive layouts.
- **Assuming Expressive APIs in `material3` 1.4.0.** They need 1.5.x.
- **Navigation bar, rail and drawer all at once.** Choose one by window size.
- **A FAB per section, or several filled primary buttons together.** One FAB, one dominant filled button per group.
- **Cards around every list row.** Use list items and dividers.
- **Raw `fontSize` and `Color(0xFF...)` in screens.** Use theme roles.
- **Shadows for depth.** Use tonal surface roles.
- **Icon-only buttons without `contentDescription`**, and status shown by colour alone.
- **Animations that ignore system animation settings.**
- **Custom back handling that blocks the system back gesture.**

## Verify on Android

1. **Previews.** Write `@Preview` for each state (loading, empty, error, content). Add `@Preview(device = Devices.PHONE)`, then `FOLDABLE`, `TABLET` and `DESKTOP` for adaptive screens. Also preview dark theme and a large font scale, using the night mode and `fontScale` parameters if your Compose version has them. `@Preview` also has a wallpaper parameter for dynamic colour.
2. **Emulator commands.**
   - `adb exec-out screencap -p > shot.png`
   - `adb shell cmd uimode night yes` (and `night no`)
   - `adb shell settings put system font_scale 1.3` (also try 2.0, then reset to 1.0)
3. **Configurations to cover.** Light, dark, font scale 1.3 and 2.0, the smallest supported phone, a tablet or foldable window, gesture navigation and three-button navigation, and dynamic colour with two different wallpapers.
4. **What to check.** Content hidden under system bars or the keyboard, insets applied twice, clipped text at large font scale, targets under 48 dp, the navigation element that fits the window size, predictive back on an Android 16 image, and Back dismissing every sheet and dialog.
5. **Caveat.** Emulators give breadth. They cannot judge touch feel, haptics, gesture navigation quality or performance. Test those on hardware and say in the report what was not checked.
