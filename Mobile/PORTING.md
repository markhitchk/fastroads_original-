# Native SlowRoads parity tracker

**Intended reference: [official Slow Roads 2.4.2 — world A2-c1d60f6c@0](https://slowroads.io/#A2-c1d60f6c@0).**
**Important:** the root archived build and this native prototype are **not** the official current 2.4.2 game.
Reference and license details: [TARGET_OFFICIAL_GAME.md](./TARGET_OFFICIAL_GAME.md).
Android implementation: `Mobile/src/` on `react-native-android`.

| Feature | Native progress | Reference |
| --- | --- | --- |
| App title, landscape, Android ID | Scaffolded | `Mobile/app.json` |
| Archived original logo, wordmark, tagline | Native SVG/text implementation | `src/components/SlowRoadsBrand.js` |
| WebView removed | Done | `Mobile/App.js` and package.json |
| Native GL surface / perspective camera | Prototype | `src/render/NativeRenderer.js` |
| Procedural road geometry | Sine-wave approximation; **does not reproduce requested seed** | `src/engine/road.js` |
| Requested official world-code reference | Parsed/tested, **NOT simulated** | `src/reference/targetWorld.js` |
| Hills, off-world, weather, seasons | Missing for current official 2.4.2 | Official game reference |
| Original roadster 3D mesh and wheels | Original OBJ geometry imported into native renderer; shaders/materials/textures still partial | `src/assets/roadster-*.js` |
| Speed/accelerate/brake baseline | Partial first-pass approximation | Original Roadster metrics |
| Suspension, collision and handling | Missing | Archived vehicle physics code |
| Roadster, Bike, Coach selection | Missing | Archived vehicle map |
| Touch buttons | New Android implementation | `src/NativeDrivingGame.js` |
| Keyboard/controller/gyro | Missing | Platform input work |
| Full current 2.4.2 HUD/menu/settings | Missing | Official game reference |
| Cameras, autopilot, cruise control | Missing | Archived game logic |
| Audio, haptics, local settings | Missing | Original behavior |
| GPU/native GL rendering test on device | Not performed | Requires installed debug APK |
| Side-by-side original appearance/gameplay | Not performed | Requires reference run |
| Standalone release APK | CI workflow packages release + verifies embedded JS; on-device check pending | `.github/workflows/slowroads-native-android.yml` |

## Source behavior values verified from the archive

- Roadster topSpeed = 45, accel = 9, brake = 8
- Default road complexities: Casual, Normal, Hard
- Standard vehicles: Roadster, Bike, Coach (availability flags in original game differ)
- Default scene: Hills
- Original app's underlying 3D game is compiled/minified JavaScript with
  WebGL and browser dependencies, and is *not* directly usable as a native
  React Native module.

**Acceptance criterion:** 1:1 means the same visible layout, assets,
gameplay mechanics, UI interactions, controls, persistence, audio and camera
behavior. Passing the foundational native tests does not constitute parity.
