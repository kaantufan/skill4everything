# Flutter

Checked on 2026-11-10 against Flutter 3.47.9 stable (Dart 3.13.7, released 2026-10-29) and the 3.50 beta.
When the project's SDK is newer or an API does not compile, the SDK and its documentation win.

## Contents

- Where Flutter stands
- Theme as the single source
- Native feel on both platforms
- Layout and adaptivity
- Accessibility
- Motion and haptics APIs
- Stale API to current API
- Commonly wrong in generated Flutter
- Verify in Flutter

## Where Flutter stands

- Material and Cupertino are moving out of the core framework into two packages: `material_ui` and `cupertino_ui`. The in-SDK libraries have been frozen since 3.44 and are formally deprecated in 3.50.
- Imports change to `package:material_ui/material_ui.dart` and `package:cupertino_ui/cupertino_ui.dart`. The old `package:flutter/material.dart` and `cupertino.dart` still work on 3.47 but are wrong for new code on 3.50.
- Check `pubspec.yaml` first. Follow what the project already imports. Do not mix both import styles without a reason.
- To migrate: run `dart fix --apply --code=migrate_design_widgets`. Third-party packages that still import the old libraries need `MaterialUiCompatibilityBridge` placed in `MaterialApp.builder`. It cannot fix type mismatches in a package's public API.
- The packages release on their own schedule, so read the installed version's changelog before you rely on a new widget.
- Material 3 is the default theme. The `useMaterial3` flag is no longer needed.
- Material 3 Expressive is not shipped by the SDK today. The tracking issue is open and the team says it is not building it in the SDK; the work is planned for `material_ui`.
- Cupertino "Liquid Glass" (iOS 26 look) is not shipped either. The built-in Cupertino widgets still have the pre-iOS-26 look. The work is planned for `cupertino_ui`.
- So do not fake either one. No hand-rolled blur, no invented widgets, no made-up package names. Build with the real widgets and tell the user plainly that the iOS 26 glass and Material 3 Expressive looks are not available in Flutter yet.
- Wrapper packages for native glass controls or Expressive widgets exist on pub.dev. Their quality is unchecked. Add one only if the user asks, and say it is third party.

## Theme as the single source

- Build one `ThemeData` per brightness and pass them as `theme` and `darkTheme` on the app widget. Set `themeMode` to follow the system by default.
- Colours come from `ColorScheme`. Text comes from `TextTheme`. Widgets read `Theme.of(context)`; they never contain colour literals, `fontSize` or `fontWeight`.
- Put per-component styling in component themes inside `ThemeData` (for example `DialogThemeData`, `TabBarThemeData`, button themes), not in each widget.
- Make a small spacing class with a base unit and named steps. Use `EdgeInsets.only` or `EdgeInsets.symmetric`, not `fromLTRB`, so the intent is readable.
- Define radii and motion timings in the same place (see the motion section).
- Never write `if (brightness == Brightness.dark)` inside a widget. If a widget needs a different value in dark mode, the scheme is missing a role. Add the role.
- The template's seed colour is a tell. Replace the `seedColor` in `ColorScheme.fromSeed` with a colour chosen for the product.
- Build light and dark schemes from the first screen, not at the end.
- Keep the system font unless the brief asks for a brand face. If you add one, set `fontFamilyFallback`, and do not force a single custom family on both platforms.

## Native feel on both platforms

Flutter draws everything itself, so platform behaviour is not free. Fix each tell below.

