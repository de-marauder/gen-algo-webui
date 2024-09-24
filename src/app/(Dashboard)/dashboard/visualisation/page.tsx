'use client'

import axios from 'axios'
import { LineChart } from "@/app/_components/Graph"
import { useContext, useEffect, useRef, useState } from "react"
import { MainContainer } from '../../../_components/Container/MainContainer'
import { Blur } from '../../../_components/utils/Blur'
import { DataPoints, Generations, GraphItems, GraphItemsKeys, graphs } from './_helpers'
import { SelectConfig } from '../runs/CreateRun'
import { APIConfig } from '../config/_helper'
import { AlgoResult } from '@/Types/algo'
import ContextStore from '@/app/_components/store/context'

const Visualizations = () => {
  const visualisationSectionRef = useRef<null | HTMLDivElement>(null)
  const { configId, configs } = useContext(ContextStore)
  const [data, setData] = useState<null | { data: AlgoResult[] }>(null);

  const loadGraphData = async (item: GraphItemsKeys) => {
    if (!data) throw new Error(`No data to load`)
    try {
      const graph: DataPoints = data.data.map((el, id) => {
        if (!el || !el[item as keyof GraphItems]) throw new Error('Data point undefined')
        return {
          x: id + 1, y: el[item as keyof GraphItems] as number, generations: el['generations' as keyof GraphItems] as Generations['generations']
        }
      })
      return { graph, error: null }
    } catch (error) {
      return { error: error as Error, graph: null }
    }
  }

  const fetchGraphData = async (configId: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/runs?configId=${configId}`;
    const { data } = await axios.get<{ data: AlgoResult[] }>(url, APIConfig)
    setData(data)
  };

  useEffect(()=>{
    if(configId){
      fetchGraphData(configId)
    } else {
      setData(null)
    }
  }, [configId])

  return (
    <>
      <MainContainer>
        <section ref={visualisationSectionRef} id='visualizations-section' className='w-full text-white mt-[2rem] '>
          <Blur />
          <h1 className="text-4xl max-sm:text-2xl max-sm:pl-2 mb-8 sm:text-center">
            <strong>Graph Visualizations</strong>
          </h1>
          <div className='mb-8 max-sm:px-2'>
            <h3 className='max-sm:py-2 text-2xl max-sm:text-lg sm:font-bold mb-4'>Filter By Configuration</h3>
            <SelectConfig configs={configs} fetchGraphData={fetchGraphData} />
          </div>
          <section id='graphs' className="max-sm:w-full overflow-x-scroll h-[80vh] overflow-scroll flex flex-wrap gap-8 justify-center pb-8">
            {graphs.map((el, id) => {
              return (
                <div key={'graph-' + id} className="w-fit rounded-3xl bg-blue-300/10 overflow-y-hidden max-sm:mx-2 " >
                  <LineChart
                    outerSection={visualisationSectionRef}
                    caption={el.caption}
                    xLabel={el.xLabel}
                    yLabel={el.yLabel}
                    fetchData={loadGraphData}
                    item={el.item}
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

