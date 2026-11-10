# One codebase, two platforms

Baseline: checked on 2026-11-10 against iOS and iPadOS 26 and 27, Android 16 and 17, Flutter 3.47, React Native 0.88 with Expo SDK 58, and WCAG 2.2. For Flutter, React Native and Compose Multiplatform apps that ship to both iOS and Android.
The goal is an app that feels native on each platform and still feels like one product. When an SDK or library is newer, or an API does not compile, the SDK and its documentation win.

## Contents

- What stays shared
- What must differ
- How to branch
- Tablets, foldables and resizable windows
- Accessibility baseline

## What stays shared

Share the things that make the product itself, not the things that make a platform.

- **Brand tokens:** colour roles, type roles, spacing steps, shape by role, icon weight, motion timing. One token set, mapped to each platform's own structures.
- **Content and data:** copy, imagery, sample data, empty and error messages.
- **Information architecture:** the sections, the screen list, what each screen answers.
- **Copy voice:** words, tone, names of features. Capitalisation follows the platform (see the table).
- **The brief:** product, audience, direction, signature moment. If the brief says one thing, both platforms say it.
- **States and logic:** loading, empty, error, offline, permission-denied.

## What must differ

Rows marked "convention" are long-standing platform habits. Check the platform's current guideline before you treat them as hard rules.

| Concern | iOS | Android |
|---|---|---|
| Primary navigation (phone) | Tab bar at the bottom, floating on Liquid Glass. It can minimise on scroll | Navigation bar at the bottom with 3 to 5 destinations |
| Navigation on larger screens | Tab bar at the top that converts to a sidebar. Split view | Rail from medium width. Expanded rail instead of a drawer. List-detail panes |
| Back | Back chevron in the bar plus edge-swipe. No system back button (convention) | System back (gesture or button) with predictive back animation. Never trap it. An up arrow appears only for hierarchy (convention) |
| Title alignment | Large title that collapses to a centred inline title | Leading-aligned title in a small, medium or large app bar |
| Top bar actions | Toolbar item groups, symbols without borders, one prominent Done | Icons plus an overflow menu |
| Primary action | A trailing toolbar button or a prominent button. No FAB habit (convention) | FAB, extended FAB or FAB menu |
| Sheets | Detent sheets (medium, large) with a grabber. Cancel leading, Done trailing | Bottom sheet with a drag handle, side sheet at large widths, full-screen dialog. Back dismisses (convention) |
| Alerts and dialogs | Alert with up to 3 verb buttons. Confirmation dialog anchored to its source control | Dialog with text buttons. Snackbar for brief feedback (convention) |
| Alert button order | Cancel leading or bottom, preferred action trailing or top | Dismiss on the left, confirm on the right. No iOS-style stacking (convention) |
| Pickers and date pickers | Wheel, compact or inline date picker. Menu pickers shown in context | Material date picker (modal or docked) and time picker (dial, input, scroll) |
| Switches | Green capsule switch, only inside list rows. Elsewhere use a toggle button | Material switch with a thumb icon. May sit in any settings row (convention) |
| Share | System share sheet via `ShareLink`. The up-arrow-from-box symbol | System Sharesheet via an `ACTION_SEND` intent. The connected-dots symbol (convention) |
| Pull to refresh | Spinner above the list (convention) | Material pull to refresh with a loading indicator |
| Search | A trailing search tab, a bottom toolbar field, or an inline field. Tokens and scope bar | Search bar in the app bar. Expands to a docked or full-screen search view |
| Typography and fonts | SF Pro through Dynamic Type text styles, Body 17 pt | Material type scale in sp, Body Large 16 sp, in the theme's font |
| Icons | SF Symbols. Weight matches text. Filled in tabs | Material Symbols. Variable weight, fill, grade and optical size (convention) |
| Haptics | Rich system haptics. Notification, impact and selection categories | `HapticFeedbackType` semantic constants. Lighter use (convention) |
| Motion | Ease and spring, zoom transitions, Reduce Motion | M3 spring motion schemes, shared-axis and container-transform, predictive back |
| Scroll physics | Rubber-band overscroll (convention) | Clamping with stretch overscroll (convention) |
| Swipe actions | Trailing swipe actions on rows, full swipe for the main one. Match the context menu | Swipe-to-dismiss or long-press multi-select. Swipe actions are less standard (convention) |
| Context menus | Long-press menu with preview | Long-press selects or opens contextual actions. Overflow menus. Tooltips (convention) |
| Where settings live | A section for the app in the iOS Settings app, plus a small in-app screen (convention) | An in-app Settings screen from the overflow or profile. System app-info page for permissions (convention) |
| Menu and button copy | Verb first, title case in menus | Sentence case (convention) |

## How to branch

