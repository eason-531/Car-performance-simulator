# Purpose: Codex logs code reviews, instructions, and handoff tasks here; Claude executes them.
# Rule 1 (Claude): Treat this file as your active prompt and to-do list.
# Rule 2 (Codex): Write in maximum detail using dense, machine-readable language (human readability is not required).
# Rule 3 (Codex): Clear all previous entries before writing a new handoff to keep the file clean. Exclude content from other branches.
# Rule 4 (Both): Preserve this header block when clearing the file.


```json
{
  "schema": "codex-review-handoff/v1",
  "branch": "claude/determined-planck-qhjicj",
  "reviewed_head": "7571153e3a71b50e57af69e91b74dacb84d544b1",
  "claude_md_blob": "d4c04bdc09e40952cb960f09fa6c0ed6d211d285",
  "log_commit": "7571153e3a71b50e57af69e91b74dacb84d544b1",
  "previous_observed_head": "f6d77a51c044f6fce5ba69612993ff589c6786fe",
  "review_base": "62eca11d46fd273813a82f2504060a3836cb3604",
  "implementation": "c8d734806e9ecdf2f41373b806117e99fc3564c5",
  "related_implementation": "c182f8f8b5e7e09a960ed22e1ef175202f2d31ed",
  "pull_request": "https://github.com/eason-531/Car-performance-simulator/pull/8",
  "result": "changes_requested_before_merge",
  "observations": [
    "Claude-authored log and both implementation commits corroborate draft PR #8 (31 paths relative to its pinned base). The merge at 3da930f has the base tree; the log reset is header-only and excluded from the qualifying entry.",
    "Six playable additions: Veyron 16.4, Chiron, CCX 6MT, Chiron Super Sport, Carrera GT, Chiron Sport. The Sport counts as a distinct production configuration under the documented mass criterion: Bugatti reports approximately −18 kg and a Sport chassis package. The simulator represents the mass difference and does not model its handling package.",
    "Stock output changed only for r44 and the six additions; both owner's cars have identical generated rows, stable IDs, and defaults at the reviewed base and head. The optional DCT creep path defaults to the prior 25 Nm; the Bugattis use 40 Nm. Race/launch model remains DCT/manual; the live gauge scales with reachable speed.",
    "Prior review: r44 C/D exact vs MotorTrend equivalent rows are separate; 155 mph governed publication figure vs 296 km/h uncapped simulation are distinct; unsupported VR30 causation removed. r67 Taycan dates/rollout, r18 Evo publication date and r04 Autocar publisher CDN were changed as requested in the code.",
    "Bugatti Super Sport factory sheet confirms separate 380 and 440 km/h modes; limiter-off simulation is neither the production Top Speed mode nor the prototype record specification. W16 trap deltas remain visible (Veyron +2.9 mph, Sport +4.4, SS +4.1 on displayed benchmark rows)."
  ],
  "findings": [
    {
      "priority": "P2",
      "path": "src/data/catalog/cars/r44-nissan-z.ts",
      "lines": "152,164–169",
      "impact": "The MY2023 model and its provenance extend rated torque through 5,600 rpm, while both cited US MY2023 factory sources specify 350 lb-ft at 1,600–5,200 rpm. This changes the simulated in-gear curve, residuals and stock score. The 2023 Nissan press kit also lists 6,800 rpm maximum engine speed versus the 7,000 rpm simulation hard cut.",
      "request": "Restore the verified MY2023 1,600–5,200 rpm torque band. Evaluate 6,800 rpm as maximum engine speed versus any separately documented hard fuel cut; do not equate maximum speed with measured cut without evidence. Cite the brochure and 2023 press kit, preserve the C/D tire row (Potenza S007 B-Silent 255/40R19 and 275/35R19) and the separate equivalent MotorTrend run. Keep 155 mph as C/D-reported governed speed pending US factory confirmation, and avoid claiming measured or estimated status without explicit support.",
      "acceptance": "Production torque plateau and provenance match MY2023, any remaining hard-cut assumption is explicit, generated r44 and residual differences are reported, exact C/D remains ahead of equivalent MotorTrend, owner rows remain identical.",
      "sources": [
        "https://www.nissanusa.com/content/dam/Nissan/us/vehicle-brochures/2023/2023-nissan-nissan-z-brochure-en.pdf",
        "https://usa.nissannews.com/en-US/releases/2023-nissan-z-press-kit",
        "https://www.caranddriver.com/reviews/a43987884/2023-nissan-z-automatic-by-the-numbers/"
      ]
    },
    {
      "priority": "P2",
      "path": "src/data/catalog/cars/h10-bugatti-chiron-sport.ts",
      "lines": "8–16,58–95,135–136; h02-bugatti-chiron.ts:64–107,143–144",
      "impact": "The 2021 publication tested a 2018 base Chiron retrofitted to Sport specification. Treating it as exact production-MY2021 evidence incorrectly gives sim+benchmark readiness and production calibration certainty. The model identifier's year was inferred from publication rather than production evidence.",
      "request": "Use C/D's full instrumented article. Mark this run equivalent for a production Sport and retain equivalent status for base Chiron, with the 2018 retrofit deviation, 2021 publication, 4,544 lb, Cup 2 BG 285/30ZR20 F and 355/25ZR21 R, launch control used, and 0.2 s rollout. Obtain exact production-year evidence for the catalog identity and follow saved-ID compatibility if any identity correction is needed. Label fits to this run as provisional.",
      "acceptance": "Production Sport still counts on documented mass and playable behavior; no exact readiness based on the retrofit; both Chiron rows make the test context visible and keep 2.4 s / 9.4 s at 158 mph.",
      "sources": [
        "https://www.caranddriver.com/reviews/a35353692/2021-bugatti-chiron-sport-by-the-numbers/",
        "https://newsroom.bugatti.com/en/press-releases/88th-geneva-international-motor-show-2018"
      ]
    },
    {
      "priority": "P2",
      "path": "src/data/catalog/cars/h04-bugatti-chiron-super-sport.ts",
      "lines": "78–104,120–121; src/data/catalog/build.ts:288–303",
      "impact": "Built-in 3,000 rpm launch/hold defaults are 500 rpm above the approximately 2,500 rpm launch C/D describes. Launch fit and reported residuals currently use a different launch setting.",
      "request": "Add published 2,500 rpm to the comparison conditions and use it for the benchmark launch or justify a separate stock setting with evidence. Record Cup 2 BG2 sizes 285/30ZR20 and 355/25ZR21; retain unknown drive mode if unconfirmed. Check the 3.6% seventh estimate separately from the 440 km/h limiter-bound table and preserve published mode/gear-shift distinctions.",
      "acceptance": "Verified tire and launch conditions appear in the benchmark; rerun launch and report before/after 60 mph, ET and trap on the same rollout basis, with any grip-floor or efficiency-bound effects kept explicit.",
      "sources": [
        "https://www.caranddriver.com/reviews/a39429194/2022-bugatti-chiron-super-sport-by-the-numbers/",
        "https://bugatti-newsroom.imgix.net/6673edce31d99cf64fc74087/211122_BU_Chiron%20Super%20Sport_ENG.pdf"
      ]
    },
    {
      "priority": "P3",
      "path": "src/views/GarageView.tsx",
      "lines": "431–437; src/physics/dyno.ts:90–94",
      "impact": "Label is selected solely by presence of a limiter. Golf GTI is modeled at 249 km/h with a 250 cap; GT-R is modeled at 313 with a 315 cap. Both are incorrectly called limiter-capped.",
      "request": "Distinguish an active speed cap from a configured cap above a force/gearing-limited top speed, using the actual binding constraint before display rounding. Preserve an explicitly uncapped label when no cap is modeled.",
      "acceptance": "Cover binding cap (Chiron SS), configured but nonbinding cap (Golf GTI or GT-R) and no cap (Nissan Z); keep the separate limiter and factory/published speed rows."
    },
    {
      "priority": "P3",
      "path": "src/data/catalog/cars/h06-porsche-carrera-gt.ts",
      "lines": "39–70,103",
      "impact": "A verified instrumented comparison is available. The secondary 11.1 s at 133 mph lead does not match the original.",
      "request": "Add the June 2004 C/D run as equivalent to the 2005 German specification unless exact agreement is established: 3.5 s to 60, 11.2 s at 132 mph, 3,146 lb tested, six-speed manual, 605 hp at 8,000 rpm as printed. Verify timing basis before fitting and preserve Porsche DIN stock mass independently.",
      "acceptance": "Publisher original and configuration deviations are retained; timing stays unconfirmed pending proof and the factory claim never serves as a road-test residual.",
      "sources": [
        "https://www.caranddriver.com/reviews/a15132548/porsche-carrera-gt-road-test/"
      ]
    },
    {
      "priority": "P3",
      "path": "src/data/catalog/cars/h01-bugatti-veyron-16-4.ts",
      "lines": "94–112,128–149",
      "impact": "The original C/D specifications corroborate wheelbase and plan dimensions currently estimated; the article does not specify rollout, and EPA N/V versus modeled wheel-speed mismatch remains ~4.7%.",
      "request": "Record C/D as tested at 106.7 in WB, 175.7 in length, 78.7 in width, and height range 45.1–47.4 in; retain a model-height assumption for aero. Add PAX test fitment, retain unconfirmed timing and keep EPA/model validation open until an exact speed-by-gear, axle and rolling-circumference comparison resolves it.",
      "acceptance": "Test dimensions and fitment are sourced separately from modeled values; no implied one-foot timing or blind fit across bases.",
      "sources": [
        "https://www.caranddriver.com/reviews/a15152105/bugatti-veyron-164-road-test/"
      ]
    }
  ],
  "unfinished": [
    "14 more playable additions to reach 20. Agera RS exact gearbox reductions and standard vs 1 MW engine/fuel remain gating; keep blocked while proceeding with source-ready candidates.",
    "Original 18 catalog-only entries remain 18/18 unpromoted: r29/r60 gearing; r34/r62 clutch paths; r61 transfer case; r13 CVT; r67–r73 EV; r14/r35/r36/r65/r66 hybrid. Keep each exact blocker and promote only with the corresponding simulation and tests.",
    "CCX factory page confirms dry mass 1,280 kg, 70 L fuel capacity, dimensions and manual gearing; curb mass, wheelbase, rev limit, fuel grade and an instrumented 6MT run still need evidence. Keep the modeled ~7.5 s to 200 vs factory claim 9.8 s visible as provisional.",
    "Chiron exact reductions, base rev limit, Veyron rev limit/weight distribution and exact Nissan Z US factory limiter remain open."
  ],
  "needs": {
    "eason": "Merge decision after corrections; native iPad Safari touch/keyboard smoke and exact-market source documents if available. No decision is needed on counting the documented Chiron Sport variant.",
    "claude": "Correct the source and binding-constraint findings, regenerate and attach the scoped diff and test evidence, then continue the 20-car target and original backlog. Keep exact vs equivalent test classifications and mass/timing bases explicit."
  },
  "verification": {
    "local": "Pinned head installed with npm ci; npm run check passed (typecheck, lint, 906 tests across 21 files, production build). generate:stats and generate:gaps reproduced the checked-in files byte-for-byte. git diff --check clean.",
    "ci": [
      "https://github.com/eason-531/Car-performance-simulator/actions/runs/45377880919",
      "https://github.com/eason-531/Car-performance-simulator/actions/runs/45377889011"
    ],
    "vercel": "https://vercel.com/eason531/car-performance-simulator/6xLtukfneaFT8mnm2C8iCHHTZBcv",
    "limits": "Chromium iPad-sized smoke was reported by Claude for Garage, Live Drive, Tests, Dyno, Drag, tuning and reload; it was not independently repeated. Native iPad Safari/WebKit remains unverified. Original source verification targeted the listed fields and is not a complete audit of every input or previous catalog row."
  }
}
```
