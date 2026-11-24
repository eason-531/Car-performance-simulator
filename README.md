# Car Performance Simulator

An interactive, physics-based performance simulator built with React,
TypeScript and Vite. It centres on the owner's two cars (**My Garage**) and adds
a researched catalog of 73 stock configurations, 55 of which can be driven,
tested, raced and tuned, plus a growing set of playable hypercars (6 so far). It runs entirely in the browser (no backend, no paid
APIs) and is designed for iPad Safari.

*This project is held by Eason and built mainly with Claude and ChatGPT.*

| Live drive | Acceleration tests |
|---|---|
| ![Live drive](docs/screenshots/drive.jpg) | ![Tests](docs/screenshots/tests.jpg) |
| **Drag race** | **Dyno** |
| ![Drag race](docs/screenshots/drag-race.jpg) | ![Dyno](docs/screenshots/dyno.jpg) |

## Features

- **Live drive.** A real-time cockpit with tachometer, speedometer, boost gauge,
  gear indicator, shift lights and warning lights (traction control, speed
  limiter, rev limiter, Auto Hold, lock-up/clutch).
  - Touch pedals: press higher for more pedal, and both pedals can be used at
    once for left-foot braking. Shift paddles sit between them.
  - Automatic or manual shifting.
  - A GPS-style performance timer records 0–100, 0–200 and ¼ mile while you drive.
- **Acceleration tests.** 0–100 and 0–200 km/h, 100–200, 0–60 mph, 60 ft, ⅛ and
  ¼ mile with trap speeds, and 1 km. Choose a brake-boost or a standard launch.
  - Speed, rpm (shift pattern) and boost traces share one crosshair.
  - Optional overlay of the other car's run.
  - Published reference figures are shown alongside for comparison.
- **Drag race.** Lexus against Škoda, or any car against itself stock vs tuned,
  over ⅛ mile, ¼ mile, ½ mile or 1 km. A Christmas-tree countdown is followed by
  a chase camera, a minimap and a results card with winner, margin, ET and trap.
- **Dyno.** Power, torque and boost against rpm, at the crank or at the wheel.
  Tuned and stock curves overlay each other, with a synced crosshair, an
  animated "dyno pull" and a table view.
- **Tuning.**
  - Stage 1 ECU remap and a −30 % to +50 % power adjustment.
  - Tire sizes per car and five tire compounds.
  - Weight changes, with passenger presets.
  - Speed limiter on/off.
  - Overrides for every estimated model parameter: Cd, frontal area and
    drivetrain efficiency.
  - Predicted performance against stock updates live.
- **Results.** Save tests, drag runs and live drives on the device. Compare up
  to four runs side by side with best values marked and a speed-vs-time overlay,
  or export them as JSON.
- **Garage.** *My Garage* holds the owner's cars; *All Cars* browses the
  catalog with search (case- and accent-insensitive), filters (brand, origin,
  market, class, body, use, era, drivetrain, transmission, powertrain),
  labelled sorts and favourites. Each car page shows specifications, gearing,
  measured benchmarks next to the simulation (with residuals), its stock class
  and a source/confidence rating for every parameter.
- **One car picker everywhere.** The same searchable picker chooses the active
  car, the test comparison and each drag lane; a car can race itself stock vs
  tuned. Favourites come first.

## My Garage: the owner's cars

| | 2016 Lexus IS 200t (Taiwan) | Škoda Superb Combi L&K 2.0 TSI 280 4x4 |
|---|---|---|
| Engine | 8AR-FTS 2.0 turbo I4 | EA888 Gen 3 2.0 TSI I4 |
| Output | 245 PS @ 5,800 · 350 Nm @ 1,650–4,400 | 280 PS @ 5,600–6,500 · 350 Nm @ 1,700–5,600 |
| Driveline | RWD, 8-speed torque-converter automatic | AWD (Haldex), 6-speed wet DSG (DQ250) |
| Curb mass | 1,680 kg (Taiwan spec sheet) | 1,560 kg (EU 1,635 kg incl. driver) |
| Factory 0–100 | 7.0 s | 5.8 s |

