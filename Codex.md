# Purpose: Codex logs code reviews, instructions, and handoff tasks here; Claude executes them.
# Rule 1 (Claude): Treat this file as your active prompt and to-do list.
# Rule 2 (Codex): Write in maximum detail using dense, machine-readable language (human readability is not required).
# Rule 3 (Codex): Clear all previous entries before writing a new handoff to keep the file clean. Exclude content from other branches.
# Rule 4 (Both): Preserve this header block when clearing the file.



```json
{
  "schema": "codex-review-handoff/v1",
  "branch": "claude/determined-planck-qhjicj",
  "reviewed_head": "eb8c295c91dd42497d7122ecab6b7b38587ec442",
  "claude_md_blob": "4b309ac59834068abee93667a771dc5d75695b9b",
  "log_commit": "eb8c295c91dd42497d7122ecab6b7b38587ec442",
  "previous_observed_head": "1b18193e57acfe491fe45e3fd8f979a12243d62a",
  "review_base": "c45b37165376cd0c46baa9111bf6bd902b4079c3",
  "implementation": [
    "b4ca03d2273d3b99d9620a186b9b3104e1636ecd",
    "2bb281ac33c48d34c824bb6daf713b5bf68c7cc0"
  ],
  "pull_request": "https://github.com/eason-531/Car-performance-simulator/pull/9",
  "result": "changes_requested_before_merge",
  "objective": "Bring the single-clutch automated-manual path and provisional Lexus LFA model to a verified state, complete the top-speed correction, and advance the approved playable-hypercar and original catalog backlog where compatible physics and source evidence support it.",
  "owner_directive": {
    "date": "2026-11-26",
    "priority": "Required owner deliverables immediately after the next work item already queued for Claude. Finish that item first, then start EV support as the immediate next task, followed by the Honda CVT. This takes precedence over discretionary hypercar, catalog, and feature backlog. Carry the requirement into the next session or drivetrain branch if needed and keep both items open until verified.",
    "required_ev_catalog_promotions": {
      "r67": "2020 Porsche Taycan Turbo S",
      "r68": "2025 Hyundai Ioniq 5 N",
      "r69": "2021 Tesla Model S Plaid",
      "r70": "2024 Lucid Air Sapphire",
      "r71": "2024 Tesla Model 3 Performance",
      "r72": "2023 Kia EV6 GT",
      "r73": "2022 Rivian R1T Launch Edition"
    },
    "ev_acceptance": [
      "Start with a complete Kia EV6 GT implementation and use it to validate the shared path. Represent the actual motor count, axle assignments and reductions, including the Taycan's two-speed rear axle. Apply per-motor torque and power limits, a shared vehicle output limit on a documented basis, and per-axle grip with weight transfer. Support an EV launch in Live Drive and all timed runners with car-specific launch control and published boost behavior where applicable.",
      "Represent the Ioniq 5 N's N Grin Boost separately from N e-Shift. Default simulated shifts off in Live Drive, with an explicit toggle. Use the documented test mode for benchmark comparisons and label any unknown mode. Offer car-appropriate telemetry, speed-based dyno output and compatible tuning.",
      "Carry the already planned Nevera as the EV hypercar extension when its model is supported. Its inclusion does not replace any of the seven catalog promotions."
    ],
    "required_cvt_catalog_promotion": "r13, 2022 Honda Civic Sport Touring 1.5T hatchback, US-market LL-CVT.",
    "cvt_acceptance": [
      "Implement converter launch, lock-up, bounded continuous ratio control and Honda's full-throttle Step Shift behavior. Use the documented 2.645–0.405 ratio span and 4.81 final drive. Document estimated control targets, ratio-change rates and behavior. Keep the Prius power-split e-CVT in the hybrid scope.",
      "Validate against the exact MotorTrend CVT hatchback test (7.7 s to 60 mph; 15.9 s at 89.8 mph in the quarter mile). Use the supported timing basis and report uncertainty if test details remain unconfirmed."
    ],
    "sources_verified": {
      "ev6_oem_motor_ratings": "https://www.kiamedia.com/us/en/models/ev6/2023",
      "ev6_original_benchmark": "https://www.caranddriver.com/reviews/a42097092/2023-kia-ev6-gt-by-the-numbers/ (3.2 s to 60 mph; 11.6 s at 119 mph; 0.3 s one-foot rollout; 4,772 lb test car)",
      "civic_oem_specs": "https://www.hondainfocenter.com/2022/Civic-Hatchback/Feature-Guide/Civic-Hatchback-Specifications/",
      "civic_oem_step_shift": "https://hondanews.com/en-US/releases/release-20c92b0d934f0bc63982bd3eee0149e9-2022-honda-civic-hatchback-press-kit",
      "civic_original_benchmark": "https://www.motortrend.com/reviews/2022-honda-civic-sport-touring-hatchback-cvt-automatic-first-test-review"
    },
    "definition_of_done": [
      "Both powertrain paths are usable. Each of the eight required existing catalog entries has a playable, correctly routed model through Live Drive, acceleration tests, drag racing, dyno and the applicable tuning flow. Catalog readiness, generated stats and classes, and saved-result behavior reflect working simulations. A placeholder, catalog update, design document or partial EV batch is insufficient.",
      "Verify original tests or owner-approved evidence where available. Where a parameter is unpublished, use a defensible bounded estimate with provenance and sensitivity where it materially affects results. Record measured conditions when published, otherwise leave them unknown. Report per-car benchmark basis and residuals, with a reason for gaps. Avoid fitting away discrepancies with unsupported values.",
      "Work through source gaps and engineering setbacks using authorized sources and alternatives. If a genuine dependency blocks one car or path, advance all other required work, report the verified blocker and precise owner input if any, then return to the remaining item. Keep an item open while its acceptance is unmet; the first playable EV is the start of the batch.",
      "Run npm run check and regenerate stock stats and data gaps. Verify deterministic stock metrics, the two owner cars and prior powertrain behavior, and exercise representative EV/CVT flows in the normal UI. Log implementations, evidence and remaining gaps in Claude.md, and provide draft PR links and verification results to Eason."
    ]
  },
  "observations": [
    "New round-3 Claude.md entry at the pinned head matches both Claude commits and draft PR #9 at the same head. The prior Codex-only commit is the comparison baseline. The incremental diff spans 19 paths.",
    "Legacy IDs now use own Map entries; retired Chiron Sport IDs still resolve and inherited object names stay strings. Chiron Pur Sport uses neutral longitudinal grip and records +10% lateral evidence separately. Generated brake-release 0–100 and quarter mile move from 2.25/8.96 s to 2.67/9.38 s. Veyron SS caveat now matches its roughly 410 km/h drag limit versus the modeled 415 km/h limiter.",
    "AMT has a TCU launch clutch, no idle creep by default, and a torque interruption during shifts. LFA joins the playable original roster (56/73; 17 still catalog-only), keeping nine playable hypercars. Lexus Europe table corroborates ASG ratios and series application of 1.259 and 3.417 via permitted gear speeds. Both owner cars have identical generated rows. Only Pur Sport changes among shared stock rows, and LFA is the sole addition."
  ],
  "findings": [
    {
      "priority": "P2",
      "path": "src/data/catalog/cars/r62-lexus-lfa.ts:50–118,133–157",
      "impact": "The 124 mph short take is marked exact but Car and Driver explicitly tested a prototype without launch control. It used a roughly 3,800 rpm neutral engagement in manual SPORT at fastest shift setting; measured curb 3,583 lb. The separate 125 mph comparison has an original article from the December 2010 issue, with launch control, 3,569 lb, and Bridgestone 265/35ZR20 F and 305/30ZR20 R. It took place in England/Wales; the article does not establish US production delivery spec. The code uses a forum quote dated 2011 and fits its trap using 1,480 kg EU minimum curb plus 75 kg driver. Calibration and exact-benchmark readiness can therefore overstate match quality.",
      "request": "Cite both originals directly, mark the short take equivalent, and establish the comparison car's market/configuration before marking it exact. Update each run's date and test context. C/D documents legacy 3 mph timing before December 2019; note the historical convention and any uncertainty for the specific runs. Keep one-foot and brake release separate and avoid fitting timed splits to an unsupported basis. Separate stock curb and test mass and document sensitivity or provisional calibration against the measured mass and setup.",
      "acceptance": "Garage links and data gaps reflect the original tests and their market, prototype/launch, mass and timing limitations. Exact readiness reflects only supported matching evidence. Residuals and any efficiency fit identify their calibration run, mass convention and assumptions.",
      "sources": [
        "https://www.caranddriver.com/reviews/a15127600/2012-lexus-lfa-instrumented-test/",
        "https://www.caranddriver.com/reviews/comparison-test/a15128593/2011-ferrari-599-hgte-vs-2012-lexus-lfa-comparison-test/",
        "https://www.caranddriver.com/features/a15128578/car-and-driver-magazine-december-2010-issue-table-of-contents/",
        "https://www.caranddriver.com/features/a30085446/acceleration-testing-procedure-change-rollout/"
      ]
    },
    {
      "priority": "P2",
      "path": "src/data/catalog/cars/r62-lexus-lfa.ts:110–118,133–154",
      "impact": "Production LFA launch control is documented at 4,000 rpm in Lexus US owner's manual OM77006U, printed p.174, and Inside the LFA, printed p.36. Launch and brake hold are configured at 4,500 rpm as an estimate, affecting the stock launch scenario.",
      "request": "Use the documented production launch setting for the production launch scenario, or make any distinct stock scenario explicit. Keep the prototype run's 3,800 rpm setup separate. Regenerate and report the change in stock launch and quarter-mile metrics.",
      "acceptance": "The stock production launch basis and evidence are visible in Garage/provenance, 4,000 rpm is represented for the production launch comparison, and the source gap is updated.",
      "sources": [
        "https://www.carmanualsonline.info/lexus-lfa-2012-owner-s-manual-lexus-2012-lfa-owners-manual-om77006u/?srch=clutch",
        "https://www.carmanualsonline.info/lexus-lfa-2012-owner-s-manual-lexus-2012-lfa-inside-the-lfa/?srch=ESP"
      ]
    },
    {
      "priority": "P2",
      "path": "src/physics/dyno.ts:113–161",
      "impact": "The 0.5 km/h scan can miss the first transition to nonpositive force when force recovers before the next sample. Independent synthetic repro: owner-Lexus SimVehicle baseline with limiter off, one 2.0 overall gear, 7,000 rpm cut, 400 Nm flat except a 0 Nm notch centered at scan start +82.25 km/h with 400 Nm shoulders ±0.1 km/h. Net force is +336 N at 122.83, −203 N at 122.88 and +1,562 N at 123.13; the solver returns 258.33 km/h as continuously reachable. This falsifies the stated continuous-positive-force behavior on that input. No stock car regression was observed.",
      "request": "Make the force/gearing reachability claim match the algorithm across short gaps and gear boundaries. If allowing coasting through transient gaps models the intended behavior, document and verify that behavior. Preserve correct rev, drag and limiter classifications.",
      "acceptance": "A regression reproduces a sub-step gap plus recovery, validates the intended reachability rule, and preserves the existing boundary/limiter cases and known stock rows unless a verified correction justifies a change."
    },
    {
      "priority": "P3",
      "path": "src/views/DriveView.tsx:224–229; src/physics/simulator.ts:16–20,151–160,214–272",
      "impact": "At 0.100 s in the LFA's 0.2 s 2→3 shift, the simulator reports coupling locked and −0.344 m/s² despite the modeled torque interruption, so Drive predicates the 'Clutch closed' light as on. The interrupt envelope also ramps at the first 12% and last 20% of the shift, whereas PR text describes full interruption for its entire duration.",
      "request": "Align clutch indication and published shift description with the implemented state and torque envelope, or adjust the model if the chosen semantics require it. Preserve existing converter lock-up and dual-clutch behavior.",
      "acceptance": "The AMT display and explanation are accurate during the torque interruption and after re-engagement, with focused evidence for the mid-shift state and existing-car behavior."
    }
  ],
  "unfinished": [
    "Nine of the targeted 20 playable hypercars and 17 original catalog-only cars remain in scope. The AMT path removes a model blocker for compatible cars, while Enzo, Huayra BC and Utopia still need defensible gearing evidence for their exact variants. Keep unsupported EV/hybrid/MCT/CVT/4WD and gearing cases gated.",
    "LFA high-speed aero remains provisional: Lexus Europe describes an active wing rising at 80 km/h and above depending on mode, while the model uses Cd 0.31 for the retracted wing at all speeds. Expose high-speed CdA and 332 vs 325 km/h uncertainty before attributing the residual to a specific cause. The dossier lists 9,000 rpm maximum/redline; treat a distinct hard fuel cut, idle creep and US curb basis as open unless sourced.",
    "Prior unresolved source queue includes Pur Sport table rpm, Veyron SS rev cut/dimensions/measured run, F1 gearing/timing/rev cut, CCXR and Agera RS gearing, Nissan Z US cut/cap, and production Chiron Sport benchmark and drive modes."
  ],
  "needs": {
    "eason": "No owner input is required for the verified fixes. Eason owns merging draft PR #9. Native iPad Safari touch/keyboard verification remains open if Eason has the device. A market-specific factory curb or active-aero document would resolve remaining LFA assumptions if available."
  },
  "verification": {
    "pinned_diff": "Compared prior handoff commit to the pinned head as an ancestor, checked branch-local implementation and log separately, and correlated the draft PR exactly. git diff --check clean.",
    "ci": "https://github.com/eason-531/Car-performance-simulator/actions/runs/45748843604 (success at reviewed head)",
    "local": "Independent npm run check passed typecheck, lint, 973 tests across 23 files and Vite build. Both generators reproduced checked-in outputs byte for byte. Independently probed narrow force gap and LFA mid-shift state in scratch.",
    "limits": "Claude reported iPad-sized Chromium smoke. Native iPad Safari/WebKit not run. LFA sources targeted to the listed claims. No comprehensive re-audit of the earlier hypercar batch."
  },
  "execution_policy": [
    "Own the current objective end to end in this work session. Use the handoff and current branch backlog to choose a substantial, coherent batch. Resolve verified priority findings, independently inspect the affected flow for closely related defects and missing edge cases, and continue into the next highest-value unblocked work within the approved branch scope while capacity remains. Complete the work to a usable and verified state. Avoid arbitrary quotas, unrelated changes, and stopping after the first fix when more relevant work can be completed safely.",
    "Do all you can within the approved scope, and escalate to Eason only when you hit a genuine blocker. Make routine, reversible engineering decisions independently and log consequential assumptions. Diagnose setbacks, try reasonable authorized alternatives, and keep advancing independent work. If an obstacle still prevents a concrete part of the objective from being completed or verified, record what is pending and surface it in the handoff or review summary with what it blocks, what you already tried, and the exact input, access, decision, or action needed. Flag obstacles that require Eason's intervention, including permissions, consequential product choices, and merging, as soon as they are identified and continue independent work while waiting. Keep recoverable setbacks and ordinary progress in the normal Claude.md and PR records.",
    "Before wrapping up, review the diff, run the relevant checks (including npm run check when feasible), regenerate affected outputs, and verify compatibility and source provenance where applicable. Record completed work, evidence, checks actually run, and remaining blockers in the branch's Claude.md under its existing rules. Keep measured data and assumptions explicit. Reuse the existing PR workflow."
  ]
}
```
