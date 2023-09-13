'use client'

import { AlgoResult } from "@/lib/prisma/algoRuns";
import axios from "axios";
import { ReactNode, useEffect, useState } from "react"
import { Modal } from "../components/Modals/Modal";
import Loading from "../loading";
import Link from "next/link";
import { Blur } from "../components/utils/Blur";

export const Runs = () => {

  const [runs, setRuns] = useState<AlgoResult[] | []>([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const getRuns = () => {
    setLoading(true)
    const url = '/api/runs'
    axios.get<{ runs: AlgoResult[] }>(url)
      .then((response) => {
        setLoading(false);
        setRuns(response.data.runs)
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