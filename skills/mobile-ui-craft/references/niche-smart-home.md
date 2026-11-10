# Niche: smart home and IoT

**Preset:** D3 · E2 · W3 — scannable tiles, instant feedback, calm and friendly.
**Stakes:** trust 4/5 (cameras, locks, access to the home). Unreliable control makes the product pointless; unsafe control is worse.
**Session:** a glance or a one-tap action of under 30 seconds, often in a hurry or away from home.

## The user in the moment

Wants to know "is it on, is it locked, is it okay?" and to change it now. Often standing at the door, in bed, or away from home. They are used to apps that do not respond and have low patience for re-pairing, cloud outages and updates that change how things work.

## Structure

- **Navigation:** 3–4 tabs (for example Home or Favourites, Rooms or Devices, Automations, Activity). Widgets and quick controls on the lock screen carry the most common actions.
- **First screen answers:** "What is the state of my home?" Favourite devices with live state and last-seen time. Anything wrong is shown first.
- **Key screens:** dashboard with live state · device detail · setup and pairing · automation builder · activity and alerts.
- **Tiles:** a scannable grid or list with name, state and a toggle. State is shown with an icon and a word, not only colour or a glow.
- **Sensitive actions:** unlocking doors, disarming alarms and sharing access need re-authentication and a clear confirmation of the result.

## Look and feel

- **Cliché to avoid:** glossy 3D house illustrations and neon "on" glow.
- **Over-correction to avoid:** a bare technical list of device IDs and toggles, which is reliable but leaves non-technical household members unable to find the light they want.
- **Colour:** neutral base. On, off and alert states use colour plus icon and label. Dark mode is safe at night and does not glare.
- **Type:** device names large and clear. State words are short ("Locked", "Offline, last seen 2 hours ago").
- **Shape:** moderate radii on tiles. Large toggles.
- **Motion and haptics:** instant feedback with optimistic UI, followed by confirmation. A haptic on toggle. Failure is visible, not silent.

## Trust signals

- Camera and microphone privacy indicators.
- A clear view of who has access to the home.
- Transparent firmware updates, with what changes.
- A local-control fallback when the cloud is down, and a plain message when it is not available.

## States you must design

Offline device · hub offline · pairing failed (with a next step) · firmware updating · command pending or failed · partial group failure (3 of 5 lights responded) · cloud outage with local fallback · battery low · automation did not run · guest access expired · new device found.

## Refuse to build

Forcing a cloud account for devices that could work locally; silent feature removals; redesigns that break existing routines; showing a device as controlled when the command failed; blocking control during a cloud outage without telling the user.

## Learn from

- **Commonly cited: Apple Home and Home Assistant** — stability benchmarks in a vendor ranking, which is weak evidence. Treat them as leads to study, not proven models.
- **Flighty-style state awareness (from another niche)** — a lock-screen glance that shows the right fact at the right time is the pattern to bring to home status and alerts.
- **Cautionary evidence:** Google Home and SmartThings drew complaints after redesigns and reliability problems. Learn what not to do.

## What users complain about here

Disconnects; commands sent to the wrong device; setup loops when adding devices through the Matter standard; speakers failing basic requests; an app that became slower after a redesign; and redesigns that broke routines. This is the best-documented complaint set in the research for this niche.

## Accessibility specifics

- Voice control works for every common action.
- State is never shown only by colour or glow.
- Toggles are large and well spaced.
- Sensors and devices have clear names a screen reader can speak, with room and state.
- Alerts are available as audio and haptic, not just visual.
