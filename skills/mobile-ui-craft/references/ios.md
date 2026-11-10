# iOS: Human Interface Guidelines and SwiftUI

Baseline: checked on 2026-11-10 against iOS and iPadOS 26, the iOS 27 announcements (June 2026) and Apple's SwiftUI and UIKit update notes for the 27 SDK.
When the project's SDK is newer, or an API does not compile, the SDK and Apple's documentation win.

## Contents

- Numbers
- Structure
- Type, colour and materials
- Icons, motion and haptics APIs
- Stale API to current API
- Commonly wrong in generated SwiftUI
- Verify on iOS

## Numbers

| Item | Value |
|---|---|
| Touch target, default | 44 x 44 pt |
| Touch target, absolute minimum | 28 x 28 pt. Never go below it |
| Space around controls | About 12 pt around bezeled controls, about 24 pt around controls with no bezel |
| Body text, default | 17 pt |
| Text, absolute minimum | 11 pt |
| Contrast, text | 4.5:1 up to 17 pt. 3:1 from 18 pt or bold. Aim for 7:1 on small text |
| Contrast, icons and control edges | 3:1 |
| Text scaling | Support at least 200% enlargement |
| Tab count | The current HIG gives no fixed limit for iPhone. The system adds a "More" tab on overflow, so avoid overflow. An iPad tab list the user can customise should default to 5 or fewer |
| Alert buttons | 3 at most |
| Toolbar item groups | About 3 at most |
| Menu | One submenu level, about 5 items in a submenu |
| Prominent buttons | One or two per view |
| Clear glass over bright content | Add a dimming layer of about 35% |
| Date picker minute interval | Must divide 60 |
| App icon canvas | 1024 x 1024 |

Dynamic Type at the default Large size (regular weight, Headline is semibold):

| Style | Size / leading | Style | Size / leading |
|---|---|---|---|
| Large Title | 34 / 41 | Callout | 16 / 21 |
| Title 1 | 28 / 34 | Subhead | 15 / 20 |
| Title 2 | 22 / 28 | Footnote | 13 / 18 |
| Title 3 | 20 / 25 | Caption 1 | 12 / 16 |
| Headline | 17 / 22 | Caption 2 | 11 / 13 |
| Body | 17 / 22 | | |

Body size by setting: xSmall 14, Small 15, Medium 16, Large 17, xLarge 19, xxLarge 21, xxxLarge 23, AX1 28, AX2 33, AX3 40. Large Title goes from 31 up to 40, then 44, 48 and 52 at AX1 to AX3. AX4 and AX5 also exist.

## Structure

