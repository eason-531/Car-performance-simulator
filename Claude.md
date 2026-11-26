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

```yaml
round: 3  # same branch; Codex.md 1b18193 = inspection of 44d84c5 (result changes_requested_before_merge); PR #9 open
commits:
  - b4ca03d: review fixes (P2 h11 Pur Sport grip, P2 top-speed boundary/classifier + h12 wording, P3 canonicalId Map)
  - 2bb281a: single-clutch automated-manual path + r62 Lexus LFA promoted (original backlog 18 → 17)
review_fixes:
  P3_canonicalId: catalog/index.ts LEGACY (Map from LEGACY_IDS) → canonicalId uses Map.get; storage test "keeps unknown ids, including inherited object names, as the same string" (constructor/toString/__proto__/hasOwnProperty/no-such-car; results vehicleId stays string) — fails on the previous object lookup, passes now
  P2_top_speed:
    physics/dyno.ts: forceGearingLimit(): start at 1.001 × idle speed in the lowest gear; 0.5 km/h scan for the first speed at which no gear out-pulls road load (continuous acceleration required); bisect to 0.002 km/h; result rounded to 0.01 km/h. Binding gear = gear still pulling at the limit with the highest cut speed. atCut (gear cut speed − limit ≤ 0.01 km/h) → 'rev-limit', else 'drag'. Tie (TOP_SPEED_TIE_KMH 0.1): drag case when the gear's cut is ≤ 0.1 km/h above; rev case when road load at cut + 0.1 km/h ≥ wheel force at the cut. Limiter tie when |limiter − limit| ≤ 0.1 (binding = physical constraint, tiedWith 'limiter'); limiter binding only if limiter < limit − 0.1.
    TopSpeedBreakdown +gear, +gearCount, +tiedWith; theoreticalTopSpeedKmh = forceGearingLimit().kmh
    lib/topSpeed.ts: cause text names the gear ("drag-limited in top gear", "rev-limited in 1st gear (2nd cannot pull past it)", "rev cut and drag coincide in top gear"); limiter tie → "≈ X km/h · the modelled L km/h limiter and the force/gearing limit coincide (within 0.1 km/h; …)"; one decimal only when rounding would equalise distinct values (non-tie gaps > 0.1 always differ at one decimal)
    tests (lib/__tests__/topSpeed.test.ts, flat-torque synthetic cars + catalog cars): force crossing 0.2 km/h before the cut → drag (old grid classifier called rev); cut 0.3 km/h before crossing → rev; 0.03 km/h → tie; stretched 2nd (ratios 3.0/0.55) → rev-limited in 1st; limiter +0.04 km/h → limiter tie, +0.3 → distinct numbers; Chiron SS binding 380; GTI/GT-R non-binding; Nissan Z uncapped
    generated stats: 0 rows changed (all rounded top speeds identical); owners identical
    browser labels: LFA "332 · uncapped prediction, drag-limited in top gear"; Pur Sport "350 · held by … 350 (≈ 355 without it)"; Veyron SS "410 · drag-limited in top gear, below … 415 …"; GT-R "313 · rev-limited in top gear, below … 315 …"; F1 "362 · uncapped prediction, rev-limited in top gear"
  P2_h12_veyron_ss: computed constraint = drag at 409.95 km/h in 7th (7th cut ≈ 414.4 km/h at 6,700 rpm); simCaveat rewritten to that; EPA-radius sensitivity (r 0.353 vs 0.3371): force limit 417.52 km/h → 415 limiter binds. (h01 Veyron 16.4: 387.75 → 392.91 km/h with the EPA radius; limiter 375 binds either way.) Published 415 km/h limit and 431.072 km/h record remain separate.
  P2_h11_pur_sport: grip ×1.10 → ×1.00 (neutral, transferred); +provenance 'Lateral grip (not modelled)' (reported, Bugatti ≈ +10 % lateral acceleration); sensitivity (stock stats): ×1.00 BR 0–100 2.671, 0–200 5.919, ¼ 9.376 @ 265.14 km/h, RO 0–100 2.430, ¼ 9.135; ×1.10 BR 2.248 / 5.432 / 8.963 @ 266.33, RO 2.139 / 8.854; score 132.3 → 127.6 (S+). Factory 2.3 s claim stays a factory figure (sim now 0.37 s slower).
automated_manual_path:
  data/types.ts TransmissionType +'automated-manual' (single clutch; TCU launch; interrupt shifts; no idle creep by default)
  defaults: buildSimVehicle shiftProfile interrupt for manual + automated-manual; launchClutch.creep default only for dual-clutch (TC cars have no launch clutch; manual unchanged false); catalog builder: AMT shift 0.25 up / 0.35 down (estimate text "single-clutch automated manual"), dip 1, creep false; DriveView clutch light keyed on torque converter presence (manual cars now show CLU instead of L/U; owners unchanged: Lexus L/U, Škoda CLU)
  tests (physics/__tests__/automatedManual.test.ts, Škoda converted to AMT vs its DCT): builds with interrupt/no-creep/instant TCU; 4 s idle off brake < 0.5 km/h; slipping at 0.15 s then locked and > 60 km/h; mid-shift (25–75 %) accel max < 0 for AMT vs min > 0 for DCT (gears ≥ 3); ¼ mile slower than DCT by < 1 s; every catalog AMT runs. vehicles.test gearbox rule: AMT dip ≤ 1, launch clutch required, driverEngageS 0. simulator creep test now covers DCT + converter cars only.
  existing cars: generated stats unchanged (only the LFA row added)
r62_lexus_lfa:
  source: Lexus Europe LFA press dossier (prensa.lexusauto.es, 2009-10) — verified: 1LR-GUE 4,805 cc; 412 kW (560 PS EEC) @ 8,700; 480 Nm @ 6,800; max engine speed 9,000; ASG 3.231/2.188/1.609/1.233/0.970/0.795; front counter gear 1.259; final 3.417; max speed per gear 83/123/167/218/277 km/h; 0.2 s upshift (7 stages); 265/35R20 F, 305/30R20 R; 4505×1895×1220, WB 2605; 48:52; Cd 0.31 (wing retracted); kerb 1,480–1,580 kg; 325 km/h; 0–100 3.7
  counter_gear_resolution: overall = gear × 1.259 × 3.417 (finalDrive 4.302); sim-radius (0.33514) speeds at 9,000 rpm 81.8/120.8/…/272.4 km/h vs Lexus 83/123/…/277 (−1.5 to −1.7 %, radius convention); gear × 3.417 alone → 103 km/h in 1st (rejected)
  model: type automated-manual; upshift 0.2 (verified); launch 4,500 rpm (estimated); curb 1,480 (reported, lower end; C/D 3,583 lb kept separate); grip 1.30 RWD median NOT fitted (both C/D runs timing unconfirmed); eff: trap fit to the 125 mph comparison row = 0.823; the original 124 mph test asks ≈ 0.80 (< plausible) → held 0.823 (lowest accepted elsewhere: r20 GS F, r21 IS 500)
  stats: S 75.1; BR 0–60 3.669, 0–100 3.835, ¼ 11.732 @ 125.0 mph; RO 0–60 3.391, ¼ 11.454; vmax 332 km/h drag-limited in 6th (claim 325)
  residuals (BR | RO vs C/D original 3.7 / 11.8 @ 124): 3.67 | 3.39 ; 11.73 | 11.45 ; 125.0
  unsupportedReason removed; readiness sim+benchmark; simCaveats added; DATA_GAPS: catalog-only 18 → 17, playable 64 → 65
counts: playable hypercars 9 (unchanged this round); original catalog-only 17 (r62 promoted)
blocked_checked_this_round: Pagani Huayra BC (pagani.com: 764 CV @6,200, 1,000 Nm @4,000, 7-speed AMT, 1,218 kg — no ratios) → blocked on gearing despite the new AMT path
tests: npm run check → typecheck, lint, 973 tests / 23 files, build ✓
app_smoke (Chromium 1194×834 touch, preview build; console errors none): labels above; LFA readiness "Simulation + measured benchmark · Provisional model", launch "Clutch slip to ≈ 4,500 rpm"; Live Drive LFA 4 s idle off brake → 0 km/h, 6 s WOT → 130 km/h, clutch light CLU; Tests LFA 0–100 3.84 s (factory 3.7, +0.14), ¼ 11.73 s @ 125.0 mph; Drag LFA semi-slick 11.693 vs stock 11.732 s, Save both → reload → Results 3 LFA entries; Dyno LFA 560 PS @ 8,700 / 480 Nm @ 6,800
codex_verification_requests_added:
  - LFA: C/D 2010/2011 timing procedure (would allow a grip fit); launch-control rpm; whether the ASG creeps at idle; US curb definition vs the 1,480–1,580 kg range
  - Huayra BC / Enzo / Utopia: gear ratio sets (the AMT path is ready for them)
```

