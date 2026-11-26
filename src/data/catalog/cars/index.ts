import type { CatalogEntry } from '../types';
import { entry as ownerLexus } from './owner-lexus-is200t';
import { entry as ownerSkoda } from './owner-skoda-superb';
import { entry as r01 } from './r01-honda-civic-type-r';
import { entry as r02 } from './r02-acura-integra';
import { entry as r03 } from './r03-toyota-gr-corolla';
import { entry as r04 } from './r04-toyota-gr-yaris';
import { entry as r05 } from './r05-volkswagen-golf-r';
import { entry as r06 } from './r06-volkswagen-golf-gti';
import { entry as r07 } from './r07-hyundai-veloster-n';
import { entry as r08 } from './r08-acura-integra';
import { entry as r09 } from './r09-honda-accord';
import { entry as r10 } from './r10-toyota-camry';
import { entry as r11 } from './r11-mazda-mazda3';
import { entry as r12 } from './r12-honda-civic';
import { entry as r13 } from './r13-honda-civic';
import { entry as r14 } from './r14-toyota-prius';
import { entry as r15 } from './r15-hyundai-elantra-n';
import { entry as r16 } from './r16-subaru-wrx';
import { entry as r17 } from './r17-subaru-wrx-sti';
import { entry as r18 } from './r18-mitsubishi-lancer-evolution';
import { entry as r19 } from './r19-lexus-gs-350';
import { entry as r20 } from './r20-lexus-gs-f';
import { entry as r21 } from './r21-lexus-is-500';
import { entry as r22 } from './r22-kia-stinger';
import { entry as r23 } from './r23-genesis-g70';
import { entry as r24 } from './r24-cadillac-ct4-v';
import { entry as r25 } from './r25-cadillac-ct5-v';
import { entry as r26 } from './r26-bmw-m5';
import { entry as r27 } from './r27-bmw-m3';
import { entry as r28 } from './r28-bmw-m340i';
import { entry as r29 } from './r29-audi-rs-3';
import { entry as r30 } from './r30-alfa-romeo-giulia';
import { entry as r31 } from './r31-acura-tlx';
import { entry as r32 } from './r32-skoda-octavia-combi';
import { entry as r33 } from './r33-audi-rs-6-avant';
import { entry as r34 } from './r34-mercedes-amg-e-63-s-wagon';
import { entry as r35 } from './r35-volvo-v60';
import { entry as r36 } from './r36-bmw-m5-touring';
import { entry as r37 } from './r37-toyota-supra';
import { entry as r38 } from './r38-toyota-gr-supra';
import { entry as r39 } from './r39-toyota-gr86';
import { entry as r40 } from './r40-subaru-brz';
import { entry as r41 } from './r41-mazda-mx-5-miata';
import { entry as r42 } from './r42-mazda-mx-5-miata-rf';
import { entry as r43 } from './r43-honda-s2000';
import { entry as r44 } from './r44-nissan-z';
import { entry as r45 } from './r45-nissan-gt-r';
import { entry as r46 } from './r46-audi-tt-rs';
import { entry as r47 } from './r47-alpine-a110';
import { entry as r48 } from './r48-bmw-m2';
import { entry as r49 } from './r49-porsche-718-cayman-gt4-rs';
import { entry as r50 } from './r50-porsche-911-gt3';
import { entry as r51 } from './r51-porsche-911-turbo-s';
import { entry as r52 } from './r52-chevrolet-corvette';
import { entry as r53 } from './r53-chevrolet-corvette-z06';
import { entry as r54 } from './r54-ford-mustang-shelby-gt500';
import { entry as r55 } from './r55-chevrolet-camaro';
import { entry as r56 } from './r56-dodge-challenger';
import { entry as r57 } from './r57-hyundai-kona-n';
import { entry as r58 } from './r58-jeep-grand-cherokee';
import { entry as r59 } from './r59-alfa-romeo-stelvio';
import { entry as r60 } from './r60-porsche-macan';
import { entry as r61 } from './r61-ford-f-150-raptor';
import { entry as r62 } from './r62-lexus-lfa';
import { entry as r63 } from './r63-mclaren-720s';
import { entry as r64 } from './r64-lamborghini-huracan';
import { entry as r65 } from './r65-acura-nsx';
import { entry as r66 } from './r66-ferrari-sf90-stradale';
import { entry as r67 } from './r67-porsche-taycan';
import { entry as r68 } from './r68-hyundai-ioniq-5-n';
import { entry as r69 } from './r69-tesla-model-s';
import { entry as r70 } from './r70-lucid-air';
import { entry as r71 } from './r71-tesla-model-3';
import { entry as r72 } from './r72-kia-ev6';
import { entry as r73 } from './r73-rivian-r1t';
import { entry as h01 } from './h01-bugatti-veyron-16-4';
import { entry as h02 } from './h02-bugatti-chiron';
import { entry as h03 } from './h03-koenigsegg-ccx';
import { entry as h04 } from './h04-bugatti-chiron-super-sport';
import { entry as h06 } from './h06-porsche-carrera-gt';
import { entry as h10 } from './h10-bugatti-chiron-sport';
import { entry as h11 } from './h11-bugatti-chiron-pur-sport';
import { entry as h12 } from './h12-bugatti-veyron-super-sport';
import { entry as h20 } from './h20-mclaren-f1';
import { entry as h26 } from './h26-rimac-nevera';

/**
 * Every catalog entry: the owner's two cars first, then the 73-car roster in
 * order, then the playable extension sets (hypercars) in handoff order.
 */
export const ENTRIES: readonly CatalogEntry[] = [
  ownerLexus,
  ownerSkoda,
  r01,
  r02,
  r03,
  r04,
  r05,
  r06,
  r07,
  r08,
  r09,
  r10,
  r11,
  r12,
  r13,
  r14,
  r15,
  r16,
  r17,
  r18,
  r19,
  r20,
  r21,
  r22,
  r23,
  r24,
  r25,
  r26,
  r27,
  r28,
  r29,
  r30,
  r31,
  r32,
  r33,
  r34,
  r35,
  r36,
  r37,
  r38,
  r39,
  r40,
  r41,
  r42,
  r43,
  r44,
  r45,
  r46,
  r47,
  r48,
  r49,
  r50,
  r51,
  r52,
  r53,
  r54,
  r55,
  r56,
  r57,
  r58,
  r59,
  r60,
  r61,
  r62,
  r63,
  r64,
  r65,
  r66,
  r67,
  r68,
  r69,
  r70,
  r71,
  r72,
  r73,
  h01,
  h02,
  h03,
  h04,
  h06,
  h10,
  h11,
  h12,
  h20,
  h26,
];
