# SlowRoads — React Native Android

This folder starts the **SlowRoads** Android port on the `react-native-android` branch. The main branch remains the saved browser version of the game.

## Current implementation

- React Native Android application with **SlowRoads** as the app name
- Expo SDK 58 / React Native 0.88
- Android package: `com.harleytg.slowroads`
- Landscape layout
- Offline WebView host for the **existing** browser-game code
- Config plugin copies the repository's `index.html`, `alea.min.js`, `favicon_circle.svg`, `manifest.json`, and `static/` assets into the Android application at prebuild time
- Error/retry screen and external-link handling

**Scope:** This is a first-stage hybrid shell, not a completed native rewrite. The 3D rendering engine and game controls are currently the archived browser implementation. Touch input, WebGL compatibility, performance, and audio must be tested on real Android devices. No APK has been verified yet.

## Build locally

Requirements: Node.js 22.13+ (or 24), Android SDK, Java 17, and an Android device or emulator.

```sh
git checkout react-native-android
cd Mobile
npm install
npx expo install --fix
npm run prebuild
npm run android
```

Do not attempt this in Expo Go: the offline game assets are copied into the generated native Android project during prebuild. After changing a game asset in the repository root, run `npm run prebuild` again to refresh the copy.

For an APK build after prebuild:

```sh
cd android
./gradlew assembleDebug
```

The debug APK is normally generated under `android/app/build/outputs/apk/debug/`.

## Next stages

1. Verify the bundled browser build actually renders in Android WebView (WebGL, texture URLs, canvas resizing, landscape, touch, audio, saved settings).
2. Implement native lifecycle integration (resume/pause), back action, display cutout handling, Android controls, and measured performance checks.
3. Decide whether to keep a hybrid 3D game surface with React Native controls or rewrite the WebGL engine for a genuinely native renderer. That is significantly more work than a WebView host.
4. Check the original game's intellectual-property and distribution permissions before publicly publishing or distributing the Android app. The archived browser code is not an official source release.

The `master` branch and the original website files should not be modified for Android-specific work.
