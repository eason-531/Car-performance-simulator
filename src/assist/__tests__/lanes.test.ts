import { describe, expect, it } from 'vitest';
import { FIXED_DT } from '../../physics/constants';
import { lexus, sim, skoda } from '../../test-helpers';
import { LiveDriveLoop, PLAYER_LANE_CHANGE_S, type DriverInput } from '../liveDrive';
import { CLAIM_LANES, START_LANE } from '../traffic';

const IDLE: DriverInput = { throttle: 0, brake: 0 };
const steps = (s: number) => Math.round(s / FIXED_DT);
/** Largest lateral step of a minimum-jerk move of one lane over PLAYER_LANE_CHANGE_S, per fixed step (peak speed 1.875/T). */
const MAX_STEP = (1.875 / PLAYER_LANE_CHANGE_S) * FIXED_DT * 1.001;

function run(loop: LiveDriveLoop, seconds: number, input: DriverInput = IDLE, each?: (l: LiveDriveLoop) => void) {
  for (let i = 0; i < steps(seconds); i++) {
    loop.step(input);
    each?.(loop);
  }
}

describe('player lane changes', () => {
  it('move continuously from lane to lane on command, and stop at the road edges with a reason', () => {
    const loop = new LiveDriveLoop(sim(lexus));
    expect(loop.playerLane).toBe(START_LANE);
    expect(loop.requestLaneChange(-1)).toEqual({ ok: true });
    let prev = loop.playerLat;
    let maxStep = 0;
    run(loop, PLAYER_LANE_CHANGE_S + 0.2, IDLE, (l) => {
      maxStep = Math.max(maxStep, Math.abs(l.playerLat - prev));
      prev = l.playerLat;
    });
    expect(maxStep).toBeLessThanOrEqual(MAX_STEP);
    expect(loop.playerLat).toBe(0);
    expect(loop.requestLaneChange(-1)).toEqual({ ok: false, message: 'No lane to the left' });
    loop.requestLaneChange(1);
    run(loop, PLAYER_LANE_CHANGE_S + 0.2);
    loop.requestLaneChange(1);
    run(loop, PLAYER_LANE_CHANGE_S + 0.2);
    expect(loop.playerLat).toBe(2);
    expect(loop.requestLaneChange(1)).toEqual({ ok: false, message: 'No lane to the right' });
  });

  it('ignores a repeat in the same direction and eases back without a jolt on the opposite command', () => {
    const loop = new LiveDriveLoop(sim(lexus));
    loop.requestLaneChange(1);
    // Starts from rest sideways: no jump in lateral speed at the start.
    const lat0 = loop.playerLat;
    loop.step(IDLE);
    expect((loop.playerLat - lat0) / FIXED_DT).toBeLessThan(0.01);
    run(loop, 1);
    expect(loop.requestLaneChange(1)).toEqual({ ok: false, message: 'Already changing lanes' });
    const mid = loop.playerLat;
    expect(mid).toBeGreaterThan(1.1);
    expect(mid).toBeLessThan(1.9);
    const before = loop.playerLat;
    loop.step(IDLE);
    const vBefore = (loop.playerLat - before) / FIXED_DT;
    expect(vBefore).toBeGreaterThan(0.3);
    expect(loop.requestLaneChange(-1)).toEqual({ ok: true, message: 'Lane change cancelled' });
    expect(loop.playerLane).toBe(1);
    // Lateral position and speed stay continuous: the car eases out of its rightward motion and back.
    const lats: number[] = [loop.playerLat];
    run(loop, 3, IDLE, (l) => lats.push(l.playerLat));
    const v = lats.slice(1).map((x, i) => (x - lats[i]) / FIXED_DT);
    expect(Math.abs(v[0] - vBefore)).toBeLessThan(0.01);
    for (let i = 1; i < v.length; i++) expect(Math.abs(v[i] - v[i - 1])).toBeLessThan(0.02);
    expect(Math.max(...lats) - lats[0]).toBeLessThan(0.3);
    expect(loop.playerLat).toBe(1);
    expect(loop.laneView.signal).toBe(0);
  });

  it('refuses to move into a car alongside', () => {
    // The driver test puts a car alongside in the next lane during its burst phase.
    const loop = new LiveDriveLoop(sim(lexus), 'auto', { trafficMode: 'drivers', seed: 1 });
    loop.engage();
    let tried = false;
    run(loop, 80, IDLE, (l) => {
      if (tried || l.traffic!.phase !== 'burst') return;
      tried = true;
      expect(l.requestLaneChange(1)).toEqual({ ok: false, message: 'Lane occupied — wait for a gap' });
    });
    expect(tried).toBe(true);
  }, 30_000);

  it('Auto Drive never changes lanes and follows the correct lead after the player changes lanes', () => {
    const loop = new LiveDriveLoop(sim(skoda), 'auto', { trafficMode: 'cut-in', seed: 1 });
    loop.engage();
    run(loop, 5);
    expect(loop.playerLane).toBe(1);
    const leadId = loop.traffic!.lead()?.id;
    expect(leadId).toBe(1);
    // Move left, away from the lead: the lane ahead is clear, so Auto Drive keeps full throttle.
    loop.requestLaneChange(-1);
    let releasedAt: number | null = null;
    let seenLat = 1;
    run(loop, 4, IDLE, (l) => {
      if (releasedAt === null && l.traffic!.lead() === null) {
        releasedAt = l.time;
        seenLat = l.playerLat;
      }
    });
    expect(releasedAt).not.toBeNull();
    // The lead is dropped at the same boundary the traffic uses (more than 0.75 lanes away).
    expect(1 - seenLat).toBeGreaterThan(0.75 - 1e-9);
    expect(loop.autoDriveView().throttle).toBe(1);
    expect(loop.playerLane).toBe(0);
    // Back into the lane: the original lead is tracked again once within 0.6 lanes, and Auto Drive slows for it.
    loop.requestLaneChange(1);
    let reclaimedLat: number | null = null;
    run(loop, PLAYER_LANE_CHANGE_S + 0.5, IDLE, (l) => {
      if (reclaimedLat === null && l.traffic!.lead() !== null) reclaimedLat = l.playerLat;
    });
    expect(reclaimedLat).not.toBeNull();
    expect(reclaimedLat! - 0).toBeGreaterThanOrEqual(1 - CLAIM_LANES - 1e-9);
    expect(loop.traffic!.lead()?.id).toBe(leadId);
    run(loop, 30);
    expect(['following', 'braking']).toContain(loop.autoDriveView().mode);
    expect(loop.traffic!.lead()?.id).toBe(leadId);
    expect(loop.playerLane).toBe(1);
  }, 30_000);
});
