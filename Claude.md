# Purpose: Claude logs changes made here; Codex reads this file as a reference before reviewing the branch.
# Rule 1 (Codex): Inspect this file before reviewing the codebase.
# Rule 2 (Claude): Document changes in maximum detail using dense, machine-readable language (human readability is not required).
# Rule 3 (Claude): Clear this file upon creating a new branch. Exclude changes from other branches.
# Rule 4 (Both): Preserve this header block when clearing the file.

## round=2 · branch=claude/determined-planck-qhjicj · base=6e4726a (Codex handoff of d6e2b40, result=changes_requested_before_merge) · impl=a6da8c5 · PR=#7 (draft)

### P1 · src/data/catalog/cars/r44-nissan-z.ts
- removed bm `cd` (sourceId src-cd → sports.yahoo Mach 1 comparison; that Z = 6MT 4.5/13.0@111; 4.0/12.3@116 unsupported) + source src-cd.
- added source `src-cd-at` = https://www.caranddriver.com/reviews/a43987884/2023-nissan-z-automatic-by-the-numbers/ (road-test); bm `cd-at` exact, timing rollout-1ft, results {zeroTo60MphS 4.3, quarterMileS 12.7, quarterMileTrapMph 115, rolloutS 0.3}, conditions {testMass "3,592 lb as tested", fuel "91 AKI"}, date 2023; verification cites Codex review + replaced-row reason.
- gaps: removed "…no independent instrumented automatic test found" and "MotorTrend Performance 9AT test (roster source)"; added "MotorTrend Performance 9AT first-test figures (roster source; not transcribed)".
- calibration: free fit → eff ≥0.92 (fitter ceiling, trap still 114.2) → eff held 0.88 (automatic bound), grip 1.30→1.22. residual (rollout basis): 0–60 4.31 vs 4.3; ET 12.66 vs 12.7; trap 112.61 vs 115 (−2.4, visible, provenance explains VR30 underrating).
- stock: A 55.1→A 53.3; BR 0–100 4.657→4.851; BR ET 12.823→12.986. no other car changed (diff of stockStats.generated.ts). SLC-4 unchanged; boundary-margin test passes. owners byte-identical.

### P2 · picker focus under StrictMode
- src/Root.tsx (new): <StrictMode><AppProvider store?><App/></AppProvider></StrictMode>; src/main.tsx renders <Root/> (same tree as before).
- src/components/catalog/CarPicker.tsx: effect setup focuses first input (fallback first enabled button) when document.activeElement ∉ panel → reclaims focus after StrictMode replay cleanup (which restores opener). backdrop: onPointerDown records pressedBackdrop=(target===currentTarget); onClick closes iff pressedBackdrop && target===currentTarget. root cause of browser-only bug: closing on pointerdown removed the dialog before the browser's mousedown default → blur to BODY + click-through to element under the backdrop.
- src/__tests__/CarPicker.focus.test.tsx: describe.each over ['without StrictMode' (AppProvider+App), 'through the StrictMode Root' (Root)] × 7 cases: open→search focused + Escape→opener; focus stays inside across re-renders; Close→opener; backdrop pointerDown+blur+click→opener; press inside dialog + click on backdrop → stays open; select GR86→opener; Tab/Shift+Tab wrap. 14/14 pass; with pre-fix CarPicker: 2 StrictMode cases fail (reproduces Codex finding).
- browser (Chromium 1180×820, hasTouch; dev server = StrictMode, preview = production): Enter-open→Search; typing goes to search; Escape→Lane B; tap-open→Search; mouse click on backdrop → closed, focus Lane B, view unchanged (no click-through); touch tap on backdrop → same; Shift+Tab stays inside; 0 console errors in both modes. WebKit NOT available (only chromium in /opt/pw-browsers) → native iPad Safari still unverified.