Every parameter has a status: **Verified**, **Reported** or **Estimated**. These
are listed in the Garage view and in the data files. For example, the Superb's
exact DQ250 ratios are not published, so the simulator uses the MQB
high-output DQ250 set and marks it as estimated.

### Calibration against real-world data (stock)

| Measurement | Simulation | Published |
|---|---|---|
| Škoda 0–100 / 0–160 / 0–180 km/h (standard launch) | 6.1 / 14.4 / 18.7 s | 6.0 / 14.1 / 18.6 s (Automobil Revue road test) |
| Škoda 0–100 km/h (brake-boost launch) | 5.7 s | 5.8 s factory claim |
| Lexus 0–100 km/h (brake-boost launch) | 7.1 s | 7.0 s factory claim (7.76 s Taiwan P-Box test) |
| Lexus ¼ mile | 15.2 s | ≈ 15.3 s (US press test) |

These comparisons are enforced by unit tests, so a change that breaks realism
fails CI. The owner cars keep their IDs, saved results, calibration and colours,
and remain the default drag matchup on a fresh install.

## The catalog

73 stock configurations (`src/data/catalog/cars/rNN-*.ts`, one file each) carry
an identity (year, make, model, trim, market, body, drivetrain, gearbox),
factory claims, sources, measured benchmarks and the data gaps still open.
Playable hypercars added after the original roster live in
`src/data/catalog/cars/hNN-*.ts`, numbered by their place in the hypercar
handoff, and carry the **Hypercar** tag (a quick filter in the car browser).

- **Playable (55).** Torque-converter automatics, dual-clutch and manual
  gearboxes, front, rear and all-wheel drive. Their physics input is built by
  `buildSpec()` from rated peaks (the curves never exceed the published power or
  torque), and every value that is not sourced is labelled *estimated* with a
  reason.
- **Hypercars (6).** Bugatti Veyron 16.4, Chiron, Chiron Sport and Chiron
  Super Sport, Koenigsegg CCX (6-speed manual) and Porsche Carrera GT, built
  from Bugatti, Koenigsegg and Porsche technical data and the EPA filing, with
  Car and Driver results where a test exists.
- **Catalog-only (18).** CVTs, hybrids, EVs, the AMG MCT, the LFA's automated
  manual and the Raptor's 4WD wait for models of their own, so they are never
  routed through an incompatible one. Some conventional cars wait for gear
  ratios that no reachable source published. They can still be browsed and
  compared on their measured results.
- **Benchmarks.** Each result records the publication, the timing basis
  (from brake release, or 1-ft rollout as Car and Driver has used since late
  2019 and MotorTrend uses), test conditions, and whether the tested car is the
  exact configuration or an *equivalent* (with the deviation stated). 0–60 mph
  figures are never converted to 0–100 km/h. The Tests view can show both
  timing bases.
- **Calibration.** Only two declared estimates are fitted, and only against
  defensible tests: tire grip (×1.00–1.30) and drivetrain efficiency (within
  plausible bounds for the layout and gearbox). Where a fit hits a bound, the
  residual is left visible. Cars without a usable launch benchmark take the
  median fitted grip of their layout (front drive 1.15, rear drive 1.30).
- **Manual gearboxes** are driven by a deterministic test driver: no creep,
  a pre-revved launch at the peak-torque rpm (4,000 rpm minimum, 75 % of the
  redline maximum), a 0.3 s clutch engagement and 0.3 s shifts with the drive
  interrupted.
- **Stock classes D, C, B, A, S and S+** come from one standardized stock run
  per car (formula SLC-4: 45 % quarter-mile ET, 40 % trap speed, 15 % 0–100
  km/h). They ignore your tuning. The thresholds (20/36.4/46.5/64/78) sit in wide
  gaps of the score distribution and are checked against slow, middle and
  fast reference fixtures. The table is generated offline into
  `stockStats.generated.ts` (`npm run generate:stats`), and a test fails if it
  goes stale.
