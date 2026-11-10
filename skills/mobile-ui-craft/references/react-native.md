# React Native and Expo

Checked on 2026-11-10 against React Native 0.88.1 and Expo SDK 58 (`expo` 58.0.x). The New Architecture is the only architecture: legacy was removed from React Native 0.82 and Expo SDK 55.
When the project's SDK is newer or an API does not compile, the SDK and its documentation win.

## Contents

- Prefer native primitives
- Safe areas, colour and shape
- Touch, keyboard and forms
- Lists and performance that users feel
- Motion and haptics APIs
- Stale API to current API
- Commonly wrong in generated React Native
- Verify in React Native

## Prefer native primitives

The native layer gives the right look, gestures and accessibility for free, and it updates with each OS release. Hand-rolled copies do not. Do not hand-roll headers, tab bars, bottom sheets, toggles or pickers.

- **Stack headers.** Use the native stack (`@react-navigation/native-stack`, built on `react-native-screens`). Set the title through the header options, not a custom `Text`. For an iOS large title use `headerLargeTitleEnabled`; if your installed version does not know that option, check its types for the current name. Large titles are iOS only. Android gets a standard top app bar.
- **Tabs.** Use `expo-router/native-tabs`. It is stable in SDK 58. On SDK 54 to 57 the path is `expo-router/unstable-native-tabs`. Follow the path that matches the installed SDK.
  - On iOS it renders the system tab bar and adopts Liquid Glass on iOS 26 by itself. On Android it renders Material 3 bottom navigation. On web it is only a basic fallback.
  - Parts: `NativeTabs`, `NativeTabs.Trigger` (with a `name`), and its label, icon and badge parts. The icon takes `sf` for SF Symbols and `md` for Material Symbols, for example `sf="house.fill" md="home"`. Check the docs for the exact nesting.
  - `role="search"` makes an iOS search tab. `minimizeBehavior="onScrollDown"` lets the bar shrink on scroll. `NativeTabs.BottomAccessory` adds a bar above the tabs; its state must live outside it, because two instances render. `usePlacement()` reports where it sits.
  - Colour label and icon with `DynamicColorIOS` or `PlatformColor`, because glass flips between light and dark.
  - On Android set `tabBarRespectsIMEInsets` so the keyboard pushes the bar. Android content gets only the bottom inset; handle the other insets yourself.
  - Tab switches do not slide. Screen pushes keep the platform default transition.
- **Sheets.** Use a native form sheet with detents, not a JS bottom sheet. In the native stack that is `presentation: "formSheet"` with a list of allowed detents (for example half and full height, `[0.5, 1.0]`). Exact option names depend on the `react-native-screens` version: check its types.
- **Context menus and previews.** Use native context menus and link previews (in Expo Router, `Link.Menu` and `Link.Preview` if your version has them) instead of custom popovers.
- **Real platform controls.** The `@expo/ui` package gives real SwiftUI and Jetpack Compose controls (sheets, pickers, sliders, toggles, menus, grouped forms). Check it before building any of those by hand. Its `List` is not virtualised, so use a virtualised list for feeds.
- **Images.** Use `expo-image` for every image.
- **Icons.** SF Symbols on iOS through `expo-symbols`, Material Symbols on Android. Every icon needs an equivalent on both platforms. No emoji and no PNG tab icons.
- **Glass.** `expo-glass-effect` provides `GlassView`, with `glassEffectStyle="regular"` or `"clear"` and a tint. It needs iOS 26 or newer and falls back to a plain `View`. The third-party alternative is `@callstack/liquid-glass`. Use glass only on a few floating controls, never on content, never one glass surface on another. Never fake it with `expo-blur` and a translucent `View`.
- **Text.** Add `selectable` to `Text` that holds data users may copy.

## Safe areas, colour and shape

- The `SafeAreaView` exported by `react-native` is deprecated. Do not use it.
- Preferred: `contentInsetAdjustmentBehavior="automatic"` on `ScrollView`, `FlatList` and `SectionList`. The system then handles the header and tab bar insets.
- Where you need numbers, use `useSafeAreaInsets` or `SafeAreaView` from `react-native-safe-area-context` (5.x).
- Never patch a collision with `marginTop: 50` or similar. It breaks on other devices.
- Use `useWindowDimensions` for sizes, not `Dimensions.get()`. Use flexbox for layout.
- Centralise colour in one theme file. Use `PlatformColor` and `DynamicColorIOS` for system roles, wrapped in `Platform.select` with a hex fallback. If your Expo Router version exports a `Color` helper for semantic colours, prefer it.
- Brand colours are explicit light and dark pairs in the same file. No `#fff` or `#000` inside components.
- Corners: use `borderCurve: "continuous"` on rounded shapes, except capsules.
- Fonts: keep the platform system font unless the brief asks for a brand face. Never set `allowFontScaling={false}`. To limit growth, use `maxFontSizeMultiplier`.
- Use `Platform.select`, not `Platform.OS` forks, for per-platform values.

