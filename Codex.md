# Purpose: Codex logs code reviews, instructions, and handoff tasks here; Claude executes them.
# Rule 1 (Claude): Treat this file as your active prompt and to-do list.
# Rule 2 (Codex): Write in maximum detail using dense, machine-readable language (human readability is not required).
# Rule 3 (Codex): Clear all previous entries before writing a new handoff to keep the file clean. Exclude content from other branches.
# Rule 4 (Both): Preserve this header block when clearing the file.



```json
{
  "schema": "codex-review-handoff/v1",
  "branch": "claude/clever-mayer-rgkw0b",
  "reviewed_head": "d4b8a3b90689a5291129f1de5adbd851a779487a",
  "claude_md_blob": "1921372bedf01bc4dc145687d002aa79799025d8",
  "log_commit": "d4b8a3b90689a5291129f1de5adbd851a779487a",
  "related_log_commits": [
    "88f022ee75fbdb312a44daea1e44f93dc00a9397"
  ],
  "previous_observed_head": "77e0892e451f763a3b55d5bafb2cc3d2095c6df5",
  "comparison_base": "85cf2b7627267ba5119ace8af3fcab7c8391b0f6",
  "implementation": [
    "9d525252435607354b28b0cc814b4a8de2d1b0ac",
    "ff1450558587093db8a963b9feba0f11daa39c5e"
  ],
  "pull_request": "https://github.com/eason-531/Car-performance-simulator/pull/12",
  "result": "changes_requested_before_merge",
  "objective": "Complete the Live Drive canvas and traffic follow-up, finish the EV/CVT corrections in PR #12, and make the complete pinned data-gap roster runnable in stock form from the normal simulator UI during the next work session.",
  "observations": [
    "The previous handoff head 77e0892 is an ancestor through the already observed main merge 85cf2b7 (PR #11). The PR #12 branch-local range is 85cf2b7..d4b8a3b, with two implementation commits and two matching substantive Claude.md entries. The 40-file pinned tree diff agrees with the draft PR head and base. PR #9 supplied inherited EV/CVT functionality and the prior review context.",
    "9d52525 replaces the SVG road with a single canvas paint, uses common bumper geometry and adds continuous lateral motion through reversals. The ordinary brake-before-command test passes. Former queue heads and scripted actors return to generated behavior and prior scenario guidance clears in the covered transitions.",
    "ff14505 adds renewable EV boost, EV timed motor telemetry, consistent EV wheel torque, and command-based CVT paddles. It separates the Nevera benchmarks by venue, tires and timing basis and adds a provisional high-speed power fade. Regenerated stock statistics differ only for the Nevera. The branch report only changes gap/provenance text for EV6 and Nevera.",
    "Both pinned data-gap reports contain the same 83 headings, each mapped to exactly one distinct canonical catalog ID. 74 stock quarter-mile engine runs returned finite trace data and positive finite elapsed times. Nine have no simulator spec. This was an engine baseline using the normal Tests runner, with UI acceptance still pending for the full roster."
  ],
  "findings": [
    {
      "priority": "P2",
      "id": "held_brake_interlock_after_vehicle_switch",
      "paths": [
        "src/hooks/useDriveSimulation.ts:112-134",
        "src/hooks/useDriveSimulation.ts:150-168",
        "src/assist/liveDrive.ts:175-182",
        "src/assist/liveDrive.ts:213-224"
      ],
      "evidence": "Pinned jsdom App reproduction, synchronously before the next rAF: hold S on Lexus, select Škoda, click Auto Drive. aria-pressed becomes true and traffic changes Off → Sparse. The new loop copies applied pedal values but starts with default current driver targets. The next step can correct engagement only after the accepted command has changed traffic.",
      "impact": "Changing active vehicle while braking recreates the same-frame interlock bypass left open by the ordinary pedal-event fix.",
      "acceptance": "Preserve current manual pedal targets across any live-loop replacement. Held brake must refuse Auto Drive before each next physics step, and refused commands must preserve traffic and stored cruise state. Exercise car selection with keyboard and pointer targets, fresh brake release, and SET/RES where eligible."
    },
    {
      "priority": "P2",
      "id": "ioniq_stale_launch_prime_bypasses_e_shift",
      "paths": [
        "src/physics/simulator.ts:137-144",
        "src/physics/simulator.ts:530-537",
        "src/physics/simulator.ts:633-656"
      ],
      "evidence": "Pinned executable reproduction: link N Grin Boost, hold brake and full throttle at rest for 1 s until LC primes, enable N e-Shift, then release the brake at full throttle in the next fixed step. The simulator starts >9.9 s of boost and suspends the selected gearbox. setVirtualShift retains the prime; the release branch consumes it without checking current readiness. The cited 2025 Hyundai manual limits LC while N e-Shift operates.",
      "source": "https://ownersmanual.hyundai.com/full_webhelp/NE1N/2025/en_UK/id2362E0V0UY4.html",
      "impact": "The LC interlock can be bypassed through a normal mode change and consumes the linked boost and launch cooldown.",
      "acceptance": "A launch can fire only while currently eligible and on a valid brake release. Enabling N e-Shift must invalidate any existing LC prime and prevent stale firing across rapid toggles, while manual NGB still suspends and resumes N e-Shift and eligible Taycan launches repeat."
    },
    {
      "priority": "P2",
      "id": "ioniq_verified_grip_table_reversed",
      "paths": [
        "src/data/catalog/cars/r68-hyundai-ioniq-5-n.ts:184-189",
        "src/data/catalog/cars/r68-hyundai-ioniq-5-n.ts:222-225"
      ],
      "evidence": "The exact UK 2025 manual cited in the verified row shows MEDIUM links N Grin Boost and does not pre-torque. LOW links neither and HIGH applies both. The catalog reverses both states for MEDIUM and describes the simulator's unboosted comparison as that mode. The page also explicitly sets an eight-second release window and two minutes of cooling.",
      "source": "https://ownersmanual.hyundai.com/full_webhelp/NE1N/2025/en_UK/id2362E0V0UY4.html",
      "impact": "The source-backed setup description is wrong. It can cause users to compare a simulated stock assumption with the wrong factory launch setting.",
      "acceptance": "Correct the verified grip table and distinguish the unboosted stock comparison assumption from factory behavior. Qualify UK evidence on the US catalog entry unless the US configuration is corroborated. Keep unsupported pre-torque, release window, temperature and SOC behavior explicit if still omitted. Preserve the unknown test-day boost use."
    },
    {
      "priority": "P3",
      "id": "nevera_record_source_metadata",
      "paths": [
        "src/data/catalog/cars/h26-rimac-nevera.ts:111-136"
      ],
      "evidence": "Rimac's other official Papenburg account gives the event as 2023-04-30. The press release prints the two official standing-mile results as 20.62/20.59 s; the blanket agreement within 0.02 s overstates concordance. The two records still support the separate benchmark setup.",
      "sources": [
        "https://www.rimac-automobili.com/bendingphysics/episode-1.php",
        "https://www.rimac-newsroom.com/press-releases/rimac-automobili/rimac-nevera-sets-23-performance-records-in-a-single-day"
      ],
      "impact": "The timing and date annotation overstates the source and confuses event and publication dates.",
      "acceptance": "Keep event and publication dates distinct. Attribute figures to the exact timing system and source. Keep the fitted power fade provisional and the 2021 trap residual visible."
    }
  ],
  "data_gaps_playability_handoff": {
    "type": "one_time_eason_priority",
    "deadline": "End of Claude's next work session",
    "reviewed_report": "https://github.com/eason-531/Car-performance-simulator/blob/d4b8a3b90689a5291129f1de5adbd851a779487a/docs/DATA_GAPS.md",
    "main_roster_baseline": "https://github.com/eason-531/Car-performance-simulator/blob/85cf2b7627267ba5119ace8af3fcab7c8391b0f6/docs/DATA_GAPS.md",
    "scope": "Union of the exact year, trim and configuration headings in both pinned reports, including catalog-only and already-playable vehicles. At this head the sets are identical: 9 catalog-only plus 74 playable on estimates, 83 distinct configurations. Resolve headings against canonical catalog IDs and preserve the main roster baseline.",
    "baseline_catalog_only_ids": [
      "2023-toyota-prius-limited-awd-us-liftback-awd-ecvt",
      "2022-audi-rs-3-us-sedan-awd-7dct",
      "2018-mercedes-amg-e-63-s-wagon-4matic-us-wagon-awd-9mct",
      "2020-volvo-v60-t8-polestar-engineered-us-wagon-awd-8at",
      "2025-bmw-m5-touring-us-wagon-awd-8at",
      "2021-porsche-macan-gts-us-suv-awd-7dct",
      "2021-ford-f-150-raptor-supercrew-37-performance-package-us-pickup-4wd-10at",
      "2017-acura-nsx-us-coupe-awd-9dct",
      "2021-ferrari-sf90-stradale-assetto-fiorano-us-coupe-awd-8dct"
    ],
    "acceptance": [
      "Every in-scope exact configuration is visible and selectable through the normal simulator car picker and completes its own stock performance run. Removing a report row, hiding a vehicle, pointing to another trim or adding a duplicate readiness badge leaves that configuration unfulfilled.",
      "Verify each configuration through the usual stock simulator path with per-car evidence: exact catalog identity, picker selection, completed run and finite results (e.g. quarter-mile elapsed time plus finite trace values). Acceptance requires zero in-scope catalog-only configurations and zero failed or non-finite runs.",
      "Use the appropriate powertrain model per configuration, including the required hybrid deployment, MCT launch clutch and 4WD behavior. Keep measured inputs separate from estimates under the existing provenance rules. If a ratio or parameter remains disputed, show the modeled assumption explicitly with its evidence and uncertainty.",
      "Regenerate docs/DATA_GAPS.md and affected stock data from the catalog. Continue to list unverified values. For any incomplete configuration, record its exact identity, failure or blocker, attempted recovery and what would unblock it."
    ]
  },
  "unfinished": [
    "Native iPad Safari acceptance for the owner's screenshot scenario is open. In the PR preview, verify Taiwan Heavy with Auto Drive capped at 140 km/h and Stuck, gap-line placement, car/blinker coherence, lane reversal and touch control reachability. The 1024×768 and 1133×744 layouts reportedly still scroll.",
    "Track unresolved exact model inputs for Taycan, Nevera, Ioniq and EV6 and keep model-vs-benchmark residuals and source confidence visible. Launch Lab and 3D Highway remain later milestones."
  ],
  "needs": {
    "from_eason": "Eason owns the PR #12 merge decision after verification. If Claude has no native iPad Safari hardware, Eason can confirm the preview in the reported device scenario. The verified software corrections and bounded, labeled engineering estimates can proceed independently. Escalate only genuinely blocking configuration evidence, access, or consequential product decisions, with the exact request.",
    "from_others": "Where a primary specification remains blocked, record the exact missing input and continue unblocked configurations and transparent provisional modeling within branch scope."
  },
  "verification": {
    "pinned_ci": "https://github.com/eason-531/Car-performance-simulator/actions/runs/45951691287/job/140348774328",
    "ci_result": "GitHub Actions check job passed: npm ci, typecheck, lint, npm test and Vite build. Vercel status succeeded at the reviewed head.",
    "independent": [
      "Detached d4b8a3b: npm ci and npm run check passed, including 1,206 tests across 34 files and the production build (existing chunk-size warning). git diff --check passed.",
      "npm run generate:stats and npm run generate:gaps passed and regenerated outputs equal the pinned tree.",
      "Temporary jsdom and fixed-step fixtures reproduced the two P2 runtime findings. The catalog fixture joined the two pinned reports to 83 unique IDs and checked finite results for all 74 stock brake-release quarter-mile engine runs."
    ],
    "limits": [
      "Native iPad Safari and hardware touch were unavailable. Canvas pixel samples and iPad-sized Chromium emulation are recorded by Claude. No full UI picker pass was performed for the 83 configurations.",
      "Reviewed the cited Hyundai and Rimac original pages for the stated findings. Magazine source fields and all remaining factory specifications were not independently re-transcribed during this inspection."
    ]
  },
  "execution_policy": [
    "Own the current objective end to end in this work session. Use the handoff and current branch backlog to choose a substantial, coherent batch. Resolve verified priority findings, independently inspect the affected flow for closely related defects and missing edge cases, and continue into the next highest-value unblocked work within the approved branch scope while capacity remains. Complete the work to a usable and verified state. Avoid arbitrary quotas, unrelated changes, and stopping after the first fix when more relevant work can be completed safely.",
    "Do all you can within the approved scope, and escalate to Eason only when you hit a genuine blocker. Make routine, reversible engineering decisions independently and log consequential assumptions. Diagnose setbacks, try reasonable authorized alternatives, and keep advancing independent work. If an obstacle still prevents a concrete part of the objective from being completed or verified, record what is pending and surface it in the handoff or review summary with what it blocks, what you already tried, and the exact input, access, decision, or action needed. Flag obstacles that require Eason's intervention, including permissions, consequential product choices, and merging, as soon as they are identified and continue independent work while waiting. Keep recoverable setbacks and ordinary progress in the normal Claude.md and PR records.",
    "Before wrapping up, review the diff, run the relevant checks (including npm run check when feasible), regenerate affected outputs, and verify compatibility and source provenance where applicable. Record completed work, evidence, checks actually run, and remaining blockers in the branch's Claude.md under its existing rules. Keep measured data and assumptions explicit. Reuse the existing PR workflow."
  ]
}
```