| Problem | Fix |
|---|---|
| Same controls on both platforms | Use adaptive constructors: `Switch.adaptive`, `Slider.adaptive`, `Checkbox.adaptive`, `Radio.adaptive`, `CircularProgressIndicator.adaptive`, `showAdaptiveDialog`, `AlertDialog.adaptive` |
| Wrong icon set | `Icons` on Android, `CupertinoIcons` on iOS. One family per platform, one weight |
| Wrong page transition | Set `PageTransitionsTheme` builders per `TargetPlatform` (below) |
| Back gesture missing or broken | iOS needs the edge swipe. Android needs predictive back (below) |
| Wrong overscroll | iOS: `BouncingScrollPhysics`. Android: `ClampingScrollPhysics`. Let `ScrollConfiguration` choose by platform; do not force one globally |
| Material ripple on iOS | Use `CupertinoButton`, or set `splashFactory: NoSplash.splashFactory` and show a highlight-only press state |
| Wrong navigation idiom | iOS: bottom tab bar (`CupertinoTabScaffold`, `CupertinoTabBar`). Android: bottom `NavigationBar` with 3 to 5 destinations |
| Wrong primary action | Android: FAB or extended FAB. iOS: trailing button in the navigation bar, no FAB |
| Wrong dialogs | iOS alert: cancel leading, preferred action trailing, destructive in red. Android: confirm on the right, dismiss to its left. Use a snackbar for transient feedback on Android |
| Wrong pickers | iOS: `CupertinoDatePicker`. Android: `showDatePicker`, `showTimePicker` |
| Content under system UI | `SafeArea`, or `MediaQuery.paddingOf`, `viewPaddingOf`, `viewInsetsOf` |
| Text ignores user size | Read `MediaQuery.textScalerOf(context)`; never scale by hand |

Page transitions and back:

- `PageTransitionsTheme` accepts these builders: `ZoomPageTransitionsBuilder` (Material 3 default), `PredictiveBackPageTransitionsBuilder`, `OpenUpwardsPageTransitionsBuilder`, `FadeUpwardsPageTransitionsBuilder` (old default), `CupertinoPageTransitionsBuilder` (lives in `cupertino_ui` since 3.44).
- Use the Cupertino builder for `TargetPlatform.iOS`. Use the zoom or predictive-back builder for `TargetPlatform.android`.
- `MaterialPageRoute` already gives the iOS swipe-back on iOS. `CupertinoPageRoute` gives the full iOS behaviour.
- Intercept back with `PopScope(canPop:, onPopInvokedWithResult:)`. Never use `WillPopScope`.
- For Android predictive back set `android:enableOnBackInvokedCallback="true"` in the manifest. At API 36 it is on by default, and `onBackPressed` is no longer called.
- Edge-to-edge is forced for apps targeting API 36. Call `SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge)` and handle insets with `SafeArea` or `MediaQuery`.
- Text scaling: do not cap or fix it. Avoid fixed-height containers. Use `maxLines` with `overflow` only on text that may be cut without loss.

## Layout and adaptivity

- Read the window with `MediaQuery.sizeOf(context)`. Inside a widget that must fit its parent, use `LayoutBuilder` and `constraints.maxWidth`.
- Pick a layout from width breakpoints, for example 600 as the point where a compact layout becomes a wide one. Never branch on orientation or on device type. Flutter apps run in resizable windows, multi-window and picture-in-picture.
- Never lock orientation. It letterboxes on foldables, and at API 36 locks are ignored on screens 600dp wide or more. If an orientation is truly forced, read the Display API, not `MediaQuery`.
- On large screens cap the content width: `ConstrainedBox` with `maxWidth`, inside `Center`. For grids use `GridView` with `SliverGridDelegateWithMaxCrossAxisExtent`.
- Use `ListView.builder` and `GridView.builder` for every list that is not a handful of fixed items.
- Support mouse, trackpad and keyboard shortcuts when the app can run on tablets or desktop.

Layout errors and their fixes:

| Error text | Cause and fix |
|---|---|
| Vertical viewport was given unbounded height | A scrolling list sits inside a `Column`. Wrap it in `Expanded` or give it a `SizedBox` height |
| InputDecorator unbounded width | A `TextField` sits inside a `Row`. Wrap it in `Expanded` or `Flexible` |
| RenderFlex overflowed | Children are wider or taller than the parent. Wrap in `Expanded` or `Flexible`, or let the content scroll |

## Accessibility

