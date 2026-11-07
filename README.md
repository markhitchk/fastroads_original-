# Slow Roads — archived website build

This repository contains an unofficial snapshot of the browser files originally served by [slowroads.io](https://slowroads.io/). The original game was created by [anslo](https://twitter.com/anslogen). This repository is not an official source-code release, and the bundled application JavaScript was originally distributed in compiled/minified form.

The previously documented Fast Roads additions have been removed from the gameplay bundle. The original selectable vehicles (Roadster, Bike, and Coach), original road-complexity modes (Casual, Normal, and Hard), and standard graphics presets remain. Existing browser settings that refer to removed options are automatically reset to supported values.

The original game, artwork, and other assets remain the work of their respective creators.

## Running locally

The saved files use relative URLs and should be served over HTTP rather than opened directly from disk. Install [Node.js](https://nodejs.org/) and run:

```sh
npx http-server .
```

Open the address printed by the server (usually `http://127.0.0.1:8080`) to run the archived build. Use a hard refresh if you changed files and the browser still uses a cached script.

## Notes

This historical snapshot uses prebuilt JavaScript and CSS assets rather than the original game's development source. Changes to `static/js/main.e7a33c55.chunk.js` must be tested carefully because that bundle contains most of the game logic.
