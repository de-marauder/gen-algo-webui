'use client'

import { TypeConfig } from "@/Types/Config";
import { TypeRun } from "@/Types/Run";
import axios from "axios";
import { APIConfig } from "./config/_helper";
import { useEffect, useState } from "react";
import { getRunsWithConfig } from "./serverActions";
import Loading from "@/app/(Home)/loading";



export const DashBoardData = () => {

  const [configs, setConfigs] = useState<TypeConfig[]>([])
  const [data, setData] = useState<[string, number][]>([])
  const [loading, setLoading] = useState<boolean>(true);
  const allConfigsUrl = `${process.env.NEXT_PUBLIC_API_URL}/config/all`

  useEffect(() => {
    axios.get<{ data: TypeConfig[] }>(allConfigsUrl, APIConfig)
      .then((response) => {
        setConfigs(response.data.data)
      }).catch((error) => {
        // console.log('config fetch error', error)
      })
  }, [allConfigsUrl])

  useEffect(() => {

    if (configs) {
      setData([]);
      setLoading(true);
      (async () => {
        const { data, error } = await getRunsWithConfig(configs, APIConfig);
        setLoading(false)
        if (error) {
          // console.log(error);
          return
        }
        // console.log('Data: ', data)
        data && setData(data)

      })()
    }
  }, [configs])

  return (
    <div className='max-sm:px-2'>
      <h2 className="mb-8 text-2xl">
        <strong>
          Number of runs per configuration
        </strong>
      </h2>
      <div className="border rounded rounded-2xl overflow-hidden">
        <Items k="Config" value={'No'} />
        {data[0] ? (
          data.map((el) => {
            return (
              <Items key={el[0]} k={el[0]} value={el[1]} />
            )
          })
        ) : (loading) ? <Loading /> : (
          <div className="h-full text-xl text-red-500 font-normal border rounded border-blue-800">
            <p>Request failed</p>
            <p>Could not fetch data...</p>
          </div>
        )}
      </div>

    </div>
  )
}

const Items = ({ k, value }: { k: string; value: number | string }) => {
  return (
    <div className="flex text-xl font-normal">
      <p className="w-full py-4 pl-2 border max-sm:text-sm sm:px-4">
        <strong>
          {k}
        </strong>
      </p>
      <p className="max-sm:w-[5rem] w-[6rem] px-4 py-4 pl-2 border max-sm:text-sm sm:px-4">
        <strong>
          {value}
        </strong>
      </p>
    </div>
  )
}