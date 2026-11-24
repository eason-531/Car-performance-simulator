# Purpose: Claude logs changes made here; Codex reads this file as a reference before reviewing the branch.
# Rule 1 (Codex): Inspect this file before reviewing the codebase.
# Rule 2 (Claude): Document changes in maximum detail using dense, machine-readable language (human readability is not required).
# Rule 3 (Claude): Clear this file upon creating a new branch. Exclude changes from other branches.
# Rule 4 (Both): Preserve this header block when clearing the file.

```yaml
schema: claude-change-log/v1
branch: claude/determined-planck-qhjicj
base: origin/main 62eca11 (Codex.md hypercar handoff) + merge of origin branch tip f6d77a5 (Codex review of 358661b) → 3da930f (tree == main); Claude.md cleared → 188749b
handoffs_executed:
  - f6d77a5 Codex review of 358661b (result previous_fixes_verified_followup_requested): P2 r44 limiter, P2 r44 MotorTrend run, P3 r67/r18/r04 metadata
  - main 62eca11 Codex.md "Active handoff — 20+ playable hypercars and the existing catalog backlog": batch 1 delivered; backlog (original 18) not yet promoted
source_access_this_session:
  reachable_direct: [bugatti-newsroom.imgix.net PDFs, newsroom.bugatti.com, koenigsegg.com, newsroom.porsche.com, ausmotive.com mirror, autonocion.com EPA mirror (36-byte prefix before %PDF stripped locally)]
  refused: [www.caranddriver.com (fetch tool host refusal; browser-UA retry not attempted after a permission denial), manualshelf.com (HTTP 520)]
  rule_applied: C/D numbers used only where Codex verified them in a handoff; search summaries used only as leads, never as verified/reported inputs.

commits:
  - 188749b: Claude.md reset (header only)
  - c182f8f: Codex 358661b follow-ups (r44, r67, r18, r04, top-speed labelling)
  - <this commit>: hypercar infrastructure + batch 1 (6 playable) + creep-torque option + speed dial + docs

codex_358661b_followups:
  P2_r44_limiter:
    file: src/data/catalog/cars/r44-nissan-z.ts
    sim.speedLimiterKmh: null (unchanged; production US limiter not confirmed by a reachable Nissan document → not substituted)
    benchmarks.cd-at.results: +topSpeedMph 155, +topSpeedNote "governed limit, Car and Driver estimate; not measured and not confirmed by a Nissan US document"
    benchmarks.cd-at.conditions.tires: "Bridgestone Potenza S007, 255/40R-19 F / 275/35R-19 R (test car, as listed by Car and Driver)"  # value per Codex statement that C/D lists test-car tires; S007 OE fitment corroborated by Hagerty/spec-sheet leads; VERIFY
    provenance+: {Speed limiter: "None modelled (uncapped prediction)", estimated}
    dataGaps: -["Power/torque rpm","Tire size","MotorTrend ... (not transcribed)"] +["Production speed limiter (C/D governed 155 mph estimate; no Nissan US document; none modelled)"]
    types.PublishedResults +topSpeedNote?: string; compare.uncomparedResults appends "(note)" → GarageView "Also published: Top speed 155 mph (governed limit, …)"
    GarageView.SimSpecs +row "Simulated top speed": `${stock.topSpeedKmh} km/h · capped by the modelled limiter | uncapped gearing/drag prediction, not a published or governed figure` (all playable cars; display only)
    sources+: src-nissan-brochure https://www.nissanusa.com/content/dam/Nissan/us/vehicle-brochures/2023/2023-nissan-nissan-z-brochure-en.pdf (manufacturer, 2023); src-mt-method https://www.motortrend.com/news/motor-trend-testing
    inputs_changed: torque rpm band [1600,5200]→[1600,5600] (Nissan US/press-kit 350 lb-ft @ 1,600–5,600; status estimated→reported, retrieved via search summaries → VERIFY); tire label 'Performance fitment (assumed)'→'Performance 19-in fitment (Nissan US)'; tire provenance estimated→reported
    refit: grip 1.22 (unchanged, BENCH=Car and Driver, eff fixed 0.88) ; stats: rollout 0–60 4.308→4.30, ¼ 12.658→12.64, trap 112.61→112.9 mph; score 53.3→53.6 (A, unchanged); topSpeedKmh 296 (uncapped, labelled)
  P2_r44_motortrend:
    benchmarks+: {id mt-first-test, sourceId test, publication MotorTrend, timing rollout-1ft, results {zeroTo60MphS 4.3, quarterMileS 12.9, quarterMileTrapMph 107.6}, conditions {testMass "3,597 lb as tested, 57/43 front/rear", fuel "91-octane pump fuel, no octane booster", other ["Knock / low-power warning reported after the initial runs"]}, match equivalent, deviation "Preproduction Performance 9AT; knock/low-power warning"}
    date: omitted (publication date not confirmed here)
    sort: exact C/D row stays first (measuredResult prefers exact); verified by existing measured-sort tests
    provenance.efficiency: causal "VR30 exceeds rating" wording removed → "traps bracket the model (115 C/D above, 107.6 MT below); residual is uncertainty; no cause attributed"
    residuals_after (rollout basis): C/D 4.3/4.30, 12.7/12.64, 115/112.9 ; MT 4.3/4.30, 12.9/12.64, 107.6/112.9
  P3_r67_taycan: sources+ src-cd-cmp (C/D comparison a30799498, 2020); benchmark.cd sourceId test→src-cd-cmp, timing unconfirmed→rollout-1ft, results+rolloutS 0.2, date 2019→2020, times unchanged (2.4/10.5/130); still catalog-only
  P3_r18_evo: benchmark.cd date 2015→2016; timing stays unconfirmed; timingNote cites "legacy (pre-late-2019) procedure, described by Codex as a 3 mph procedure; not a measured 1-ft rollout" (mechanism not asserted)
  P3_r04_gr_yaris: src-autocar url www.em.autocar.co.uk → images.cdn.autocar.co.uk/car-review/toyota/gr-yaris-2020-2024; equivalent + timing unconfirmed retained

hypercar_infrastructure:
  types.ts: Market +'EU' (label Europe); UsageTag +'Hypercar'; CatalogEntry +extension?: {set:'Hypercars'; order:number} (order = Codex candidate-roster number); roster doc "undefined for owner cars and extension sets"
  cars/index.ts: imports h01,h02,h03,h04,h06,h10 appended after r73 (owner cars first, roster 1–73, then extension in order)
  CatalogBrowser: quick chip "Hypercars" (rendered only when FACETS.usage has 'Hypercar') toggles filters.usage 'Hypercar'; usage facet also lists it
  catalog.test.ts:
    - length == 75 + extension.length; roster == 1..73; each entry exactly one of {owner, roster, extension}
    - new test: extension ≥6, unique ascending orders, set 'Hypercars', section 'Hypercars', usage ∋ 'Hypercar', sim present, verified 'Peak power' provenance; Veyron 16.4 + base Chiron (trim Coupé) + ≥1 Koenigsegg present; no non-extension entry carries 'Hypercar'
  physics/dyno.theoreticalTopSpeedKmh: search 20..400 → 20..500 km/h (Chiron SS limiter-off 437 km/h was clipped at 400); existing cars unaffected (none reached 400)
  lib/speedDial.ts (+test): Live Drive speedometer {max,step} = 280/40 when vmax+20 ≤ 280, else ceil((vmax+20)/step)·step with step 40 (≤360) / 60 (>360). Owner cars (230/250 limited) keep 280. Cars with vmax >260 km/h now get a longer dial (e.g. Nissan Z 296 → 320, Chiron SS 380 → 420, CCX 387 → 420)
  creep torque: LaunchClutchSpec +creepTorqueNm? (catalog builder passes it only when set); SimLaunchClutch +creepTorqueNm (default DEFAULT_CREEP_TORQUE_NM=25 in physics/constants); simulator creep clutch torque min(25, slip·2) → min(lc.creepTorqueNm, slip·2). Default 25 ⇒ every existing car incl. owner Škoda DSG identical. Bugattis set 40 (Veyron failed "creeps forward off the brake": 1.8 km/h after 4 s with 25 Nm). Idle creep only; no effect on launches/stats.

hypercars_batch1:  # all S+ (SLC-4 unchanged); all on existing DCT/manual paths; no new physics path
  - id: 2008-bugatti-veyron-16-4-us-coupe-awd-7dct
    file: h01-bugatti-veyron-16-4.ts ; order 1 ; market US ; origin France ; usage [Hypercar, Grand Tourer]
    verified: 736 kW/1,001 PS @6000 (Bugatti final-Veyron release PDF); 1,250 Nm @2200–5500 (Bugatti Targa Florio release + EPA); ratios 3.176/2.263/1.667/1.290/1.057/0.878/0.795 + axle 2.585 (EPA 2014 CSI test group EBGTV08.0V16, sect.12 p.2, trans AD71C001 L7 4WD, N/V 24.85; same code/N/V for coupé, Grand Sport, Super Sport; test dates 2005 carried over); tires PAX 265-680 ZR500A F / 365-710 ZR540A R (EPA); idle 840 (EPA); limiter 375 km/h (Bugatti: >375 km/h needs second key; 253 mph claimed)
    reported: curb 4,512 lb = 2,047 kg (EPA MY2014 carline row, applied to 2008 via carried-over test group)
    estimated: redline/limit 6400/6500; dims 4462×1998×1204, WB 2710 (common figures, not fetched); 44 % front; AWD front share 0–0.5; CdA 0.684 m² from EPA target C 0.0185 lbf/mph² @ρ1.204 → split Cd 0.339 × A 2.02 (0.84·W·H); creep 40 Nm
    tire dims encoded: F {265, 33.96 %, 19.685 in}, R {365, 23.29 %, 21.26 in}
    caveat: averaged AWD radius 0.3371 m vs EPA-N/V radius 0.3530 m → modelled road speed per rpm ≈4.7 % low every gear (EPA ratios applied as filed, effective axle applied once)
    benchmark: C/D 2008 exact, timing unconfirmed (legacy procedure), 2.5 s / 10.1 s @ 142 mph, 4,486 lb (values from Codex handoff; 2006 C/D estimates 2.9/10.8@140 listed as reference, not used)
    calibration: grip 1.00 = bounded not basis-fitted (BR basis allows ≤1.03, RO basis needs floor 1.00, mid-basis convention → 1.00; AWD median 1.11 would give 2.27 BR / 2.15 RO); eff fit wanted <0.80 → held 0.84 (lowest accepted AWD value: r26 0.844, r59 0.843)
  - id: 2017-bugatti-chiron-eu-coupe-awd-7dct
    file: h02-bugatti-chiron.ts ; order 2 ; market EU ; exports CHIRON_REDUCTIONS
    verified (Bugatti Chiron tech-spec PDF): 1,103 kW/1,500 hp @6700; 1,600 Nm @2000–6000; 1,995 kg DIN empty; 4544×2038×1212, WB 2711; tires 285/30 ZR20 F, 355/25 ZR21 R; limiter 380 (EB/Autobahn/Handling), 420 Top Speed (documented, not modelled); Cd 0.40 EB (0.39 Autobahn, 0.41 Handling, 0.36 Top Speed; EB modelled); speed-per-gear at 6,700 rpm 90/150/200/260/320/390/420
    derived (estimated): effective overall reductions = 6700·2π·0.33705/(60·v) → 9.459/5.676/4.257/3.274/2.660/2.183/2.027, finalDrive 1.000 placeholder; r = mean of 0.97·unloaded F 0.32932 / R 0.34479 (simulator's own AWD radius ⇒ in-sim gear speeds reproduce the table); rounding ±5.6 % 1st, ≤±1.6 % from 3rd; second rpm/speed point: Super Sport table at its 7,100 rpm ceiling → 95/159/212/276/339/413 vs listed 100/160/210/280/340/415 (gears 2–6 within rounding); 7th limiter-bound (≥ this tall)
    estimated: redline 6700 / limit 6800 (SS release "+300 rpm" to 7,100); area 2.08 m² (0.84·W·H); 43 % front; idle 800; AWD 0–0.5; creep 40 Nm
    benchmark: C/D Chiron Sport as EQUIVALENT (deviation: −18 kg, Sport chassis tune) → readiness 'sim' (no exact test)
    calibration: transferred from Chiron Sport (grip 1.00, eff 0.84)
  - id: 2006-koenigsegg-ccx-eu-coupe-rwd-6mt
    file: h03-koenigsegg-ccx.ts ; order 3 ; market EU (market-neutral factory sheet) ; origin Sweden ; trim Coupé ; bodyLabel Targa coupé ; modelPath MT
    verified (koenigsegg.com/technical-specifications-ccx): 806 bhp @7000; 920 Nm @5500; 4,700 cc twin Rotrex centrifugal SC, 1.4 bar; ratios 2.875/1.773/1.267/1.000/0.833/0.711; final 3.364; Cd 0.32; A 1.867 m²; 45:55; tires 255/35-19 F, 335/30-20 R; 4293×1996×1120; dry 1,280 kg; torque-sensitive LSD; dual-plate 240 mm clutch
    factory claims (notes/factory only): 0–100 3.2 s, 0–200 9.8 s, 395+ km/h
    estimated: curb 1,360 kg (dry + ≈80 kg fuel/fluids); WB 2,660; redline/limit 7,200; idle 900; lowEndFraction 0.55; grip 1.30 (RWD median); eff 0.88 builder default
    caveat (simCaveats): sim 0–100 ≈3.18 s BR (claim 3.2) but 0–200 ≈7.53 s vs 9.8 s claim — NOT fitted to claims; flagged
  - id: 2022-bugatti-chiron-super-sport-us-coupe-awd-7dct
    file: h04-bugatti-chiron-super-sport.ts ; order 4 ; market US
    verified (Bugatti SS sheet + "Shaped by speed" release): 1,177 kW/1,600 hp @7050–7100; 1,600 Nm @2250–7000; 7th 3.6 % longer than Chiron; 6→7 at 403 km/h; limiter 380 / 440 Top Speed; Cd 0.38 EB (0.39/0.41/0.35); tires as Chiron ("BG2")
    reported: curb 1,972 kg (1,995 DIN − 23 kg stated reduction); rev limit 7,100 (release: +300 rpm, plateau to 7,100); dims length 4,733, width 2,183 incl. mirrors (body width 2,038 from Chiron sheet)
    derived: gears 1–6 = CHIRON_REDUCTIONS; 7th = 2.027/1.036 = 1.957 (461 km/h @7100 > 440 limit; consistent)
    benchmark: C/D 2022 exact, rollout-1ft, 0.2 s rollout, 2.2 s / 9.1 s @ 161 mph, 4,587 lb (Codex handoff values)
    calibration: grip 1.05 (fit, eff fixed 0.84); eff fit wanted <0.80 → held 0.84
  - id: 2005-porsche-carrera-gt-de-convertible-rwd-6mt
    file: h06-porsche-carrera-gt.ts ; order 6 ; market DE ; chassisCode 980 ; modelPath MT
    verified (Porsche archive PDF + MY05 table mirror): 450 kW/612 PS @8000; 590 Nm @5750; max engine speed 8,400; ratios 3.20/1.87/1.36/1.07/0.90/0.75; final 4.44; tires 265/35 ZR19 F, 335/30 ZR20 R; 1,380 kg DIN unladen; 4613×1921×1166, WB 2730; Cd 0.39; fuel 98 RON
    factory claims: 0–100 3.9, 0–160 6.9, 0–200 9.9, standing km 20.0, 330 km/h
    estimated: 42 % front; idle 900; area 1.88 (builder 0.84·W·H); grip 1.30 RWD median; eff 0.88 default
    caveat: sim 0–100 ≈3.35 s BR vs 3.9 s claim (0–200 9.76 vs 9.9) — NOT fitted; C/D 2004 test known only via aggregators → VERIFY to enable a fit
  - id: 2021-bugatti-chiron-sport-us-coupe-awd-7dct
    file: h10-bugatti-chiron-sport.ts ; order 10 ; market US ; model year = C/D test year (VERIFY)
    verified (Bugatti Chiron Sport sheet): as Chiron + curb 1,977 kg (sheet: −18 kg; DIN value stays 1,995 as not homologated as variant); speed-per-gear table identical to Chiron
    benchmark: C/D 2021 exact, rollout-1ft, 0.2 s, 2.4 s / 9.4 s @ 158 mph, 4,544 lb (Codex handoff values)
    calibration: grip fit → 1.00 floor (sim stays ≈0.06 s quick); eff fit wanted <0.80 → held 0.84
    count_note: differs from base Chiron by mass only (−18 kg) + chassis tune; counted below as a separate configuration only if Codex accepts it as "meaningful"

playable_hypercar_count: 6 (5 if Chiron Sport is not accepted as a meaningful variant). Target ≥20 → 14–15 remaining.
blocked_this_batch:
  - Koenigsegg Agera RS (candidate 5): OEM page has no gear ratios; engine block 865 kW (1,160 hp) @7800, redline 8250, 1,280 Nm @4100 vs Performance block 960 hp @7100, redline 7500, 1,100 Nm @4000; "7-speed paddle-shift with auto shift mode"; dims 4293×2050×1120; A 1.873 m²; 44:56; tires 265/35-19 F, 345/30-20 R (Cup 2 / optional Super Sport). Not added to the catalog (no playable model without ratios).
original_18_catalog_only: none promoted in this batch; per-ID blockers unchanged (see docs/DATA_GAPS.md "Catalog-only cars (18)"). Next tracks: r29/r60 gearing evidence; r34 MCT, r62 ASG; r61 transfer case, r13 CVT; EV r67–r73; hybrid r14/r35/r36/r65/r66.

residuals:  # published / simulated; basis per publication timing (mid = mean of BR and RO for unconfirmed)
  r44 Nissan Z C/D (exact, RO): 0-60 4.3/4.30 ; ¼ 12.7/12.64 ; trap 115/112.9
  r44 Nissan Z MotorTrend (equivalent, RO): 0-60 4.3/4.30 ; ¼ 12.9/12.64 ; trap 107.6/112.9
  h01 Veyron C/D 2008 (exact, unconfirmed; BR | RO | mid): 0-60 2.5/2.59|2.35|2.47 ; ¼ 10.1/10.14|9.89|10.02 ; trap 142/144.9
  h10 Chiron Sport C/D (exact, RO): 0-60 2.4/2.34 ; ¼ 9.4/9.22 ; trap 158/162.4
  h02 Chiron (C/D Sport, equivalent, RO): 0-60 2.4/2.34 ; ¼ 9.4/9.23 ; trap 158/162.1
  h04 Chiron Super Sport C/D (exact, RO): 0-60 2.2/2.20 ; ¼ 9.1/9.03 ; trap 161/165.1
  pattern: all three W16 traps +3…+4.4 mph at eff 0.84 (fits wanted <0.80); C/D curb-as-tested is 9–109 kg above the sim's factory curb and the sim adds only a 75 kg driver; not attributed
generated:
  stockStats.generated.ts: +6 entries (veyron S+ 105.8 vmax 375; chiron S+ 124.6 / 380; ccx S+ 106.0 / 387; chiron-ss S+ 129.7 / 380; carrera-gt S+ 88.2 / 327; chiron-sport S+ 125.0 / 380); 0 lines removed vs c182f8f (no existing or owner car changed); r44 change is in c182f8f
  docs/DATA_GAPS.md: regenerated (playable section +6 hypercars; r44/r67/r18/r04 source lines)
  README: hypercar paragraph + count
tests: npm run check → typecheck, lint, 906 tests / 21 files, build ✓ (was 824 before this branch: +catalog per-car suites for 6 cars, +2 catalog invariants, +speedDial)
app_smoke (Chromium 1194×834 touch, vite preview of the checked build; console errors: none):
  garage: Hypercars chip → 6 rows (S+, readiness: Chiron sim; Sport/SS/Veyron sim+benchmark; CCX/CGT sim); details show "Simulated top speed 380 km/h · capped by the modelled limiter" (Chiron SS), "375 …" (Veyron), Nissan Z "296 km/h · uncapped …" + "Also published: Top speed 155 mph (governed limit, …)"
  live_drive: Chiron SS dial 0–420/60, 8 s WOT → 240 km/h, 4th, 0–100 2.61 s, 0–200 5.84 s on the live timer; CCX dial 420, 6 s → 164 km/h; Carrera GT dial 360, 6 s → 145 km/h
  tests: Chiron SS 0–100 2.46 s (factory 2.4, +0.06), 0–200 5.69, ¼ 9.20 @ 265.7 km/h; Save result ✓
  tuning: Chiron SS limiter toggle "Factory limiter at 380 km/h" → top speed 380 → 437 km/h; semi-slick compound → 0–100 2.46 → 1.91 s
  drag: lane A Chiron SS current tune vs lane B Chiron SS Stock → 8.712 s vs 9.195 s (tuned wins); "Save both runs" ✓; CCX vs Veyron stock 10.285 @238.2 vs 10.136 @233.2 km/h
  reload: lanes persisted (CCX | Veyron); Results lists the saved Chiron SS runs
  dyno: Chiron SS (stock + modified) 1,600 PS @7,050 / 1,600 Nm; CCX 817 PS @7,000 / 920 Nm, 1.40 bar; Carrera GT 612 PS @8,000 / 590 Nm @5,750; pull plays
  not_run: native iPad Safari/WebKit
owner_cars: ids, defaults, calibration, generated stats unchanged (0 removed lines); default creep 25 Nm preserved for the Škoda DSG; speed dial stays 280 km/h for both.

codex_verification_requests:  # exact fields + candidate sources
  - r44 Nissan Z: (a) US production speed limiter (Nissan US brochure / owner's manual); (b) torque rpm band 1,600–5,600 in the Nissan US brochure p.? ; (c) C/D test-car tire line (a43987884) S007 sizes.
  - h01 Veyron: (a) C/D 2008 timing procedure (to permit a basis-specific grip fit); (b) rev limit/redline (owner's manual mirror manualshelf, or Bugatti press kit 2005); (c) L/W/H/WB; (d) speed-per-gear table from the period spec scan; (e) weight distribution.
  - h02/h10/h04 Chiron family: (a) individual gear ratios + axle (any Bugatti/Ricardo or homologation doc) to replace effective reductions; (b) base Chiron rev limit (6,700 vs 6,800); (c) C/D test model years, drive modes and tires for Sport (a35105452) and SS (a39429194); (d) whether Chiron Sport (−18 kg) counts as a meaningful variant toward 20.
  - h03 CCX: (a) curb mass basis (factory curb vs dry); (b) wheelbase; (c) rev limit; (d) any instrumented 6MT test; (e) fuel grade for 806 bhp.
  - h06 Carrera GT: (a) Car and Driver 2004 instrumented result (lead: 3.5 s 0–60, 11.1 s @ 133 mph — aggregator only) with timing basis; (b) weight distribution; (c) US 605 hp / curb.
  - Agera RS: gear ratios + final drive and which engine block (standard vs 1 MW) is the production car; clutch/gearbox type.
next_batches_plan: CC8S, CCR, CCXR (Koenigsegg manual tables), Chiron Pur Sport (shorter gearing per Bugatti), Veyron Super Sport / Grand Sport Vitesse (EPA AD71C001 shared; 1,200 hp @6400, 1,500 Nm @3000–5000 in the same EPA filing), Divo, Chiron SS 300+, EB110 SS, Agera/Agera R/One:1 (gearing-dependent), McLaren F1, F40, F50, Zonda F, Utopia, W16 Mistral.
```
