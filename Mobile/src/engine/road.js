// Dedicated native terrain module. This is a temporary deterministic road
// generator, NOT the original slowroads.io procedural heightmap algorithm.
// The original 3D game's topography is currently embedded in the archived JS.
export const ROAD_HALF_WIDTH = 3.2;
export const ROAD_STYLE = 'normal';

export function sampleRoad(z) {
  if (!Number.isFinite(z)) throw new Error('Road coordinate must be finite');
  return {
    x: 8 * Math.sin(z / 138) + 2.8 * Math.sin(z / 54),
    y: 1.8 * Math.sin(z / 93) + 0.8 * Math.sin(z / 240),
  };
}

export function roadHeading(z) {
  const before = sampleRoad(z - 0.5);
  const after = sampleRoad(z + 0.5);
  return Math.atan2(after.x - before.x, 1);
}

export function clamp(value, low, high) {
  return Math.max(low, Math.min(high, value));
}