- **Open data.** [`docs/DATA_GAPS.md`](docs/DATA_GAPS.md) lists every car's
  missing or unconfirmed inputs with the sources already consulted
  (`npm run generate:gaps`). Spec sheets for those cars can be dropped into the
  car files to confirm values or make catalog-only cars playable; the first
  owner-supplied follow-up is kept in [`docs/spec-sheets/`](docs/spec-sheets/).

## The physics model

All physics lives in `src/physics/` and is plain TypeScript with no React. It
advances in **fixed 1 ms steps**. The live view uses a time accumulator on top
of `requestAnimationFrame`, so results are identical at any frame rate, and the
headless tests run the same code.

- **Engine.** A full-load torque curve (monotone cubic interpolation). Torque is
  driven by manifold pressure, and boost builds through an rpm-dependent
  turbo-spool time constant, so turbo lag emerges naturally. The model also
  covers friction and pumping losses, an idle controller and a rev limiter.
- **Torque converter (Lexus).** A capacity-factor (K-factor) model with torque
  multiplication up to the coupling point, plus lock-up from 2nd gear.
- **Dual-clutch launch (Škoda).** The launch clutch is controlled to hold a
  target launch rpm until it synchronises. There is creep at idle and brake-hold
  boosting.
- **Gearbox.** Per-gear final drives and shift times with a torque dip and a
  ratio blend. The automatic shift schedule computes optimal full-throttle
  upshift points and handles multi-gear kickdown and coasting downshifts. Manual
  mode has over-rev protection and stall protection.
- **Traction.** Tire μ by compound and width, with longitudinal weight transfer
  from CG height and wheelbase. Limits are modelled separately for RWD, FWD and
  AWD (the Haldex rear share is limited), with a traction-control slip margin.
- **Road load.** Aerodynamic drag (½ρCdAv²), speed-dependent rolling resistance
  and brakes. Rotating inertia (wheels, plus the engine reflected through the
  gearing) adds to the effective mass.

## Project structure

```
src/
  physics/        Pure simulation: engine, torque converter, gearbox, forces,
                  simulator, metrics, test runners, dyno, live timer (+ tests)
  data/           Owner-car specs, tire compounds (+ tests)
  data/catalog/   Catalog types, spec builder, classes, generated stock stats,
                  filters/sorting, gaps report, and cars/ (one file per row)
  tuning/         Tuning config, validation, and SimVehicle builder (+ tests)
  storage/        localStorage persistence with validation (+ tests)
  state/          React context: settings, tunings, saved results, toasts
  hooks/          Fixed-step real-time loop, playback, element size
  components/     Gauges, charts, pedals, shift lights, UI primitives
  views/          Drive, Tests, Drag Race, Dyno, Tuning, Results, Garage
  __tests__/      UI smoke tests (jsdom)
```

### Adding or completing a catalog car

1. Open (or copy) a file in `src/data/catalog/cars/` and fill in the identity,
   factory claims, sources and benchmarks.
2. To make it playable, add `sim: buildSpec(identity, { engine, transmission,
   drivetrain, chassis, aero, tires, provenance })` with sourced values; any
   omitted input falls back to a labelled estimate.
3. Run `npm run generate:stats` and `npm run generate:gaps`, then
   `npm run check`. The data tests check that the curves reproduce the rated
   power and torque, that the gearing is valid and that the provenance is
   complete.

Chart colours are allocated per chart, so new cars need no colour slot. Every
screen picks up new cars automatically.

## Working entirely from an iPad

Everything below works from Safari on an iPad. No local installation is needed.

### Develop in GitHub Codespaces (recommended)

1. Open the repository on github.com in Safari.
2. Tap **Code**, then the **Codespaces** tab, then **Create codespace on `main`**
   (or on your branch). A full VS Code editor and terminal open in the browser.
