# SlowRoads Android parity checklist

This is a staged migration from the cleaned archived browser snapshot, not a claim that its Three.js/WebGL renderer is already native.

| Component | Android status | Source / next check |
| --- | --- | --- |
| App name, Android ID, landscape | Scaffolded | `app.json` |
| React Native app shell | Scaffolded | `App.js` |
| Bundled offline game files | Configured, unverified | `plugins/withSlowRoadsAssets.js` |
| Browser 3D renderer | Reused via WebView | `../static/js/main.e7a33c55.chunk.js` |
| Default vehicles / road complexity | Reused from cleaned master | Root game JS |
| Mobile steering/accelerator UI | Not verified | Test existing browser controls |
| Touch / controller / keyboard inputs | Not verified | Android device testing |
| Audio unlock / focus handling | Not verified | Android lifecycle testing |
| Saved settings / progress | Not verified | WebView localStorage testing |
| Performance / GPU / WebGL | Not verified | Android device testing |
| APK build / installation | Not run | Expo prebuild + Gradle |
| Full native engine rewrite | Not started | Separate engineering stage |

## Parity rule

Do not add the previously removed Fast Roads custom vehicles, the Wide or Straight road modes, or Ultra+. Preserve the original game's default modes and game behavior.
