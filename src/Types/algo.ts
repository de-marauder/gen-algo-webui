import { Generations } from "@/app/(Dashboard)/dashboard/visualisation/_helpers";
import { TypeConfig } from "./Config";

export type Config = {
  smrConfig: {
    smrPopSize: number;
    smrGenSize: number;
    smrMovingAverage: number;
    smrMutationProbability: number;
  };
  mbConfig: {
    mbPopSize: number;
    mbGenSize: number;
    mbMovingAverage: number;
    mbMutationProbability: number;
  };
  standardPressure: number;
  flareGasComposition: {
    ch4: number;
    c2h6: number;
    c3h8: number;
    ic4: number;
    nc4: number;
    ic5: number;
    nc5: number;
    ic6: number;
    nc6: number;
    h2: number;
    n2: number;
    co2: number;
  };
  traitBoundaries: {
    pressureLowerbound: number;
    pressureUpperbound: number;
    temperatureLowerbound: number;
    temperatureUpperbound: number;
    steamCarbonRatioLowerbound: number;
    steamCarbonRatioUpperbound: number;
  };
};

export type AlgoResult = {
  config: string | TypeConfig;
  stopCondition: Stop // convergence, fitness or max gen_size
  numberOfGenerationsRan: number;
  pressure: number;
  temperature: number;
  steamToCarbonRatio: number;
  outputH2: number;
  outputH2O: number;
  outputCO2: number;
  outputCO: number;
  outputCH4: number;
  error: number;
  timeTaken: string;
} & Generations

export type Stop = 'convergence' | 'isFit' | 'maxGen';
