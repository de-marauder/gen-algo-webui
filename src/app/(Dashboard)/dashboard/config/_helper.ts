import { AlgoResult } from "@/Types/algo";
import { cookie } from "@/app/(Home)/auth/helpers";

export const resultItems = (result: AlgoResult) => [
  {
    label: 'Pressure',
    value: result.pressure,
    unit: 'bar'
  },
  {
    label: 'Temperature',
    value: result.temperature,
    unit: 'K'
  },
  {
    label: 'Steam to Carbon ratio',
    value: result.steamToCarbonRatio,
    unit: '(kmol/kmol)'
  },
  {
    label: 'Hydrogen output',
    value: result.outputH2,
    unit: 'kmol'
  },
  {
    label: 'CO2 output',
    value: result.outputCO2,
    unit: 'kmol'
  },
  {
    label: 'CO output',
    value: result.outputCO,
    unit: 'kmol'
  },
  {
    label: 'Water output',
    value: result.outputH2O,
    unit: 'kmol'
  },
  {
    label: 'Methane',
    value: result.outputCH4,
    unit: 'kmol'
  },
];


export const APIConfig = {
  headers: {
    'content-type': 'application/json',
    authorization: `Bearer ${cookie.get('jwt-token')}`
  }
}