### P3 · original sources (verification = "checked in the Codex inspection of d6e2b40")
- r18 Evo FE: bm cd-agg→`cd`, sourceId src-agg(0-60specs)→`test` (C/D a15102392), publication "Car and Driver", conditions testMass "3,517 lb as tested"; timing stays unconfirmed (CD_PRE note); src-agg removed. values unchanged (4.4/13.3@104) → calibration unchanged.
- r66 SF90 AF: bm mt-agg→`mt`, sourceId→`test` (MotorTrend AF first test), conditions testMass "3,839 lb as tested", other ["Assetto Fiorano package"]; src-agg removed; C/D-via-Carscoops row stays equivalent (AF unconfirmed). catalog-only.
- r67 Taycan Turbo S: bm `cd` verification → original C/D page; timing stays unconfirmed. catalog-only.
- r04 GR Yaris: source `src-autocar` = https://www.em.autocar.co.uk/car-review/toyota/gr-yaris-2020-2024; bm autocar sourceId test(cloudfront mirror)→src-autocar; launchControl "None" (confirmed); timing basis + Circuit Pack stay unconfirmed (match=equivalent); gap text updated.

### VERIFICATION
- npm run generate:stats ✓, npm run generate:gaps ✓, npm run check ✓ (824 tests / 21 files; typecheck, lint, build; chunk warning ~749 kB min unchanged).
- CI/Vercel for pushed head: see PR #7 body.

### STILL OPEN (unchanged from Codex "remaining")
- second-hand rows not yet checked against originals (all rows whose verification says syndicated/aggregator/forum/search summary); BRZ converter parameters; Z07/GT500 package aero; Turbo S AWD approximation + 0–130 mph primary source; GR Yaris timing basis/Circuit Pack; Hyundai US N DCT doc + Kona N gearbox code; Octavia/RS 3 axle assignment; Macan GTS axle conflict; no benchmark: CT4-V, ZL1 1LE, E 63 wagon; native iPad Safari check.

## branch=claude/determined-planck-qhjicj · base=origin/main@1d6734e + merge(origin/claude/determined-planck-qhjicj@234198e, Codex.md=branch copy, no other content) · impl=d401274 · handoff=Codex.md "Initial inspection and engineering handoff" (reviewed e4eecd8)

### SCOPE
- input: Codex.md items 1–7 + "Remaining research and validation" + process note (fresh branch from main, draft PR, merge=Eason).
- branch_policy: session may push only `claude/determined-planck-qhjicj` → branch restarted from current main (equivalent to fresh); Codex record commit 234198e merged (no force push). Claude.md was header-only (no prior entries to clear).
- invariants_kept: owner ids `lexus-is200t-2016-tw`,`skoda-superb-combi-lk-280` stock stats byte-identical on both timing bases (verified vs main generated table); classes D/C unchanged; colorSlots, storage schema, saved tuning/results untouched; no vehicle id renamed.

