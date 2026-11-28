# Purpose: Claude logs changes made here; Codex reads this file as a reference before reviewing the branch.
# Rule 1 (Codex): Inspect this file before reviewing the codebase.
# Rule 2 (Claude): Document changes in maximum detail using dense, machine-readable language (human readability is not required).
# Rule 3 (Claude): Clear this file upon creating a new branch. Exclude changes from other branches.
# Rule 4 (Both): Preserve this header block when clearing the file.

```yaml
schema: claude-change-log/v1
branch: claude/car-perf-simulator-handoff-l68phc (created at origin/main 5566be6 = merge of PR #12; log cleared per Rule 3)
author_note: implementation session run by Claude Code (owner asked for "Codex"); no independent review of this branch exists yet → Codex.md left as the pinned PR #12 review (d4b8a3b) = this branch's to-do list; review checkpoint not updated (no qualifying review)
inputs:
  owner_brief_2026-11-28: (1) Live Drive layout: gauges + both paddles visible together at 1024×768 / 1133×744 after the ACC update; (2) four PR #12 review findings; (3) stock picker acceptance 83/83 incl. 9 catalog-only
  handoff_files: Car_Performance_Simulator_New_Chat_Handoff.md + Car_Performance_Review_Checkpoint.json are chatgpt.com library files → not reachable from this environment; owner's in-message snapshot used
  reconciled_state_2026-11-28: origin/main 5566be6 (PR #12 merged 04:20Z); 0 open PRs; clever-mayer b4c0977, determined-planck aa1f1e9, upbeat-volta 4485300 (source-access note, ancestor branch of 1d6734e) = snapshot; no Claude implementation newer than PR #12 → nothing to review; pinned review Codex.md@5566be6 (reviewed_head d4b8a3b, claude_md_blob 1921372, impl 9d52525 + ff14505) carried forward
  baseline_check: main 5566be6 npm ci + npm run check PASS 34 files / 1,206 tests (= pinned review count)
commits:
  - 0c77edc: Live Drive layout
  - 7d79732: P2 held_brake_interlock_after_vehicle_switch
  - 46a6017: P2 ioniq_stale_launch_prime_bypasses_e_shift
  - 7404150: P2 ioniq_verified_grip_table_reversed + P3 nevera_record_source_metadata
  - 437ee80: this log (first part)
  - 2d5e56d: catalog RS 3, Macan GTS, F-150 Raptor 37, AMG E 63 S Wagon + 'multi-clutch' transmission type
  - dd8e66a: hybrid drive model + NSX, SF90 AF, M5 Touring, V60 T8 PE, Prius AWD
  - 6205c80: README
  - (10): this log (acceptance part)

changes:
  layout (0c77edc):
    cause_measured (Chromium 158, Playwright, dpr 1, touch, Lexus default, #/drive, scrollY 0; builds 8d45b47 = pre-Auto Drive, ff2d47b = Auto Drive pre-cruise, 85cf2b7 = PR #11 cruise/traffic, 5566be6 = main):
      1024x768 main/side gauge px: 8d45b47 261/215 · ff2d47b 261/215 · 85cf2b7 207/169 · 5566be6 207/169 (PR #11 changed max-width 34vh→27vh, 28vh→22vh; pedals 27vh→23vh)
      1024x768 paddle bottom y: 618 · 747 · 753 · 753; page scroll 13 · 141 · 202 · 202
      1133x744 paddle bottom y: 536 · 665 · 672 · 672
      stack added above paddles since 8d45b47: road 30→104 px, status note 1–3 lines (18–70 px, height follows the Auto Drive status), assist row 48 px, lane buttons in the pedal columns
      Safari-like heights (toolbar shown): 1133x670 main → paddles cut at the bottom, pedals off screen; 1024x698 main → paddles 599–687, pedals top 651
      layout shift on main: Taiwan Heavy AD + 140 cap (1024x768) and Stuck (1024x698): paddle y 599↔609 / 618↔628 (≈10 px) as status changes; cause = telemetry row height change (label re-wrap with value width) + note line count
    fix:
      DriveView: .drive__roadbar (grid: ◀ Lane | AutoDriveToggle | status note | odo | Lane ▶) under the road; note = 2-line clamp, fixed 36 px, title = full text; .drive__controls = [brake pedal | paddles (+boost row) + CruisePanel | throttle pedal]; .drive__lower = AssistBar (traffic/seed/road/limit only) + timer
      DriveAssist: AutoDriveToggle split out of AssistBar (same aria-pressed button, same title/A key); AssistBar role=group "Traffic and road"; LaneButton gets lane-btn--left/right
      CSS: cluster 4 columns from 1000 px (was 1100): 0.85/1.1/0.85fr + telemetry minmax(168px,0.72fr), gap 14, padding 14/16; .lights auto-fit minmax(28px) gap 5, font 10 px; .telemetry-row__value min-width 5.2em tabular-nums nowrap; gauges min(340,34svh)/min(240,28svh) (vh fallback) = pre-Auto Drive proportions
      compact landscape @media (orientation: landscape) and (min-width:900px) and (max-height:900px): main gauge max(190px, min(340px, 34svh, 100svh − --drive-stack − safe-area-bottom)); side max(155px, min(240px, 28svh, 0.82·(…))); pedal min-height clamp(150px,22svh,220px); .view__bar nowrap with car chips flex-shrinking into their existing horizontal scroller
      useDriveFit (new hook): ResizeObserver on .view.drive → --drive-stack = offsetTop + (controls.bottom − view.top) − mainGauge.height + 12 px (layout positions; view-in transform cancels); stack excludes the gauge → settles in one pass; default 480 px; skipped without ResizeObserver (jsdom)
      README: layout paragraph; iPad walkthrough points to the new rows
    verified_after (same harness; scratchpad scripts measure2/drive-flow/ad-flow/rotate-nav; NOT native Safari):
      gauges main/side px, paddle bottom, pedal visible/height, usable height:
        Lexus 1024x768 250/193, 641, 169/169 of 768 · 1133x744 253/208, 644, 163/164 · 1024x698 219/180, 610, 153/154 · 1133x670 194/159, 585, 150/151 · 1133x640 190/155 (floor), 581, 137/151 · 1180x820 279/230, 670 · 1366x1024 340/240 · 1440x900 306/240 (main 243/198) · 1280x720 236/194 (main 194/158, pedals 81 visible → 158)
        Ioniq 5 N (single-speed, boost slot, e-Shift toggle) 1024x768 250/193 bar 60 (main: bar wraps to 120 and pushes everything 60 px) · 1024x698 231/189 · 1133x670 206/169; Taycan (2-speed paddles) 1024x768 250/193 paddle bottom 641 · 1133x670 190/155 paddle bottom 591 pedals 151/151; Nevera 1024x768 250/193; Škoda = Lexus
        portrait (bottom tab bar subtracted): 768x1024 paddles 847 ≤ 953 (main 941), pedal 184/210 visible (main 39/293) · 744x1133 868 ≤ 1062 · 820x1180 877 ≤ 1109 · 834x1194 879 ≤ 1123; portrait gauge sizes unchanged (19/15vh rule <860 px); 390x844 phone: paddles still below the fold (1224; main 1501) — not a target
        no horizontal overflow at any size; no page errors
      paddles: touch taps on Shift up/down (Manual, W held) Lexus 1/8→2/8→1/8, Škoda 1/6→2/6→1/6 at 1024x768 and 1133x744; paddle boxes 306,563 / 607,563 (1024) fully inside the viewport
      Auto Drive states: Taiwan Heavy seed default, AD on, SET at ≥60 then +/− to cap 140 (cruise state 'Auto Drive cap'), 45 s @ 4 Hz: statuses Auto Drive off → Accelerating → Accelerating · cap 140 → Holding the set speed · cap 140 → Following · cap 140 → Braking · cap 140 (1024x768, 1133x744); Stuck 40 s (1024x698): Following/Braking; after the 1 s entry animation every control y is constant (paddle, pedal, gauge, note h 36, road, cruise); pedal box changes only by its pressed scale(0.985); note x shifts ≤ 5 px when ON/OFF text changes width (assist__state min-width added)
      rotation 1133x744 → 744x1133 → 1133x744 → 1133x670 (toolbar) → Tests → Drive: stack 489→806→489→476 px, paddles in view every time
      tests: src/__tests__/DriveLayout.ui.test.tsx (row membership and DOM order gauges→road→roadbar→paddles→traffic/timer; useDriveFit stack 414 px, stable after gauge resize, +60 when the bar grows)
  held_brake_interlock (7d79732):
    cause: useDriveSimulation replaced LiveDriveLoop on vehicle (car or tuning) change with driver input {0,0}; engage()/cruiseSet()/cruiseResume() read this.driver → accepted until the next step()
    fix: LiveDriveLoop opts.driver (initial DriverInput); hook passes driverTargets() (max of pointer and key targets) when constructing the replacement
    tests: UI keyDown S → click Škoda → click Auto Drive / A / SET / V before any rAF: off, 'Release the brake to start Auto Drive' / '…set a speed', traffic heavy + seed unchanged, cruise 'Not set' (car change clears it by design), keyUp → engage ok; UI pointer-held brake (pointerDown clientY 10 on 200 px pedal) → Škoda → refused, focused-pedal End → Lexus → refused, Home → engage ok; loop: new LiveDriveLoop({driver:{brake:1}}) refuses engage/SET/RES before any step, heavy/42 kept, release → engage. 3 tests fail on 7d79732^ src, pass after
    browser (Chromium, real rAF): hold S, click Škoda, MessageChannel task (0 frames between), click Auto Drive: main 5566be6 aria-pressed true then 'Cancelled — brake pressed' at the next step (3/3); fix: false + 'Release the brake to start Auto Drive' (3/3)
  ioniq_stale_launch_prime (46a6017):
    cause: setVirtualShift(true) kept s.launchPrimed; driveElectric release branch fired without re-checking ready (virtualActive etc.)
    fix: setVirtualShift(on) clears launchPrimed and sets launchRearm (no prime while the same full-throttle brake hold continues; cleared once !full || !stationaryHold; reset() clears); release fires only if ready (armed, !virtualActive, boostS 0, recovery 0, cooldown 0)
    tests (electric.test.ts +4): prime → e-Shift on → release: boostS 0, boostUsed false, cooldown 0, not suspended, 8 gears; on/off/on/off during one hold → never re-primes, release fires nothing, fresh hold after stop primes and fires (10 s, cooldown >119 s); forced prime under e-Shift → no fire; NGB suspends e-Shift and returns, LC stays blocked through boost + recovery, e-Shift off + fresh hold primes. First 3 fail on 46a6017^ src. Existing Taycan 3× repeat launch and Ioniq 120 s cooldown tests unchanged/pass. Stock stats byte-identical (runners never enable e-Shift)
  provenance (7404150):
    sources re-read 2026-11-28: Hyundai OM 2025 en_UK id2362E0V0UY4 (table 'Road grip level | Automatic link to N Grin Boost | Pre torque': LOW Not applied/Not applied; MEDIUM Applied/Not applied; HIGH Applied/Applied; 'release the brake pedal within 8 seconds'; 'cool the vehicle at least 2 minutes'; LC 'limited when N Grin Boost, … N e-Shift … is operating'; page shows no market/year label beyond the URL); Rimac newsroom release (dated May 17, 2023; no run date; Racelogic|Dewesoft table: ¼ 8.26|8.25, standing mile 20.62|20.59, ½ 12.82|12.83, 0–100 km/h 1.82|1.81, 200–300 4.81|4.79); Rimac Bending Physics ep. 1 ('April 30th, 2023'; one value per test, no system named: mostly Dewesoft values, but ½ mile 12.82 = Racelogic)
    ioniq: N Launch Control row value corrected to the table; N Grin Boost / N Launch Control / N e-Shift rows status verified → reported with 'UK (en_UK) evidence on this US entry; US manual not checked'; simCaveats/notes: Tuning link = boost-linked setting (MEDIUM or HIGH); unlinked stock run = simulation assumption (no boost, as LOW; no pre-torque either way), test-day boost use unknown; dataGaps + 'US-market owner's manual …' and grip level in the test-mode gap; TuningView/tuning.ts/runners.ts/types.ts comments 'HIGH grip' → boost link
    nevera: benchmark rimac-2023 date 2023-05-17 → 2023-04-30 (event); source src-rimac-2023 keeps 2023-05-17 (publication); new source src-rimac-bp1; timingNote: Dewesoft column shown, up to 0.03 s apart (1.82/1.81, 8.26/8.25, 20.62/20.59); other: Dewesoft (Racelogic) pairs; record day vs release; caveat + provenance check line attribute the standing mile to both systems; provisional fade (8,400 rpm, ^0.44) and Famoso trap residual (≈178 vs 167.5 mph) unchanged
    generated: DATA_GAPS.md Ioniq line only; stockStats byte-identical

  stock_picker_acceptance (2d5e56d, dd8e66a):
    roster: pinned DATA_GAPS.md at 85cf2b7 and 5566be6 → identical 83 '### ' headings; each = fullName(e) of exactly one CATALOG entry → 83 unique ids (map built with a temporary vitest fixture, not committed); 74 sim + 9 catalog-only at 5566be6 (= the brief's nine ids)
    harness (session scratchpad scripts/accept.cjs, Playwright Chromium 158.0.8127.36, 1180x820, fresh storage): #/tests → 'All cars' → search the exact heading → button 'Choose <heading>' (default 'Runnable only' filter) → radio aria-checked title = heading → no stored tuning (stock) → Run test → Skip → ¼-mile StatTile text → Save result → localStorage cps:v1:results newest for the id: metrics.quarterMileS finite > 0, trace.t/v all finite (> 10 samples), shown value = saved value to 2 dp, chart paths free of NaN/Infinity, no page errors
    baseline 7404150: 74 pass / 9 catalog-only ('Choose … (not runnable yet)' with Runnable only off) / 0 fail / 0 error; ET 8.472–16.055 s
    final dd8e66a build: 83 pass / 0 catalog-only / 0 fail / 0 error; the 74 baseline ETs identical to the bit; new: Prius AWD 15.612, RS 3 11.850, E 63 S Wagon 11.554, V60 T8 PE 13.152, M5 Touring 11.362, Macan GTS 12.779, Raptor 37 14.207, NSX 11.455, SF90 AF 9.738 s (brake-release ¼, stock, Best launch)
    live drive smoke (1133x744, Manual, W held 2.5 s, touch Shift up): E 63 S 65 km/h 1/9→2/9 · NSX 80 1/9→2/9 · Prius 56 1/6→2/6 · Raptor 59 1/10→2/10 · SF90 105 1/8→2/8; paddle bottom 644 (in view); 0 page errors
    sources tried 2026-11-28: Audi RS 3 Sedan TFSI eTD PDF (fetched; pdftotext locally): 294 kW (400 PS) @ 5,600–7,000, 500 Nm @ 2,250–5,600, 3.560/2.530/1.680/1.020/0.790/0.760/0.630, 'final drive ratio 1-2 / 2-3: 4.059 / -', 265/30 ZR19 F | 245/35 ZR19 R, 1,570/1,645/2,070 kg, Cd 0.32 / 2.22 m², 4,542 × 1,851 × 1,412, WB 2,631, 250 km/h governed, 0–100 3.8 s · Motor1 Raptor first drive (450 hp / 510 lb-ft, 10AT, '4.10 rear end', 37-inch BFGoodrich KO2, 5,851 lb, 'Maximum speed 118 MPH', 0–60 5.3 s est) · BLOCKED: caranddriver.com (fetch layer refuses), download.newsroom.porsche.com (DNS ENOTFOUND), media.mbusa.com release (HTTP 404)
    models:
      multi-clutch (types.ts TransmissionType): non-converter path (launchClutch), creep default true, shift defaults 0.20 up / 0.30 down, dip 0.35, 'blend' profile; used by the E 63 S Wagon only
      hybrid (VehicleSpec.hybrid → SimHybrid via buildSimVehicle; build.ts SimInput.hybrid): inputMotor torque = demand × min(Tpk, Ppk/ω_engine), 0 at fuel cut or above maxRpm, ≤ battery/ω and ≤ system/ω − engine T; added to engine torque before converter/clutch (s.engineTorqueNm stays engine-only). axleMotors: ω_m = v/r × reduction, 0 above maxRpm, T = demand × min(Tpk, Ppk/ω_m), F = T × reduction × 0.95 / r; total scaled to min(battery − input motor, system − engine power); F added to the engine force before the shared traction clamp; s.motorPowerKw = input + axle motor power. demand = throttle after the speed limiter, before idle control. Dyno unchanged (engine only); classes come from simulated ET/trap/0–100 so hybrids are classed on performance
    configurations (provenance per field; 'estimated' = bounded estimate with its basis; most recalled values marked 'not verified from a reachable source'):
      rs-3: TT RS DQ500 per-gear outputs [4.059,3.45,3.45,4.059,4.059,3.45,3.45] estimated; bounds all-4.059 → 11.80 @ 116.1 (0–60 3.32), all-3.45 → 11.89 @ 114.0 (3.35); grip 1.15, η 0.91 fit to C/D 3.3 / 11.8 @ 117 (sim 3.29 / 11.73 @ 117.1 rollout); mass 1,651 kg C/D test; staggered EU tires
      macan-gts: axle 4.67 (EU) modelled, 4.13 (US db) → 3.96 / 12.62 @ 107.6 vs 3.96 / 12.53 @ 108.0 (MT cannot separate); grip 1 (not traction-limited), η 0.92 fit to MT trap; PTM front share 0–0.5; 2,032 kg 55 % MT
      raptor-37: 4WD front share 0–0.5 (4A/4H assumption; test mode not transcribed); touring compound ×0.8, η 0.80 fit to C/D 5.2 s rollout (5.22) and Edmunds 14.3 standing (14.21); 2,708 kg C/D; 190 km/h (Motor1 118 mph); 10R80 ratios recalled
      e-63-s-wagon: multi-clutch 9G ratios + 3.06 (MBUSA as transcribed, page 404 now); no benchmark → grip/η default, uncalibrated (sim 3.06 s rollout 0–60, 11.31 @ 122.2)
      nsx: DD motor 35 kW/148 Nm input; front 2 × 27 kW/73 Nm @ 8.05 cut 16,000 rpm; battery 89 kW; system 427 kW; front share 0–0.3; grip 0.85, η 0.81 → 3.09 / 11.18 @ 126.4 rollout vs C/D 3.1 / 11.2 @ 126 (basis unconfirmed; brake-release 3.36 / 11.46)
      sf90-af: MGUK 80 kW/250 Nm; front 2 × 45 kW/120 Nm @ 10 cut ≈ 211 km/h; battery 162 kW; system 735 kW; 8DCT ratios geometric (estimated, sized to 340 km/h); grip 1.15, η 0.78 → 2.10 / 9.51 @ 146.3 vs MT 2.1 / 9.6 @ 145.2
      m5-touring: P2 145 kW/450 Nm; battery 145; system 535; grip 0.82, η 0.94 (ceiling; lumped) → 3.09 / 11.09 @ 128.4 vs C/D 3.1 / 11.0 @ 129; brake-release 3.36 / 11.36 vs Edmunds 3.4 / 11.3 @ 124.7
      v60-t8-pe: crank ISG 34 kW/150 Nm; rear 65 kW/240 Nm @ 9.2 cut ≈ 165 km/h; battery 70; system 309; front share 0.5–1; 180 km/h; grip 0.9, η 0.82 → 4.37 / 12.88 @ 106.8 vs aggregator 4.4 / 12.9 @ 107 (unconfirmed)
      prius-awd: CVT model (span 2.60–0.55 × 3.218, hold 5,900 rpm, no Step Shift) + MG2 83 kW/206 Nm @ 10 front + rear 30 kW/84 Nm @ 10.5; battery 45; system 146; grip 1, η 0.86 → 6.89 / 15.32 @ 88.3 vs FWD Limited 7.1 / 15.5 @ 92 (equivalent; trap −3.7 mph = power-split approximation)
    tests: hybrid.test.ts (quicker than engine-only for M5/NSX/V60; motor ≤ battery and engine+motor ≤ system each ms to 200 km/h; 0 output at zero demand; NSX front motors cut above ≈ 245 km/h); catalog.test.ts nine formerly catalog-only ids playable with no unsupportedReason; vehicles.test.ts per-car suites cover the nine (Peak power/Peak torque/Gear ratios/Curb mass/Drag coefficient rows; idle < 1000; η < 0.95)
    generated: DATA_GAPS 'Catalog-only cars (0)', 'Playable cars (83)', 83 headings kept; stockStats additions only (0 removed lines)

checks:
  npm run check (dd8e66a): PASS 36 files / 1,324 tests (+109 vs 7404150: per-vehicle suites for nine cars, hybrid 3, roster 1), typecheck, lint, build (chunk-size warning); git diff --check clean
  npm run check (7404150): PASS 35 files / 1,215 tests (+9 vs main: layout 2, interlock 3, launch prime 4), typecheck, lint, vite build (pre-existing chunk-size warning); git diff --check clean
  generate:gaps → Ioniq line; generate:stats → no diff
  browser: Playwright Chromium 158.0.8127.36 headless, emulated touch, dpr 1 (evidence screenshots dpr 2 in session scratchpad, not committed). NOT native iPad Safari; svh/safe-area behave as vh/0 in this emulation

remaining:
  - native iPad Safari (owner device): 1024x768 / 1133x744 landscape with the toolbar shown and hidden, home indicator safe area, Taiwan Heavy AD cap 140 + Stuck (gap line, car/blinker alignment, overlap, interrupted lane changes, touch reach); canvas stale-paint report from PR #12 still unconfirmed on WebKit
  - nine formerly catalog-only cars run on bounded estimates: confirm with primary sheets when reachable — C/D tests (RS 3, Raptor 37, E 63 S Wagon, NSX, Prius AWD, M5 Touring, V60 T8), Porsche Macan GTS sheets (axle ratio, rpm band, tires), MBUSA E 63 data, hybrid motor ratings/reductions/battery limits for all five hybrids, SF90 DCT ratios, E 63 S Wagon benchmark (uncalibrated now), V60 curb mass
  - hybrid model limits: no charge state, temperature, regeneration or deployment strategy; Dyno engine-only; front motor axles share one traction limit
  - Launch Lab, 3D Highway (later milestones)
```
