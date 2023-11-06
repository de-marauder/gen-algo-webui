'use client'
import { TypeConfig } from "@/Types/Config";
import axios from "axios";
import { useEffect, useState } from "react"
import { ConfigCard } from "../CreateConfig";
import { Modal } from "@/app/_components/Modals/Modal";
import Loading from "@/app/(Home)/loading";
import { APIConfig } from "../_helper";

export const ViewAll = () => {
  const [configs, setConfigs] = useState<TypeConfig[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/configs`;
    
    setLoading(true)
    axios.get<{ status: string; data: TypeConfig[] }>(url, APIConfig)
      .then((response) => {
        // console.log(response);
        setLoading(false)
        setConfigs(response.data.data)
      }).catch((error) => {
        // console.log(error)
        setLoading(false)
        setError('Could Not get Configs')
      })
  }, [])

  return (
    <div className='max-sm:p-2'>
      {error && <Modal isError={true} message={error} toggle={() => setError('')} />}
      <h1 className='text-2xl font-bold mb-4'>CONFIGURATIONS</h1>
      {(loading) ? <Loading /> :
        (
          (configs.length > 0) ?
            configs.map((config) => {
              return <ConfigCard key={config.name} config={config} />
            }) : <div className="mt-8 text-2xl"> No Configurations present</div>
        )
      }
    </div>
  )
}
