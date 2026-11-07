'use strict';
// Uses the archived original website's SVG instead of substitute artwork.
const sharp = require('sharp');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = path.resolve(root, '../favicon_circle.svg');
const output = path.join(root, 'assets');
const SIZE = 1024;
async function generate() {
  const original = fs.readFileSync(source, 'utf8');
  if ((original.match(/<path\b/g) || []).length !== 9)
    throw new Error('Original Slow Roads emblem has changed unexpectedly');
  const recolored = original.replace(/stroke:#000000/g, 'stroke:#F5F8FA');
  fs.mkdirSync(output, {recursive: true});
  const render = size => sharp(Buffer.from(recolored)).resize(size, size, {fit:'contain'}).png().toBuffer();
  const mark = await render(720);
  await sharp({create:{width:SIZE,height:SIZE,channels:4,background:'#10202A'}})
    .composite([{input:mark,left:152,top:152}])
    .png().toFile(path.join(output,'icon.png'));
  const adaptMark = await render(620);
  for (const name of ['adaptive-icon.png','monochrome-icon.png']) {
    await sharp({create:{width:SIZE,height:SIZE,channels:4,background:{r:0,g:0,b:0,alpha:0}}})
      .composite([{input:adaptMark,left:202,top:202}])
      .png().toFile(path.join(output,name));
  }
  for (const name of ['icon.png','adaptive-icon.png','monochrome-icon.png']) {
    const meta = await sharp(path.join(output,name)).metadata();
    if (meta.format!=='png'||meta.width!==SIZE||meta.height!==SIZE)
      throw new Error('Bad icon: '+name);
    console.log('Generated original Slow Roads icon:',name);
  }
}
generate().catch(err=>{console.error(err);process.exitCode=1});
