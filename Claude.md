# Purpose: Claude logs changes made here; Codex reads this file as a reference before reviewing the branch.
# Rule 1 (Codex): Inspect this file before reviewing the codebase.
# Rule 2 (Claude): Document changes in maximum detail using dense, machine-readable language (human readability is not required).
# Rule 3 (Claude): Clear this file upon creating a new branch. Exclude changes from other branches.
# Rule 4 (Both): Preserve this header block when clearing the file.

```yaml
schema: claude-change-log/v1
branch: claude/clever-mayer-rgkw0b (restarted at origin/main 85cf2b7 = merge of PR #11; previous tip 46b6e68 is an ancestor → fast-forward push)
inputs:
  owner_report (iPad Safari screenshot, production Vercel, Taiwan Heavy, AD with 140 km/h cap): gap line ends ~8 m short of the highlighted lead; lane changes not smooth; cars overlap. Screenshot evidence: blinker dot pairs with no body under them, and the white lead body drawn beyond the gap line's end while the line length matched the label (22 m) → SVG bodies painted from stale positions in Safari (attributes in Chromium were exact: PR #11 frame sampling compared attributes only)
  codex_review: Codex.md (reviewed 46b6e68, changes_requested): P2 automation_brake_interlock, P2 released_queue_pacers_remain_crawling, P3 script_state_and_speed_leak
commits:
  - 9d52525: canvas road strip, minimum-jerk lateral motion, NPC merge aborts, review fixes, tests, README
  - (2): this log

changes:
  road_canvas:
    src/components/roadCanvas.ts drawRoad(ctx, paint): one 2D canvas, one pass per frame from one RoadScene: clip to road → edges, dashes, gap line (dashed, end tick), gap label if it would cover a car (drawn under bodies), bodies (lead/in-lane/shade fill, lead/burst stroke, windshield, blinkers on the body's corners), player, short-gap marker, gap label if clear, behind cues (skipped where a body is drawn) → horizon strip (rgba bg, border line) with ahead cues
    RoadView: <canvas class=road__canvas> sized w·dpr (dpr ≤ 3), drawn in useLayoutEffect every render; canvas.roadScene = last painted scene (for pixel checks); skipped under jsdom (UA); status line keeps the text information; SVG and its CSS removed
    roadGeometry: RoadLayout.roadEnd = width − horizonWidth (68 px; 56 px under 520 px) — px/m = clamp((roadEnd − x0 − 4)/170, 2.2, 6.5); bodies drawn when any part is before roadEnd (clipped there), cues when wholly beyond; offscreen gap line ends at roadEnd; cue text drops '›' under 520 px
    gap label: candidates on the segment midpoint (if the segment fits the pill + 16 px), above (min y − 0.28·laneH − 10), below; first that intersects no non-lead body wins; otherwise the first candidate is painted beneath the bodies
  lateral_motion (src/assist/lateral.ts): quintic minimum-jerk p(t) from (p0, v0, a0) to (target, 0, 0) over T; reversalDuration = max(0.9, T_lane·|Δ| + 0.6·|v|·T_lane); NPC: LaneChange.move created after the signal from current (lat, latV, latA); aborts start from current state; TrafficCar.latV/latA; player: PlayerLaneChange.move, latV/latA, reversal from current state; peak lateral speed 1.875/T lanes/s
  traffic:
    targetLaneStillClear(): before a moving car is across the line (|lat − from| < 0.5) it aborts if any vehicle in the target lane overlaps (±1 m) or is within half its accepted gap ahead/behind (in addition to the player-merge check). Reproduced before: Stuck Taiwan seed 1 (van mid-pass beside a car), Stuck Autobahn seed 1 (33 overlap samples)
    pacer stop phase 3–8 s → 5–10 s (waves reach the queue tail; AD now stops 4–5× per 150 s on Lexus/Škoda/Nevera, min gap 4.8 m)
    releasePacers(): pacer → null, role pacer|queue → flow 1, v0 = max(speed, 1), v0Target = road target, reacts after traits.reactionS (Stuck exit and Auto jam exit); Pacer.released removed
    releaseScript(): releaseActors() + script = null + phase = null; releaseActors(): scripted false, intents cleared, fixedSpeed null, v0Target = road target·flow with reaction (also on 'missed', which keeps its phase/note)
  brake_interlock: LiveDriveLoop.setDriverInput(); hook calls it on every setPedal and on releaseAll → engage/cruiseSet/cruiseResume read the brake pressed since the last step; refused commands change nothing (toggleAutoDrive sets traffic only after a successful engage)

checks:
  npm run check: PASS — 33 files / 1193 tests (+15 vs PR #11 merge: traffic integrity 2, transitions 3, interlock 1, UI interlock 1, roadCanvas 4+2 layering, roadGeometry +1, lanes rewritten), build (pre-existing chunk-size warning)
  generate:stats + generate:gaps: no diff
  new_tests: no NPC overlap (Stuck Taiwan/Autobahn, Heavy Taiwan/Autobahn × seeds 1–3, 120 s, every 50 ms); NPC lateral continuity (Heavy Autobahn seeds 1–4: step < 1.1 lanes/s·dt, |Δv| per ms < 0.02 lanes/s, aborts occur); Stuck → Sparse (+Autobahn 120): positions/speeds kept, heads not pacers, targets ≤ 134.4 and > 60 km/h, speed > 40 km/h after 40 s; Auto seed 11 jam→mid: no pacers, released targets > 60 km/h; Cut-in → Sparse: phase/note null, fixedSpeed null, Taiwan 60 → v0Target ≤ 66, speed < 68, decel < 1.3 m/s², reselecting Cut-in restarts at approach; interlock: setDriverInput(brake) → engage false, SET/RES refused with messages, cruise unchanged, traffic still off; release → RES/engage ok; brake tap cancels; UI: keyDown S then click Auto Drive before a frame → off, traffic off; canvas recorder: gap line start = drawn player front, end = drawn lead rear (x and y) at 360/820/1036/1500 px and lead/player between lanes; label at segment midpoint; one body per visible car; blinkers within their body; cues only in the horizon strip; label never painted over a crossing car (moved or underneath); player lane change: no jump in lateral speed at start or reversal (|Δv| < 0.02 lanes/s per ms), overshoot < 0.3 lane, ends in lane
  browser (Playwright Chromium, dpr 2, touch emulation; NOT iPad Safari): pixel sampling of the canvas against canvas.roadScene, 900 frames each: 1180×820 Heavy Taiwan, 820×1180 Stuck Autobahn, 1440×900 Heavy Autobahn, 820×1180 Heavy Taiwan → 24,976 body samples, 0 missing/wrong; gap end tick present 3600/3600; player lateral step ≤ 1.06 px/frame through a lane change and reversal; page height 1180×820 = 820, 1440×900 = 900, 820×1180 = 1194 (unchanged); no page errors

remaining:
  - iPad Safari: the stale-paint cause cannot be reproduced here (no WebKit); the canvas removes the per-element SVG repaint path the screenshot points to. Owner to confirm on the device
  - 1024×768 and 1133×744 still scroll vertically (as before)
  - Milestone 2 Launch Lab, Milestone 3 Highway
```
