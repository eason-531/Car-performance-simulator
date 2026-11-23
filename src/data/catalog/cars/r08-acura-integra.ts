import type { CatalogEntry } from '../types';

/** Roster #8: 1997 Acura Integra Type R (US). */
export const entry: CatalogEntry = {
  id: "1997-acura-integra-type-r-us-liftback-fwd-5mt",
  roster: 8,
  section: "Hot hatches",
  make: "Acura",
  model: "Integra",
  trim: "Type R",
  modelYear: 1997,
  market: "US",
  body: "Liftback",
  bodyLabel: "3-door liftback",
  chassisCode: "DC2",
  aliases: [
    "ITR",
    "Integra Type R",
    "DC2"
  ],
  origin: "Japan",
  usage: [
    "Hot Hatch",
    "Sport Compact",
    "Track"
  ],
  drive: "FWD",
  transmission: "MT",
  transmissionLabel: "5-speed manual",
  powertrain: "Petrol",
  engineLabel: "1.8 I4 (B18C5)",
  modelPath: "MT",
  factory: {
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "1997 Acura Integra Type R archived test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15141504/1997-acura-integra-type-r-archived-test-review/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Honda Integra Type-R (1997–2001) specs",
      publisher: "Parkers",
      url: "https://parkers.co.uk/honda/integra-type-r/coupe-1997/specs",
      kind: "reference"
    }
  ],
  benchmarks: [],
  dataGaps: [
    "Rated output (US B18C5)",
    "5-speed gear ratios and final drive",
    "Curb mass",
    "Car and Driver 1997 test results",
    "Tire size",
    "Drag coefficient"
  ],
  notes: [
    "Recalled (unverified) figures: 195 hp @ 8,000 rpm, 130 lb-ft @ 7,500 rpm, 5-speed 3.230/2.105/1.458/1.107/0.848, final drive 4.400, ≈2,639 lb.",
    "Parkers quotes 0–60 mph in 6.5 s for the UK car (a database figure, not a test)."
  ],
  unsupportedReason: "Awaiting spec sheet: no reachable source gave the US car’s output, gearing or mass (only recalled figures), so it is not routed through the physics model."
};
