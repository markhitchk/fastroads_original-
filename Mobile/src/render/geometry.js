import { ROAD_HALF_WIDTH, sampleRoad } from '../engine/road.js';

const PALETTE = {
  grass: [0.37, 0.49, 0.30],
  grassLight: [0.42, 0.54, 0.34],
  shoulder: [0.47, 0.45, 0.40],
  asphalt: [0.34, 0.36, 0.38],
  center: [0.91, 0.82, 0.56],
  edge: [0.90, 0.91, 0.84],
  trunk: [0.38, 0.29, 0.23],
  foliage: [0.20, 0.36, 0.26],
  foliageLight: [0.25, 0.42, 0.28],
  carBody: [0.89, 0.91, 0.91],
  carTop: [0.74, 0.78, 0.80],
  glass: [0.22, 0.32, 0.36],
  tire: [0.12, 0.13, 0.14],
  lights: [0.94, 0.21, 0.14],
};

// Interleaved vertex positions and colors: x,y,z,r,g,b.
function vertex(out, point, color) {
  out.push(point[0], point[1], point[2], color[0], color[1], color[2]);
}

function triangle(out, a, b, c, color) {
  vertex(out, a, color);
  vertex(out, b, color);
  vertex(out, c, color);
}

function quad(out, a, b, c, d, color) {
  triangle(out, a, b, c, color);
  triangle(out, a, c, d, color);
}

function roadPoint(z, lateral, lift = 0) {
  const p = sampleRoad(z);
  return [p.x + lateral, p.y + lift, z];
}

function addRoad(out, z0, z1) {
  const width = ROAD_HALF_WIDTH;
  for (let z = z0; z < z1; z += 6) {
    const nextZ = z + 6;
    for (const [min, max, color] of [
      [-75, -width - 0.5, PALETTE.grass],
      [width + 0.5, 75, PALETTE.grassLight],
      [-width - 0.5, -width, PALETTE.shoulder],
      [width, width + 0.5, PALETTE.shoulder],
      [-width, width, PALETTE.asphalt],
    ]) {
      quad(
        out,
        roadPoint(z, min),
        roadPoint(nextZ, min),
        roadPoint(nextZ, max),
        roadPoint(z, max),
        color
      );
    }
    // Road edge paint is continuous; center dashes alternate.
    for (const lateral of [-width + 0.2, width - 0.2]) {
      quad(
        out,
        roadPoint(z, lateral - 0.035, 0.018),
        roadPoint(nextZ, lateral - 0.035, 0.018),
        roadPoint(nextZ, lateral + 0.035, 0.018),
        roadPoint(z, lateral + 0.035, 0.018),
        PALETTE.edge
      );
    }
  }
  const firstDash = Math.floor(z0 / 18) * 18;
  for (let z = firstDash; z < z1; z += 18) {
    quad(
      out,
      roadPoint(z, -0.06, 0.025),
      roadPoint(z + 9, -0.06, 0.025),
      roadPoint(z + 9, 0.06, 0.025),
      roadPoint(z, 0.06, 0.025),
      PALETTE.center
    );
  }
}

function box(out, center, size, color, yaw = 0) {
  const [width, height, length] = size;
  const cx = Math.cos(yaw);
  const sx = Math.sin(yaw);
  const point = (dx, dy, dz) => [
    center[0] + dx * cx + dz * sx,
    center[1] + dy,
    center[2] - dx * sx + dz * cx,
  ];
  const a = point(-width / 2, 0, -length / 2);
  const b = point(width / 2, 0, -length / 2);
  const c = point(width / 2, 0, length / 2);
  const d = point(-width / 2, 0, length / 2);
  const e = point(-width / 2, height, -length / 2);
  const f = point(width / 2, height, -length / 2);
  const g = point(width / 2, height, length / 2);
  const h = point(-width / 2, height, length / 2);
  quad(out, e, h, g, f, color);
  quad(out, a, e, f, b, color);
  quad(out, d, c, g, h, color);
  quad(out, a, d, h, e, color);
  quad(out, b, f, g, c, color);
}

function tree(out, x, y, z, height) {
  box(out, [x, y, z], [0.4, height * 0.34, 0.4], PALETTE.trunk);
  const bottom = y + height * 0.24;
  const peak = [x, y + height, z];
  const radius = height * 0.38;
  const a = [x - radius, bottom, z - radius];
  const b = [x + radius, bottom, z - radius];
  const c = [x + radius, bottom, z + radius];
  const d = [x - radius, bottom, z + radius];
  triangle(out, a, b, peak, PALETTE.foliage);
  triangle(out, b, c, peak, PALETTE.foliageLight);
  triangle(out, c, d, peak, PALETTE.foliage);
  triangle(out, d, a, peak, PALETTE.foliageLight);
}

function addTrees(out, z0, z1) {
  const start = Math.floor(z0 / 24) * 24;
  for (let z = start; z < z1; z += 24) {
    for (const side of [-1, 1]) {
      const rand = Math.abs(Math.sin(z * 0.013 + side * 7.13));
      const road = sampleRoad(z);
      const lateral = side * (11 + rand * 21);
      const height = 5 + rand * 6;
      tree(out, road.x + lateral, road.y - 0.15, z + rand * 4, height);
    }
  }
}

function addCar(out, state) {
  const p = sampleRoad(state.z);
  const x = p.x + state.lane;
  const y = p.y + 0.22;
  const z = state.z;
  const yaw = state.yaw;
  box(out, [x, y, z], [1.5, 0.43, 2.85], PALETTE.carBody, yaw);
  box(out, [x, y + 0.42, z - 0.2], [1.22, 0.47, 1.45], PALETTE.carTop, yaw);
  box(out, [x, y + 0.54, z + 0.47], [1.06, 0.22, 0.085], PALETTE.glass, yaw);
  box(out, [x, y + 0.55, z - 0.9], [1.06, 0.2, 0.07], PALETTE.glass, yaw);
  for (const side of [-1, 1]) {
    for (const offset of [-0.85, 0.87]) {
      box(
        out,
        [x + side * 0.77, y - 0.11, z + offset],
        [0.24, 0.46, 0.52],
        PALETTE.tire,
        yaw
      );
    }
    box(
      out,
      [x + side * 0.52, y + 0.10, z - 1.43],
      [0.25, 0.10, 0.06],
      PALETTE.lights,
      yaw
    );
  }
}

export function makeWorldGeometry(state) {
  const z0 = Math.floor((state.z - 30) / 6) * 6;
  const z1 = z0 + 510;
  const vertices = [];
  addRoad(vertices, z0, z1);
  addTrees(vertices, z0, z1);
  addCar(vertices, state);
  return new Float32Array(vertices);
}
