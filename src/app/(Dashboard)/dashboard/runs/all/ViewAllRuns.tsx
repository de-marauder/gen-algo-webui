'use client'

import axios from "axios";
import { ReactNode, useContext, useEffect, useState } from "react"
import { Modal } from "../../../../_components/Modals/Modal";
import Loading from "../../../../(Home)/loading";
import Link from "next/link";
import { TypeRun } from "@/Types/Run";
import { APIConfig } from "../../config/_helper";
import { SelectConfig } from "../CreateRun";
import { TypeConfig } from "@/Types/Config";
import { toTitleCase } from "@/app/(Home)/auth/helpers";
import ContextStore from "@/app/_components/store/context";


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

const defaultAv = {
  pressure: 0,
  temperature: 0,
  steamToCarbonRatio: 0,
  outputH2: 0,
  outputCO2: 0,
  outputCO: 0,
  outputH2O: 0,
  outputCH4: 0,
}

export const ViewAllRuns = () => {
  const { configId, configs } = useContext(ContextStore)
  const [runs, setRuns] = useState<TypeRun[] | []>([]);
  const [averages, setAverages] = useState<FieldsInRunsShown>(defaultAv);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getRuns = (confId: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/runs?configId=${confId}`
    setLoading(true)
    setError('')
    axios.get<{ data: TypeRun[] }>(url, APIConfig)
      .then((response) => {
        const r = response.data.data
        setLoading(false);
        setRuns(r)
        if (r.length > 0) {
          const av = (r as FieldsInRunsShown[]).reduce((prev, curr, id, arr) => {
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
          }, defaultAv)
          setAverages(av)
        }
      }).catch((error) => {
        setLoading(false);
        setError(error.message);

      })
  }

  useEffect(() => {
    if (configId) {
      getRuns(configId)
    } else {
      setRuns([])
    }
  }, [])

  return (
    <>
      <div className="max-sm:w-full]">
        <div className='mb-8 w-full max-sm:px-2'>
          <h3 className='max-sm:py-2 text-2xl max-sm:text-lg sm:font-bold mb-4'>Filter By Configuration</h3>
          <SelectConfig trigger={getRuns} configs={configs as TypeConfig[]} />
        </div>
        <div className="mx-auto max-sm:px-2 lg:max-w-full overflow-x-scroll lg:overflow-auto min-h-[60vh] rounded-xl border border-blue-800/20 grid">
          <div className="bg-blue-800/10 w-full">
            <h1 className="max-sm:px-4 p-2 sm:pt-8 sm:px-8 font-bold sm:text-3xl mb-4">Average results</h1>
            <div className="grid grid-cols-3 mb-4 bg-blue-800/20">
              {averages && Object.entries(averages).map(([key, val]) => {
                return (
                  <p key={key} className="px-4 py-2 my-2"><strong>{key.toLowerCase().startsWith('output') ? key.replace('put', 'put ') : toTitleCase(key)}</strong>: {(val / runs.length) ? (val / runs.length).toFixed(2) : 0}</p>
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
          <div className='max-h-[80vh] overflow-y-scroll xl:w-full'>

            {runs.map((el, id) => {
              return (
                <Link
                  href={`/dashboard/runs/${el._id}`}
                  key={id}
                  className=''
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
      </div>
    </>
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
        'font-bold bg-blue-800/30 h-fit'
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