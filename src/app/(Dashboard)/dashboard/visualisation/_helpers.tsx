import { TypeRun } from "@/Types/Run"

type DataPoint = readonly [number, number]
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
>
export type GraphItemsKeys = keyof GraphItems

export type GraphData = {
  caption: string;
  xLabel: string;
  yLabel: string;
  item: GraphItemsKeys
}

export const graphs: GraphData[] = [
  {
    caption: 'Amt. of H2 vs No. of Runs',
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
    caption: 'Amt. of CH4 vs No. of Runs',
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
    caption: 'Amt. of H2O vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Amt. of H2O (kmol)',
    item: 'outputH2O'
  },
  {
    caption: 'Amt. of P vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Amt. of pressure (bar)',
    item: 'pressure'
  },
  {
    caption: 'temperature vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Amt. of T (K)',
    item: 'temperature'
  },
  {
    caption: 'S/C vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Amt. of S/C',
    item: 'steamToCarbonRatio'
  },
]