## Touch, keyboard and forms

- Use `Pressable`. Do not use `TouchableOpacity` or `TouchableHighlight`; the docs point to `Pressable`.
- Targets are at least 44 by 44 pt on iOS and 48 by 48 dp on Android. Enlarge with `hitSlop`, not with a bigger glyph.
- Show feedback on press-in and commit the action on press-out. Use `pressRetentionOffset` so a slipping finger can cancel.
- Use `android_ripple` only in Material-styled Android apps. Never show a ripple on iOS.
- Button-like pressables scale to 0.97 on press. Full-width list rows highlight their background instead.
- Keyboard: use `react-native-keyboard-controller` (1.x). Do not use `KeyboardAvoidingView` behaviour guesses, and do not use `Keyboard.addListener` with a timed animation.
- Set `keyboardShouldPersistTaps="handled"` on scrolling forms so the first tap on a button is not swallowed.
- The primary action is never under the keyboard.
- Each input sets `keyboardType`, `returnKeyType`, and autofill through `autoComplete` and `textContentType`.
- Every data screen has four states: loading, error, empty and content. Never show the empty state while the first load is pending.
- Do not close or reset a form until the save has succeeded. Show the failure and keep the user's input.
- Every enabled control must do what it says.

## Lists and performance that users feel

- Any list goes into a virtualiser, even a short one. Use FlashList 2 (`@shopify/flash-list`, 2.x) or LegendList (`@legendapp/list`). `FlatList` is slower for long or heavy lists.
- Give each list a stable `keyExtractor` and stable callbacks. Avoid inline style objects in rows.
- Use item types when rows differ in shape.
- Memoise list rows. Elsewhere, add memoisation only for a measured problem.
- Keep images in lists small and use `expo-image`.
- Wrap text in `Text`. Beware `cond && <Text>` when `cond` can be `0` or an empty string.
- Prefer `onLayout` over `measure()`.
- Keep animation on the UI thread (next section). A JS-thread animation drops frames when the JS thread is busy.
- On iPhones with ProMotion, 120 Hz needs the `CADisableMinimumFrameDurationOnPhone` Info.plist key.

## Motion and haptics APIs

Versions: `react-native-reanimated` 4.x needs the New Architecture and `react-native-worklets` (0.13.x at check time). `react-native-gesture-handler` is 3.x. For gestures, use the API style that your installed version documents (builder or hook) and do not mix styles. Never use `PanResponder` when Gesture Handler is installed.

Rules:

- Run animation on the UI thread with Reanimated worklets. Never call `setState` from a gesture or scroll handler.
- In Reanimated 4 read and write shared values with `.get()` and `.set()`, not `.value`.
- Cross back to JS (`scheduleOnRN` from `react-native-worklets`) only in end handlers or threshold reactions, not per frame.
- Animate only `transform` and `opacity`. Width, height, margin, padding and gap re-run layout every frame. Animating Android elevation re-renders the shadow. Never animate blur intensity.
- Use a spring if a finger was involved, and a timing animation otherwise.
- Frequency decides: actions done 100 or more times a day (tab switches, keyboard, scroll, settings toggles) do not animate. Actions done tens of times a day (press feedback, row selection) stay under 150 ms. Occasional ones (sheets, modals, toasts) use standard motion.
- Entrances start from scale 0.9 to 0.97 with opacity 0. Never start from `scale(0)`. Never use `ease-in`.
- Do not stagger a delayed entrance on every list row.

| Use | Value |
|---|---|
| Default spring | `{ duration: 400, dampingRatio: 1 }` |
| Snap-back after a drag | `{ duration: 400, dampingRatio: 0.8, velocity }` |
| Sheet or drawer | `{ duration: 300, dampingRatio: 0.8, velocity }` |
| Ease-out for UI | `Easing.bezier(0.23, 1, 0.32, 1)` |
| Ease-in-out for on-screen movement | `Easing.bezier(0.77, 0, 0.175, 1)` |
| iOS sheet curve | `Easing.bezier(0.32, 0.72, 0, 1)` |
| Press feedback | 100 to 150 ms |
| Toggle | 150 to 200 ms |
| Other UI animation | under 300 ms. The iOS push takes 350 ms; leave platform navigation alone |

Haptics with `expo-haptics` (58.x): `selectionAsync()`, `impactAsync(ImpactFeedbackStyle.Light | Medium | Heavy | Rigid | Soft)`, `notificationAsync(NotificationFeedbackType.Success | Warning | Error)`.

| Moment | Call |
|---|---|
| Tick, detent, picker step, toggle | `selectionAsync()` |
| Snap or commit | `impactAsync(Light)` |
| Destructive or heavy action | `impactAsync(Medium)` |
| Result of an action | `notificationAsync(Success)` or `notificationAsync(Error)` |

