# Purpose: Codex logs code reviews, instructions, and handoff tasks here; Claude executes them.
# Rule 1 (Claude): Treat this file as your active prompt and to-do list.
# Rule 2 (Codex): Write in maximum detail using dense, machine-readable language (human readability is not required).
# Rule 3 (Codex): Clear all previous entries before writing a new handoff to keep the file clean. Exclude content from other branches.
# Rule 4 (Both): Preserve this header block when clearing the file.



```json
{
  "schema": "codex-review-handoff/v1",
  "branch": "claude/car-perf-simulator-handoff-l68phc",
  "reviewed_head": "1c33f24d880cd28491d4175ffe8b856083b41f41",
  "claude_md_blob": "136fba6fd7d84f780c23fd36337fadb529e0b84c",
  "comparison_base": "5566be6d028788716e30ac235b5a64d8b028263d",
  "log_commit": "1c33f24d880cd28491d4175ffe8b856083b41f41",
  "related_log_commits": [
    "437ee80e91710870545dbeb9d55680cc56960b34"
  ],
  "implementation": [
    "0c77edccbc12143ea9f458a211c66be5454143b2",
    "7d79732c6b0ec2684b6872d3d68fa575b834ecab",
    "46a60172237ceb63d88c368f679416597b9fc7dd",
    "7404150bb6ba23f09e6ffc792d8eac0b94c052a5",
    "2d5e56dc1cafebc067039fd768fcecc0fb654fa2",
    "dd8e66a5a84bb46202efcb6c24f6a4fe8a41c8cf"
  ],
  "pull_request": "https://github.com/eason-531/Car-performance-simulator/pull/13",
  "result": "changes_requested_before_merge",
  "objective": "Finish PR #13's Live Drive and new stock powertrain work to a review-ready state, preserving the complete exact stock picker roster, the existing assist behavior, the owner calibrations and saved-data compatibility.",
  "first_follow_up": {
    "id": "live_drive_layout_handoff",
    "status": "passed_chromium_touch_emulation_native_safari_pending",
    "tested_head": "1c33f24d880cd28491d4175ffe8b856083b41f41",
    "engine": "Chromium 158.0.8127.0, production build, iPad touch context at DPR 1",
    "acceptance": "At 1024×768 and 1133×744 CSS px landscape, keep correctly proportioned readable speed, RPM and boost gauges with both shift paddles fully visible, tappable and functional at zero scroll. No overlap with status, assist controls, navigation, browser chrome or safe areas. Verify Auto Drive off and on, a paddle-equipped car, rotation/portrait, desktop and native iPad Safari where available.",
    "evidence": "Lexus IS 200t at 1024×768: gauge widths speed/RPM/boost 193/250/193 px, both paddles bottom y≈641. At 1133×744: 208/253/208 px, bottom y≈644. Both sizes: status stayed 36 px with a two-line clamp, paddle positions held with Auto Drive off/on, touch shifted 1→2→1 in each mode, full controls clear of navigation at zero scroll. Verified 744×1133 portrait and back, 1024×698 and 1133×670 reduced-height proxies, 1440×900 desktop mouse context, and single-speed Ioniq 5 N boost tap.",
    "remaining": "Native iPad Safari remains open for actual toolbar/safe-area behavior, landscape rotation, and Taiwan Heavy Auto Drive capped at 140 km/h plus Stuck traffic rendering and touch. Record exact tested head, browser/device, visual viewport and captures or measurements. Keep emulation and native results separate."
  },
  "observations": [
    "New branch; PR #13 base equals merge base 5566be6. The 35-file pinned diff and branch-local Claude.md entries corroborate Claude's two implementation batches. Codex.md at the reviewed head was inherited byte-for-byte from main.",
    "The layout reorders assist and driving controls and sizes gauges against available svh. Held-brake targets seed the replacement loop; sourced UK Ioniq grip behavior and the Nevera event metadata are separated from assumptions. The committed regressions cover brake interlock and stale N e-Shift launch prime.",
    "The nine catalog-only entries gain runnable specs using the MCT or hybrid models where applicable. Both pinned report sets contain the same 83 exact headings. Generated stats diff adds nine entries with no removed or replaced lines."
  ],
  "findings": [
    {
      "priority": "P2",
      "id": "hybrid_axle_tags_do_not_control_traction",
      "paths": [
        "src/tuning/buildSimVehicle.ts:151-159",
        "src/physics/simulator.ts:435-460",
        "src/physics/forces.ts:32-43"
      ],
      "evidence": "Axle tags reach SimHybrid but the driving loop sums motor force before a generic AWD traction clamp without reading the tags. An independent pinned test moved both NSX front motors to rear, preserving ratings and drivetrain inputs. The complete acceleration trace and metrics were exactly identical.",
      "impact": "Independent axle motors and the through-the-road AWD layout cannot determine axle saturation. Fitting launch grip against the resulting trace can absorb the wrong torque distribution.",
      "acceptance": "Represent axle-specific motor force and available axle grip consistently for the new through-the-road hybrids. Demonstrate different behavior for front vs rear deployment in a traction-limited fixture, correct behavior when a powered axle saturates or a motor cuts out, and continued system/battery limits. If an approximation remains for a configuration, disclose its scope and compare timing and trap-speed residuals."
    },
    {
      "priority": "P2",
      "id": "prius_stock_ecvt_uses_fictitious_shift_controls",
      "paths": [
        "src/data/catalog/cars/r14-toyota-prius.ts:125-146",
        "src/views/DriveView.tsx:146",
        "src/views/DriveView.tsx:222-231",
        "src/views/DriveView.tsx:377-392"
      ],
      "sources": [
        "https://www.toyota.com/content/dam/toyota/brochures/pdf/2023/prius_ebrochure.pdf",
        "https://www.motortrend.com/reviews/2023-toyota-prius-limited-awd-first-test-review"
      ],
      "evidence": "The stock 2023 Toyota Prius Limited AWD exposes Manual, shift lights and virtual ratios. Chrome Drive reproduction: select the exact car, set Manual, accelerate, tap Shift up; gear changes 1/6→2/6. The scope is the US power-split e-CVT. The branch already describes the converter-style path and six positions as modeled approximations. Toyota confirms ECVT, 150 hp at 6000 rpm, 139 lb-ft at 4400–5200 rpm, 196 hp system, 83/30 kW motors and 195/50R19. MotorTrend measured this exact AWD Limited at 7.1 s to 60 mph and 15.4 s at 92.1 mph, 3346 lb with 58/42% weight distribution, rather than the FWD comparator currently used for the calibration note.",
      "impact": "Normal stock controls present fictional manual behavior as vehicle equipment, and the FWD fit can conceal AWD launch and trap residuals.",
      "acceptance": "Keep the exact stock car runnable with continuous e-CVT behavior. Gate any unsupported stepped controls and label remaining power-split assumptions at the point of use. Add the exact AWD measured result with timing and as-tested context, cite confirmed Toyota fields, retain unresolved motor reductions/battery configuration as estimates, and compare both acceleration and trap on the documented timing basis."
    },
    {
      "priority": "P3",
      "id": "e63_exact_wagon_benchmark_reachable",
      "paths": [
        "src/data/catalog/cars/r34-mercedes-amg-e-63-s-wagon.ts:42-77",
        "src/data/catalog/cars/r34-mercedes-amg-e-63-s-wagon.ts:89-108"
      ],
      "sources": [
        "https://www.caranddriver.com/reviews/a19056498/2018-mercedes-amg-e63-s-wagon-test-review/"
      ],
      "evidence": "The listed Car and Driver source was accessible to the inspector on 2026-11-28. The 2018 E63 S wagon test reports 3.0 s 0–60, 11.2 s at 126 mph, 4697 lb, and brake-held launch near 3500 rpm. The catalog has zero benchmark rows and the sim's generated rollout result is 11.307 s at about 122.2 mph. Confirm comparability before interpreting the residual. Publication's 180 mph governed manufacturer claim is for the test context, while the model assumes 250 km/h.",
      "impact": "The exact tested wagon is shown as lacking a benchmark, and the new MCT calibration misses an available reference.",
      "acceptance": "Transcribe the exact wagon benchmark with as-tested weight, launch and publication timing evidence. Evaluate the matching-basis residual and separate test-package speed limiter from the stock assumption. Keep unsupported gearbox facts labeled."
    }
  ],
  "catalog_regression": {
    "result": "verified",
    "exact_configurations": 83,
    "catalog_only": 0,
    "failed_runs": 0,
    "stock_quarter_mile_range_s": [
      8.472,
      16.055
    ],
    "method": "Independent Chromium normal Tests → All cars → exact report heading → active radio title → Run test → Skip → Save result. Verified 83 unique matching saved active IDs, stock label, finite positive ET and finite time/speed traces, and zero page errors. Generated report still lists all 83 exact headings.",
    "new_stock_best_launch_brake_release_quarter_mile_s": {
      "2023-toyota-prius-limited-awd-us-liftback-awd-ecvt": 15.612,
      "2022-audi-rs-3-us-sedan-awd-7dct": 11.85,
      "2018-mercedes-amg-e-63-s-wagon-4matic-us-wagon-awd-9mct": 11.554,
      "2020-volvo-v60-t8-polestar-engineered-us-wagon-awd-8at": 13.152,
      "2025-bmw-m5-touring-us-wagon-awd-8at": 11.362,
      "2021-porsche-macan-gts-us-suv-awd-7dct": 12.779,
      "2021-ford-f-150-raptor-supercrew-37-performance-package-us-pickup-4wd-10at": 14.207,
      "2017-acura-nsx-us-coupe-awd-9dct": 11.455,
      "2021-ferrari-sf90-stradale-assetto-fiorano-us-coupe-awd-8dct": 9.738
    }
  },
  "incomplete_work": [
    "Native-device iPad Safari verification and Taiwan Heavy/Stuck rendering remain open.",
    "Nine new configs include bounded estimates. Track car-specific source gaps in generated DATA_GAPS.md, including RS 3 shaft mapping, Macan US axle ratio, Raptor test transfer mode, SF90 gearing and hybrid deployment. Whole-system hybrid Dyno remains outside the verified coverage; the current dyno models the engine only."
  ],
  "owner_dependencies": [
    "Eason controls merging PR #13. A native iPad Safari session or a hardware tester is needed to close the actual toolbar and safe-area check. No owner decision is required to start verified code and provenance follow-ups."
  ],
  "checks": {
    "local_check": "npm run check passed on 1c33f24: 36 files / 1324 tests, typecheck, lint and production build; existing bundle-size warning. git diff --check clean.",
    "ci": "https://github.com/eason-531/Car-performance-simulator/actions/runs/46124845857",
    "additional": "Independent touch layout and stock roster using production build; pinned NSX force-allocation diagnostic compared full traces. No native device and no full primary-source audit of the nine new configurations."
  },
  "execution_policy": [
    "Own the current objective end to end in this work session. Choose a substantial, coherent batch from this handoff and branch backlog. Resolve verified priority findings, inspect the affected flow for related defects and missing edge cases, and continue into the next highest-value unblocked work within the approved branch scope while capacity remains. Complete the work to a usable and verified state. Avoid arbitrary quotas, unrelated changes and stopping after the first fix when relevant work can still be completed safely.",
    "Do all you can within scope and escalate to Eason only for a genuine blocker. Make routine reversible engineering decisions independently and log consequential assumptions. Diagnose setbacks, try reasonable authorized alternatives and advance independent work. When an obstacle still blocks completion or verification, record what remains, what it blocks, what you tried, and the exact input, access, decision or action needed. Flag permissions, consequential product choices and merging to Eason as soon as identified and continue independent work while waiting. Keep recoverable setbacks and ordinary progress in Claude.md and the PR.",
    "Before wrapping up, review the diff, run relevant checks including npm run check when feasible, regenerate affected outputs and verify compatibility and source provenance where applicable. Preserve exact vehicle identities, the 83-car runnable acceptance, existing timing conventions, owner vehicle calibrations and saved settings/results. Record completed work, evidence, checks actually run and remaining blockers in branch-local Claude.md under its existing rules. Keep measured data and assumptions explicit. Reuse the existing PR workflow."
  ]
}
```