3. In the terminal, run:
   ```bash
   npm install
   npm run dev -- --host
   ```
4. When Codespaces offers the forwarded port **5173**, tap **Open in Browser**.
   The app opens in a new Safari tab and reloads as you edit.
5. Before committing, run:
   ```bash
   npm run check   # typecheck + lint + tests + production build
   ```
6. Commit and push from the **Source Control** panel. Stop the codespace from
   github.com → Codespaces when you are done.

For quick edits, open the repo on github.com and press <kbd>.</kbd> (or change
`github.com` to `github.dev` in the URL) for a lightweight editor. Pushes are
still checked by CI.

### Tests and CI

- `npm test` runs all Vitest suites: physics, vehicle data, tuning, storage and
  UI smoke tests.
- GitHub Actions (`.github/workflows/ci.yml`) runs typecheck, lint, tests and
  build on every push and pull request. Results appear in the PR's **Checks**
  tab and under **Actions**.

### Deploy to Vercel (web UI only)

1. Go to [vercel.com](https://vercel.com) and **Sign up / Log in with GitHub**.
2. Tap **Add New… → Project**, find this repository and tap **Import**.
3. Vercel detects **Vite** automatically. `vercel.json` already sets the
   install command (`npm ci`), build command (`npm run build`) and output
   directory (`dist`). Tap **Deploy**.
4. When it finishes you get a public URL such as `car-performance-simulator.vercel.app`.
   - Every push to `main` redeploys production.
   - Every pull request gets its own preview URL, posted on the PR.
5. In Safari on the iPad, open the URL and choose **Share → Add to Home Screen**
   for a full-screen, app-like experience.

No environment variables or secrets are needed.

## Controls

| Action | Touch | Keyboard |
|---|---|---|
| Throttle | Press the right pedal; higher = more | `W` / `↑` |
| Brake | Press the left pedal | `S` / `↓` |
| Shift up / down | `+ Up` / `− Down` paddles | `E` / `→`, `Q` / `←` |
| Auto ↔ manual | Mode switch | `M` |
| Reset | Reset button | `R` |

Auto Hold keeps the car still at rest until you press the throttle, so every
live run is a true standing start. Hold the brake and the throttle together,
then release the brake, to brake-boost.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server (add `-- --host` in Codespaces) |
| `npm run build` | Typecheck and build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm test` | Run all tests once |
| `npm run lint` | ESLint |
| `npm run check` | Typecheck + lint + tests + build |
| `npm run generate:stats` | Regenerate the stock benchmark and class table |
| `npm run generate:gaps` | Regenerate `docs/DATA_GAPS.md` |

## Assumptions and limitations

- The simulation covers a flat, dry road at 20 °C and sea level, with a 75 kg
  driver included in every test mass.
- Traction control is always active. The model limits drive force to the
  available grip rather than simulating spinning wheels.
- Timed tests start at brake release; the Tests view can also report times
  after a 1-ft rollout, as Car and Driver and MotorTrend publish them. The live
  timer, like a GPS box, starts at first motion.
- Catalog research was limited to what web search could reach: many
  publication pages could not be opened directly, so results read from
  syndicated copies, aggregators or second-hand citations say so. Unconfirmed
  inputs are listed in `docs/DATA_GAPS.md`.
- Stage 1 figures are typical aftermarket claims, not dyno sheets of a specific
  tune. Real cars vary with fuel, temperature and calibration.

## Sources

Rated outputs, gear ratios, dimensions and benchmark figures were collected
from:
- manufacturer technical data and Taiwan launch coverage (U-CAR);
- spec databases (auto-data.net, ultimatespecs);
- road tests: Automobil Revue (CZ), 8891/P-Box (TW), US press tests;
- gearbox references for the DQ250;
- for the catalog: manufacturer press kits and specification sheets, road
  tests by Car and Driver, MotorTrend, Edmunds, MotorWeek and others, and
  specification databases, each linked from its car.

Each value's source is listed in the Garage view and in the data files.
