'use client'

import { useState } from "react"
import { ConfigForm } from "../components/Forms/config"
import { Modal } from "../components/Modals/Modal"
import Loading from "../loading"
import { AlgoResult } from "@/lib/prisma/algoRuns"
import { MainContainer } from "../components/Container/MainContainer"

export const Config = () => {
  const [result, setResult] = useState<null | AlgoResult>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('');


  return (
    <>
        {error && <Modal toggle={() => { setError('') }} isError={true} message={error} />}
        {loading && <Modal noCloseButton={true} toggle={() => { setLoading(false) }}><Loading /></Modal>}
        {
          result && <Modal toggle={() => { setResult(null) }} >
            <div className='flex gap-4 flex-col p-4 m-4 border-double border-4 border-black bg-slate-100/80 text-slate-800 md:max-h-[40vh] overflow-hidden overflow-y-scroll'>
              {resultItems(result).map(({ label, value, unit }, id) => {
                return (
                  <Result key={`result-item-${id + 1}`} label={label} value={value} unit={unit} />
                )

              })}
            </div>
          </Modal>
        }
        <section id='config-section text-white'>
          <ConfigForm
            result={result}
            loading={loading}
            error={error}
            setResult={setResult}
            setLoading={setLoading}
            setError={setError}
          />
        </section >
    </>
  )
}


const Result: React.FC<{ label: string; value: number; unit: string }> = ({ label, value, unit }) => {
  return (
    <>
      <div className="grid grid-cols-2 px-4 py-2 rounded bg-blue-800/10 hover:bg-blue-800/20 backdrop-blur-lg">
        <p className="font-bold">{label}: </p>
        <p className="text-right">{value} <i className="font-bold text-slate-700">{unit}</i></p>
      </div>
    </>
  )
}

const resultItems = (result: AlgoResult) => [
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
