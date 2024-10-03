'use client'

import axios from 'axios'
import { MultiLineChart } from "@/app/_components/Graph"
import { useContext, useRef, useState } from "react"
import { MainContainer } from '../../../_components/Container/MainContainer'
import { Blur } from '../../../_components/utils/Blur'
import { DataPoints, Generations, GraphItems, GraphItemsKeys, graphs } from './_helpers'
import { SelectConfig, SelectMultiConfig } from '../runs/CreateRun'
import { APIConfig } from '../config/_helper'
import { AlgoResult } from '@/Types/algo'
import ContextStore from '@/app/_components/store/context'
import { TypeConfig } from '@/Types/Config'

const Visualizations = () => {
  const visualisationSectionRef = useRef<null | HTMLDivElement>(null)
  const { configs } = useContext(ContextStore)
  const [configIds, setConfigIds] = useState<string[]>([]);
  const [data, setData] = useState<AlgoResult[][]>([]);

  const loadGraphData = async (item: GraphItemsKeys) => {
    if (!data.length) throw new Error(`No data to load`)
    const graphs = []
    try {
      for (const d of data) {
        const graph: DataPoints = d.map((el, id) => {
          if (!el || !el[item as keyof GraphItems]) throw new Error('Data point undefined')
          return {
            x: id + 1, y: el[item as keyof GraphItems] as number, generations: el['generations' as keyof GraphItems] as Generations['generations']
          }
        })
        graphs.push(graph)
      }
      return { graphs, error: null }
    } catch (error) {
      return { error: error as Error, graphs: null }
    }
  }

  const fetchGraphData = async (configIds: string[]) => {
    const newData: AlgoResult[][] = []
    for (const configId of configIds) {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/runs?configId=${configId}`;
      const { data: res } = await axios.get<{ data: AlgoResult[] }>(url, APIConfig)
      newData.push(res.data);
    }
    setData(() => {
      return data.concat(newData)
    });
  };

  const removeData = async (removedIds: string[]) => {
    const newIds = configIds.filter((id) => !removedIds.includes(id));
    setData(() => {
      return data.filter((d) => newIds.includes((d[0].config as TypeConfig)._id))
    });
  }

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
            <SelectMultiConfig
              configs={configs}
              fetchGraphData={fetchGraphData}
              selectedConfigs={configIds}
              setSelectedConfigs={setConfigIds}
              removeData={removeData}
            />
          </div>
          <section id='graphs' className="max-sm:w-full overflow-x-scroll h-[80vh] overflow-scroll flex flex-wrap gap-8 justify-center pb-8">
            {graphs.map((el, id) => {
              return (
                <div key={'graph-' + id} className="w-fit rounded-3xl bg-blue-300/10 overflow-y-hidden max-sm:mx-2 " >
                  <MultiLineChart
                    outerSection={visualisationSectionRef}
                    caption={el.caption}
                    xLabel={el.xLabel}
                    yLabel={el.yLabel}
                    refresh={fetchGraphData}
                    loadData={loadGraphData}
                    configIds={configIds}
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

