'use client'

import axios, { AxiosError } from "axios";
import { useContext, useState } from "react"
import { Modal } from "../../../_components/Modals/Modal";
import Loading from "../../../(Home)/loading";
import { TypeRun } from "@/Types/Run";
import { Button } from "@/app/_components/Buttons/Buttons";
import { APIConfig } from "../config/_helper";
import { TypeConfig } from "@/Types/Config";
import { Input } from "@/app/_components/Forms/Input";
import ContextStore from "@/app/_components/store/context";


export const CreateRun = () => {
  const { configId, configs } = useContext(ContextStore)
  // const [configs, setConfigs] = useState<(TypeConfig | never)[]>([]);
  const [numberOfRuns, setNumberOfRuns] = useState<number>(1);
  // const [configId, setConfigId] = useState<string>('');
  const [runRes, setRun] = useState<TypeRun[] | null>(null);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')


  const makeRun = (configId: string) => {
    if (!configId || configId.length !== 24) return setError('Please select a configuration')
    if (numberOfRuns < 1) return setError('Must be at least 1 run')
    const url = `${process.env.NEXT_PUBLIC_API_URL}/runs`;
    const payload = { configId, numberOfRuns }
    setError('')
    setLoading(true)
    axios.post(url, payload, APIConfig)
      .then((response) => {
        setLoading(false)
        setRun(response.data)
      }).catch((error) => {
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
        runRes && (
          <Modal message={"Your run is on-going. You'll receive a notification once it's done"} toggle={() => { setRun(null) }} />
        )
      }
      {
        error && (
          <Modal isError message={error} toggle={() => { setError('') }} />
        )
      }
      <div className="px-4 border rounded py-8 flex flex-col gap-8">
        <SelectConfig configs={configs as TypeConfig[]} />
        <Input
          k="numberOfRuns"
          label="Number Of Runs"
          type="number"
          placeholder="Number of runs"
          v={numberOfRuns}
          setValue={setNumberOfRuns}
        />
      </div>
      <Button styles="px-4 min-w-[150px]" type='lg' onClick={() => { makeRun(configId as string) }}>
        Make Run
      </Button>
    </>
  )
}

export const SelectConfig = ({ trigger, configs, fetchGraphData }: {
  trigger?: (config: string) => void
  configs: TypeConfig[] | null;
  fetchGraphData?: (configId: string) => void;
}) => {

  const { configId, updateConfigId, updateConfigError, configLoading, configError } = useContext(ContextStore)

  return (
    <>
      {configError && <Modal toggle={() => updateConfigError('')} isError={true} message="Could not fetch configs" />}
      <div className="w-full max-sm:py-2 flex gap-4">
        {configLoading ? <Loading type={'xs'} /> :
          <select
            className="text-black p-2 w-full rounded hover:bg-slate-300"
            placeholder="Select a configuration"
            name="configurations"
            id="configurations"
            value={configId || ''} // Set the value prop
            onChange={async (e) => {
              const configId = e.target.value
              updateConfigId(configId)
              fetchGraphData && fetchGraphData(configId)
              if (trigger) trigger(configId)
            }}>
            <option>{'Select config'}</option>
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
          </select>}
      </div>
    </>
  )
}