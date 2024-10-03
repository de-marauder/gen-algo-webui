import { TypeRun } from "@/Types/Run"

export type Generations = {
  generations: {
    error: number,
    hydrogen: number,
    methane: number,
    CO: number,
    CO2: number,
    id: number,
  }[];
}
export type DataPoint = {
  x: number; y: number
} & Generations
export type DataPoints = DataPoint[]
export type GraphItems = Pick<
  TypeRun,
  'outputH2' |
  'outputCO2' |
  'outputCH4' |
  'outputCO' |
  'outputH2O' |
  'pressure' |
  'temperature' |
  'steamToCarbonRatio'
> & Generations
export type GraphItemsKeys = keyof GraphItems

export type GraphData = {
  caption: string;
  xLabel: string;
  yLabel: string;
  item: GraphItemsKeys
}

export const graphs: GraphData[] = [
  {
    caption: 'Amount of Hydrogen vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Amount of H₂ (kmol)',  // H₂ with subscript
    item: 'outputH2'
  },
  {
    caption: 'Amount of CO₂ vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Amount of CO₂ (kmol)',  // CO₂ with subscript
    item: 'outputCO2'
  },
  {
    caption: 'Amount of Methane vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Amount of CH₄ (kmol)',  // CH₄ with subscript
    item: 'outputCH4'
  },
  {
    caption: 'Amount of CO vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Amount of CO (kmol)',   // CO has no subscripts
    item: 'outputCO'
  },
  {
    caption: 'Amount of Water vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Amount of H₂O (kmol)',  // H₂O with subscript
    item: 'outputH2O'
  },
  {
    caption: 'Pressure vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Pressure (bar)',
    item: 'pressure'
  },
  {
    caption: 'Temperature vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Temperature (K)',
    item: 'temperature'
  },
  {
    caption: 'Steam-to-carbon ratio vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Steam-to-carbon ratio [S/C] (kmol/kmol)',
    item: 'steamToCarbonRatio'
  },
]