- **Tab bar** when the app has a few peer sections, because people switch sections often and need to see where they are. The bar is for navigation only, never for actions. Do not hide or disable a tab; show an empty state instead. Use one-word labels and filled symbols. Show a badge only for critical information.
- **Navigation stack** for drilling into detail inside one section. Use `NavigationStack`. Do not use `NavigationView`.
- **Split view** (`NavigationSplitView`) when the content is a list with a detail pane and the window can be wide: iPad, large windows, foldables. On iPad the tab bar sits at the top and can convert to a sidebar (`sidebarAdaptable`).
- **Large title** on the root screen of a section, because it anchors the user. It collapses to a small centred title on scroll. Use inline titles on deeper screens.
- **Toolbars:** use the standard Back chevron and Close buttons, not text. Group items by function. Use symbols without borders. Give one primary action (Done, Submit) the `.prominent` style on the trailing side. Do not mix text items and icon items on one glass background. Every icon item needs an accessibility label.
- **Search:** put it in a bottom toolbar when there is room, because it is easy to reach. Use a dedicated trailing search tab when search is a main way to discover content (`Tab(role: .search)`). Use the top toolbar button or an inline field above a list otherwise. Show suggestions and recents, and search as the user types.
- **Sheet** for a short task that keeps the parent visible. Use `presentationDetents` with `medium` and `large`, and show a grabber on resizable sheets. Cancel goes on the leading side, Done on the trailing side. Do not show Cancel, Done and Back together. Show one sheet at a time. If the sheet holds unsaved changes, confirm before swipe-dismiss.
- **Full-screen cover** for media or multi-step editing that needs the whole screen, because a sheet would invite accidental dismissal.
- **Push** for content that is part of the hierarchy, because the user expects Back and edge-swipe.
- **Alert** only for rare, important information, usually irreversible. Use a title, an optional message and verb buttons ("Delete", not "OK"). The most likely action goes trailing or top. Cancel is exactly "Cancel". Use destructive style only for a destructive action the user did not choose. No alert at launch.
- **Undo** instead of an alert for actions the user can reverse, because alerts for common actions train people to tap through.
- **Confirmation dialog** (`confirmationDialog`) when choices follow an intentional action. It anchors to the control that triggered it. The destructive option goes on top and Cancel at the bottom. Avoid scrolling in it.
- **Menu** for secondary actions. Labels are title case, verb first, with an ellipsis when more input is needed. Use icons on all items in a group or on none. Context menu actions should match the swipe actions.
- **Lists:** use the grouped style for settings. Section headers are title case, not all caps. Use `swipeActions` for row actions, trailing for the main one. Selection highlight stays only in navigation hierarchies. Use `ContentUnavailableView` for empty states.
- **Switches** only inside list rows. Outside a list, use a toggle-style button. Keep the system switch colour unless a custom tint still has clear contrast in both states.
- **Pickers** for medium to long lists. Show them in context (below the field or in a popover), not on a new screen.
- **iPad and foldables:** decide layout by size classes, not by device or orientation. Keep all functions available at every size. Use safe areas and layout guides. Extend background art under bars. Never read `UIScreen.main`. Test resizable windows. If your SDK is Xcode 27, check the new adaptive and hinge APIs (`ArrangementView`, `onHingeChange`) in Apple's docs before using them.

**If your SDK is Xcode 27**, Apple's update notes list these as new. Read the docs for exact behaviour before use:
- A `prominent` tab role (a separate trailing position) and `toolbarMinimizationBehavior(_:for:)`.
- `swipeActions` that work in any container, and `reorderable()`.
- `@State` becomes a macro, and `ContentBuilder` unifies the toolbar and commands builders.
- A `.crossFade` transition for sheets.

## Type, colour and materials

**Dynamic Type**
- Use semantic text styles (`.font(.body)`). Never set a fixed size with `.system(size:)`. The default size must look unchanged.
- Never clamp the supported size range. Scroll instead of truncating.
- At accessibility sizes, switch horizontal stacks to vertical. Read `dynamicTypeSize.isAccessibilitySize` or use `ViewThatFits`.
- Scale icons and padding with `@ScaledMetric`. Do not use `.minimumScaleFactor` as a fix.
- Chrome that cannot grow (tab and toolbar items) should support the Large Content Viewer.
- Use `.monospacedDigit()` on numbers that change. Avoid Ultralight, Thin and Light weights. Prefer `bold()` over `fontWeight(.bold)`. Avoid `.caption2`.

**Character without custom fonts**
- The system font already has weights, widths and rounded, serif and monospaced designs. Pick one by the product's subject. Keep a clear hierarchy of size and weight. Do not embed system fonts.

**Colour**
- Use semantic colours (`label`, `secondaryLabel`, `separator`, `systemBackground`) or asset-catalog colour sets with light, dark and high-contrast variants.
- Use hierarchical styles (`.primary`, `.secondary`, `.tertiary`) through `foregroundStyle`.
- Do not add an app-specific appearance toggle. Follow the system.
- Test Increase Contrast and Reduce Transparency.

