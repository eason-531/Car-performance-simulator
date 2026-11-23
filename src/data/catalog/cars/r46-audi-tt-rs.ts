import type { CatalogEntry } from '../types';

/** Roster #46: 2018 Audi TT RS Coupe (US). */
export const entry: CatalogEntry = {
  id: "2018-audi-tt-rs-coupe-us-coupe-awd-7dct",
  roster: 46,
  section: "Sports cars",
  make: "Audi",
  model: "TT RS",
  trim: "Coupe",
  modelYear: 2018,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "8S",
  aliases: [
    "TTRS",
    "8S",
    "quattro"
  ],
  origin: "Germany",
  usage: [
    "Sports Car"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "7-speed S tronic",
  powertrain: "Petrol",
  engineLabel: "2.5 turbo I5 (EA855 evo)",
  modelPath: "Existing",
  factory: {
    power: "400 PS (394 hp)",
    torque: "480 Nm (354 lb-ft)",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2018 Audi TT RS test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a14516384/2018-audi-tt-rs-test-review/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Audi TT RS Coupé technical data (eTD)",
      publisher: "Audi MediaCenter",
      url: "https://uploads.audi-mediacenter.com/system/production/car_motorizations/837/file_en/ab1a688414eda4f444a9a7fad976f57fbe0061a8/eTD_Audi_TTRS_Coupe_TFSI_221102.pdf",
      kind: "manufacturer"
    },
    {
      id: "src3",
      title: "Audi TT RS drivetrain",
      publisher: "Audi MediaCenter",
      url: "https://www.audi-mediacenter.com/en/the-audi-tt-rs-2924/drivetrain-2940",
      kind: "manufacturer"
    }
  ],
  benchmarks: [],
  dataGaps: [
    "7-speed DQ500 gear ratios 1st–3rd (4th–7th and final drive weakly sourced)",
    "Car and Driver 2018 test results (0–60, ¼ mile, trap)",
    "Curb mass",
    "Power/torque rpm bands",
    "Tire size",
    "Drag coefficient"
  ],
  notes: [
    "A dealer listing gives 4th–7th as 1.02/0.79/0.76/0.64 and a 3.45 final drive; 1st–3rd were not found, and older DQ500 tables from other applications do not match."
  ],
  unsupportedReason: "Awaiting spec sheet: the 8S TT RS 1st–3rd gear ratios (only 4th–7th and a 3.45 final drive were found, from a dealer listing) not found in any reachable source, so the car is not routed through the physics model."
};