### CODE
- src/components/catalog/CarPicker.tsx:27 opener=useState(()=>document.activeElement) captured during first render (before CatalogBrowser autoFocus); :30 onCloseRef synced each render; key effect deps=[opener] (registered once, was [onClose] → re-ran every render and re-captured search input); :63 cleanup restores focus iff opener.isConnected (Escape|close button|backdrop|selection all unmount); Tab trap also pulls focus in when activeElement outside panel.
- src/__tests__/CarPicker.focus.test.tsx (new, 5 tests, jsdom): autofocus→search; Escape→opener; Close→opener; select GR86→opener (aria-label updated); rerender (search edits)→Escape→opener; Tab last→first, Shift+Tab first→last. pre-fix: 4/5 fail.
- src/data/catalog/types.ts:203 CatalogEntry.simCaveats?: readonly string[] (playable-model approximations).
- src/components/catalog/CatalogBrowser.tsx:213 ReadinessBadge adds warning badge "Provisional model" (title=caveats) when sim&&simCaveats; :185 CarRow note=sortNote(e,sort); :279 renders `.car-row__sortnote`.
- src/views/GarageView.tsx:212 hero callout "Provisional model." + caveats; :246 Reference-tests note that residuals include the approximations.
- src/data/catalog/index.ts:194 measuredResult(e,key)→{value,benchmark}: pool=exact-match benchmarks if any else equivalents; min value. :206 measured()=measuredResult.value (was min over ALL benchmarks incl. drag-strip/equivalent). :218 sortNote(e,key): sim → "Simulated <m> x s · brake release"; meas → "Measured <m> x s · <publication> · <timing> [· equivalent configuration]"; null for non-value sorts. :181/:183 SORT_LABEL meas-* now say "(exact tests first)".
- src/styles/global.css: .car-row__sortnote (12.5px, --text-secondary, tabular-nums), .badge-wrap.
- src/data/catalog/__tests__/catalog.test.ts:124 per-entry invariant: unique source ids, unique source URLs, unique benchmark ids, benchmark.sourceId∈sources, factory.sourceId∈sources. :137 measured-sort tests (Redeye exact 11.4 beats drag-strip 10.8 equivalent; GR Yaris falls back to equivalent + note says so; note names publication+timing; non-value sort→null).
- src/data/catalog/classes.ts:36 SLC-3→SLC-4; :45 B 39.4→36.4 (gap 33.6↔39.1; trigger: Integra Type S 39.1, 0.3 below B after refit). fixtures still slow=12.4→D, middle=42.2→B, fast≈87→S+; min boundary margin ≥0.9 except B neighbours 2.7/2.8. README thresholds/version updated.
- regenerated: src/data/catalog/stockStats.generated.ts (formula SLC-4), docs/DATA_GAPS.md.

