import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialState,
  ROADSTER,
  speedMph,
  stepGame,
} from '../src/engine/physics.js';
import { ROAD_HALF_WIDTH, roadHeading, sampleRoad } from '../src/engine/road.js';
import { lookAt, multiplyMatrix, perspective } from '../src/render/matrix.js';
import { makeWorldGeometry } from '../src/render/geometry.js';

test('road sampling is deterministic and finite', () => {
  for (const z of [0, 100, 1000]) {
    assert.deepEqual(sampleRoad(z), sampleRoad(z));
    assert.ok(Number.isFinite(sampleRoad(z).x));
    assert.ok(Number.isFinite(roadHeading(z)));
  }
});

test('roadster accelerates and slows when braking', () => {
  let state = createInitialState();
  for (let i = 0; i < 300; i++) {
    state = stepGame(state, { throttle: 1 }, 0.016);
  }
  assert.ok(state.speed > 0);
  assert.ok(state.distance > 0);
  const acceleratingSpeed = state.speed;
  for (let i = 0; i < 100; i++) {
    state = stepGame(state, { brake: 1 }, 0.016);
  }
  assert.ok(state.speed < acceleratingSpeed);
});

test('roadster speed is capped by the archived original metric', () => {
  let state = createInitialState();
  for (let i = 0; i < 10000; i++) {
    state = stepGame(state, { throttle: 1 }, 0.05);
  }
  assert.ok(state.speed <= ROADSTER.topSpeed);
  assert.equal(ROADSTER.topSpeed, 45);
  assert.ok(speedMph(45) > 100);
});

test('steering does not leave the first-stage drivable roadway', () => {
  let state = createInitialState();
  for (let i = 0; i < 300; i++) {
    state = stepGame(state, { throttle: 1, steer: 1 }, 0.05);
  }
  assert.ok(Math.abs(state.lane) <= ROAD_HALF_WIDTH - 0.7);
});

test('native camera view-projection matrix contains finite numbers', () => {
  const view = lookAt([0, 4, -9], [0, 1, 20]);
  const proj = perspective(Math.PI / 3, 1.6, 0.1, 650);
  const vp = multiplyMatrix(proj, view);
  assert.equal(vp.length, 16);
  for (const element of vp) assert.ok(Number.isFinite(element));
});

test('generated terrain and vehicle vertex buffer is valid', () => {
  const vertices = makeWorldGeometry(createInitialState());
  assert.ok(vertices.length > 1000);
  assert.equal(vertices.length % 6, 0);
  for (const element of vertices) assert.ok(Number.isFinite(element));
});
