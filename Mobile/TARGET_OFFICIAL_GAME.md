# Target: official Slow Roads web game (not the archived 2022 clone)

## User-requested target

- Official game: https://slowroads.io/#A2-c1d60f6c@0
- Version shown on the official site, checked November 7, 2026: **2.4.2** (June 15, 2026 update)
- World location: `A` = Hills
- Road complexity: `2` (the game's code system uses 0–3)
- World seed: `c1d60f6c`
- Distance: `0` km
- Preserve the exact reference link as the visual/gameplay acceptance test.

The official developer explains the world-code format as `[location][road complexity]-[seed]@[distance in kilometres]`:
https://www.reddit.com/r/slowroads/comments/1hvfc9k/

## Important clarification

**The current Android app is NOT that game.** It is a small independent
React Native + native OpenGL demonstration. Its road uses a deterministic
sine-wave approximation in `src/engine/road.js`, not Slow Roads'
terrain/road-generation pipeline. Its shaders, driving physics, road geometry,
environment and user interface do not match the official title.

The repository root contains an older unofficial saved browser build.
It is **not** the current slowroads.io 2.4.2 engine. Porting only that old
archived bundle would not meet the user's requirement.

Do not claim the app replicates `#A2-c1d60f6c@0` merely because the
reference code is parseable. A testable parser is in
`src/reference/targetWorld.js`; it is deliberately NOT wired into the
placeholder road generator because that would create a false parity claim.

## Acceptance gate for a real 1:1 native port

1. Reproduce the EXACT starting terrain/road/sky and seed deterministically
   for the target link; compare screenshots and roads at recorded distances.
2. Match current web game's vehicle models, handling, suspension, braking,
   collision response, steering, camera positions, weather and audio.
3. Match current menus/settings/world selection/camera modes/input behavior,
   including touchscreen controls and gamepad input where supported.
4. Preserve original graphics and performance characteristics on Android,
   with native rendering only and **no WebView**.
5. Test Android cold-start, switching screens, save/reload, and a continuous
   driving session on actual Android devices.
6. Obtain appropriate rights and source/assets for an authorized exact port.

## Rights constraint

The official Slow Roads website displays
**CC BY-NC-ND 4.0**. In particular, the NoDerivatives term generally
prohibits distributing adapted game content without separate permission.
See https://creativecommons.org/licenses/by-nc-nd/4.0/.
The unofficial archived files in this repo do not grant permission to publish
a new Android edition. Contact the original creator
(hello@slowroads.io on the official website) about licensing/collaboration
before distributing original game code or artwork in an APK.

Until original-engine access and rights are settled, work can use a clean-room
native implementation of general driving-game mechanics, but it must be
identified as an independent prototype, never as the official game.
