# Purpose: Codex logs code reviews, instructions, and handoff tasks here; Claude executes them.
# Rule 1 (Claude): Treat this file as your active prompt and to-do list.
# Rule 2 (Codex): Write in maximum detail using dense, machine-readable language (human readability is not required).
# Rule 3 (Codex): Clear all previous entries before writing a new handoff to keep the file clean. Exclude content from other branches.
# Rule 4 (Both): Preserve this header block when clearing the file.

```json
{
  "schema": "codex-review-handoff/v1",
  "branch": "claude/determined-planck-qhjicj",
  "reviewed_head": "358661b01c0621001fee3aa405a5c3dc4c9117ef",
  "claude_md_blob": "20e1565a60525ca373df8d5f4d5439ca14138478",
  "implementation": "a6da8c52ad514274035ac079f4c4f9b9b0589cec",
  "log_commit": "358661b01c0621001fee3aa405a5c3dc4c9117ef",
  "previous_observed_head": "6e4726a435c6b701868ae1b7cb2640a103008d39",
  "pull_request": "https://github.com/eason-531/Car-performance-simulator/pull/7",
  "merge_commit": "66112e2815cb752392ebfc6baafa951bef88250d",
  "result": "previous_fixes_verified_followup_requested",
  "verified_changes": [
    "Claude author/session trailers, the new Round 2 branch-local log and its implementation diff agree. The head tree is identical to merged PR #7 on main. Round 2 fixed the Nissan Z 9AT reference, StrictMode focus replay and premature backdrop dismissal, and updated four original-source references.",
    "r44 C/D exact 9AT: 4.3 s to 60 mph, 12.7 s at 115 mph, 0.3 s rollout, 3,592 lb tested and 91 AKI. Simulation on rollout basis: 4.308 s, 12.658 s, 112.61 mph. Grip 1.30 to 1.22 with 88% efficiency retained. Generated stock changes are confined to this car, A 55.1 to A 53.3.",
    "Picker delegates initial focus to Search and reclaims it on StrictMode setup replay. Backdrop dismissal waits for click; 7 cases run with and without production entry-point Root StrictMode. Previous modeled owner-car values and classes are identical, with only the formula identifier differing against the PR base.",
    "Evo FE 4.4 s/13.3 s at 104 mph and 3,517 lb verified from original C/D. SF90 Assetto Fiorano 2.1 s/9.6 s at 145.2 mph and 3,839 lb verified from MotorTrend; its published methodology supports rollout. Autocar publisher CDN confirms GR Yaris 5.2 s to 60 mph, two occupants, full tank, 1,283 kg as tested and no launch control. Circuit Pack and timing procedure remain unconfirmed."
  ],
  "findings": [
    {
      "priority": "P2",
      "path": "src/data/catalog/cars/r44-nissan-z.ts",
      "lines": "98–102,114,119–130; src/data/catalog/stockStats.generated.ts:2086 onward",
      "impact": "Catalog reports modeled 296 km/h with no limiter. The exact-trim C/D test lists a governed 155 mph (about 249 km/h), a roughly 47 km/h discrepancy. The newly cited test and the Nissan U.S. brochure also resolve the stale tire fitment and power/torque RPM gaps.",
      "request": "Verify the production US Performance 9AT limiter before substituting it, record the published governed result separately from the simulation, and label any uncapped prediction. Cite Nissan U.S. for production fitment and RPM band, and C/D for test-car tires; close supported gaps and regenerate stats/gaps if inputs change.",
      "acceptance": "Stock display and provenance distinguish governed stock speed from uncapped simulation, cite separate factory and test conditions, and preserve owner-car records. Only explicitly justified model changes and their residuals appear in regenerated data.",
      "sources": [
        "https://www.caranddriver.com/reviews/a43987884/2023-nissan-z-automatic-by-the-numbers/",
        "https://www.nissanusa.com/content/dam/Nissan/us/vehicle-brochures/2023/2023-nissan-nissan-z-brochure-en.pdf"
      ]
    },
    {
      "priority": "P2",
      "path": "src/data/catalog/cars/r44-nissan-z.ts",
      "lines": "76–102,121–123",
      "impact": "The linked MotorTrend 9AT test gives a materially different trap of 107.6 mph. The simulator's 112.61 mph lies between the two published results, so the C/D residual alone cannot establish the reason for the miss.",
      "request": "Record MotorTrend as a separate equivalent preproduction 9AT run: 4.3 s, 12.9 s at 107.6 mph, 3,597 lb at 57/43, 91-octane pump fuel without booster, and the reported knock/low-power warning after initial runs. Keep the C/D exact row as the production calibration reference. Remove or qualify the unsupported causal attribution to power underrating.",
      "acceptance": "Both source-backed runs and timing/conditions are distinguishable; equivalent MotorTrend data never overrides the exact C/D sort value; the trap residual is shown as uncertainty rather than proof of a power cause.",
      "sources": [
        "https://www.caranddriver.com/reviews/a43987884/2023-nissan-z-automatic-by-the-numbers/",
        "https://www.motortrend.com/reviews/2023-nissan-z-performance-first-test-review",
        "https://www.motortrend.com/news/motor-trend-testing"
      ]
    },
    {
      "priority": "P3",
      "paths": [
        "src/data/catalog/cars/r67-porsche-taycan.ts:36–67",
        "src/data/catalog/cars/r18-mitsubishi-lancer-evolution.ts:63–79",
        "src/data/catalog/cars/r04-toyota-gr-yaris.ts:82–87,119–138"
      ],
      "impact": "Taycan row is mislabeled as pre-change/2019 even though the linked story is Jan 29, 2020; the matching original C/D comparison table explicitly lists 0.2 s one-foot rollout. Evo benchmark date tracks model year rather than original 2016 publication. The new GR Yaris source hostname timed out during this inspection while the publisher CDN served the verified article.",
      "request": "For Taycan use the original comparison table for the existing result, set 2020 and rollout-1ft with rolloutS 0.2; keep the 2020 model identity and published elapsed times. Correct Evo benchmark publication year to 2016 without calling its legacy 3 mph procedure a measured one-foot rollout. Prefer a working publisher URL for Autocar, retaining equivalent configuration and unconfirmed timing.",
      "acceptance": "Each benchmark points to a working primary text with accurate publication metadata and timing; Taycan remains catalog-only; no fabricated exact test fitment or changed elapsed values.",
      "sources": [
        "https://www.caranddriver.com/reviews/comparison-test/a30799498/2020-porsche-taycan-turbo-s-vs-2020-tesla-model-s-performance/",
        "https://www.caranddriver.com/reviews/a30688949/2020-porsche-taycan-turbo-s-testing-acceleration-zero-to-60/",
        "https://www.caranddriver.com/features/a30085446/acceleration-testing-procedure-change-rollout/",
        "https://www.caranddriver.com/reviews/a15102392/2015-mitsubishi-lancer-evolution-final-edition-test-review/",
        "https://images.cdn.autocar.co.uk/car-review/toyota/gr-yaris-2020-2024"
      ]
    }
  ],
  "remaining": [
    "Native iPad Safari/WebKit touch and keyboard coverage; both operating modes, search focus, Tab wrap and opener restore without backdrop click-through.",
    "Untouched research: secondary-only benchmarks, BRZ converter, Corvette Z07 and GT500 aero, Turbo S AWD and original 0–130 source, GR Yaris exact package/timing, US Hyundai N gearing, Octavia/RS 3 axle assignments, Macan GTS axle conflict and missing CT4-V/ZL1 1LE/E 63 wagon tests."
  ],
  "dependencies": {
    "eason": "Native iPad Safari run and any available exact-market factory/service documents. No decision required to address the evidence-backed provenance items.",
    "claude": "Apply the source-backed corrections, retain exact versus equivalent distinctions, and attach generated diff, residuals and CI. Record unresolved fields explicitly."
  },
  "test_evidence": {
    "branch_ci": "https://github.com/eason-531/Car-performance-simulator/actions/runs/45352286276",
    "merge_tree_ci": "https://github.com/eason-531/Car-performance-simulator/actions/runs/45355582253",
    "verified": "GitHub job steps passed npm ci, typecheck, lint, tests and Vite build on both exact heads. Vercel reported success. Pinned-tree equality, git diff --check and generated row comparison verified locally.",
    "engineer_reported": "824 tests, 21 files; 14 picker regression cases; Chromium iPad-size dev and production keyboard/mouse/touch pass."
  },
  "verification_limits": "No independent local full-suite or browser execution in this round; native Safari remains unverified. Primary-source checks targeted the changed rows and direct follow-up; unresolved exact-trim factory limits and secondary-source rows require evidence."
}
```
