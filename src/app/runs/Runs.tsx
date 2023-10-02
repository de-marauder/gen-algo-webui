'use client'

import { AlgoResult } from "@/lib/prisma/algoRuns";
import axios from "axios";
import { ReactNode, useEffect, useState } from "react"
import { Modal } from "../components/Modals/Modal";
import Loading from "../loading";
import Link from "next/link";
import { Blur } from "../components/utils/Blur";


type FieldsInRunsShown = {
  outputCO: number;
  outputH2: number;
  outputCO2: number
  outputH2O: number;
  outputCH4: number;
  pressure: number;
  temperature: number;
  steamToCarbonRatio: number
}
export const Runs = () => {

  const [runs, setRuns] = useState<AlgoResult[] | []>([]);
  const [averages, setAverages] = useState<Record<string, number>>();
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const getRuns = () => {
    setLoading(true)
    const url = '/api/runs'
    axios.get<{ runs: AlgoResult[] }>(url)
      .then((response) => {
        const r = response.data.runs
        setLoading(false);
        setRuns(r)
        const av = (r as FieldsInRunsShown[]).reduce((prev, curr) => {
          return {
            pressure: prev.pressure + curr.pressure,
            temperature: prev.temperature + curr.temperature,
            steamToCarbonRatio: prev.steamToCarbonRatio + curr.steamToCarbonRatio,
            outputH2: prev.outputH2 + curr.outputH2,
            outputCO2: prev.outputCO2 + curr.outputCO2,
            outputCO: prev.outputCO + curr.outputCO,
            outputH2O: prev.outputH2O + curr.outputH2O,
            outputCH4: prev.outputCH4 + curr.outputCH4,
          }
        })
        setAverages(av)
      }).catch((error) => {
        setLoading(false);
        setError(error.message);

      })
  }

  useEffect(() => {
    getRuns()
  }, [])


  return (
    <div className="mx-auto xl:max-w-full overflow-x-scroll xl:overflow-auto min-h-[60vh] rounded-xl border border-blue-800/20">
      <div className="bg-blue-800/10">
        <h1 className="p-2 sm:pt-8 sm:px-8 font-bold sm:text-3xl mb-4">Average results</h1>
        <div className="grid sm:grid-cols-2 mb-4">
          {averages && Object.entries(averages).map(([key, val]) => {
            return (
              <p key={key} className="px-4 py-2 m-y2 bg-blue-800/20"><strong>{key}</strong>: {(val / runs.length).toFixed(2)}</p>
            )
          })}
        </div>
      </div>
      <RunCard isHeader={true}>
        <PItem>No</PItem>
        <PItem>Pressure (bar)</PItem>
        <PItem>Temperature (K)</PItem>
        <PItem>S/C</PItem>
        <PItem>Output H<sub>2</sub> (kmol)</PItem>
        <PItem>Output CO<sub>2</sub> (kmol)</PItem>
        <PItem>Output CO (kmol)</PItem>
        <PItem>Output H<sub>2</sub>O (kmol)</PItem>
        <PItem>Output CH<sub>4</sub> (kmol)</PItem>
      </RunCard>
      {loading && (
        <Loading />
      )}
      {error && (
        <Modal isError={true} message={error} toggle={() => setError('')} />
      )}
      <div className='max-h-[80vh] overflow-y-scroll w-fit xl:w-full overflow-x-auto'>

        <Blur />
        {runs.map((el, id) => {
          return (
            <Link
              href={`/runs/${el.id}/${id + 1}`}
              key={id}
            >
              <RunCard
                id={id + 1}
                outputCH4={el.outputCH4}
                outputCO={el.outputCO}
                outputCO2={el.outputCO2}
                outputH2={el.outputH2}
                outputH2O={el.outputH2O}
                pressure={el.pressure}
                temperature={el.temperature}
                steamToCarbonRatio={el.steamToCarbonRatio}
              />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

const RunCard: React.FC<{
  id?: number;
  outputH2?: number;
  outputCO2?: number;
  outputCO?: number;
  outputCH4?: number;
  outputH2O?: number;
  pressure?: number;
  temperature?: number;
  steamToCarbonRatio?: number;
  children?: ReactNode;
  isHeader?: boolean
}> = ({
  isHeader, children, id, outputH2, outputCO2, outputCO, outputCH4, outputH2O, pressure, temperature, steamToCarbonRatio
}) => {
    const style = 'grid grid-cols-9 w-[1000px] xl:w-full backdrop-blur-sm ' +
      (isHeader ?
        'font-bold bg-blue-800/30'
        :
        'bg-blue-800/0 hover:bg-blue-800/10')
    return (
      <div className={style}>
        {children ?
          children
          :
          (
            <>
              <PItem>{id}</PItem>
              <PItem>{pressure}</PItem>
              <PItem>{temperature}</PItem>
              <PItem>{steamToCarbonRatio}</PItem>
              <PItem>{outputH2}</PItem>
              <PItem>{outputCO2}</PItem>
              <PItem>{outputCO}</PItem>
              <PItem>{outputH2O}</PItem>
              <PItem>{outputCH4}</PItem>
            </>
          )
        }
      </div>
    )
  }

const PItem: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <p className='p-4 text-center border border-blue-800/20'>
      {children}
    </p>
  )
}