# SlowRoads — true React Native Android port (in progress)

**Branch:** react-native-android  
**App:** SlowRoads  
**Package:** com.harleytg.slowroads

## What this project is

A native Android 3D game project using React Native, Expo SDK 58, and
**expo-gl / Android OpenGL ES**. The renderer uses native GPU resources and
custom shaders; the controls and game HUD are native React Native views.

**No WebView. No browser-hosted game. No HTML or DOM rendering.**

The existing archived website sources in the parent repository remain a
reference for the original game. They are not loaded or executed by the
Android app. The abandoned offline WebView asset-copy plugin has been removed.

## Current implementation

- Native OpenGL ES rendering loop with depth testing and perspective camera
- A dynamically generated, curved roadway with lane markings and terrain
- Low-poly scenery and a temporary roadster-shaped 3D vehicle
- Real native multitouch steer, throttle, brake, pause, and reset controls
- Roadster baseline speed / acceleration / braking values drawn from the archive
- Distance and MPH HUD, pause/resume on Android app lifecycle
- Tests for road generation, simple physics, native matrix math, and geometry

**THIS IS NOT A COMPLETE 1:1 GAME PORT YET.** Its procedural road layout,
terrain, model, textures, sounds, driving/collision physics, weather, menus,
vehicle inventory, and camera modes are temporary or absent. A faithful
port requires extracting and reimplementing those systems from the archived
compiled game. Do not publish or market this as parity-complete.

## Run and test

Install Node.js 22.13+, Android SDK (compile SDK 37), Java 17, and use an
Android device with OpenGL ES support. Run:

~~~sh
git checkout react-native-android
cd Mobile
npm install
npm test
npx expo install --fix
npx expo run:android
~~~

To produce an Android debug APK after prebuild:

~~~sh
cd android
./gradlew assembleDebug
~~~

This compiles Android native code, so it is not a browser application. An
installable APK has **not** been built or tested in this repository update.

## Next required parity stages

1. Recreate the original seeded procedural road spline, heightmap, scenery,
   weather and generation/streaming algorithms.
2. Port the original 3D vehicle model and wheels, terrain textures, materials,
   engine sounds and environmental audio.
3. Match driving physics: collision, suspension, traction, slip, steering,
   cruise control, autopilot, road friction and speed conversion.
4. Rebuild every original screen, controls panel, settings, camera modes,
   environment selection, state persistence, and accessibility.
5. Verify side-by-side on Android hardware against the original browser game.

See [PORTING.md](./PORTING.md) for the parity table and source references.

## Ownership and distribution

The original Slow Roads game is credited to anslo. This repository's
browser snapshot is not an official open-source release. Verify the rights
to redistribute modified game code/assets before release.
