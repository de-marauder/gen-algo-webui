'use client'

import axios from 'axios'
import { LineChart } from "@/app/components/Graph"
import { useRef } from "react"
import { AlgoResult } from '@/lib/prisma/algoRuns'
import { MainContainer } from '../components/Container/MainContainer'
import { Blur } from '../components/utils/Blur'

type DataPoint = readonly [number, number]
export type DataPoints = DataPoint[]
type GraphItems = Pick<
  AlgoResult,
  'outputH2' |
  'outputCO2' |
  'outputCH4' |
  'outputCO' |
  'outputH2O' |
  'pressure' |
  'temperature' |
  'steamToCarbonRatio'
>
export type GraphItemsKeys = keyof GraphItems

type GraphData = {
  caption: string;
  xLabel: string;
  yLabel: string;
  item: GraphItemsKeys
}
const graphs: GraphData[] = [
  {
    caption: 'Amt. of H2 vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Amt. of H2 (kmol)',
    item: 'outputH2'
  },
  {
    caption: 'Amt. of CO2 vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Amt. of CO2 (kmol)',
    item: 'outputCO2'
  },
  {
    caption: 'Amt. of CH4 vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Amt. of CH4 (kmol)',
    item: 'outputCH4'
  },
  {
    caption: 'Amt. of CO vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Amt. of CO (kmol)',
    item: 'outputCO'
  },
  {
    caption: 'Amt. of H2O vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Amt. of H2O (kmol)',
    item: 'outputH2O'
  },
  {
    caption: 'Amt. of P vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Amt. of pressure (bar)',
    item: 'pressure'
  },
  {
    caption: 'temperature vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Amt. of T (K)',
    item: 'temperature'
  },
  {
    caption: 'S/C vs No. of Runs',
    xLabel: 'No. of Runs',
    yLabel: 'Amt. of S/C',
    item: 'steamToCarbonRatio'
  },
]

const Visualizations = () => {
  const visualisationSectionRef = useRef<null | HTMLDivElement>(null)

  const fetchGraphData = async (url: string, item: GraphItemsKeys) => {
    try {
      const { data } = await axios.get<{ runs: AlgoResult[] }>(url)
      console.log('data = ', data)
      const graph: DataPoints = data.runs.map((el, id) => {
        if (!el || !el[item as keyof GraphItems]) throw new Error('Data point undefined')
        return [id + 1, el[item as keyof GraphItems]]
      })
      return { graph, error: null }
    } catch (error) {
      console.log('error = ', error)
      return { error: error as Error, graph: null }
    }
  }

  return (
    <>
      <MainContainer>

        <section ref={visualisationSectionRef} id='visualizations-section' className='w-full text-white mt-[2rem]'>
          <Blur />
          <h1 className="text-4xl mb-8 text-center">
            <strong>Graph Visualizations</strong>
          </h1>
          <section id='graphs' className="w-full flex flex-wrap gap-8 justify-center pb-8">
            <Blur />
            {graphs.map((el, id) => {
              return (
                <div key={'graph-' + id} className="w-fit rounded-3xl bg-blue-300/10">
                  <LineChart
                    outerSection={visualisationSectionRef}
                    caption={el.caption}
                    xLabel={el.xLabel}
                    yLabel={el.yLabel}
                    fetchData={fetchGraphData}
                    item={el.item}
                  />
                  <Blur />
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

