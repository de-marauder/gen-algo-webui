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
  const [error, setError] = useState('')
  console.log('result = ', result)
  return (
    <>
      <MainContainer >
        {error && <Modal toggle={() => { setError('') }} isError={true} message={error} />}
        {loading && <Modal noCloseButton={true} toggle={() => { setLoading(false) }}><Loading /></Modal>}
        {
          result && <Modal toggle={() => { setResult(null) }} >
            <div className='flex gap-4 flex-col'>
              <p>Pressure: {result.pressure} bar</p>
              <p>Temperature: {result.temperature} K</p>
              <p>SteamCarbonRatio: {result.steamToCarbonRatio} (kmol/kmol)</p>
              <p>Hydrogen output: {result.outputH2} kmol</p>
              <p>CO2 output: {result.outputCO2} kmol</p>
              <p>CO output: {result.outputCO} kmol</p>
              <p>Water output: {result.outputH2O} kmol</p>
              <p>methane: {result.outputCH4} kmol</p>
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
      </MainContainer >
    </>
  )
}

export default Config