- Add `Semantics(label:, button:, header:, liveRegion:)` where the default is missing. Cupertino widgets have weaker semantic defaults than Material ones, so wrap them.
- Give every `Image` a `semanticLabel`, or set `excludeFromSemantics` when it is decoration.
- Give icon-only buttons a `Tooltip` or `Semantics(label:)`.
- Never use `ExcludeSemantics` on interactive content. Use `MergeSemantics` only to join a static label with its value.
- Target size: 48 by 48 dp. `MaterialTapTargetSize.padded` gives this for Material buttons. WCAG 2.2 AA sets 24 as the floor, but build to 48 (Android) or 44 (iOS).
- Make taps with buttons or `InkWell`. A bare `GestureDetector` has no semantics, no focus and no feedback.
- Never put a fixed height around `Text`. Android clips at about 1.5x font scale, and iOS accessibility sizes reach about 3.1x.
- Every drag needs a non-drag path: a stepper beside a `Slider`, a delete button beside `Dismissible`, move up and down actions beside `ReorderableListView`.
- Keep the focused field visible above sticky bars and the keyboard: `Scrollable.ensureVisible`, and `resizeToAvoidBottomInset: true`.
- Gate animation on `MediaQuery.disableAnimations`.
- Set `autofillHints` on fields that hold personal data (name, email, password, address).
- Announce async results (saved, failed, loaded) with `Semantics(liveRegion: true)` or `SemanticsService.announce`.
- Never use colour as the only signal.
- In 3.47 the header and heading-level behaviour of `Semantics` changed on iOS and Android. Re-test screen reader headings after upgrading.

## Motion and haptics APIs

Choose the lightest tool that works:

1. Implicit animations (`AnimatedContainer`, `AnimatedOpacity`, `AnimatedSwitcher` and the other `AnimatedFoo` widgets). Two properties at once is still implicit.
2. `TweenAnimationBuilder` for a custom value that tweens to a target.
3. `AnimationController` with `AnimatedBuilder` only when you need to start, stop, repeat or drive by gesture. Use `SingleTickerProviderStateMixin` for one controller. Dispose every controller.

Rules:

- Do not wire an `AnimationController` for a plain tween to a target value.
- Never animate layout properties (width, height, padding, `SizedBox` size). Animate `Transform.scale`, `Transform.translate` or `Opacity`.
- Put durations and curves in named constants (an `AppMotion` class), based on the Material 3 motion tokens. No inline `Duration(milliseconds: 237)`.
- Frequent feedback stays under 150 ms. Occasional transitions use the platform default.
- Gate every animation on `MediaQuery.disableAnimations`.

Haptics: `HapticFeedback` has `selectionClick()`, `lightImpact()`, `mediumImpact()`, `heavyImpact()` and `vibrate()`.

| Moment | Call |
|---|---|
| Tick, detent, picker step, toggle | `selectionClick()` |
| Snap or commit | `lightImpact()` |
| Destructive or heavy action | `mediumImpact()` |
| `heavyImpact()`, `vibrate()` | Rare. Use only when a lighter call would go unnoticed |

- Flutter has fewer semantic haptic types than iOS or Android. For success, warning and error patterns, use a plugin.
- Fire one haptic per user action, in the same frame as the visual change. Never in a scroll loop. Never as the only feedback.

Impeller: it is the only engine on iOS. It is the default on Android API 29 and newer, with a GL fallback. It is the default on macOS and Linux from 3.47. Web still uses Skia. Do not add engine flags to "fix" jank; profile first.

## Stale API to current API