### DATA (src/data/catalog/cars/rNN-*.ts; provenance labels: verified=factory doc, reported=secondary/test, estimated=assumption)
- r03 GR Corolla Circuit [item1]: bm `mt` sourceId src3(Carscoops)→`test`(MotorTrend Circuit first test); results 5.4/13.7@100.1 (was trap 101.2=Core); conditions testMass "3,261 lb as tested (58/42)", other "Prototype without the stock rear wing and the edition shift knob"; match=equivalent + deviation; src3 dropped. chassis fwf 0.6→0.58 (reported, MT measured). prov Gear ratios estimated→verified (Toyota US MY2023 brochure). curb 3,285 lb factory kept. gaps: removed gear ratios/Cd/weight dist/AWD split; added power-torque rpm bands, production-car (with wing) test.
- r40 BRZ Limited 6AT [item2]: bm `mt` (test) exact rollout-1ft 6.6/14.9@97.0, testMass "2,878 lb as tested (56/44)", tires "Michelin Pilot Sport 4, 215/40 R18", launch "both pedals ≈2,200 rpm". fwf 0.54→0.56 (reported). axle 3.909 kept. residual BEFORE refit (grip 1.30 layout median): sim ro 0–60 5.665 vs 6.6. AFTER: grip 1.00 (floor) eff 0.865 → 5.95 vs 6.6, ET 14.54 vs 14.9, trap 96.98 vs 97.0; residual kept, cause documented in grip provenance (estimated converter stall 2,300 rpm ×1.9 likely overstates low-speed thrust). C/D Premium AT (different trim+tires) recorded as source only, no numbers → gap.
- r38 GR Supra A91-MT [item3]: duplicate src2 (Toyota release vs Yahoo syndication) → Yahoo source removed; bm `cd`→sourceId `test` (C/D original a41096194); trap 115→114, rolloutS 0.3, testMass "3,343 lb as tested", tires "Michelin Pilot Super Sport", other ["A91-MT Edition package","Driver Assist package"]. refit grip 1.20→1.23, eff 0.90→0.879 → 3.89/12.42@114.0.
- r04 GR Yaris [item6]: duplicate src2 → Toyota Ireland renamed `src-toy-ie` (factory.sourceId repointed); roster src2=Toyota GB pre-facelift full release kept. bm `autocar` (test) 0–60 5.2, timing=unconfirmed, match=equivalent (Circuit Pack unconfirmed), conditions testMass "1,283 kg as tested (kerb with fuel)", occupants Two, fuel Full tank, launchControl "None (per handoff; unconfirmed)". Final drive prov reported→estimated (2024 facelift-era Toyota UK doc; pre-facelift GB release unchecked). SA/AU 0–100 km/h benches kept equivalent; 0–60 mph distinct.
- r53 Z06 Z07 [item4]: bm `mt` (test) exact rollout 2.8/10.8@128.2, tires "Cup 2 R ZP (Z07)", other ["Z07 package with Carbon Fiber Aero","Optional carbon-fiber wheels"]. prov ratios+5.56 axle verified (Chevrolet MY2023 brochure); tires+compound from GM technical release (src-gm). note + simCaveats: generic coupe Cd, package Cd/CdA unknown, trap residual unfitted (sim 133.86 vs MT 128.2 / C/D 131). gaps: Z07 aero Cd/CdA, factory curb (Z07+carbon wheels), weight distribution.
- r51 911 Turbo S [item7]: curbMassKg 1654(C/D test 3,646)→1649 (factory 3,636 lb, verified Porsche US sheet jcr:8b531ae3…); bm `cd` +zeroTo100MphS 5.3, +zeroTo130MphS 8.9 (held-out; 0–130 from forum repost of C/D table), rolloutS 0.2, testMass "3,646 lb as tested", tires factory sizes (model not transcribed). simCaveats: single averaged rolling radius tied to rear axle, 3.33 front display-only, PTM generic 0–0.5 front share. refit grip 1.19→1.18 eff 0.88 (fit asked 0.92; AWD bound). held-out: 0–100 mph sim 5.62 vs 5.3, 0–130 mph 9.56 vs 8.9; 0–60 2.21 vs 2.2; trap 133.66 vs 137 → approximation fine at launch, short at speed (consistent with underrating/eff cap).
- r56 Redeye: bm `carscom` sourceId src4→test (dup URL), timing unconfirmed→drag-strip, match exact→equivalent, deviation drag-strip special launch, conditions surface; src4 dropped.
- r15 Elantra N DCT: ratios [3.714,2.6,1.95,1.48,1.12,0.85,0.65,0.498] (2–7 interpolated) → [3.714,2.261,2.174,1.621,0.927,0.767,0.878,0.698]; finalDrive 3.8 single → [3.8,3.8,2.714,2.714,3.8,3.8,2.714,2.714]. evidence: Auto123 2022 (1–3) + 2024 (3–8, FD 2.71); Motor Matchup 3rd/4th/7th/8th = ratio×2.714/3.8 (normalised to 3.8); Hyundai AU i30 N DCT sheet 3.800(1,2,5,6,R)/2.714(3,4,7,8). status reported (no Hyundai US doc). src-mt (dup of test) removed; stale gap "MotorTrend first-test results" removed. refit grip 1.24→1.30 eff 0.90 (cap) → MT 4.70/13.22@106.04 vs 4.7/13.3@106.7.
- r57 Kona N: gears still interpolated (US gearbox code pending, per handoff); note: Elantra N DCT uses identical eight ratios (supports, does not confirm). simCaveats provisional gearing. grip/eff transferred from Elantra N → 1.30/0.90.
- simCaveats added: r32 Octavia (older single-ratio DQ381 set pending shaft assignment), r47 A110 (effective reductions), r64 Huracán (secondary gearing, generic AWD map), r45 GT-R (2.937 front display-only), r51, r53, r57.
- dedupe same-URL sources: r21 src-mw→src3, r54 src-mt→test, r63/r64 src-cd→test.
- new benchmarks (research via web search; pages themselves unreachable → verification notes say syndicated/aggregator/forum):
  r02 Integra Type S C/D (magazine Sep 2023) rollout 5.1/13.7@105, fuel premium → refit grip 1.15→1.05, eff 0.89 held (fit asked 0.826) → trap 107.74 vs 105 kept visible.
  r07 Veloster N MotorWeek 5.2/13.9@102 equivalent (Performance Package unconfirmed); no refit (grip 1.15 FWD median) → sim 5.92/5.53 vs 5.2.
  r18 Evo FE C/D via 0-60specs 4.4/13.3@104 → grip 1.30 (bound) eff 0.90 (fit asked 0.913, cap) → 5.12/4.75 vs 4.4 residual kept.
  r21 IS 500 MotorWeek 12.9@112 + C/D forum repost 4.4/12.9@112, both equivalent (Premium unconfirmed); no refit.
  r44 Z 9AT C/D comparison 4.0/12.3@116 (conflict: another article quotes C/D 4.3) → grip 1.30 (bound) eff 0.88 held (fit asked 0.92) → 4.13/12.51@112.75.
  r48 M2 6MT C/D 3.9/12.2@118 (testMass 3,745 lb, Carbon package in options) + C/D comparison 4.1/12.3@119 → grip 1.22 eff 0.90 held (fit asked 0.92) → 3.90/12.25@116.66.
  r66 SF90 AF MotorTrend via 0-60specs 2.1/9.6@145.2 (labels flagged unreliable) + C/D via Carscoops 2.0/9.5@148 equivalent (AF unconfirmed). catalog-only.
  r67 Taycan Turbo S C/D 2.4/10.5@130 (as reported by Jalopnik/CarAdvice). catalog-only.