```yaml
round: 4  # same branch; Codex.md 215dabf = review of eb8c295 (changes_requested_before_merge) + owner_directive (EV then CVT, required)
user_request_extra: "do not make the keyboard on portable devices pop up immediately after the All cars icon is clicked" (Eason)
commits:
  - c592430: picker keyboard fix (touch-first focus to dialog, not search input)
  - ed02748: review fixes (P2 LFA evidence, P2 LFA 4,000 rpm launch, P2 exact reachability, P3 AMT clutch light)
  - d9e6394: battery-electric path + r72 Kia EV6 GT
  - 2d1e47e / e411dda: EV views (Drive, Dyno, Tuning, Garage); e411dda restores hand formatting after an accidental prettier run (net view diff 131+/40-)
  - 130b20e: r68 Ioniq 5 N + class formula SLC-5
  - f7ed830: N e-Shift (virtual 8-speed, Live Drive only, off by default) + EV simulator tests
  - 0864064: r67 Taycan Turbo S, r69 Model S Plaid, r70 Air Sapphire, r71 Model 3 Performance, r73 R1T
  - 1e252d4: CVT path + r13 Civic Sport Touring 1.5T LL-CVT
  - 714bda8: h26 Rimac Nevera (EV hypercar extension) + README counts
keyboard_fix:
  CarPicker.tsx: isTouchFirst() = matchMedia('(hover: none) and (pointer: coarse)') (guarded); touch-first → CatalogBrowser autoFocus=false, focus moves to dialog panel (tabIndex -1, .dialog:focus outline none); desktop unchanged (search input focused)
  tests: CarPicker.focus.test.tsx touch-first describe.each (3 × 2) + desktop; 2 fail without the fix
  smoke: emulated iPad → activeElement DIV[role=dialog]; desktop → INPUT
review_fixes:
  P2_lfa_evidence: r62 sources + src-cd-cmp (a15128593, Dec 2010 comparison: 3.6 / 11.7 @ 125, 3,569 lb, Bridgestone 265/35ZR20 F 305/30ZR20 R, launch control, UK) and src-cd-procedure, src-lexus-om (OM77006U p.174), src-lexus-inside (p.36); both C/D rows match equivalent, timing unconfirmed (legacy 3-mph basis noted); prototype short take 3.7 / 11.8 @ 124, 3,583 lb, manual SPORT, ≈3,800 rpm, no launch control
  P2_lfa_launch: launchClutch { launchRpm 4000, brakeHoldRpmLimit 4000 } (Lexus OM launch-control rpm); efficiency 0.883 (trap fit at the comparison car's 3,569 lb; sensitivity short take 0.867, factory kerb 0.823); aero caveat +11 % CdA would give the 325 km/h claim (sim 332); class S → S+ 79.8; BR 3.54 / 11.515 @ 128.4 mph
  P2_reachability: Curve.knotsWithin(lo,hi); dyno forceGearingLimit exact over LUT knots + idle/cut speeds per gear (net force concave between breakpoints) → first uncovered speed by bisection; tests: narrow-notch repro (lutSize 65536), gear gap with recovery, drag 0.2 km/h before cut, rev cut, tie, lower-gear binding, limiter tie, catalog cars; generated stats unchanged
  P3_amt_clutch_light: SimState.clutchOpen = interrupt profile && shift && torqueFactor < 1; DriveView CLU off while open; test LFA 2→3 at 0.1 s open, DCT/converter never open
ev_path:
  types: TransmissionType +direct-drive; ElectricMotorSpec {axle, peakPowerKw, peakTorqueNm, maxRpm, peakPowerEndRpm?, reductions[1|2], upshiftKmh?}; ElectricSpec {motors, systemPowerKw, systemTorqueNm?, boost?{systemPowerKw, systemTorqueNm?, durationS, trigger launch-control|driver, label, armedByDefault?}, creep, virtualShift?}
  physics/electric.ts: motorTorqueNm = min(peakT, P/ω) with P ∝ band-end/ω above peakPowerEndRpm, 3 % linear fade to maxRpm; electricOutput scales motors evenly to shared torque then power caps (boost caps while boosting); torqueFactor applies to motor torque (power dips during shifts); reflected rotor inertia 0.05 kg·m² × ratio²
  simulator.stepElectric: two-speed schedule (auto: up at upshiftKmh, down < 0.6× at throttle > 0.5) + blend with dip; speed limiter; launch-control boost primes on brake+WOT and fires on release; driver boost when armed (once); per-axle traction min(force, μ·N_axle·TCE) with axleLoads(accelFiltered); creep 0.6 m/s² × (1 − v/2) below 2 m/s off brake; engineRpm = rear motor rpm; motorPowerKw
  build.buildElectricSpec: equivalent engine curve referred to the primary (rear) motor; transmission direct-drive (primary reductions, final 1); engine-only estimates removed
  tuning: power adjust scales motors + shared limits; TuningConfig.electricBoostArmed (driver boosts only)
  dyno: computeElectricDyno over road speed (axis 'speed', speedKmh, peak*Kmh); electricForceLimit scan 0.25 km/h + bisection; rev-limit if in motor fade band; top-speed wording for EVs
  views: Drive (motor rpm tach, motor-power gauge, BST light, single-speed hides paddles/mode/shift lights, REV/CLU hidden for EVs), Dyno (km/h axis when all EVs, mixed note), Tuning (Electric drive panel, boost toggle), Garage (motors, shared limits, creep; no Stage 1)
  tests: physics/__tests__/electric.test.ts (per-axle traction bound each step, power cap at 30–220 km/h, creep < 2 m/s and brake hold, driver boost armed-only once 10 s ≤ 478.1 kW, launch-control prime/fire and no fire on rolling start, two-speed change at 90 km/h) + dyno EV rated-output test + vehicles test EV rules (direct-drive 1–2 gears, eff < 0.98, pickup mass < 3,500)
class_formula: SLC-5 (S+ 78 → 77.0, centred in the 75.6–78.3 gap; Ioniq 5 N landed 78.3); 0 class changes; owner rows differ only in the formula id
n_e_shift:
  ElectricSpec.virtualShift {label, ratios (virtual rpm per wheel rpm), idleRpm, redlineRpm, revLimitRpm, upshiftTimeS, downshiftTimeS}; SimElectric.virtualShift with a synthetic dual-clutch SimTransmission (wotUpshift = redline, last = limiter)
  Simulator.setVirtualShift(on): per instance (runners/drag/dyno never call it); picks gear under 0.95 × redline; off → gear 1; gearCount/inputRpmInGear/requestShift/startShift use the virtual box; stepVirtualShift: auto (autoShiftTarget) or manual (stall protection), torque to 20 % over first 15 % of the change then restored in one step (jolt), hard limiter at revLimit (150 rpm hysteresis) cuts motor torque, tach = max(idle, virtual rpm)
  r68 data (estimated): ratios = Elantra N DCT overall (3.714×3.8, 2.261×3.8, 2.174×2.714, 1.621×2.714, 0.927×3.8, 0.767×3.8, 0.878×2.714, 0.698×2.714) × scale so 8th = 260 km/h at 6,850 rpm; idle 750, redline 6,750, limiter 6,850; 0.15 s up / 0.25 s down; full motor output between changes; no regen
  DriveView: N e-Shift switch in the bar (per car, resets on car change), paddles/mode/shift lights/REV shown only when on; saved drive label appends the switch
  smoke: off → no paddles; on → 8 gears, 4 s WOT auto 103 km/h at 6,307 rpm in 4th; manual 1st holds 35 km/h at 6,844 rpm with REV; switch resets after switching car
  tests: off by default/absent on EV6; ≥ 6 gears to 200 km/h, tach ≤ 6,900, torque cut mid-shift; manual 1st on limiter 30–38 km/h; switch off → gear 1, motor rpm; runner trace gear 1 and motor rpm > 15,000 at 200 km/h
ev_cars:  # residuals: sim vs benchmark on the benchmark's basis (RO = 1-ft rollout; BR = standing start)
  r72_kia_ev6_gt: reduction 10.62 (EPA N/V 126.7); front 160 kW/347 Nm, rear 270 kW/379 Nm, 21,000 rpm, peak-power bands to 9,000/9,400 rpm then P ∝ 1/ω; system 430 kW/740 Nm; 2,110 kg; Cd 0.371 × 2.45 (EPA C); grip 1.00 floor, eff 0.95 held | C/D RO 3.2/11.6 @ 119 → 3.21/11.62 @ 114.8 | score 66.2 S | top 243 km/h drag-limited (claim 260)
  r68_hyundai_ioniq_5_n: reduction 10.6 (EPA N/V 128.5); caps 175/303 kW, 370/400 Nm; system 448 kW/740 Nm; N Grin Boost 478 kW/770 Nm 10 s driver-armed (off); 2,200 kg 50 %; Cd 0.347 × 2.58 (EPA C); grip 1.30 bound, eff 0.94 | MT RO 2.8/11.0 @ 124.9 (mode not stated) → 3.04/11.18 @ 125.1 (NGB: 2.94/11.00 @ 126.4) | 78.3 S+
  r67_porsche_taycan_turbo_s: Porsche Technical Feature 2021 (front 190 kW/400 Nm, 440 Nm LC; rear 335 kW/550 Nm; 16,000 rpm; front ≈8:1; rear 1st ≈15:1 → 15.2 from EPA N/V 186 at sim radius 0.34806, 2nd 8.0); caps × 560/525 (202.7/357.3 kW); system 460 kW; overboost 560 kW/1,050 Nm launch-control 2.5 s (duration estimated); upshift 120 km/h (estimated); 2,295 kg DIN; Cd 0.25, CdA 0.583 (Range mode); 265/35 ZR21 / 305/30 ZR21; grip 1.12, eff 0.95 held | C/D RO 2.4/10.5 @ 130 → 2.40/10.65 @ 128.1 (10 s overboost sensitivity 10.26 @ 135.6) | 86.4 S+ | factory 0–100 2.8 → sim BR 2.80 | top 260 rev-limit tied with limiter
  r69_tesla_model_s_plaid: three motors 295 kW (Tesla CN manual via search summary), 475 Nm each (1,424 Nm reported, even split est.), 20,000 rpm (C/D), reduction 7.56 (EPA axle; N/V 90.3 → 7.25 at sim radius), system 760 kW, 2,162 kg, Cd 0.208 × 2.34 (EPA C 0.0132 agrees), 19-in fitment est.; grip 1.20 (power-limited), eff 0.89 | Edmunds BR 2.3/9.4 @ 150.8 → 2.35/9.68 @ 150.8; C/D RO ¼ 9.4 → 9.44 | 114.7 S+
  r70_lucid_air_sapphire: Lucid spec sheet (3 motors F1/R2, 7.0/6.8:1, 908 kW/1,940 Nm, 5,336 lb, 205 mph, 265/35R20 / 295/30R21, dims); per-motor 400 kW/647 Nm est.; 20,000 rpm est.; Cd 0.303 × 2.35 (EPA C 0.01926); grip 1.15, eff 0.89 | MT RO 2.1/9.3 @ 153 (second-hand) → 2.10/9.31 @ 153.4; Edmunds BR 2.2/9.2 @ 149.6 → 2.33/9.54 @ 153.4 | 117.8 S+ | top 330 limiter
  r71_tesla_model_3_performance: front 158 kW/219 Nm, rear 303 kW/522 Nm (EVSpecifications/Carsales via search; 741 Nm reported), system 380 kW (EPA 510 hp), reduction 8.8 (EPA N/V 114), 19,500 rpm est., 1,835 kg (C/D test), Cd 0.225 × 2.35 (EPA C 0.0143); grip 1.00 (torque-limited), eff 0.90 | C/D RO 2.8/11.0 @ 125 → 3.02/11.19 @ 125.3; Edmunds BR 3.0/11.0 @ 123.7 → 3.30/11.46 @ 125.3 | 78.3 S+ | 460 kW sensitivity does not fix the launch
  r73_rivian_r1t_launch_edition: four motors 156 kW/308 Nm each (623 kW/1,231 Nm even split; Wikipedia), 12.6:1 (Motor Authority, gen-1 quad), 15,500 rpm est., 3,242 kg (Edmunds), Cd 0.297 × 3.07 (EPA C 0.02461), 275/55 R21 touring est., limiter 177 km/h; grip 1.06, eff 0.95 held (trap limiter-capped) | C/D RO 3.3/11.9 @ 110 → 3.30/11.59 @ 109.8; Edmunds BR 3.5 → 3.57 | 62.2 A
  h26_rimac_nevera: Rimac page (fetched): 2×226 kW/270 Nm F, 2×450 kW/900 Nm R, 1,408 kW, 2,340 Nm motor / 13,430 Nm wheel → reduction 5.74 (EPA axle 5.6), caps × 1,408/1,352, 18,500 rpm est., 2,300 kg, Cd 0.3 (× 2.14 est.), 4745×2052×1240 WB 2745, PS4S 275/35R20 / 315/35R20, 412 km/h; grip 1.30 bound, eff 0.95 held | Rimac RO 0–60 1.74, 0–100 1.81 → 1.83 / 1.90; DragTimes drag-strip 8.582 @ 167.51 → BR 8.42 @ 183.4 (trap +16 mph: power vs speed unpublished) | 151 S+; Origin +Croatia
cvt_path:
  types: TransmissionType +cvt; CvtSpec {ratioLow, ratioHigh, ratioRatePerS, stepRatePerS, stepThrottle, stepUpshiftRpm, holdRpm, partThrottleRpm[2], brakingRpm}; TransmissionSpec.cvt / SimTransmission.cvt; gearRatios = simulated steps
  simulator.stepCvtRatio: at rest → ratioLow; manual → selected step at stepRate (+ stall protection); auto and throttle ≥ stepThrottle → Step Shift (entry picks step with rpm < 0.98 × stepUpshiftRpm = kickdown; change at stepUpshiftRpm; last step: min(step, max(high, holdRpm / wheel·fd))); else part-throttle target rpm lerp(partThrottleRpm, (thr/stepThrottle)^1.5) or brakingRpm when brake > 0.1, at ratioRate; ratio clamped to span; gear = nearest step for display; torque converter launch + lock-up (lockupMinGear 1); requestShift CVT branch selects steps
  build: CVT gets a torque converter like automatics; buildSimVehicle wotUpshift = stepUpshiftRpm (last = limiter)
  dyno: top speed over cvtRatioLadder (64 geometric samples of the span × final); TopSpeedBreakdown.cvt; wording "with the CVT at its best ratio" / "at the CVT's highest ratio"
  garage: CVT ratio span + Step Shift rows; gearing table header Step + Top row (0.405)
  r13_honda_civic (verified Honda specs page): 180 hp @ 6,000, 177 lb-ft @ 1,700–4,500, 16.5 psi, redline 6,600 (limiter 6,700 est.), 1,498 cc, span 2.645–0.405, final 4.81, 235/40 R18 91W all-season, 179.0×70.9×55.7 in WB 107.7, curb 3,102 lb, 60.2 %; EPA 2022 Civic 5DR 180 hp paddle CVT "# of gears 7"; estimated: steps 2.645/2.223/1.868/1.57/1.319/1.108/0.931 (×1.19), Step Shift ≥ 80 % throttle, change 6,200 rpm at 2.0 ratio/s, hold 6,000, part throttle 1,400–4,500 rpm at 0.8 ratio/s, braking 2,500 rpm, converter stall 2,600 rpm 2.0:1 (stall 2,200–2,600 gives identical results: torque plateau from 1,700); calibrated at MT 3,075 lb 61 %; grip 1.00 floor, eff 0.84 (trap fit)
  benchmark: MotorTrend first test (fetched, 2021-11-25) RO 7.7 / 15.9 @ 89.8 → sim 7.31 / 15.69 @ 89.9 (0–60 −0.39 s, ET −0.21 s; drive mode not stated); Edmunds BR 7.9 → 7.67 | score 4.0 D
  smoke: WOT trace 6,059 → 5,538 (step 1→2 at 58 km/h), 6,105 → 5,358 (2→3 at 70 km/h); L/U light; paddle up → manual step 4/7; Tests 0–100 8.14, ¼ 16.05 @ 89.9; Drag vs EV6; Dyno rpm axis
  tests: physics/__tests__/cvt.test.ts (span/steps/final; WOT ratio within span and non-increasing, lock-up < 40 km/h, ≥ 4 drops > 600 rpm, rpm < 6,700, hold 6,000 ± 200 in step 7; light-throttle cruise < 2,500 rpm ratio < 0.8, kickdown > 5,000 rpm, braking > 1,800 rpm; paddles; determinism)
ui_misc: StatTile hides the unit after a dash ("—s" for unreachable 0–200)
verification:
  npm run check: typecheck, lint, 1,103 tests / 25 files, build ✓ (chunk-size warning only)
  generated stats: owner rows unchanged (formula id SLC-5 only); added rows: 7 EVs, r13, h26; 0 changed rows otherwise
  app smoke (Chromium 1194×834 touch, preview build, console errors none): every new car in Garage, Live Drive, Tests, Tuning, Drag and Dyno; EV dyno km/h axis
counts: original roster playable 64/73 (catalog-only 9: hybrids r14/r35/r36/r65/r66, r34 MCT, r61 4WD, r29/r60 gearing); playable hypercars 10
source_access: fetched hondainfocenter.com, motortrend.com, newsroom.porsche.com PDFs, rimac-automobili.com, lucidmotors.com PDF, hyundai.news PDF, epa.gov xlsx; refused/unreachable: hondanews.com (403), tesla.com / tesla.cn / evspecifications.com (agent DNS refusal; a direct fetch was blocked by the permission classifier, not retried), caranddriver.com, kiamedia; Tesla/Rivian figures therefore come from search summaries and are labelled reported/estimated
codex_verification_requests:
  - Taycan Turbo S: overboost duration with Launch Control; exact gear ratios; C/D test mass and mode
  - Model 3 Performance / Plaid: Tesla per-motor torque and peak battery power; test-car wheel fitment
  - Model 3 launch residual (+0.22 s to 60 mph): actual reduction (Tesla 9.04?) vs EPA N/V-derived 8.8
  - Lucid Sapphire per-motor split; R1T gen-1 per-motor ratings and test-truck tire
  - Ioniq 5 N: MotorTrend drive mode (NGB?), N e-Shift virtual ratios/rpm if Hyundai published them
  - Civic: Step Shift step ratios, change rpm and rates; converter stall; MotorTrend drive mode
  - Nevera: power vs speed (trap residual +16 mph), motor max rpm, magazine test
open_items: EV and CVT kept open until Codex verification per owner directive; Taycan two-speed live smoke shows gear 1/2 with paddles
```
