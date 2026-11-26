# Purpose: Claude logs changes made here; Codex reads this file as a reference before reviewing the branch.
# Rule 1 (Codex): Inspect this file before reviewing the codebase.
# Rule 2 (Claude): Document changes in maximum detail using dense, machine-readable language (human readability is not required).
# Rule 3 (Claude): Clear this file upon creating a new branch. Exclude changes from other branches.
# Rule 4 (Both): Preserve this header block when clearing the file.

```yaml
schema: claude-change-log/v1
branch: claude/determined-planck-qhjicj (restarted from origin/main c45b371 = merge of PR #8; remote branch tip 6f6cf33 is an ancestor of main → fast-forward push, no force)
handoff_executed: origin/main Codex.md (review of 7571153, result changes_requested_before_merge; PR #8 was merged before the fixes)
commits:
  - e6efd81: Claude.md reset (header only)
  - e32b5c5: review fixes (P2 r44, P2 h10/h02, P2 h04, P3 GarageView, P3 h06, P3 h01) + legacy-id resolution
  - bb49f15: h11 Chiron Pur Sport, h12 Veyron 16.4 Super Sport, h20 McLaren F1 + README + this log
source_access: direct fetch OK for nissanusa.com brochure PDF, usa.nissannews.com press kit, newsroom.bugatti.com, bugatti-newsroom.imgix.net PDFs, koenigsegg.com, allcarcentral.com (McLaren sheet mirror); refused/unusable: caranddriver.com (fetch tool host refusal; not retried by other means), ferrari.com (CloudFront 403), cdn.ferrari.com F50 dossier (no extractable text), pagani.com Zonda F (no spec text), mclaren.com (JS shell). C/D values used only where Codex verified them.

review_fixes:
  P2_r44_nissan_z:
    torque.rpm: [1600,5600] → [1600,5200]  # verified: brochure p.? spec block "350 lb-ft @ 1,600-5,200 rpm"; press kit text + spec table "350 @ 1,600 - 5,200 rpm"
    redline/revLimit: 7000/7000 → 6800/6800  # press kit spec table "Maximum engine speed 6,800 rpm" (verified); modelled hard cut = that value, provenance row 'Rev limit (modelled cut)' status estimated, "assumption; no separately documented or measured fuel cut; previous 7,000 unsourced"
    provenance: Peak power/torque reported(autoblog) → verified (brochure + press kit, with rpm); +Maximum engine speed (verified, press kit); Tire size reported → verified (press kit: 255/40R19 F / 275/35R19 R Bridgestone Potenza S007, Performance)
    sources+: src-nissan-presskit https://usa.nissannews.com/en-US/releases/2023-nissan-z-press-kit (manufacturer, 2022)
    cd-at.conditions.tires: "Bridgestone Potenza S007 B-Silent, 255/40R19 F / 275/35R19 R (test car, as listed by Car and Driver)"
    cd-at.results.topSpeedNote: "governed, as reported by Car and Driver; not confirmed by a Nissan US document" (removed "C/D estimate; not measured" — no explicit support); dataGap + Speed-limiter provenance reworded the same way; neither Nissan document states a limiter → still none modelled
    MotorTrend equivalent row unchanged; exact C/D row still sorts first
    refit: grip 1.22 → 1.23 (C/D 0–60 RO, eff fixed 0.88; free eff fit wants 0.92 > bound)
    stats (r44): RO 0-60 4.301→4.293, ¼ 12.640→12.673, trap 181.674→180.529 km/h (112.9→112.2 mph); BR 0-60 4.629→4.620, ¼ 12.967→12.999; score 53.6→52.8 (A unchanged); vmax 296 (uncapped, drag-limited)
    residuals_after (RO): C/D 4.3/4.29, 12.7/12.67, 115/112.2 ; MotorTrend 4.3/4.29, 12.9/12.67, 107.6/112.2
  P2_h10_chiron_sport:
    id: 2021-bugatti-chiron-sport-us-coupe-awd-7dct → 2018-bugatti-chiron-sport-us-coupe-awd-7dct ; modelYear 2021 → 2018
    year_evidence: Bugatti "88th Geneva International Motor Show 2018" release (6 Mar 2018): Chiron Sport launched, US price US$3.26 M, ≈ −18 kg, "first deliveries are planned for the end of the year" → provenance 'Model year' reported; source src-bugatti-geneva
    saved_id_compatibility: catalog/index.ts LEGACY_IDS {old→new} + canonicalId(); findEntry/getEntry/isPlayable resolve aliases (deep links); storage/settings.ts maps activeVehicleId, tunings keys (canonical key wins on conflict), favorites, dragLanes, testCompare; storage/results.ts maps vehicleId. Tests: storage.test "moves settings and results saved under a retired id…", catalog.test "keeps retired ids resolvable and never reuses them". Browser: seeded old-id settings → Drive opens "2018 Bugatti Chiron Sport"; #/garage/<old id> renders the 2018 entry.
    benchmark cd: source → src-cd "2021 Bugatti Chiron Sport by the numbers" https://www.caranddriver.com/reviews/a35353692/2021-bugatti-chiron-sport-by-the-numbers/ (news a35105452 kept as reference src-cd-news); match exact → equivalent; deviation "test car was a 2018 Chiron that Bugatti retrofitted to Chiron Sport specification, not a production Chiron Sport; published 2021"; conditions {testMass 4,544 lb, tires "Michelin Pilot Sport Cup 2 BG, 285/30ZR20 F / 355/25ZR21 R", launchControl "Launch control used"}; results unchanged 2.4/9.4/158, rolloutS 0.2, timing rollout-1ft
    readiness: sim+benchmark → sim (no exact run); grip/eff provenance + simCaveat labelled "Provisional"; dataGaps +"Instrumented test of a production Chiron Sport", "Car and Driver drive mode"
    stats: byte-identical body under the new key (only the id changed)
    count: still counted (Codex: documented mass criterion)
  P2_h02_chiron: cd-sport row → same full-article source, conditions and retrofit deviation; stays equivalent; simCaveat "Provisional calibration: transferred from the Chiron Sport fit, itself made to an equivalent retrofit run"
  P2_h04_chiron_super_sport:
    launch: launchClutch {launchRpm 2500, brakeHoldRpmLimit 2500} (was builder default 3000); provenance 'Launch rpm' reported (C/D ≈ 2,500 rpm, per Codex); conditions.launchControl "Launch at about 2,500 rpm (as described by Car and Driver)"; conditions.tires "Michelin Pilot Sport Cup 2 BG2, 285/30ZR20 F / 355/25ZR21 R"; drive mode left unconfirmed (dataGap)
    before/after (RO, grip 1.05, eff 0.84): 0-60 2.201→2.201 ; ¼ 9.033→9.033 ; trap 165.13→165.12 mph (265.713→265.711 km/h); BR ¼ 9.195→9.196. Launch is traction-limited at this power → no measurable change; refit keeps grip 1.05 (search interval 0.01); eff fit still wants <0.80 → held 0.84 (floor), trap +4.1 mph visible
    7th_check: provenance 'Gear ratios' now states: 7th = Chiron 7th ÷ 1.036 (release); Chiron 7th itself bounded by its 420 km/h limiter entry → SS 7th is a derived bound; SS table "7th 440 km/h (deactivated)" is the Top Speed-mode limit, not used (derived 7th → ≈461 km/h @7,100). New row '6→7 upshift check' (reported): simulated full-load upshift 407.4 km/h at 7,000 rpm vs Bugatti 403 km/h (≈1 %), checks 6th + shift point, not the 7th ratio. Chiron base sim upshifts at 6,700 rpm reproduce its table exactly (90/150/200/260/320/390 km/h).
  P3_garage_top_speed_label:
    physics/dyno.ts: +TopSpeedConstraint 'limiter'|'rev-limit'|'drag'; +topSpeedBreakdown(v) {kmh, unlimitedKmh, limiterKmh, binding}; binding=limiter iff limiterKmh < unlimitedKmh (unrounded); else rev-limit when the tallest gear exceeds revLimit at unlimited+0.5 km/h, else drag; topSpeedKmh() = breakdown.kmh (unchanged values)
    lib/topSpeed.ts topSpeedText(): "X km/h · held by the modelled L km/h limiter (≈ U km/h without it)" | "X km/h · {drag-limited|rev-limited in top gear} below the modelled L km/h limiter, which is never reached" (one decimal when rounding would make X == L) | "X km/h · uncapped prediction, {cause} (no limiter modelled); not a published or governed figure"
    GarageView SimSpecs uses topSpeedBreakdown(stock SimVehicle); separate "Speed limiter" row and published/factory rows kept
    tests (lib/__tests__/topSpeed.test.ts): Chiron SS binding (380, unlimited 437); Golf GTI 249 < 250 and GT-R 313 < 315 non-binding; Nissan Z none; decimal disambiguation
    browser: Chiron SS "380 · held by … 380 (≈ 437 without it)"; GTI "249 · drag-limited below … 250 …never reached"; GT-R "313 · rev-limited in top gear below … 315 …"; Z "296 · uncapped prediction, drag-limited …"; Veyron SS "410 · drag-limited below … 415 …"
  P3_h06_carrera_gt: +source src-cd-2004 https://www.caranddriver.com/reviews/a15132548/porsche-carrera-gt-road-test/ (2004-06); +benchmark cd-2004 {timing unconfirmed, 3.5 s / 11.2 s @ 132 mph, testMass 3,146 lb, other ["Six-speed manual","Rated 605 hp @ 8,000 rpm as printed"], match equivalent, deviation US-market car vs German-spec 612 PS DIN / 1,380 kg DIN (kept independently)}; secondary 11.1 @ 133 lead dropped; grip NOT fitted (RWD median 1.30); residuals visible: 60 3.5/3.21 BR–2.90 RO, ¼ 11.2/11.03 BR–10.71 RO, trap 132/133.3
  P3_h01_veyron: conditions +tires "PAX 265-680 ZR500 F / 365-710 ZR540 R (test car fitment)", +other "As tested: wheelbase 106.7 in, length 175.7 in, width 78.7 in, height 45.1–47.4 in"; Dimensions provenance estimated → reported (C/D) with modelled height 1,204 mm (upper of range) stated as aero assumption; chassis L 4462→4463, W 1998→1999 (in→mm); timing stays unconfirmed; EPA N/V caveat kept open
    grip: ×1.00 (two-basis bound) → ×1.11 calibrated-AWD median, unfitted ("no cross-basis fit"); eff 0.84 kept (trap fit, basis-insensitive)
    stats: BR 0-60 2.587→2.270, ¼ 10.136→9.846; RO 0-60 2.346→2.147, ¼ 9.895→9.723; trap 233.21→233.53 km/h; score 105.8→108.9 (S+)
    residuals_after: 0-60 2.5/2.27 BR–2.15 RO ; ¼ 10.1/9.85–9.72 ; trap 142/145.1

hypercars_batch2:  # all S+; existing DCT/manual paths; no new physics path
  - id: 2020-bugatti-chiron-pur-sport-eu-coupe-awd-7dct  (h11, order 11)
    verified: Bugatti Pur Sport sheet + release (2020-05-26): 1,103 kW @6,700–6,900; 1,600 Nm @2,000–6,000; max engine speed 7,000 (+200 vs Chiron ⇒ Chiron max 6,800, matching h02's estimate); max shift speed 6,900; limiter 350 (electronically regulated); Cd 0.38 (fixed wing −5°); Michelin Sport Cup 2 R 285/30 R20, 355/25 R21; speed per gear 90/145/185/230/280/325/350(deactivated); "all in all the gears have been shortened by 15 per cent"
    reported: curb 1,945 kg (1,995 DIN − 50 kg stated); L 4,647, H 1,212, WB 2,711, width 2,162 incl. mirrors; model year 2020 (series production 2H 2020)
    derived (estimated): effective reductions at 6,900 rpm, r 0.33705 → 9.742/6.047/4.739/3.812/3.131/2.698/2.505; finalDrive 1.000; per-gear shortening vs Chiron table 3/7/11/16/18/24/24 %; alternative 7,000 rpm basis = +1.4 % taller (dataGap)
    calibration (provisional): eff 0.84 (Chiron family); grip ×1.10 on 'uhp' = family ×1.00 × Bugatti's "about ten per cent more lateral acceleration" for the Cup 2 R (semi-slick class gave 0–100 ≈ 2.11 s BR vs 2.3 claim → rejected)
    sim: 0–100 2.248 BR vs factory 2.3; ¼ 8.963 @ 266.3 km/h (drag strip view); vmax 350 (limiter); score 132.3
  - id: 2010-bugatti-veyron-16-4-super-sport-us-coupe-awd-7dct  (h12, order 12)
    verified: Bugatti release (2010-08-13): 1,200 hp (882 kW), 1,500 Nm, limited 415 km/h "to protect the tyres", record 431.072 km/h separate, production from autumn 2010; EPA MY2014 filing carline "Super Sport" (CBLA): 1200 @ 6400, 1500 Nm @ 3000–5000, curb 4,513 lb, PAX 365-710 ZR540A / 265-680 ZR500A, trans AD71C001 (same ratios 3.176…0.795, axle 2.585, N/V 24.85), EDV road-load target A 60 / B 0.59 / C 0.0185 (identical to coupé → coupé CdA 0.684 reused)
    estimated: redline/limit 6,600/6,700 (431 km/h record in 7th ≈ 6,660 rpm at EPA N/V); dims = 16.4 coupé; 44 % front; AWD 0–0.5; creep 40 Nm; grip 1.11 (AWD median, no benchmark); eff 0.84 transferred from h01 trap fit
    sim: vmax 410 km/h drag-limited below the 415 limiter (averaged-radius caveat; EPA-N/V radius would reach 415); 0–100 2.22 BR; score 119.9
  - id: 1994-mclaren-f1-uk-coupe-rwd-6mt  (h20, order 20)
    verified (McLaren Automotive road-car specification, mirror allcarcentral): S70/2 6,064 cc V12; 461 kW/627 PS @7,500; 651 Nm @5,600; 95–98 RON; ratios 3.23/2.19/1.71/1.39/1.16/0.93 with mph/1000 rpm 8.7/12.7/16.7/20.0/24.0/30.0; final 2.37 spur after high-speed bevel gears; LSD; triple-plate 200 mm carbon clutch; tires 235/45 ZR17 F, 315/45 ZR17 R; kerb 1,140 kg; 41.2/58.8; Cd 0.32; 4287×1820×1140, WB 2718
    derived (estimated): overall reductions from the mph/1000 rpm column with r 0.34692 (315/45 ZR17 ×0.97) → 9.341/6.399/4.866/4.063/3.386/2.709, finalDrive 1.000; listed ratios × 2.37 are 1.20–1.23× taller in every gear (unlisted bevel stage) → speed column used
    estimated: rev limit 7,500 (secondary leads; record car ran a raised limit); model year 1994 (production 1993–1998, leads); area 1.74 (builder); grip 1.30 RWD median
    factory (notes only): 0–60 3.2, 0–100 mph 6.3, ¼ 11.1 @ 138 mph, km 19.6 @ 177 mph, top 386 km/h (record figure)
    sim: vmax 362 (rev-limited 6th @7,500); BR 0–60 ≈ 2.71, ¼ 10.43 @ 142.5 mph — quicker than the sheet (flagged in simCaveats); score 101.4

playable_hypercar_count: 9 (h01 Veyron 16.4, h02 Chiron, h03 CCX 6MT, h04 Chiron SS, h06 Carrera GT, h10 Chiron Sport, h11 Chiron Pur Sport, h12 Veyron SS, h20 McLaren F1); target 20 → 11 remaining
blocked_candidates (source checked this round):
  - Koenigsegg CC8S, CCR, CCXR, Agera, Agera R, One:1, Agera RS: factory pages list no gear ratios (CC8S/CCR "6-speed by Cima"; CCXR "transversal gearbox"; Agera family "7-speed dual-clutch, 1 input shaft"). CCXR could share the CCX box (same description, clutch, dims) but no ratio evidence → not enabled.
  - Bugatti Divo: sheet lacks speed-per-gear, limiter and Cd. W16 Mistral: sheet lacks gear speeds (1,600 PS, 2,040 kg DIN, 420/380 modes). Grand Sport Vitesse: no Vitesse-specific gearing in the release; EPA filing names no Vitesse carline. Chiron SS 300+: sheet matches the Super Sport (same limits, gear table, −23 kg) → no documented production difference to count. EB110 SS: Bugatti page has no specs.
  - Ferrari F40 (ferrari.com 403), F50 (dossier text not extractable), Pagani Zonda F (no spec text), Utopia (no Xtrac ratios; AMT or manual).
  - Shortlist (Enzo, Huayra BC, Jesko, Regera, 918, P1, Nevera) need AMT/LST/hybrid/EV paths.
original_18_catalog_only: 0 promoted this round; blockers unchanged (r29/r60 gearing; r34 MCT, r62 ASG; r61 transfer case; r13 CVT; r67–r73 EV; r14/r35/r36/r65/r66 hybrid). Next unlock with the widest reach: an AMT/single-clutch path (r62 LFA ASG + Enzo/Huayra BC/Utopia AMT), then EV (7 roster cars + Nevera).

generated: stockStats rows changed only for r44, h01, h04 (3-decimal), h10 (key rename, identical body) and +h11/h12/h20; 59/63 base rows identical incl. both owner cars; DATA_GAPS regenerated
tests: npm run check → typecheck, lint, 951 tests / 22 files, build ✓ (main baseline 906; +legacy-id storage/catalog, +topSpeed suite, +3 per-car suites)
app_smoke (Chromium 1194×834 touch, vite preview of checked build; console errors none):
  legacy id seeded in localStorage → Drive active chip "Bugatti Chiron Sport 2018"; old deep link → 2018 entry
  labels as listed under P3; Chiron Sport benchmark shows "Equivalent configuration · 1-ft rollout" + retrofit deviation; Carrera GT shows "Equivalent configuration · Timing basis unconfirmed" + US-market deviation
  Hypercars chip → 9 rows
  Live Drive 6 s WOT: McLaren F1 160 km/h (dial 420), Pur Sport 204 km/h (420), Veyron SS 186 km/h (480)
  Tests McLaren F1: 0–100 2.81 s, 0–200 8.30 s, ¼ 10.43 s @ 229.4 km/h; Save ✓
  Tuning F1 semi-slick: 0–100 2.81 → 2.51 s
  Drag: F1 tuned (semi-slick) 10.195 s vs F1 stock 10.435 s; Save both ✓; Pur Sport 8.963 @ 266.3 vs Veyron SS 9.384 @ 247.7 km/h; reload keeps lanes; Results list McLaren F1 runs
  Dyno: F1 627 PS @7,500 / 651 Nm @5,600; Pur Sport 1,504 PS @6,850 / 1,600 Nm; Veyron SS 1,199 PS @6,400 / 1,500 Nm
  not_run: native iPad Safari/WebKit

codex_verification_requests:
  - r44: does any Nissan US document state a governed top speed or a fuel-cut rpm separate from the 6,800 rpm maximum engine speed?
  - h10: an exact instrumented test of a production Chiron Sport; C/D drive mode.
  - h04: C/D drive mode for the Super Sport run.
  - h11 Pur Sport: rpm basis of the speed-per-gear table (6,900 shift vs 7,000 max).
  - h12 Veyron SS: rev limit; Super Sport-specific dimensions; any instrumented test.
  - h20 McLaren F1: road-car rev limit and model year from a McLaren document; bevel-stage ratio (explains the 1.20–1.23 factor); timing basis of the sheet's performance figures (could become a benchmark).
  - CCXR: any evidence that it shares the CCX ratios (would enable it).
  - Agera RS (from before): ratios + production engine block.
```