- no benchmark found: r24 CT4-V (claim 4.1 only), r55 ZL1 1LE (estimate only), r34 E63 wagon.

### CLASS DELTAS vs main (SLC-3→SLC-4)
- 2015 Evo FE C(36.1)→B(40.3) via benchmark refit (grip 1.0→1.3, eff 0.85→0.90); 2022 Kona N C(38.4)→B(39.3) via Elantra transfer + B threshold 39.4→36.4. all others unchanged; owners D(18)/C(33.6) unchanged.

### VERIFICATION
- npm run generate:stats ✓, npm run generate:gaps ✓, npm run check ✓ (typecheck, lint, 815 tests / 21 files, build; bundle-size warning unchanged ~734 kB min).
- residual diff (publication timing basis) recorded in PR body; source: report run on main worktree vs branch.
- browser (Chromium 1180×820, touch + keyboard): Lane B Enter→search focused; Escape→Lane B; Shift+Tab first→last, Tab last→first; choose GR86 via Enter→focus Lane B (label updated); Turbo S page shows Provisional callout + 0–130 row; measured ¼-mile sort notes render; 0 console errors. NOT run: native iPad Safari/WebKit.

### UNRESOLVED / ASSUMPTIONS
- network: direct page fetch blocked (DNS); all new figures from web-search summaries or the handoff's transcriptions → verification fields say so; original-page confirmation still open for every "syndicated"/"aggregator"/"forum" row.
- held per handoff: Kona N EU N DCT table (US gearbox code), Octavia per-gear axle mapping, RS 3 shaft assignment, Macan GTS axle conflict (4.67 EU vs 4.13 US).
- Elantra N gearing is secondary-only (no Hyundai US doc); Turbo S/Z/M2/GT500/Supra efficiency held at bounds where fits asked >bound (engines widely reported underrated) → trap residuals visible.
- BRZ launch residual (−0.65 s) attributed to estimated converter parameters; no converter data sourced.
- GR Yaris Autocar timing basis + Circuit Pack + launch-control absence unconfirmed; pre-facelift Toyota GB release unchecked.
- Z07 aero Cd/CdA unknown; GT500 CFTP aero unknown (trap +4.8 mph, unchanged).
- remaining playable rows without any benchmark: 24 (CT4-V), 55 (ZL1 1LE); catalog-only: 34 (E63 wagon).
- picker verified in Chromium only; WebKit not installed in this environment.