**Liquid Glass**
- Glass is for the control and navigation layer floating above content. Never put it on rows, cards or backgrounds. Use standard materials (ultraThin to thick) in the content layer.
- Do not stack glass on glass.
- Standard bars, tab bars and sheets adopt glass when you build with the new SDK. Do not re-glass them. Remove custom bar backgrounds and `toolbarBackground` tints. Let the scroll edge effect separate bars from content (`scrollEdgeEffectStyle(_:for:)`).
- Put neighbouring custom glass shapes in one `GlassEffectContainer(spacing:)`. A container spacing smaller than the layout gap keeps shapes apart; a larger one lets them merge.
- Use `Glass.regular` by default. Use `.clear` only over media-rich backgrounds with a dimming layer. Do not mix the two.
- Tint means prominence. Tint only the one or two primary actions, never decoration. Brand colour belongs in the content layer.
- Use `.interactive()` only on controls that are tapped.
- Text on glass uses `.primary`. `.secondary` can fall near 2.3:1 on glass.
- The user can change glass transparency in Settings (iOS 27) and can use Reduce Transparency. Never assume how clear the glass is. Test the extremes.
- Do not add your own fallback for Reduce Transparency by default. Sources disagree on whether one is needed, so switch the setting on and judge the result.
- Gate with `#available(iOS 26, *)` and give a fallback when the deployment target is lower. The `UIDesignRequiresCompatibility` opt-out is ignored when the app is linked against the iOS 27 SDK. Do not plan around it.
- Use `ConcentricRectangle` with `containerShape(_:)` for shapes that sit at an edge, so corners follow the container.

## Icons, motion and haptics APIs

- **SF Symbols:** four rendering modes: monochrome, hierarchical, palette, multicolor. Match symbol weight to the text beside it. Use filled symbols in tab bars and outline symbols in toolbars. Use `Image(decorative:)` for pure decoration. Check that a symbol exists in your minimum OS.
- **Symbol effects:** `symbolEffect(_:options:value:)` or `symbolEffect(_:options:isActive:)` (iOS 17). Effects include Bounce, Pulse, Variable Color, Replace, Wiggle, Breathe, Rotate. Magic Replace is the default replace. Draw On and Draw Off need iOS 26.
- **Animation:** bind implicit animation to a value: `.animation(_:value:)`. Chain steps with `withAnimation { } completion:`. If your SDK offers spring presets (`.smooth`, `.snappy`, `.bouncy`), use them before custom spring numbers. For hero transitions use `navigationTransition(.zoom)` with `matchedTransitionSource(id:in:)` (iOS 18).
- **Reduce Motion:** read `@Environment(\.accessibilityReduceMotion)`. Replace movement with an opacity change.
- **Haptics:** `sensoryFeedback(_:trigger:)` (iOS 17). Selection for ticks and pickers, impact for collisions and commits, notification for outcomes. Fire at the same moment as the visual change. Never make haptics the only feedback. Standard controls already play them.
- **Tabs and scrolling:** `tabBarMinimizeBehavior(_:)` (`.onScrollDown`) and `tabViewBottomAccessory(content:)` need iOS 26.
- **Safe area:** `safeAreaInset(edge:)`, `safeAreaPadding`, and `safeAreaBar(edge:alignment:spacing:content:)` (iOS 26, gives the bar the scroll edge effect).

## Stale API to current API

