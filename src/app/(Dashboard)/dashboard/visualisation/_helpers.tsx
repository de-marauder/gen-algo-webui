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
    caption: 'Amt. of Hydrogen vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Amt. of H2 (kmol)',
    item: 'outputH2'
  },
  {
    caption: 'Amt. of CO2 vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Amt. of CO2 (kmol)',
    item: 'outputCO2'
  },
  {
    caption: 'Amt. of Methane vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Amt. of CH4 (kmol)',
    item: 'outputCH4'
  },
  {
    caption: 'Amt. of CO vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Amt. of CO (kmol)',
    item: 'outputCO'
  },
  {
    caption: 'Amt. of Water vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Amt. of H2O (kmol)',
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
    caption: 'S/C vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Steam-to-carbon ratio [S/C] (kmol/kmol)',
    item: 'steamToCarbonRatio'
  },
]
