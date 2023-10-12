
export const smrConfigInputLabels = {
  smrPopSize: 'Population size',
  smrGenSize: 'Generation size',
  smrMovingAverage: 'Moving average',
  smrMutationProbability: '%age Mutation probability',
}
export const mbConfigInputLabels = {
  mbPopSize: 'Population size',
  mbGenSize: 'Generation size',
  mbMovingAverage: 'Moving average',
  mbMutationProbability: '%age Mutation probability',
}
export const flareGasCompositionConfigInputLabels = {
  ch4: 'CH4',
  c2h6: 'C2H6',
  c3h8: 'C3H8',
  ic4: 'i-C4',
  nc4: 'n-C4',
  ic5: 'i-C5',
  nc5: 'n-C5',
  ic6: 'i-C6',
  nc6: 'n-C6',
  h2: 'H2',
  n2: 'N2',
  co2: 'CO2',
}
export const standardPressureLabel = 'Standard pressure'

export const traitBoundariesConfigInputLabels = {
  pressureLowerbound: 'Pressure lower bound (bar)',
  pressureUpperbound: 'Pressure upper bound (bar)',
  temperatureLowerbound: 'Temperatuore lower bound (K)',
  temperatureUpperbound: 'Temperature upper bound (K)',
  steamCarbonRatioLowerbound: 'S/C ratio lower bound (kmol/kmol)',
  steamCarbonRatioUpperbound: 'S/C ratio upper bound (kmol/kmol)',
}
export const smrConfig = {
  smrPopSize: 30,
  smrGenSize: 50,
  smrMovingAverage: 10,
  smrMutationProbability: 20,
},
  mbConfig = {
    mbPopSize: 30,
    mbGenSize: 30,
    mbMovingAverage: 10,
    mbMutationProbability: 10,
  },
  standardPressure: StPressure = '1.01325',
  flareGasComposition = {
    ch4: '100',
    c2h6: '0',
    c3h8: '0',
    ic4: '0',
    nc4: '0',
    ic5: '0',
    nc5: '0',
    ic6: '0',
    nc6: '0',
    h2: '0',
    n2: '0',
    co2: '0',
  },
  traitBoundaries = {
    pressureLowerbound: 20,
    pressureUpperbound: 30,
    temperatureLowerbound: 600,
    temperatureUpperbound: 1200,
    steamCarbonRatioLowerbound: 2,
    steamCarbonRatioUpperbound: 8,
  }

export type SmrConfig = typeof smrConfig
export type MbConfig = typeof mbConfig
export type FlareGasComposition = typeof flareGasComposition
export type TraitBoundaries = typeof traitBoundaries
export type StPressure = string

type ConvertValuesToNumbers<T> = {
  [K in keyof T]: number;
};

export function convertObjectValuesToNumbers<T extends Record<string, any>>(obj: T): ConvertValuesToNumbers<T> {
  const result: Partial<ConvertValuesToNumbers<T>> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = parseFloat(obj[key]);
      result[key] = isNaN(value) ? 0 : value; // Default to 0 if the conversion fails
    }
  }

  return result as ConvertValuesToNumbers<T>;
}
