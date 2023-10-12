'use client'

import axios from 'axios'
import { LineChart } from "@/app/_components/Graph"
import { useRef, useState } from "react"
import { MainContainer } from '../../../_components/Container/MainContainer'
import { Blur } from '../../../_components/utils/Blur'
import { DataPoints, GraphItems, GraphItemsKeys, graphs } from './_helpers'
import { SelectConfig } from '../runs/CreateRun'
import { TypeConfig } from '@/Types/Config'
import { APIConfig } from '../config/_helper'
import { AlgoResult } from '@/Types/algo'

const Visualizations = () => {
  const visualisationSectionRef = useRef<null | HTMLDivElement>(null)
  const [configId, setConfigId] = useState('');
  const [configs, setConfigs] = useState<(TypeConfig | never)[]>([])

  const fetchGraphData = async (url: string, item: GraphItemsKeys) => {
    try {
      const { data } = await axios.get<{ data: AlgoResult[] }>(url, APIConfig)
      // console.log('data = ', data)
      const graph: DataPoints = data.data.map((el, id) => {
        if (!el || !el[item as keyof GraphItems]) throw new Error('Data point undefined')
        return [id + 1, el[item as keyof GraphItems]]
      })
      return { graph, error: null }
    } catch (error) {
      // console.log('error = ', error)
      return { error: error as Error, graph: null }
    }
  }

  return (
    <>
      <MainContainer>
        <section ref={visualisationSectionRef} id='visualizations-section' className='w-full text-white mt-[2rem]'>
          <Blur />
          <h1 className="text-4xl max-sm:text-2xl max-sm:pl-2 mb-8 sm:text-center">
            <strong>Graph Visualizations</strong>
          </h1>
          <div className='mb-8'>
            <h3 className='max-sm:p-2 text-2xl max-sm:text-xlfont-bold mb-4'>Filter By Configuration</h3>
            <SelectConfig
              configs={configs}
              setConfigId={setConfigId}
              setConfigs={setConfigs} />
          </div>
          <section id='graphs' className="max-sm:w-[100vw] overflow-x-scroll h-[80vh] overflow-scroll flex flex-wrap gap-8 justify-center pb-8">
            {graphs.map((el, id) => {
              return (
                <div key={'graph-' + id} className="w-fit sm:w-full rounded-3xl bg-blue-300/10 overflow-y-hidden" >
                  <LineChart
                    outerSection={visualisationSectionRef}
                    caption={el.caption}
                    xLabel={el.xLabel}
                    yLabel={el.yLabel}
                    fetchData={fetchGraphData}
                    item={el.item}
                    configId={configId}
                  />
                </div>
              )
            })}
          </section>
        </section>
      </MainContainer>
    </>
  )
}

export default Visualizations

