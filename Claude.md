# Purpose: Claude logs changes made here; Codex reads this file as a reference before reviewing the branch.
# Rule 1 (Codex): Inspect this file before reviewing the codebase.
# Rule 2 (Claude): Document changes in maximum detail using dense, machine-readable language (human readability is not required).
# Rule 3 (Claude): Clear this file upon creating a new branch. Exclude changes from other branches.
# Rule 4 (Both): Preserve this header block when clearing the file.

```yaml
schema: claude-change-log/v1
branch: claude/clever-mayer-rgkw0b (restarted at origin/main f4c997b; previous tip 7ee3fcb was merged via PR #10 = ff2d47b, so the push is a fast-forward)
brief: docs/PLAYABILITY_HANDOFF.md "Live Drive follow-up · Traffic and lane controls" + "Findings from the initial Auto Drive review" (main f4c997b); no newer Codex review for this branch (Codex.md still holds the planck-branch review)
commits:
  - 319913b: follow-up implementation + tests + README
  - (2): this log

review_findings (reproduced on main f4c997b before changes, then fixed):
  P2_gap_line: old RoadView projected the line on the centre lane with a min-width body → replaced. Fix: src/components/roadGeometry.ts bodyBox() is the only geometry for every body and for the line; gap = (player.x2, player.cy) → (lead.x1, lead.cy). Unit: 5 sizes × player lat {1,1.3,0.5} × lead lat {1,1.5,0.7} exact. Browser frame sampling (1440×900, 1180×820, 820×1180; ~4000 frames each incl. Driver test merges, player lane change + reversal, Heavy Autobahn): max |endpoint − drawn bumper| = 0.000000 px
  P2_horizon_pileup: old log compression clamped >3000 m to one x; traffic kept to 9000 m. Fix: one linear scale (no compression); bodies only when any part is inside the strip (SVG clips at edges); wholly beyond → one cue per lane (nearest; lead preferred) with distance; faster traffic approaching from beyond the left edge → left cue; despawn ahead 9000 → 4000 m (lead spawn capped 3800 m). Unit: cars at 3500 and 8000 m same lane → 0 bodies, 1 cue (3495.4 m), offscreen gap line to the cue; cue↔body handoff while approaching: exactly one of them every 0.25 m. Browser: car drawn as both cue and body = 0 frames
  P2_cutin_stuck: reproduced exactly (Lexus manual full throttle: lead despawned 28.309 s; phase still 'approach' at 60 s). Fix: terminal 'missed' with reason (lead passed/left road, cut-in car passed, player left the test lane, phase timeout 150 s approach / 60 s other); actors released to ordinary traffic; Reset reruns. Unit: missed < 35 s with note "…passed… Reset to rerun"; Reset → 'approach' → Auto Drive run 'done'; leaving the lane → missed. Normal scripted runs unchanged in outcome (Lexus/Škoda/Nevera 'done'; lead sequence [1,2,1,null])
  P2_focus_throttle: reproduced (throttle slider End → 100 %, still 100 % after window blur). Fix: Pedal releases on window blur, visibilitychange hidden, pointercancel and lostpointercapture (own listeners, onChange via ref); hook releaseAll() zeroes pointer+key targets and stops automation; DriveView blur/hidden → releaseAll. jsdom: End→100 → blur → 0; End → hidden → 0; two touch pedals pressed together, lostpointercapture (throttle) + pointercancel (brake) → both 0. Brake tap still cancels synchronously in setPedal
  P3_motion: NPC lane changes and aborts use latStart → target smoothstep (abort reverses from the current lat over max(0.8, changeS·|Δlat|)); player lane changes the same (2.5 s/lane; reversal from current lat). Browser frame sampling: max per-frame lateral step 0.71 px (NPC), 0.31–0.61 px (player incl. reversal); unit: player |Δlat| per step ≤ smoothstep peak (×1.6 at the reversal), monotone return
  related_defects_found_and_fixed:
    - Heavy Autobahn (Nevera, AD): NPC 'pass' merge in front of a player who then accelerated at ~1 g → contact. Abort-if-unsafe now covers any move into the player's path (not only cut-ins); time-to-claim computed from the move's progress
    - Stuck: idle creep pushed the car to 1–3 m behind a crawling lead (coast estimate ignores creep) → creep braking below 5 m/s + standstill guard (gap < 5 m and rolling → −1.5 m/s²); queue followers had their desired speed set to the spawn speed (4 km/h) → stop-and-go now real
    - 'behind' spawns could put a 245 km/h car 25 m behind a 112 km/h car → spawnClear(): gaps ahead/behind ≥ 5 m + v·1 s + closing²/(2·3) incl. the player; 'behind' speeds capped by road (Taiwan ≤ 1.1×limit, trucks < 90)
    - SET while accelerating hard (Nevera) overshot 15–27 km/h → cruise starts from holdThrottle(v) (not the driver's pedal); at/over the cap the throttle closes 4× faster
    - Scripted cut-in with a 100 km/h cap: script started before the player settled and the generic behind-gap rule then blocked the merge → script waits for |Δv| < 1.5 m/s; scripted merges judged by mergeUnsafeForPlayer only (plus beside/ahead checks)

features:
  traffic_modes (src/assist/road.ts TRAFFIC_MODES, one <select aria-label="Traffic">): off | very-sparse | sparse | mid | heavy | stuck | auto | cut-in | drivers; seed button (#n ↻) in every generated mode
  levels (traffic.ts LEVELS): very-sparse {interval 30–55 s, group 1, max 4} · sparse {12–25 s (baseline), 1, 8} · mid {7–13 s, 1–3, 14} · heavy {3.5–7 s, 2–4, 22, flow ×0.88} · jam {6–12 s, 1–2, 26, flow ×0.8, behind-only}; encounter mix [lead, cut-in, adjacent, behind]
  auto: seeded segments over simulation time (50–110 s; jam 40–75 s); Markov neighbours very-sparse↔sparse↔mid↔heavy↔jam; per segment truckShare U(0.03,0.22), rudeShare U(0.05,0.2); jam = queue spawned beyond view (≥440 m or leadSpawnGap) + pacers released at segment end (flow change, no teleport); 'level' events
  stuck: queue in each lane (5–7 cars; tail max(30 m, v²/3+40) ahead), head = pacer alternating stop 3–8 s / go 8–25 km/h for 4–9 s; trickle joins from behind; released when leaving stuck
  setDensity(): in place (no car moved/removed; next encounter in half an interval); scripted→generated releases actors; off/scripted ↔ restart; setSeed(): reseeds future generation, cars stay; setRoad(): lane behaviour switches at once, each NPC v0Target recomputed, reacts after traits.reactionS (0.5–4 s), v0 slews 1.5 m/s², IDM free-term decel floor −1.2 m/s²
  road: taiwan (default 110; quick 100/110), autobahn (default null = no limit); limit stepper 60–200 in 10s; Default restores the preset's value; road settings never touch player/AD/cruise
  driver traits (per vehicle from the seed): courteous vs less courteous (rudeShare 0.12 Taiwan, 0.06 Autobahn in fixed modes); speedFactor (Taiwan: 0.85–1.02, 20 % slow 0.72–0.85, rude 1.0–1.1); naturalKmh (Autobahn car 95–230, van 100–140, truck 80–89); limitFactor 0.9–1.03 / rude 1.0–1.12; IDM a/b/T/s0 (rude T 0.7–1.0, s0 1.8–2.5); signalS 0.9–2.0 (rude: 70 % 0, else 0.1–0.4); changeS 2.6–3.6 (rude 1.8–2.4); gapAcceptance 1 (rude 0.5–0.65); keepRightDelayS 2–5 (8 % lazy 10–20); trucks ≤ 90 km/h, right lane on Autobahn
  lane decisions (4 Hz per car, staggered): cut-in intent into the player's current lane (window; rude min 5+0.35v+2) · cut-out after being followed · Autobahn: yield right for faster traffic incl. the player (not mid-pass; lenient right-lane check) → keep-right after delay (strict: right lane clear 8 s or leader ≥ v0+0.5) → pass left only when blocked (≥ 6 s since last change, 10 s after moving right, 20 s after a yield); never pass right · Taiwan: pass when blocked (left first; rude either side, sooner) · bursts (rude, non-truck: 2.5–4 s, +20 km/h, a 2.4) more likely right after a lane change
  safety: laneChangeSafe (beside margin 2+4k; ahead ≥ (5+0.5v+c²/3.6)k; behind ≥ (5+0.5v_o+c²/3.6)k; player as a vehicle) · mergeUnsafeForPlayer (decel after time-to-claim > 2.5 / 3.5 m/s²) → abort any in-progress move into the player's path · spawnClear
  scripts: cut-in (A 80 km/h 220 m; B 65 km/h, window [12,30]; unchanged baseline) · drivers (A; C1 courteous 70 km/h signal 1.5 s merges ahead → leaves to the far lane; C2 rude 102 km/h from behind, unsignalled 2 s merge at 10–16 m, settles 76 km/h → leaves; C3 alongside 80 km/h, burst after 2 s for 3 s; A leaves → done)
  player lane: requestLaneChange(±1) → {ok,message}: 'No lane to the left/right', 'Lane occupied — wait for a gap' (car beside or rear within max(5, 0.4v) m ahead), 'Already changing lanes', opposite mid-change → 'Lane change cancelled' (steer back); lat continuous; traffic gets {lat, targetLane}; claims relative to player lat (0.6/0.75) → lead and contact use one boundary; Reset → lane 1
  controller (autoDrive.ts): update(dt, ego, lead, {capMs, allowBrake}); capTarget = max(0.4·(cap−v), −0.8); target = min(lead, cap) with limiter 'lead'|'cap'; mode 'cruising' when the cap limits; allowBrake false = conventional cruise (coast only); creep braking; standstill guard; holdThrottle(v); fast lift at cap
  loop (liveDrive.ts): one controller for cruise and Auto Drive; automated = AD || cruiseActive; brake/focus/switch/reset disengage (cruise → standby; reset/new loop clears stored speed); cruiseSet/Adjust/Cancel/Resume with messages (min 20 km/h, ±1 km/h, ≤ 400); AD on carries active cruise as cap; AD off → standby; views: cruise {setKmh, state off|standby|cruise|cap}, laneView, trafficView (+road, level, kind, courteous, bursting), autoDriveView (+limiter, cruiseUsedThisRun); saved live run label '· Auto Drive' / '· Cruise'
  hook: setTraffic/setSeed/setRoad/changeLane/cruise(action) return {ok,message}; releaseAll(); new loop carries mode/seed/road
  UI: RoadView full width (roadGeometry: x0 = clamp(0.11w, 46, 140), px/m = clamp((w−x0−12)/170, 2.2, 6.5); dashes 12 m period/6 m length in road coordinates; lead tone amber/red; short-gap red marker; cues 'N m ›' / '‹ N m'); odometer moved to the status line; AssistBar row under the status line (Auto Drive toggle, Traffic, seed, Road preset, limit − value + quick chips Default); CruisePanel in the centre column (CANCEL − speed/state + SET RES; ± hold-to-repeat); lane buttons above each pedal; keys Z/X lanes, C/V/B SET/RES/CANCEL, +/− set speed; compact one-row timer ≥ 1100 px; gauges/pedals slightly smaller on short screens

checks:
  npm run check: PASS — tsc, eslint, vitest 32 files / 1178 tests (+47: traffic 18, cruise 10, lanes 4, roadGeometry 11, UI +4), vite build (pre-existing chunk-size warning)
  generate:stats + generate:gaps: no diff
  exploratory sweeps (not committed): Lexus/Škoda/Nevera/Civic/MX-5 across densities and presets: no contacts after fixes; max AD braking ≤ ~3.6 m/s²; compute 4–9 ms per simulated second (Node, unthrottled)
  browser (Playwright Chromium, hasTouch; not native iPad Safari):
    layout page height vs viewport (main f4c997b → this branch): 1440×900 900→900 · 1180×820 853→820 (no scroll) · 1133×744 827→801 · 1024×768 909→924 (+15; telemetry row at <1100 px) · 820×1180 1257→1194; no horizontal overflow at any size; road/status/assist row/pedals/paddles/cruise/lane buttons non-overlapping (bounding boxes checked)
    frame sampling: gap endpoint error 0 px; dash spacing/length error 0 px; per-frame lateral step ≤ 0.71 px; cue and body never for the same car in one frame
    profiling 820×1180 @2×: off/Heavy Autobahn/Stuck 60 fps unthrottled (0 long tasks); CPU ×4 throttle: off 18 fps, Heavy 14 fps, Stuck 16.5 fps → rendering of the existing view dominates; traffic adds ~10–20 %. NPC caps unchanged (max 22–26 cars); leader search now on a position-sorted list (insertion sort per step)

source_gaps: none (simulator design assumptions; no factory ACC or measured traffic data used)

remaining:
  - native iPad Safari check by the owner (Chromium touch emulation only here)
  - 1024×768 still scrolls ~150 px (as on main); iPad mini landscape ~57 px
  - Milestone 2 Launch Lab, Milestone 3 Highway (reuse controller, TrafficSim, road presets; add lateral model)

ipad_walkthrough: Drive → row under the road: choose Traffic (e.g. Heavy), Road (Taiwan/Autobahn) and limit → tap Auto Drive → watch the status line and lead outline → ◀ Lane / Lane ▶ above the pedals → with Auto Drive off, drive > 20 km/h, SET, +/−, accelerator override and release, brake tap cancels, RES resumes → Cut-in test / Driver test / a seed + Reset for repeatable runs
```
