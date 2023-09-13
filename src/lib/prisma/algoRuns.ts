import prisma from '.'

export type Stop = 'convergence' | 'isFit' | 'maxGen';

export type AlgoResult = {
  // user?: Record<string, string>;
  mbGenSize: number;
  mbPopSize: number;
  mbMutationProbability: number;
  mbMovingAverage: number;
  smrGenSize: number;
  smrPopSize: number;
  smrMutationProbability: number;
  smrMovingAverage: number;
  pressureLowerbound: number;
  pressureUpperbound: number;
  temperatureLowerbound: number;
  temperatureUpperbound: number;
  steamCarbonRatioLowerbound: number;
  steamCarbonRatioUpperbound: number;
  standardPressure: number;
  ch4: number;
  c2h6: number;
  c3h8: number;
  ic4: number;
  nc4: number;
  ic5: number;
  nc5: number;
  ic6: number;
  nc6: number;
  h2: number;
  n2: number;
  co2: number;
  stopCondition: Stop // convergence, fitness or max gen_size
  numberOfGenerationsRan: number;
  pressure: number;
  temperature: number;
  steamToCarbonRatio: number;
  outputH2: number;
  outputH2O: number;
  outputCO2: number;
  outputCO: number;
  outputCH4: number;
  timeTaken: string;
  id?: string;
}

export const saveAlgoResults = async (data: AlgoResult) => {
  try {
    const result = await prisma.run.create({
      data: {
        ...data
      }
    })
    // console.log('prisma result: ', result)
    return { result, error: null }
  } catch (error) {
    console.log('prisma error: ', error)
    return { result: null, error } as { result: null, error: Error }
  }
}

export const getAlgoResults = async () => {
  try {
    const runs = await prisma.run.findMany();
    // console.log('runs = ', runs)
    return {runs, error: null}
  } catch (error) {
    console.log('Error = ', error)
    return {runs: null, error: error as Error}
  }
}
export const getAlgoResultById = async (id: string) => {
  try {
    const run = await prisma.run.findUnique({where: {id}});
    return {run, error: null}
  } catch (error) {
    console.log('Error = ', error)
    return {run: null, error: error as Error}
  }
}