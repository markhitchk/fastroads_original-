import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TARGET_OFFICIAL_VERSION,
  TARGET_REFERENCE,
  TARGET_REFERENCE_HASH,
  TARGET_REFERENCE_URL,
  parseWorldReference,
} from '../src/reference/targetWorld.js';

test('exact user-requested official Slow Roads world is retained', () => {
  assert.equal(TARGET_OFFICIAL_VERSION, '2.4.2');
  assert.equal(TARGET_REFERENCE_URL, 'https://slowroads.io/#A2-c1d60f6c@0');
  assert.equal(TARGET_REFERENCE_HASH, '#A2-c1d60f6c@0');
  assert.deepEqual(TARGET_REFERENCE, {
    locationCode: 'A',
    location: 'Hills',
    complexity: 2,
    seed: 'c1d60f6c',
    distanceKm: 0,
    code: 'A2-c1d60f6c@0',
  });
});

test('hashes and full links parse equivalently', () => {
  assert.deepEqual(
    parseWorldReference('A2-c1d60f6c@0'),
    parseWorldReference('#A2-c1d60f6c@0')
  );
  assert.deepEqual(
    parseWorldReference('https://slowroads.io/#A2-c1d60f6c@0'),
    TARGET_REFERENCE
  );
});

test('off-world seed and distance parse without changing semantics', () => {
  const w = parseWorldReference('#O3-1234abcd@12.3');
  assert.equal(w.location, 'Off-World');
  assert.equal(w.complexity, 3);
  assert.equal(w.distanceKm, 12.3);
});

test('invalid reference codes are rejected', () => {
  for (const code of ['#A9-c1d60f6c@0', '#A2-wrong@0', '#A2-c1d60f6c@-1', '#Z2-c1d60f6c@0', '']) {
    assert.throws(() => parseWorldReference(code));
  }
});
