'use client'

import axios from 'axios'
import { LineChart } from "@/app/components/Graph"
import {  useRef } from "react"
import { AlgoResult } from '@/lib/prisma/algoRuns'
import { MainContainer } from '../components/Container/MainContainer'

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
    caption: 'Amt. of H2 vs No. of Gen',
    xLabel: 'No. of Generations',
    yLabel: 'Amt. of H2 (kmol)',
    item: 'outputH2'
  },
  {
    caption: 'Amt. of CO2 vs No. of Gen',
    xLabel: 'No. of Generations',
    yLabel: 'Amt. of CO2 (kmol)',
    item: 'outputCO2'
  },
  {
    caption: 'Amt. of CH4 vs No. of Gen',
    xLabel: 'No. of Generations',
    yLabel: 'Amt. of CH4 (kmol)',
    item: 'outputCH4'
  },
  {
    caption: 'Amt. of CO vs No. of Gen',
    xLabel: 'No. of Generations',
    yLabel: 'Amt. of CO (kmol)',
    item: 'outputCO'
  },
  {
    caption: 'Amt. of H2O vs No. of Gen',
    xLabel: 'No. of Generations',
    yLabel: 'Amt. of H2O (kmol)',
    item: 'outputH2O'
  },
  {
    caption: 'Amt. of P vs No. of Gen',
    xLabel: 'No. of Generations',
    yLabel: 'Amt. of pressure (bar)',
    item: 'pressure'
  },
  {
    caption: 'temperature vs No. of Gen',
    xLabel: 'No. of Generations',
    yLabel: 'Amt. of T (K)',
    item: 'temperature'
  },
  {
    caption: 'S/C vs No. of Gen',
    xLabel: 'No. of Generations',
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
          <Blur/>
          <h1 className="text-4xl mb-8 text-center">
            <strong>Graph Visualizations</strong>
          </h1>
          <section id='graphs' className="w-full flex flex-wrap gap-8 justify-center">
          <Blur/>
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
                </div>
              )
            })}
          </section>
          <Blur/>
        </section>
      </MainContainer>
    </>
  )
}

export default Visualizations

const Blur = () => (
  <div className="absolute  place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
  </div>
)