- **Translate the idiom, not the pixels.** Ask what the user expects on this platform, then build that. A pixel-identical screen is almost always wrong on one platform.
- **One shared component API, two renderings.** The screen calls `confirm(title, message, action)`. The platform layer decides alert or dialog, button order and copy case. Screens never contain `if iOS` layout.
- **Never ship one platform's control on the other.** No iOS switch outside a list row, no Material FAB on iOS, no wheel pickers on Android, no iOS-style alert order on Android, no Material ripple on iOS, no one back-button style on both.
- **Prefer the framework's adaptive or native components over hand-rolled lookalikes.** A native control gets glass, haptics, accessibility and OS updates for free.
- **Flutter.**
  - Use `Switch.adaptive`, `Slider.adaptive`, `Checkbox.adaptive`, `CircularProgressIndicator.adaptive` and `showAdaptiveDialog`.
  - Set `PageTransitionsTheme` per platform: Cupertino slide with edge-swipe on iOS, `ZoomPageTransitionsBuilder` or `PredictiveBackPageTransitionsBuilder` on Android.
  - Use `BouncingScrollPhysics` on iOS and `ClampingScrollPhysics` on Android. Do not force one globally.
  - Avoid Material ink ripple on iOS. Use `CupertinoButton` or a highlight-only press state.
  - Keep the system font unless the brief demands otherwise.
  - Cupertino widgets still show the pre-iOS-26 look, and Material Expressive is not shipped in the SDK. Do not assume either. Material and Cupertino are moving to the `material_ui` and `cupertino_ui` packages, and the in-SDK libraries are deprecated from Flutter 3.50.
  - Handle Android Back with `PopScope`, not `WillPopScope`.
- **React Native and Expo.**
  - Use `expo-router/native-tabs` for main tabs. iOS gets the native glass tab bar. Android gets Material 3 bottom navigation.
  - Use a native stack (`@react-navigation/native-stack` or `react-native-screens`) for headers and back behaviour.
  - Use `Platform.select`, `PlatformColor` and `DynamicColorIOS` instead of forking whole files.
  - Use `expo-symbols` or the `sf=` and `md=` icon props. Never emoji or PNG tab icons.
  - Use `Pressable` with `android_ripple` on Android and a pressed style on iOS.
  - Use `expo-glass-effect` for real glass on iOS 26 and later. It falls back to a plain view elsewhere.
  - Use `expo-haptics` (`selectionAsync`, `impactAsync`, `notificationAsync`) and `react-native-safe-area-context` for insets.
- **Compose Multiplatform.** Put the shared component API in common code and give the iOS and Android implementations the idiom from the table. Do not render the Android idiom on iOS because it is convenient.
- **Where a framework cannot produce the idiom,** pick the platform's convention for the structure (back, tabs, sheets, alerts) and accept a smaller identity difference elsewhere. Structure matters more than decoration.

## Tablets, foldables and resizable windows

- **Map classes to one strategy.** Apple size classes and Android window size classes both answer "how much room is there". Use one pane strategy for both:

| Room | Apple | Android | Layout |
|---|---|---|---|
| Narrow | Compact width | Compact, under 600 dp | One pane. Bottom navigation |
| Roomy | Regular width | Medium (600 to 839 dp) and up: Expanded (840 to 1199), Large (1200 to 1599), Extra-large (1600 and up) | List-detail or supporting pane. Rail or sidebar |

Apple gives two width classes and Android gives five, so use the Apple split as your base breakpoint (one pane or panes) and the Android classes to tune pane count and widths on Android. One shared breakpoint near 600 is a sound starting point in Flutter.

- Read the real size class or window size. Do not hard-code device names, and do not decide by orientation. In Flutter, use `MediaQuery.sizeOf` with `LayoutBuilder`, not device-type checks.
- Never lock orientation. Android 16 ignores orientation and resizability locks at sw 600 dp and up for apps targeting API 36, and removes the opt-out at API 37. WCAG also asks for no orientation lock.
- Never gate a feature by device type or size class. Change the layout, keep the function.
- Cap line length and content width on wide screens. Use adaptive grids, not stretched phone layouts.
- Keep state across fold, rotate and resize: scroll position, selection, typed text, playback.
- Test resizable windows on iPad and desktop-size windows on Android. Never read the screen size once at launch.

## Accessibility baseline

Build to WCAG 2.2 AA on both platforms.

| Topic | Rule |
|---|---|
| Target size, AA | At least 24 x 24 px unless spacing, an equivalent control or another exception applies (criterion 2.5.8) |
| Target size, AAA | At least 44 x 44 px (criterion 2.5.5) |
| Which to follow | The platform minimums, because they are stricter than the AA floor: 44 pt on iOS, 48 dp on Android |
| Text contrast | 4.5:1, or 3:1 for large text |
| Non-text contrast | 3:1 for control boundaries, states and meaningful graphics |
| Text resize | Usable at 200% without loss. Use Dynamic Type and `sp`. No fixed-height text boxes |
| Dragging | Every drag has a single-pointer alternative. Reorder lists need move up and move down actions (criterion 2.5.7) |
| Gestures | Multi-point or path gestures need a single-pointer alternative |
| Orientation | Do not restrict it unless essential |
| Authentication | No memory test or puzzle without an alternative. Allow password managers and paste, passkeys, biometrics (criterion 3.3.8) |
| Redundant entry | Do not make people retype information in the same flow |
| Focus | A focused item is not fully hidden by a sticky bar or the keyboard |

- Never rely on colour alone. Label every icon-only control. Offer a path that needs no motion.
- The European Accessibility Act has applied since 2025-06-28 to consumer services such as e-commerce and consumer banking, and a mobile app that delivers them is in scope. The cited standard is still EN 301 549 v3.2.1 (WCAG 2.1 AA), and the newer version moves to WCAG 2.2 AA, so build to 2.2.
