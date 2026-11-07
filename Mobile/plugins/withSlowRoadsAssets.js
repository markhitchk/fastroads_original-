'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { withDangerousMod } = require('@expo/config-plugins');

/**
 * Bundle the unmodified website files from the repository root into the APK.
 * The original browser game's compiled WebGL runtime is not rewritten into
 * native React Native yet. This is a standalone offline Android host.
 */
module.exports = function withSlowRoadsAssets(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const repositoryRoot = path.resolve(config.modRequest.projectRoot, '..');
      const assetRoot = path.join(
        config.modRequest.platformProjectRoot,
        'app',
        'src',
        'main',
        'assets',
        'slowroads'
      );
      const requiredFiles = [
        'index.html',
        'alea.min.js',
        'favicon_circle.svg',
        'manifest.json',
      ];
      const staticDir = path.join(repositoryRoot, 'static');
      const allSources = requiredFiles.map((name) => path.join(repositoryRoot, name));
      allSources.push(staticDir);

      for (const source of allSources) {
        if (!fs.existsSync(source)) {
          throw new Error(
            'SlowRoads asset missing: ' + source +
            '. Run Expo from Mobile/ in a complete checkout of the repository.'
          );
        }
      }

      fs.rmSync(assetRoot, { recursive: true, force: true });
      fs.mkdirSync(assetRoot, { recursive: true });
      for (const name of requiredFiles) {
        fs.copyFileSync(path.join(repositoryRoot, name), path.join(assetRoot, name));
      }
      fs.cpSync(staticDir, path.join(assetRoot, 'static'), { recursive: true });
      return config;
    },
  ]);
};
