/**
 * Target world on the official Slow Roads website.
 *
 * This module describes a REFERENCE only. The existing native game prototype
 * does NOT generate the same seeded road or reproduce the official 2.4.2
 * graphics, physics, controls, assets or exact scene.
 *
 * World-code scheme from the game's creator:
 * [location][complexity]-[seed]@[start-distance-km]
 */
export const TARGET_REFERENCE_URL = 'https://slowroads.io/#A2-c1d60f6c@0';
export const TARGET_OFFICIAL_VERSION = '2.4.2';
export const TARGET_REFERENCE_HASH = '#A2-c1d60f6c@0';

export function parseWorldReference(source) {
  if (typeof source !== 'string') {
    throw new TypeError('World reference must be a URL or hash string');
  }
  const fragment = source.includes('#') ? source.slice(source.indexOf('#') + 1) : source;
  const match = /^([AO])([0-3])-([0-9a-f]{8})@(0|[1-9]\d*)(?:\.(\d+))?$/i.exec(fragment);
  if (!match) throw new Error('Invalid Slow Roads reference-world code');
  const distanceKm = Number(match[4] + (match[5] === undefined ? '' : '.' + match[5]));
  if (!Number.isFinite(distanceKm)) throw new Error('World distance out of range');
  const locationCode = match[1].toUpperCase();
  return Object.freeze({
    locationCode,
    location: locationCode === 'A' ? 'Hills' : 'Off-World',
    complexity: Number(match[2]),
    seed: match[3].toLowerCase(),
    distanceKm,
    code: locationCode + match[2] + '-' + match[3].toLowerCase() + '@' + String(distanceKm),
  });
}

export const TARGET_REFERENCE = parseWorldReference(TARGET_REFERENCE_URL);
