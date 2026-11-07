'use strict';
// https://github.com/expo/expo/issues/51948
// SDK 58 expo-gl GLView constructor / GLContext.flush can be removed by R8
// in release APKs. Keep all expo.modules.gl native reflection targets.
const fs = require('node:fs');
const path = require('node:path');
const { withDangerousMod } = require('@expo/config-plugins');
const rule = '-keep class expo.modules.gl.** { *; }';
module.exports = config => withDangerousMod(config, ['android', async cfg => {
  const filename = path.join(cfg.modRequest.platformProjectRoot,'app','proguard-rules.pro');
  fs.mkdirSync(path.dirname(filename),{recursive:true});
  const current = fs.existsSync(filename)?fs.readFileSync(filename,'utf8'):'';
  if (!current.includes(rule))
    fs.writeFileSync(filename,current.trimEnd()+'\n\n# Preserve expo-gl reflection and JNI entrypoints (SDK 58/R8)\n'+rule+'\n');
  return cfg;
}]);
