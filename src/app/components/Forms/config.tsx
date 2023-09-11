import { Dispatch, FormEvent, SetStateAction, useState } from "react"
import { BoundsConfInput, CompositionConfInput, MbConfInput, SmrConfInput, StPressureConfInput } from "./Input"
import { Config } from "@/lib/utils/types"
import axios, { AxiosError } from "axios"
import { Button } from "../Buttons/Buttons"
import { AlgoResult } from "@/lib/prisma/algoRuns"

const smrConfigInputLabels = {
  smrPopSize: 'Population size',
  smrGenSize: 'Generation size',
  smrMovingAverage: 'Moving average',
  smrMutationProbability: '%age Mutation probability',
}
const mbConfigInputLabels = {
  mbPopSize: 'Population size',
  mbGenSize: 'Generation size',
  mbMovingAverage: 'Moving average',
  mbMutationProbability: '%age Mutation probability',
}
const flareGasCompositionConfigInputLabels = {
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
const standardPressureLabel = 'Standard pressure'

const traitBoundariesConfigInputLabels = {
  pressureLowerbound: 'Pressure lower bound (bar)',
  pressureUpperbound: 'Pressure upper bound (bar)',
  temperatureLowerbound: 'Temperatuore lower bound (K)',
  temperatureUpperbound: 'Temperature upper bound (K)',
  steamCarbonRatioLowerbound: 'S/C ratio lower bound (kmol/kmol)',
  steamCarbonRatioUpperbound: 'S/C ratio upper bound (kmol/kmol)',
}
const smrConfig = {
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
function convertObjectValuesToNumbers<T extends Record<string, any>>(obj: T): ConvertValuesToNumbers<T> {
  const result: Partial<ConvertValuesToNumbers<T>> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = parseFloat(obj[key]);
      result[key] = isNaN(value) ? 0 : value; // Default to 0 if the conversion fails
    }
  }

  return result as ConvertValuesToNumbers<T>;
}

export const ConfigForm: React.FC<{
  result: AlgoResult | null;
  error: string;
  loading: boolean;
  setResult: Dispatch<SetStateAction<AlgoResult | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
}> = ({ result, setResult, loading, setLoading, error, setError }) => {

  const [smrConf, setSmrConf] = useState(smrConfig)
  const [mbConf, setMbConf] = useState(mbConfig)
  const [stPressure, setStPressure] = useState(standardPressure)
  const [composition, setComposition] = useState(flareGasComposition)
  const [traitBounds, setTraitBounds] = useState(traitBoundaries)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault();
    const payload: Config = {
      smrConfig: smrConf,
      mbConfig: mbConf,
      flareGasComposition: convertObjectValuesToNumbers(composition),
      standardPressure: +stPressure,
      traitBoundaries: traitBounds
    }
    const url = '/api/result'
    try {
      const { data } = await axios.post<{ result: AlgoResult | null; error: null | Error }>(url, payload)
        .catch((err: AxiosError) => {
          // setError((err.response?.data as {error: Error}).error.message)
          return { data: { result: null, error: (err.response?.data as { error: Error }).error}}
        });
      if (data.error) throw new Error(data.error.message)
      setLoading(false)
      setResult(data.result)
      console.log(data)
    } catch (error) {
      setLoading(false)
      setError('Error Occured ' + (error as Error).message)
      console.log(error)
    }
  }

  return (
    <>
      <form onSubmit={(e => { handleSubmit(e) })}>
        <div id="smr" className="mb-16">
          <h3 className='font-bold text-3xl mb-2'>SMR - Config</h3>
          {Object.entries(smrConf).map(([k, v], id) => {
            return (
              <SmrConfInput
                id={id}
                key={id}
                k={k}
                v={v}
                label={smrConfigInputLabels[k as keyof typeof smrConf]}
                setValue={setSmrConf}
              />
            )
          })}
        </div >
        <div id='mb' className='mb-16'>
          <h3 className='font-bold text-3xl mb-2'>MB - Config</h3>
          {Object.entries(mbConf).map(([k, v], id) => {
            return (
              <MbConfInput
                id={id}
                key={id}
                k={k}
                v={v}
                label={mbConfigInputLabels[k as keyof typeof mbConf]}
                setValue={setMbConf}
              />
            )
          })}
        </div>
        <div id='composition' className='mb-16'>
          <h3 className='font-bold text-3xl mb-2'>Flare composition in mole mole fraction</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(composition).map(([k, v], id) => {
              return (
                <CompositionConfInput
                  id={id}
                  key={id}
                  k={k}
                  v={v}
                  label={flareGasCompositionConfigInputLabels[k as keyof typeof flareGasCompositionConfigInputLabels]}
                  setValue={setComposition}
                />
              )
            })}
          </div>
        </div>
        <div id='boundaries' className='mb-16'>
          <h3 className='font-bold text-3xl mb-2'>Decision variable boundaries</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(traitBounds).map(([k, v], id) => {
              return (
                <BoundsConfInput
                  id={id}
                  key={id}
                  k={k}
                  v={v}
                  label={traitBoundariesConfigInputLabels[k as keyof typeof traitBoundariesConfigInputLabels]}
                  setValue={setTraitBounds}
                />
              )
            })}
          </div>
        </div>
        <div className='mb-16'>
          <h3 className='font-bold text-3xl mb-2'>Constants</h3>
          <div className="flex flex-wrap gap-4">
            <StPressureConfInput
              k={'standardPressure'}
              v={stPressure}
              label={standardPressureLabel}
              setValue={setStPressure}
            />
          </div>
        </div>
        <section className='text-3xl text-center text-white'>
          <Button type='lg' >
            Run
          </Button>
        </section>
      </form >
    </>
  )
}