- Fire the haptic in the same frame as the visual change. One per user action. Never on scroll, per frame, or on an entrance. Never the only feedback.
- Reduced motion means fewer and gentler effects, not none. Read `AccessibilityInfo.isReduceMotionEnabled()`. Keep opacity and colour changes. Drop translate, scale, parallax and overshoot. Use a `fade` transition for screens.
- Text scales, so never animate to a measured height.

## Stale API to current API

| Models still emit | Use instead |
|---|---|
| `SafeAreaView` from `react-native` | `react-native-safe-area-context`, or `contentInsetAdjustmentBehavior="automatic"` |
| `TouchableOpacity`, `TouchableHighlight` | `Pressable` with a pressed style, `android_ripple`, `hitSlop` |
| Custom JS bottom-tab bar for the main tabs | `expo-router/native-tabs` |
| `expo-router/unstable-native-tabs` on SDK 58 | `expo-router/native-tabs` (the unstable path is for SDK 54 to 57) |
| `expo-blur` plus a translucent `View` as glass | `expo-glass-effect` `GlassView`, or native tabs and headers |
| `Animated` on layout props, `LayoutAnimation` hacks | Reanimated 4 with `react-native-worklets` |
| `FlatList` for long or heavy lists | FlashList 2 or LegendList |
| `KeyboardAvoidingView` | `react-native-keyboard-controller` |
| `Keyboard.addListener` plus timed animation | `react-native-keyboard-controller` |
| `newArchEnabled: false` | Remove it. It is impossible on SDK 55 and newer |
| Emoji or PNG tab icons | SF Symbols (`sf`) and Material Symbols (`md`) |
| `allowFontScaling={false}` and fixed `fontSize` | Allow scaling. Cap with `maxFontSizeMultiplier` |
| Same header and back UI on both platforms | Native stack headers: iOS large title, Android top app bar |
| `Platform.OS` forks for everything | `Platform.select`, `PlatformColor`, `DynamicColorIOS` |
| `Dimensions.get()` | `useWindowDimensions` |
| `shared.value` in Reanimated 4 | `.get()` and `.set()` |
| `PanResponder` | Gesture Handler plus Reanimated |
| `headerLargeTitle` (older option name) | `headerLargeTitleEnabled`, if your version has it |
| `Alert.alert` to confirm undoable actions | A native sheet or menu, or undo after the fact |

## Commonly wrong in generated React Native

- Web-style modal that slides over content with a close "X" button. Fix: native form sheet with detents and a standard dismiss.
- Emoji used as icons. Fix: symbols per platform.
- Header turned off and rebuilt by hand with a title and back button. Fix: native stack header options.
- Floating pill tab bar made from views. Fix: native tabs.
- Same chrome on iOS and Android (FAB or ripple on iOS, iOS spinner or large title on Android). Fix: per-platform choices through native components and `Platform.select`.
- Fixed top margin to dodge the notch. Fix: system insets.
- `#fff` and `#000` inside components, so dark mode breaks. Fix: theme file with light and dark pairs.
- Same padding value at every level of nesting, so no grouping shows. Fix: smaller gaps inside a row, larger between groups, largest between sections. Put the steps in the theme.
- Every touchable scaled to 0.96 or flashing opacity. Fix: scale only button-like targets; highlight list rows.
- Staggered fade-in on every list row on every visit. Fix: no entrance animation on lists.
- A spinner that flashes for a fast load. Fix: keep the previous content or a skeleton in place until data arrives.
- The keyboard hides the focused field or the submit button. Fix: `react-native-keyboard-controller` and scroll the field into view.
- Form closes before the save returns. Fix: close on success only.
- Fake glass with blur. Fix: `GlassView` or native components, or no glass.
- Gesture handler that updates React state per frame. Fix: shared values on the UI thread.
- Animating `width`, `height` or `margin`. Fix: `transform` and `opacity`.
- A tab bar built with `@react-navigation/bottom-tabs` for the main tabs. Fix: native tabs.
- Haptics missing on toggles and selection. Fix: `selectionAsync()` on change.

## Verify in React Native

- Run on an iOS simulator and an Android emulator. Take screenshots of each main screen. Cover light mode, dark mode, the largest text size, and the smallest supported phone.
- Check that native pieces are real: system tab bar, native header, native sheet. A JS imitation is visible in a screenshot as a missing glass or blur effect, wrong spacing, or missing detents.
- Walk the main task once, including a failure and the recovery. Check the keyboard, the back or dismiss path, long titles, a missing image, no results, and large system text.
- Expo web preview is a weak fallback. Native tabs fall back to a basic version on web, glass falls back to a plain `View`, and the native sheets, system controls and haptics are not there. Use it only to check layout logic, and say so in the report.
- Expo Go and debug builds are slow. Judge animation, scrolling and haptics on a release build on the slowest device you support.
- Check that haptics fire once per action, and that reduced motion changes the animations.
- Say in the report what ran on a device, what ran in a simulator, and what could not run.
