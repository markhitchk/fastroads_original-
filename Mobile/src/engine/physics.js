import { clamp, roadHeading, ROAD_HALF_WIDTH, sampleRoad } from './road.js';

// Roadster baseline values traced to the archived game's vehicle metrics.
// This is a native first-pass driving approximation, NOT yet the full
// Slow Roads physics, collision, steering, and traction system.
export const ROADSTER = Object.freeze({
  topSpeed: 45,
  accel: 9,
  brake: 8,
  maxSteer: 0.68,
  drag: 0.001,
  rollResistance: 0.06,
});

export function createInitialState() {
  return {
    z: 0,
    lane: 0,
    speed: 0,
    yaw: 0,
    distance: 0,
    time: 0,
    collision: false,
  };
}

export function speedMph(speedMetersPerSecond) {
  return speedMetersPerSecond * 2.23694;
}

export function stepGame(state, input, dt) {
  const elapsed = clamp(Number.isFinite(dt) ? dt : 0, 0, 0.05);
  const throttle = clamp(input.throttle || 0, 0, 1);
  const brake = clamp(input.brake || 0, 0, 1);
  const steer = clamp(input.steer || 0, -1, 1);

  const engineForce = throttle * ROADSTER.accel;
  const brakingForce = brake * ROADSTER.brake;
  const rollingDrag =
    state.speed > 0 ? ROADSTER.rollResistance + ROADSTER.drag * state.speed ** 2 : 0;
  const nextSpeed = clamp(
    state.speed + (engineForce - brakingForce - rollingDrag) * elapsed,
    0,
    ROADSTER.topSpeed
  );

  // Steering speed is bounded to stay on the road in the first native slice.
  const steeringMetersPerSecond = (1.6 + nextSpeed * 0.052) * steer;
  const nextLane = clamp(
    state.lane + steeringMetersPerSecond * elapsed,
    -(ROAD_HALF_WIDTH - 0.7),
    ROAD_HALF_WIDTH - 0.7
  );
  const nextZ = state.z + nextSpeed * elapsed;
  const nextYaw = roadHeading(nextZ) + steer * 0.075;
  const sample = sampleRoad(nextZ);
  return {
    ...state,
    z: nextZ,
    lane: nextLane,
    speed: nextSpeed,
    yaw: nextYaw,
    distance: state.distance + nextSpeed * elapsed,
    time: state.time + elapsed,
    worldX: sample.x + nextLane,
    worldY: sample.y,
  };
}
