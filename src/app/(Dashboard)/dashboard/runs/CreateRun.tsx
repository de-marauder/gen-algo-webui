'use client'

import axios, { AxiosError } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Modal } from "../../../_components/Modals/Modal";
import Loading from "../../../(Home)/loading";
import { TypeRun } from "@/Types/Run";
import { Button } from "@/app/_components/Buttons/Buttons";
import { APIConfig } from "../config/_helper";
import { TypeConfig } from "@/Types/Config";
import { useRouter } from "next/navigation";


export const CreateRun = () => {
  const router = useRouter()
  const [configs, setConfigs] = useState<(TypeConfig | never)[]>([]);
  const [configId, setConfigId] = useState<string>('');
  const [_, setRun] = useState<TypeRun[] | []>([]);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')


  const makeRun = (configId: string) => {
    if (!configId || configId.length !== 24) return setError('Please select a configuration')
    const url = `${process.env.NEXT_PUBLIC_API_URL}/runs`;
    const payload = { configId }
    setError('')
    setLoading(true)
    axios.post(url, payload, APIConfig)
      .then((response) => {
        // console.log('runs made => ', response)
        setLoading(false)
        setRun(response.data.data)
        router.push(`/dashboard/runs/${response.data.data._id}`)
      }).catch((error) => {
        // console.log('runs made error => ', error)
        setLoading(false)
        if (error instanceof AxiosError) setError(error.response?.data.message || 'Request failed')
        else setError(error.message || 'Request failed')
      })
  }

  return (
    <>
      {
        loading && (
          <Modal noCloseButton toggle={() => { }}>
            <Loading />
          </Modal>
        )
      }
      {
        error && (
          <Modal isError message={error} toggle={() => { setError('') }} />
        )
      }
      <div className="px-4 border rounded py-8 flex items-center justify-between gap-8">
        <SelectConfig
          configs={configs}
          setConfigs={setConfigs}
          setConfigId={setConfigId} />
        <Button styles="px-4 min-w-[150px]" type='lg' onClick={() => { makeRun(configId) }}>
          Make Run
        </Button>
      </div>
    </>
  )
}

export const SelectConfig = ({ trigger, configs, setConfigs, setConfigId }: {
  trigger?: (config: string) => void
  configs: TypeConfig[];
  setConfigs: Dispatch<SetStateAction<TypeConfig[]>>;
  setConfigId: Dispatch<SetStateAction<string>>
}) => {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/config/all`;
    setLoading(true)
    setError('')
    axios.get<{ data: TypeConfig[] }>(url, APIConfig)
      .then((response) => {
        // console.log('configs gotten => ', response)
        setLoading(false)
        setConfigs(response.data.data)
      }).catch((error) => {
        // console.log('configs gotten error => ', error)
        setLoading(false)
        setError('request for configs failed')
      });
  }, [setConfigs])

  return (
    <div className="w-full max-sm:p-2">
      <select className="text-black p-2 w-full rounded hover:bg-slate-300" placeholder="Select a configuration" name="configurations" id="configurations" onChange={(e) => {
        // console.log('config name: ', e.target.value)
        setConfigId(e.target.value)
        if (trigger) trigger(e.target.value)
      }}>
        {loading ? <Loading />
          : (<option value=''
          >{error || 'Select Config'}</option>
          )}
        {
          configs ?
            configs.map((config) => {
              return (
                <option key={config._id}
                  value={config._id}
                >{config.name}</option>
              )
            })
            : <p>No Configurations</p>
        }
      </select>
    </div>
  )
}