| Models emit | Use instead |
|---|---|
| `NavigationView` | `NavigationStack` or `NavigationSplitView` |
| `.foregroundColor(_)` | `.foregroundStyle(_)` |
| `.cornerRadius(_)` | `.clipShape(.rect(cornerRadius:))` or `.background(_, in: .rect(cornerRadius:))`. Use `ConcentricRectangle` near edges |
| `.tabItem { Label }` with `.tag` | `Tab("Title", systemImage:, value:) { }` (iOS 18) |
| One-argument `.onChange(of:) { newValue in }` | `.onChange(of: x) { old, new in }` or a zero-argument closure |
| `.navigationBarTitle`, `.navigationBarItems`, `.navigationBarHidden`, `.statusBar(hidden:)` | `.navigationTitle`, `.toolbar { ToolbarItem }`, `.toolbar(.hidden, for: .navigationBar)`, `.statusBarHidden` |
| `.accentColor(_)` | Asset-catalog AccentColor or `.tint(_)` |
| `.edgesIgnoringSafeArea` | `.ignoresSafeArea(_:edges:)` |
| `Alert(title:)` and `ActionSheet` structs | `.alert(_:isPresented:actions:message:)` and `.confirmationDialog` |
| `.accessibility(label:)`, `.accessibility(hint:)` | `.accessibilityLabel`, `.accessibilityHint` |
| `ScrollView(showsIndicators:)` | `.scrollIndicators(.hidden)` |
| `.autocapitalization`, `.disableAutocorrection` | `.textInputAutocapitalization`, `.autocorrectionDisabled` |
| `ObservableObject`, `@StateObject`, `@ObservedObject` in new code | `@Observable` with `@State` (iOS 17) |
| `UIImpactFeedbackGenerator` in SwiftUI | `.sensoryFeedback` |
| `UIVisualEffectView` or `.ultraThinMaterial` for floating controls | `glassEffect(_:in:)` or the system bar |
| `UIScreen.main.bounds`, fixed sizes | `containerRelativeFrame`, size classes, `GeometryReader` only when needed |
| `.font(.system(size: 17))` | Text styles or `@ScaledMetric` |
| `UIDesignRequiresCompatibility = YES` | Adopt the new design |
| App-delegate-only lifecycle (UIKit) | Scene-based lifecycle. Apps built with the iOS 27 SDK that skip scenes fail to launch |

## Commonly wrong in generated SwiftUI

- **Opaque custom tab bar or `toolbarBackground` tint on iOS 26 and later.** Remove it and use the system bar.
- **Blur capsules that imitate glass.** Use `glassEffect` on a few floating controls, or the system component.
- **Glass on cards or glass on glass.** Keep glass on the control layer, one layer deep.
- **`.interactive()` or tint on every glass control.** Tint one or two primary actions only.
- **No `#available(iOS 26, *)` fallback** when the deployment target is lower.
- **`onTapGesture` on a view that acts as a button.** Use `Button`. Add `accessibilityLabel` to icon-only buttons. Use `Button(title, systemImage:)` with `.labelStyle(.iconOnly)`.
- **Fixed font sizes and fixed-height boxes around text.** Use text styles and let rows grow.
- **Layout that clips at AX sizes.** Switch to a vertical stack and scroll.
- **`.animation(_)` without a value.** Always bind to a value.
- **Alerts for undoable actions.** Offer Undo instead.
- **ALL CAPS section headers.** Use title case.
- **Hard-coded spacing everywhere.** Pass no spacing, or `nil`, to take the system default. Use `contentMargins` and layout guides.
- **Feature gating by size class or device idiom.** Adapt the layout; keep the features.
- **Inline `filter` or `sort` inside `ForEach`, `AnyView` rows, unstable IDs.** Prepare the data first, keep rows one concrete view, use stable IDs.
- **No press state on a custom button.** Add a visible pressed state.
- **Colour as the only status signal.** Add a symbol or text.
- **Layout built only for iPhone portrait.** Check iPad windows and landscape.

## Verify on iOS

1. **Previews.** Add `#Preview` blocks for each state (loading, empty, error, content). Run each at default and at the largest accessibility size, in light and dark.
2. **Simulator screenshots.**
   - `xcrun simctl io booted screenshot shot.png`
   - `xcrun simctl ui booted appearance dark` (and `light`)
   - For text size and status-bar overrides, run `xcrun simctl help` and use them only if your Xcode lists them. Otherwise change the text size in the simulator's Settings app.
3. **Configurations to cover.** Light, dark, the largest text size, the smallest text size, Increase Contrast, Reduce Transparency, Reduce Motion, the smallest supported iPhone, and an iPad window if the app runs there.
4. **What to check in each.** Clipped or truncated text, targets under 44 pt, bars and tab bars that fight the glass, text on glass with low contrast, content hidden under the home indicator or keyboard, and a visible press state.
5. **Resizable windows.** For iPad, resize the window and rotate. In Xcode 27, Device Hub can test windows.
6. **Caveat.** A simulator cannot judge gestures, haptics, scroll feel or performance. Say so in the report and test on a device when it matters.
