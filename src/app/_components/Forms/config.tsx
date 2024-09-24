import { Dispatch, FormEvent, SetStateAction, useState } from "react"
import { BoundsConfInput, CompositionConfInput, ConfigNameInput, MbConfInput, SmrConfInput, StPressureConfInput } from "./Input"
import { Config } from "@/Types/Config"
import axios, { AxiosError } from "axios"
import { Button } from "../Buttons/Buttons"
import { convertObjectValuesToNumbers, flareGasComposition, flareGasCompositionConfigInputLabels, mbConfig, mbConfigInputLabels, smrConfig, smrConfigInputLabels, standardPressure, standardPressureLabel, traitBoundaries, traitBoundariesConfigInputLabels } from "./_helpers"
import { TypeConfig } from "@/Types/Config"
import { useRouter } from "next/navigation"
import { APIConfig } from "@/app/(Dashboard)/dashboard/config/_helper"

export const ConfigForm: React.FC<{
  setConfig: Dispatch<SetStateAction<TypeConfig | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
}> = ({ setConfig, setLoading, setError }) => {
  const router = useRouter()
  const [configName, setConfigName] = useState('')
  const [smrConf, setSmrConf] = useState(smrConfig)
  const [mbConf, setMbConf] = useState(mbConfig)
  const [stPressure, setStPressure] = useState(standardPressure)
  const [composition, setComposition] = useState(flareGasComposition)
  const [traitBounds, setTraitBounds] = useState(traitBoundaries)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/configs`

    const payload: { config: Config } = {
      config: {
        name: configName,
        smrConfig: smrConf,
        mbConfig: mbConf,
        flareGasComposition: convertObjectValuesToNumbers(composition),
        standardPressure: +stPressure,
        traitBoundaries: traitBounds
      }
    }
    try {
      const { data } = await axios.post<{ data: TypeConfig; status: 'success' | 'failed', message?: string }>(url, payload, APIConfig)
      if (data.status !== 'success' || !data.data) throw new Error(data.message)
      setLoading(false)
      setConfig(data.data)

      router.push(`/dashboard/config/${data.data._id}`)
    } catch (error) {
      setLoading(false)
      if (error instanceof AxiosError) setError(error.response?.data.message || 'Request failed')
      else setError('Error Occured ' + (error as Error).message)
    }
  }
  const configHeaderStyles = 'font-bold text-3xl mb-4 text-blue-800 underline underline-offset-8 decoration-wavy';

  return (
    <>
      <form onSubmit={(e => { handleSubmit(e) })}>

        <div id="config-name" className="mb-16">
          <h3 className={configHeaderStyles}>Config Name </h3>
          <ConfigNameInput
            k={'config-name'}
            v={configName}
            label={''}
            setValue={setConfigName}
          />
        </div >
        <div id="smr" className="mb-16">
          <h3 className={configHeaderStyles}>SMR - Config</h3>
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
          <h3 className={configHeaderStyles}>MB - Config</h3>
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
          <h3 className={configHeaderStyles}>Flare composition in mole mole fraction</h3>
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
          <h3 className={configHeaderStyles}>Decision variable boundaries</h3>
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
          <h3 className={configHeaderStyles}>Constants</h3>
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
            Create
          </Button>
        </section>
      </form >
    </>
  )
}