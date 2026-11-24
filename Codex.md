# Purpose: Codex logs code reviews, instructions, and handoff tasks here; Claude executes them.
# Rule 1 (Claude): Treat this file as your active prompt and to-do list.
# Rule 2 (Codex): Write in maximum detail using dense, machine-readable language (human readability is not required).
# Rule 3 (Codex): Clear all previous entries before writing a new handoff to keep the file clean. Exclude content from other branches.
# Rule 4 (Both): Preserve this header block when clearing the file.

```json
{
  "schema": "codex-review-handoff/v1",
  "branch": "claude/determined-planck-qhjicj",
  "reviewed_head": "d6e2b40723decd871a30104a8896fe7f33123ef0",
  "claude_md_blob": "a1ed3b7503b0785ff1181d2619e761d270fc9d15",
  "implementation": "d40127482d08336f433ba10b422a9973c688234a",
  "log_commit": "d6e2b40723decd871a30104a8896fe7f33123ef0",
  "base": "1d6734ed4ac1c06a614f6c3fc13526ba8346dde0",
  "previous_observed_head": "e1a5fb520ec78d1b2fe766538904fd51c1448404",
  "pull_request": "https://github.com/eason-531/Car-performance-simulator/pull/7",
  "result": "changes_requested_before_merge",
  "verified_changes": [
    "Branch-specific Claude.md entry describes the implementation; Git trailers, draft PR and the actual implementation diff agree. The implementation is 35 files; the PR also includes the Claude log and inherited branch Codex handoff.",
    "GR Corolla Circuit uses the 100.1 mph prototype run marked equivalent; BRZ Limited 6AT adds the exact MotorTrend run with the 3.909 axle preserved and the residual visible; A91-MT Supra now links the original C/D 114 mph run; Z06 adds the matching 128.2 mph run and explains the +5.7 mph modeled trap gap.",
    "Measured sort chooses the quickest exact observation for each metric per car, falling back to equivalent; rows show publication and timing. Source IDs/URLs and references have regression guards. Provisional labels and Turbo S higher-speed splits are present.",
    "SLC-4 moves the B threshold from 39.4 to 36.4. Only Evo FE and Kona N go from C to B. Both owner's cars retain all generated values except the formula identifier, including both timing bases, class, score, and IDs. Vehicle specs, storage, state and physics source trees are unchanged versus PR base."
  ],
  "findings": [
    {
      "priority": "P1",
      "path": "src/data/catalog/cars/r44-nissan-z.ts",
      "lines": "68–100,113–120",
      "impact": "Wrong reference affects displayed 9AT residuals, measured quarter-mile ordering, and grip/efficiency calibration. The linked Mustang Mach 1 comparison is a six-speed manual Z, 4.5 s and 13.0 s @ 111 mph, and does not support the claimed exact 4.0 s / 12.3 s @ 116 mph.",
      "request": "Use the instrumented C/D Z Performance nine-speed automatic test. Record 4.3 s, 12.7 s @ 115 mph, 0.3 s one-foot-rollout deduction, 3,592 lb tested and 91 AKI. Reevaluate bounded calibration against that test, remove the stale no-independent-automatic-test gap, regenerate stock stats and data gaps.",
      "acceptance": "Automatic test links directly and drives exact residuals and measured sort; no unsupported figures remain; updated residuals and any SLC changes are explicit; both owner cars retain timings, scores and classes.",
      "sources": [
        "https://www.caranddriver.com/reviews/comparison-test/a40393375/2023-nissan-z-vs-2021-ford-mustang-mach-1-compared/",
        "https://www.caranddriver.com/reviews/a43987884/2023-nissan-z-automatic-by-the-numbers/"
      ]
    },
    {
      "priority": "P2",
      "path": "src/components/catalog/CarPicker.tsx",
      "lines": "25–34,55–65,79–81",
      "related": [
        "src/main.tsx:7–12",
        "src/__tests__/CarPicker.focus.test.tsx:8–13,33–39"
      ],
      "impact": "React StrictMode development effect replay restores the opener while the modal is still open. JSDOM reproduction with the existing test wrapped in the app's root StrictMode leaves focus on the Lane B button instead of Search. The unchanged release-mode test passes.",
      "request": "Make initial focus and restoration safe under effect replay, and exercise the real StrictMode wrapper in the focus regression. Include backdrop dismissal in the check.",
      "acceptance": "Search owns focus after opening, focus stays inside while open, and Escape, Close, backdrop and selection restore the opener. The StrictMode and existing tests pass; exercise touch/keyboard on WebKit if available."
    },
    {
      "priority": "P3",
      "paths": [
        "src/data/catalog/cars/r18-mitsubishi-lancer-evolution.ts:69–84,110–115",
        "src/data/catalog/cars/r66-ferrari-sf90-stradale.ts:66–81",
        "src/data/catalog/cars/r67-porsche-taycan.ts:67–93",
        "src/data/catalog/cars/r04-toyota-gr-yaris.ts:115–133"
      ],
      "impact": "Primary material is available for values still attributed to aggregators or search summaries or marked unconfirmed. C/D confirms the Evo 4.4/13.3@104 and 3,517 lb test car, and Taycan 2.4/10.5@130. MotorTrend confirms exact Assetto Fiorano 2.1/9.6@145.2, 3,839 lb. Autocar confirms 5.2 s, two people, full tank, 1,283 kg and no launch control.",
      "request": "Point matching rows to originals, replace stale verification notes, record test-car conditions distinctly from stock specifications, and retain unresolved timing/package fields where the source does not verify them.",
      "acceptance": "Reference blocks link directly to the published tests and describe only independently supported fields.",
      "sources": [
        "https://www.caranddriver.com/reviews/a15102392/2015-mitsubishi-lancer-evolution-final-edition-test-review/",
        "https://www.motortrend.com/reviews/2021-ferrari-sf90-stradale-assetto-fiorano-first-test-review",
        "https://www.caranddriver.com/reviews/a30688949/2020-porsche-taycan-turbo-s-testing-acceleration-zero-to-60/",
        "https://www.em.autocar.co.uk/car-review/toyota/gr-yaris-2020-2024"
      ]
    }
  ],
  "remaining": "Confirm original sources for other second-hand measurements; unresolved BRZ converter parameters, Z07/GT500 package aero, Turbo S AWD and held-out 0–130 mph primary source, GR Yaris timing/trim, Hyundai US N DCT gearing and Kona N gearbox code, Octavia/RS 3 axle assignments and Macan GTS axle conflict. CT4-V, ZL1 1LE and E 63 wagon still lack a benchmark.",
  "dependencies": {
    "eason": "No decision needed for fixes. Draft merge remains Eason's decision. A native iPad Safari touch/keyboard check and any outstanding U.S. service or factory sheets would close evidence gaps if available.",
    "claude": "Resolve P1 before merge, add the StrictMode regression, refresh source provenance, and attach corrected residuals and CI evidence."
  },
  "test_evidence": {
    "github_actions": "https://github.com/eason-531/Car-performance-simulator/actions/runs/45323950561",
    "ci_steps": "checkout, npm ci, typecheck, lint, tests and Vite build succeeded",
    "vercel": "success for reviewed SHA",
    "local": "npm run check passed at reviewed SHA: 815 tests in 20 files, typecheck/lint/build; Vite chunk warning 748.32 kB minified. A temporary test wrapper using StrictMode failed initial Search focus (4/5 passed). No test file committed. git diff --check passed.",
    "browser": "Claude reports Chromium checks; native iPad Safari/WebKit not independently exercised."
  },
  "verification_limits": "Primary-source verification was targeted; remaining transcriptions and gear/aero claims were not independently confirmed. Explicitly separate test-car configuration and publication timing from simulator assumptions."
}
```