| Models still emit | Use instead |
|---|---|
| `WillPopScope` | `PopScope` with `onPopInvokedWithResult` |
| `color.withOpacity(0.5)` | `color.withValues(alpha: 0.5)` |
| `Color.value`, `.red`, `.green`, `.blue`, `.alpha` | `.toARGB32()`, and `.r`, `.g`, `.b`, `.a` (floats) |
| `MediaQuery.textScaleFactor`, `Text(textScaleFactor:)` | `TextScaler`, `MediaQuery.textScalerOf` |
| `MaterialStateProperty`, `MaterialState`, `MaterialStatePropertyAll` | `WidgetStateProperty`, `WidgetState`, `WidgetStatePropertyAll` |
| `ButtonBar` | `OverflowBar` |
| `RaisedButton`, `FlatButton`, `OutlineButton` | `ElevatedButton`, `TextButton`, `OutlinedButton` or `FilledButton` |
| `ThemeData(primarySwatch:)` | `ColorScheme.fromSeed(seedColor:)` |
| `ColorScheme.background`, `onBackground` | `surface`, `onSurface` |
| `ThemeData.dialogBackgroundColor` | `DialogThemeData.backgroundColor` |
| `ThemeData.indicatorColor` | `TabBarThemeData.indicatorColor` |
| App bar theme `color` | `backgroundColor` |
| `DropdownButtonFormField(value:)` | `initialValue:` |
| `ReorderableListView(onReorder:)` (deprecated in 3.44) | Read the analyzer's deprecation message for the replacement |
| `cacheExtent`, `cacheExtentStyle` on scrollables (deprecated in 3.44) | Read the analyzer's deprecation message for the replacement |
| `describeEnum` (removed in 3.47) | `enum.name` |
| `containsSemantics` (renamed in 3.41) | `isSemantics` |
| `import 'package:flutter/material.dart'` or `cupertino.dart` in new code (deprecated in 3.50) | `material_ui`, `cupertino_ui` |

Run `dart analyze` and `dart fix --apply` after generating code. The analyzer's deprecation messages are more current than this table.

## Commonly wrong in generated Flutter

- Material ripples on iOS. Fix: platform-aware buttons or highlight-only states.
- Cupertino widgets expected to look like iOS 26. Fix: accept the iOS 18-style look and tell the user.
- Material 3 Expressive widgets assumed to exist in the SDK. Fix: use stable Material 3 and tell the user.
- A blur plus a translucent container as "glass". Fix: leave it out; opaque or default bars are honest.
- `MaterialApp` look everywhere with no per-platform transitions, icons, dialogs or scroll physics. Fix: the table in the native feel section.
- Colour or font literals inside `build`. Fix: read from `Theme.of(context)`.
- The template seed colour left in place. Fix: choose one for the product.
- Brightness branching inside widgets. Fix: add a colour role to the scheme.
- Layout chosen by orientation or device type, or orientation locked. Fix: `MediaQuery.sizeOf` and `LayoutBuilder`.
- Fixed-height boxes around text. Fix: let text size the box; use `ConstrainedBox` with `minHeight`.
- A bare `GestureDetector` as a button. Fix: a real button or `InkWell`.
- A long list built with `ListView(children: [...])`. Fix: `ListView.builder`.
- A scrolling widget inside a `Column` with no bounds. Fix: `Expanded`.
- Animating width, height or padding. Fix: `Transform` and `Opacity`.
- An `AnimationController` for a simple tween, or a controller never disposed. Fix: implicit animation, or `dispose()`.
- A custom font forced on both platforms for body text. Fix: system font with a fallback.
- Haptics on scroll, on every frame or as the only feedback. Fix: one per action, with a visual change.
- Icon-only buttons with no label. Fix: `Tooltip` or `Semantics(label:)`.
- Android back trapped or `WillPopScope` used. Fix: `PopScope`, and let the system back work.

## Verify in Flutter

- Use widget previews for fast checks of a single widget. Keep previews in a `previews.dart` file. Hot reload after each edit of `lib/**/*.dart`; use the Dart tooling server if your setup has one.
- Add golden or screenshot tests for the main screens. Update goldens only when you meant to change the look.
- Run every main screen in four configurations: light, dark, text scale 200%, and a narrow phone. Add a width of 600 or more to check the wide layout.
- Check the screen sizes you support: the smallest phone, a large phone, and a tablet or foldable width.
- On each screen look for: clipped or truncated text, overflow stripes, targets smaller than 48 dp, missing labels (use the semantics debugger), content under the status bar or home indicator, and the keyboard covering the primary action.
- Walk one failure path: no network, empty result, denied permission.
- Test the back gesture on both platforms and on Android with predictive back enabled.
- Debug builds are slow and do not show real feel. Judge scroll, animation and haptics in a profile or release build on a real device, ideally the slowest one you support. Simulators and desktop windows hide jank, haptics and platform feel.
- Say in the report what ran on a real device and what ran only in a simulator or preview.
