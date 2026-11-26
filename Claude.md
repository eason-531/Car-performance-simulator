# Purpose: Claude logs changes made here; Codex reads this file as a reference before reviewing the branch.
# Rule 1 (Codex): Inspect this file before reviewing the codebase.
# Rule 2 (Claude): Document changes in maximum detail using dense, machine-readable language (human readability is not required).
# Rule 3 (Claude): Clear this file upon creating a new branch. Exclude changes from other branches.
# Rule 4 (Both): Preserve this header block when clearing the file.

```yaml
schema: claude-change-log/v1
branch: claude/clever-mayer-rgkw0b (session branch, created at origin/main a0ced0f = current main tip; used as the dedicated Auto Drive feature branch per docs/PLAYABILITY_HANDOFF.md step 1)
brief: docs/PLAYABILITY_HANDOFF.md "Start a new implementation session" → Milestone 1 · Auto Drive in Live Drive (Milestones 2 Launch Lab, 3 Highway not started)
commits:
  - ee63026: Auto Drive + seeded traffic + LiveDriveLoop + Drive UI + tests + README
  - (this commit): Claude.md reset (header kept) + this log
files:
  new: [src/assist/rng.ts, src/assist/traffic.ts, src/assist/autoDrive.ts, src/assist/liveDrive.ts, src/components/RoadView.tsx, src/assist/__tests__/autoDrive.test.ts, src/assist/__tests__/liveDrive.test.ts, src/__tests__/AutoDrive.ui.test.tsx]
  changed: [src/hooks/useDriveSimulation.ts, src/views/DriveView.tsx, src/styles/global.css, README.md]
  untouched: [src/physics/*, src/data/*, src/tuning/*, src/storage/*, stockStats.generated.ts, docs/DATA_GAPS.md, owner-car specs/ids/calibration]

architecture:
  LiveDriveLoop (src/assist/liveDrive.ts):
    owns: VehicleSimulator, LiveTimer, applied pedals (PEDAL_RATE 7/s), Auto Hold flag, TrafficSim|null, AutoDriveController, time
    step(driver): [engaged && driver.brake > BRAKE_CANCEL(0.05) → disengage('brake')] → [engaged → cmd = controller.update(FIXED_DT, {speed, accelFiltered}, traffic.lead()); override = driver.throttle > 0.05 && driver.throttle >= cmd.throttle; want = {max(driver.throttle, cmd.throttle), override ? 0 : cmd.brake}] → pedal smoothing (same expressions as old hook) → hold logic (unchanged) → sim.step → timer.update → traffic.step(player {x: distance, speed, accel: accelFiltered}) → time += dt
    equivalence: Auto Drive off + traffic off ⇒ bit-identical SimState/LiveTimer.view/hold vs a copy of the pre-change loop (test, Lexus/Škoda/Nevera, 25 s mixed manual input incl. brake-boost relaunch); traffic on + Auto Drive off ⇒ SimState identical to traffic off (traffic never acts on the player)
    disengage(reason ∈ switch|brake|reset|vehicle|focus): engaged=false, applied.throttle = min(applied.throttle, driver.throttle) (stale auto throttle cleared at once; brake follows driver via smoothing), lastDisengage {reason,time}
    engage(): refused while driver.brake > 0.05; controller.engage(applied.throttle) (bumpless)
    reset(): disengage('reset'), sim/timer reset, applied 0, hold true, time 0, traffic re-created from same seed
    usedThisRun: true while engaged; cleared at rest when off → saved live run tuningLabel += " · Auto Drive" (timing basis unchanged: live timer, first motion)
  useDriveSimulation (hook): API {snapshot, setPedal, shift, reset, runSamples, setAutoDrive, toggleAutoDrive, setTraffic}; rAF accumulator unchanged (MAX_FRAME_S 0.1, FIXED_DT); new loop when vehicle object changes (car or tuning) → Auto Drive off (lastDisengage 'vehicle'), traffic mode+seed carried, applied pedals carried only if Auto Drive was off (else min with driver targets); setPedal('brake', v>0.05) disengages synchronously (a sub-frame tap still cancels); toggleAutoDrive() engages and sets traffic 'sparse' if 'off'; snapshot += timeS, autoDrive: AutoDriveView, traffic: TrafficView
  DriveView: assist card (Auto Drive toggle button aria-pressed, ≥48 px; traffic <select aria-label="Traffic"> off|sparse|cut-in; seed button #N ↻ random new seed) + RoadView; status line under road (title: Accelerating|Following|Braking|Holding behind lead|Driver override|Cancelled — brake pressed|Switched off|Off — the app lost focus|Off — car reset|Off — car changed|Auto Drive off; detail: lead/cut-in speed, gap m, time gap s, requested pedal %, scenario note; off-state text explains "simulator aid … accelerator and brake … gears and drivetrain stay as modelled … brake or tap to cancel"); pedal hints "Auto Drive"/"Cancels Auto" while engaged; key A toggles; window blur + document hidden → setAutoDrive(false,'focus') (keys released as before); old .drive__road strip replaced
  RoadView: SVG top-down, 3 lanes, player fixed lane 1 at x0 = max(56, 0.18 w); linear scale to LINEAR_AHEAD_M = clamp(w/10, 55, 80) m at 0.7 w, then log compression (slope-matched) to 3000 m at right edge; cars true length (min 10 px), far cars shrink (size ≥ 0.35); lead white with outline amber (following) / red (braking|stopped) / white; in-lane non-lead light grey; adjacent shades; blinkers blink 3 Hz from timeS; dashed gap line + "N m · T s" label; contact flag text "Too close — no collision model"; odometer

controller (src/assist/autoDrive.ts, AUTO_DRIVE_DEFAULTS shared by all cars):
  timeGapS 2, standstillGapM 5, liftDecel 1.5, releaseDecel 0.6, closingEndMs 0.8 (effective clamp(0.05 v, 0.1, 0.8)), planClosingMs 3, planDecel 2.5, minTimeGapS 1, comfortDecel 3, gapGain 0.06, speedGain 0.4, gapTermMin 1.2, resumeRate 0.6/s, liftRate 2/s, liftJerk 8 m/s³, trimBandwidth 0.8, brakeOn 0.4, brakeOff 0.1, urgentBrake 3, brakeJerk 4, releaseJerk 5, coastDwellS 0.4
  plantModel(vehicle) (derived, not per-car tuning): brakeDecelPerUnit = min(MAX_BRAKE_G, 1.05 μ)·m·g / (m + Jw/r²) (matches simulator brake force); coastAccel(v) = −(aero + rolling)/m_eff; throttleAuthority(v) = clamp(peakPower·η / (m·max(v, 8)), 0.5, μg) with peakPower = EV systemPowerW or max over torque curve
  gap policy: rel = vL − v; following = max(max(ks(gap − s0 − T v), −1.2) + kv rel, −3); roomDes = gap − s0 − T vL; roomMin = gap − s0 − 1 s·vL;
    if rel < −closingEnd && roomMin > 0: needDes = rel²/(2 roomDes) (∞ if roomDes ≤ 0), needMin = rel²/(2 roomMin); approach starts when rel < −3 and the need predicted after the lift lag (lag = throttle/(2·liftRate), relLag = rel − max(0,a)·lag, roomLag = roomDes + relLag·lag) ≥ 1.5; ends when needDes < 0.6 or closing < closingEnd
      approaching && roomDes > 0 → −max(min(needDes, 2.5), needMin); approaching → min(following, −needMin); fast closing (rel < −3) && gap > 1.5·desired → null (full throttle); else following
    else following; plus collision guard: rel² / (2 (gap − s0)) > 3 → min(target, −that); gap ≤ 0.5 → −∞ (full brake)
    target ≥ throttle authority above coast (and not approaching) → null (lead not limiting)
  pedals: null → throttle 1 (immediately on fresh engagement in a clear lane, else +0.6/s once brake is 0 and dwell over); else aDes = max(target, −kB): braking enters only once throttle ≤ 1e-3 (then throttle := 0) and aDes < coast − 0.4 (stopped: v < 0.3 && target ≤ 0.05 → hold ≥ 0.35), leaves when aDes > coast − 0.1 (dwell 0.4 s before throttle); brake = (coast − aDes)/kB + trim (trim ∫ 0.8·(a − aDes)/kB, clamp −0.1…0.2), slew up 4 m/s³ (×4 urgent), down 5 m/s³; throttle = ff (aDes − coast)/G + trim (anti-windup ∫ 0.8·(aDes − a)/G, clamp ±0.5), slew up 0.6/s, down liftRate(v) = clamp(8/G, 0.6, 2)/s (×4 when aDes < coast − 3)
  modes: braking (brake > 0.005, 'stopped' if v < 0.3) | accelerating (target null, or throttle ≥ 0.98 and not approaching) | following

traffic (src/assist/traffic.ts):
  road: lanes 0 (left) 1 (player) 2 (right); positions = front bumpers on the player's distance axis; player length 4.7 m; cars 4.6 m (20 % 5.2 m)
  rng: mulberry32 (src/assist/rng.ts), normaliseSeed → [1, 2^31−2]; default seed 1
  sparse: initial adjacent car 60–90 m ahead; first encounter after 4–8 s of driving (player speed > 1 m/s), then every U(12, 25) s of driving; max 8 cars (else retry in 5 s); speeds U(75, 125) km/h
    roll < 0.4 lead: lane 1 at leadSpawnGap(vP4, vL) = 5 + 2 vL + c²/(2·1.0) + 3c + 80 (c = closing, vP4 = speed + max(0,a)·4 s), pushed +60 m while lane 1 occupied, cutOutAfterS U(5, 14), side ±1
    roll < 0.75 cut-in: adjacent lane; if slower than player: ahead at window max + 4c + 50; else from behind (−45 m) at ≥ vP + 2 m/s (≤ 125 km/h); cutOutAfterS U(5, 12)
    else adjacent: ahead 120 + 4c or behind −45 m if faster
  lane changes: signal 1.2 s then smoothstep move 3 s (latStart/to/durationS); in-player-lane claim |lat − 1| ≤ 0.6, release > 0.75 (hysteresis)
    cut-in trigger: gap (car rear − player front) within cutInWindow(vP_anticipated (a⁺·2.5 s), vCar) = [5 + 0.6 vP + 4, max(5 + 1.2 vP + c²/3.6 + 1.5 c, min + 10)] (scripted car: fixed [12, 30] m) && !cutInUnsafe && laneChangeSafe; gives up after 60 s
    cutInUnsafe: gap < 7 m, or closing²/(2·max(gap − 1.25 c − 5, 0.5)) > 2.5 m/s²; checked again every step until claimed → abort (steer back over ≥ 0.6 s, retry ≥ 4 s later, event 'abort')
    laneChangeSafe: no car within [rear − 12, front + 12] in target lane; car ahead gap ≥ 5 + 0.5 v + c²/3.6; car behind gap ≥ 5 + 0.5 v_o + c²/3.6
    cut-out: lane-1 car leaves after followedS ≥ cutOutAfterS (followedS accrues while it is the lead, gap ≤ 5 + 3 vP + 10 and |Δv| < 3), to its side else the other, if laneChangeSafe
  longitudinal: IDM a 1.4, b 2.5, T 1.3, s0 4, δ 4, accel clamp [−9, 1.4]; leader = nearest car (or the player, for cars behind it in lane 1) with |Δlat| < 0.8
  despawn: front < player − 200 m or > player + 9000 m; event log capped at 400 (spawn/signal/abort/despawn/phase with t, id, role, lanes, gap, speed)
  cut-in test script: A (scenario-lead) lane 1, rear 220 m ahead, 80 km/h → when A.followedS ≥ 2.5: spawn B (scenario-cut-in) lane 2, rear 36 m ahead, 65 km/h, cutIn window [12, 30] → B completes change → B.cutOutAfterS 6 to lane 0 → B leaving → A.cutOutAfterS 4 to lane 2 → A leaving ('clear') → A out of lane ('done'); phases approach|cut-in|follow|resume|clear|done with UI notes

checks:
  npm run check: PASS (tsc -b, eslint, vitest 28 files / 1131 tests (+28 new), vite build; chunk-size warning pre-existing)
  npm run generate:stats + generate:gaps: no diff in stockStats.generated.ts / docs/DATA_GAPS.md
  new tests:
    autoDrive.test.ts (real VehicleSimulator + scripted lead, pedal smoothing): defaults; clear lane = throttle 1 / brake 0 / 'accelerating' every step (Lexus, Škoda, Nevera); 300 m to 80 km/h lead: full throttle far, never both pedals, lift > 0.1 s before first brake, first brake while gap > 5 + 2 vL, exactly 1 brake application, a_min > −3.2, settled |Δv| < 1 km/h & |gap − (5 + 2v)| < 3 m, min time gap > 1.7 s (all three cars); pull-away (→160 km/h) and cut-out (lead removed): throttle rise ≤ 0.6/s per step, reaches 1.0 (< 2 s after cut-out, < 12 s pull-away) without braking, mode accelerating; stopped car: stops at 4.5–9 m, mode 'stopped', min gap > 4.5 m, resumes > 20 km/h when lead moves (Škoda); cut-in 85 km/h car at 25 m while following 100 km/h: brakes within 2 s, a_min > −3.2, min gap > 15 m, one brake application, re-settles |Δv| < 1 km/h, |gap − 2 s| < 4 m (Lexus)
    liveDrive.test.ts: legacy-loop equivalence (3 cars); traffic-without-Auto-Drive isolation; Auto Hold released, applied throttle 1 within 0.2 s, timer running (Škoda); brake cancel same step, applied throttle 0 immediately, brake ramps to 1, no re-engage after release; light touch (0.06) cancels, engage refused while braking; switch/reset/focus need re-engagement and clear throttle; driver accelerator overrides automatic braking without cancel; every playable car engages with throttle 1 and moves within 3 s, Škoda owner.acc === false and Lexus owner.acc undefined (not read by Auto Drive); cut-in test scenario on Lexus/Škoda/Nevera: phases exact, lead sequence [1, 2, 1, null], cut-in flagged, braking after cut-in, min gap > 10 m, no pedal overlap, modes {accelerating, braking, following}, 100 % throttle < 3 s after 'done'; replay: seed 42 Nevera 150 s twice ⇒ identical events/trace/SimState, seed 43 differs, Reset then replay ⇒ identical; sparse seeds 1–4 Lexus 240 s: encounter count within [floor(235/25), ceil(240/12)], spawn speeds in [75, 125], > 3 cut-ins and > 3 cut-outs total, min gap > 10 m
    AutoDrive.ui.test.tsx (jsdom): starts off with explanation, on → traffic 'sparse' + seed button, off; blur → off + "Off — the app lost focus", stays off; key A on; Reset off; car change → off + "Off — car changed", traffic kept; cut-in test on → throttle pedal > 0; key S → "Cancelled — brake pressed"; engage refused while braking with flash
  exploratory sweep (not committed): 5 cars (Lexus, Škoda, Nevera, Civic 1.5T CVT, MX-5 6MT) × seeds 1–6 × 300 s sparse: contacts 0, max braking decel ≤ 3.6 m/s², min time gap ≥ 1.03 s (cut-ins), encounter count 15–18 per 300 s; braking jerk ≤ ~8 m/s³ after liftRate scaling; ≤ 1 brake re-application within 3 s after throttle per run (traffic-triggered)
  browser (Playwright Chromium, hasTouch, deviceScaleFactor 1; not native iPad Safari): 1180×820 and 1024×768 landscape, 820×1180 portrait, 390×844 phone; no horizontal overflow; 1180×820 page height = viewport (no scroll); cut-in test via tap on Lexus, Škoda (owner chip), Rimac Nevera (All cars search): Accelerating → Braking (early, ~170 m on Lexus at 150 km/h) → Following 80 km/h at ~2.2 s → cut-in braking at 16–19 m / 0.8–0.9 s → brake-pedal tap cancels at once (aria-pressed false, throttle 0 %, "Cancelled — brake pressed"); no page errors

source_gaps: none for Milestone 1 (Auto Drive is a simulator aid; no factory ACC data used or inferred). Factory Assist metadata (Milestone 3) still needs trim/year/market-specific sources.

decisions:
  - Auto Drive on with traffic off switches traffic to 'sparse' (something to follow); traffic otherwise defaults off so manual Live Drive looks and behaves as before apart from the taller 3-lane road strip
  - no collision physics: overlap only flagged (contact), traffic behind the player in lane 1 treats the player as its leader
  - cut-in safety lives in traffic (anticipation + abort) as a real driver would; Auto Drive reacts only once a car is 40 % into the lane
  - controller constants are simulator estimates, documented in README; plant model derived from each car's existing SimVehicle (brake capacity, road load, peak power), no per-car tuning

remaining:
  - native iPad Safari check by the owner (only Chromium touch emulation here)
  - Milestone 2 Launch Lab, Milestone 3 Highway (reuse AutoDriveController + TrafficSim; add lateral layer)
  - optional: lead acceleration feedforward, adjustable gap setting, persisting traffic preference
```
