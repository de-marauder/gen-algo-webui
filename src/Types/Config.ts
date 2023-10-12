
export type TypeConfig = {
  _id: string;
  name: string;
  mbGenSize: number,
  mbMovingAverage: number,
  mbMutationProbability: number,
  mbPopSize: number,
  smrGenSize: number,
  smrMovingAverage: number,
  smrMutationProbability: number,
  smrPopSize: number,
  pressureLowerbound: number,
  pressureUpperbound: number,
  temperatureLowerbound: number,
  temperatureUpperbound: number,
  steamCarbonRatioLowerbound: number,
  steamCarbonRatioUpperbound: number,
  standardPressure: number,
  ch4: number,
  c2h6: number,
  c3h8: number,
  ic4: number,
  nc4: number,
  ic5: number,
  nc5: number,
  ic6: number,
  nc6: number,
  co2: number,
  h2: number,
  n2: number,
  userid: string
}


export type Config = {
  name?: string;
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
