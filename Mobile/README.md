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
- Low-poly scenery and the original archived Roadster body/wheel mesh geometry
- Real native multitouch steer, throttle, brake, pause, and reset controls
- Original Roadster OBJ vertices/faces and wheel geometry converted into native buffers
  and checked in as JavaScript arrays
- Roadster baseline speed / acceleration / braking values drawn from the archive
- Native rendering of the archived Slow Roads emblem and lowercase wordmark
- Distance and MPH HUD, pause/resume on Android app lifecycle
- Tests for road generation, simple physics, native matrix math, and geometry

**THIS IS NOT A COMPLETE 1:1 GAME PORT YET.** Its procedural road layout,
terrain, materials/textures, sounds, driving/collision physics, weather, menus,
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

To build an **offline standalone APK**, use a release build (not debug):

~~~sh
npx expo prebuild --platform android --clean
cd android
./gradlew :app:assembleRelease
unzip -Z -1 app/build/outputs/apk/release/app-release.apk | grep -Fx assets/index.android.bundle
~~~

The release APK is at `android/app/build/outputs/apk/release/app-release.apk`.
Debug APKs use Metro and produce a red `Unable to load script` screen when
installed on a phone without a running dev server. The GitHub Actions workflow
now builds and uploads the *release* variant only after verifying that the
JavaScript bundle is embedded.

GitHub CI-generated builds use temporary Android signing credentials. You may
need to uninstall the previously installed debug APK before installing the
new release; uninstalling an app deletes its local data. Maintain a stable
release signing key before distributing updates publicly.

An Android APK has not been device-tested as part of this change.

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

## Android v0.2.2: launcher icon and startup workaround

- `npm run icons` generates three 1024x1024 PNG launcher icon assets from the repository's original `favicon_circle.svg`: legacy, adaptive foreground, and monochrome icon. The app.json icon fields refer to these files.
- `plugins/withExpoGlR8KeepRules.cjs` preserves expo-gl classes needed for reflection/JNI during release builds; see Expo issue #51948.
- Re-run `npm install && npm run prebuild` before building locally. The GitHub release workflow generates icons, checks the keep rule, and builds a standalone APK.
- The workaround is based on a documented SDK 58 issue; on-device confirmation and device logcat remain necessary before calling the crash resolved.
