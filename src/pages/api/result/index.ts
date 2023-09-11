import { AlgoResult, saveAlgoResults } from "@/lib/prisma/algoRuns";
import { SMRGeneticsAlgorithm } from "@/lib/utils/Algorithm/SMR";
import { runAlgo } from "@/lib/utils/runAlgo";
import { Config } from "@/lib/utils/types";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method === 'POST') {
    try {
      const config = req.body as Config;
      // run algorithm
      const data = await runAlgo(config);
      if (data.error) throw new Error(data.error.message);
      // build result
      const runResult = buildResult(data.run.result, config, data.run.timeTaken, {})
      const { result, error } = await saveAlgoResults(runResult)
      if (error) throw new Error(error.message)
      return res.status(200).json({ result })
    } catch (error) {
      console.log('Error = ', error)
      return res.status(500).json({ error: (error as Error).message })
    }
  }

  res.setHeader('Allow', ['POST']);
  res.status(425).end(`Method ${req.method} is not allowed`);

}
export default handler;

const buildResult = (data: SMRGeneticsAlgorithm, config: Config, timeTaken: string, user: Record<string, string>): AlgoResult => {

  const r: AlgoResult = {
    mbGenSize: config.mbConfig.mbGenSize,
    mbMovingAverage: config.mbConfig.mbMovingAverage,
    mbMutationProbability: config.mbConfig.mbMutationProbability,
    mbPopSize: config.mbConfig.mbPopSize,
    smrGenSize: config.smrConfig.smrGenSize,
    smrMovingAverage: config.smrConfig.smrMovingAverage,
    smrMutationProbability: config.smrConfig.smrMutationProbability,
    smrPopSize: config.smrConfig.smrPopSize,
    pressureLowerbound: config.traitBoundaries.pressureLowerbound,
    pressureUpperbound: config.traitBoundaries.pressureUpperbound,
    temperatureLowerbound: config.traitBoundaries.temperatureLowerbound,
    temperatureUpperbound: config.traitBoundaries.temperatureUpperbound,
    steamCarbonRatioLowerbound: config.traitBoundaries.steamCarbonRatioLowerbound,
    steamCarbonRatioUpperbound: config.traitBoundaries.steamCarbonRatioUpperbound,
    standardPressure: config.standardPressure,
    ch4: config.flareGasComposition.ch4,
    c2h6: config.flareGasComposition.c2h6,
    c3h8: config.flareGasComposition.c3h8,
    ic4: config.flareGasComposition.ic4,
    nc4: config.flareGasComposition.nc4,
    ic5: config.flareGasComposition.ic5,
    nc5: config.flareGasComposition.nc5,
    ic6: config.flareGasComposition.ic6,
    nc6: config.flareGasComposition.nc6,
    co2: config.flareGasComposition.co2,
    h2: config.flareGasComposition.h2,
    n2: config.flareGasComposition.n2,
    outputCH4: data.population.population[0].a,
    outputCO: data.population.population[0].b,
    outputCO2: data.population.population[0].y,
    outputH2: data.population.population[0].fitness,
    outputH2O: data.population.population[0].h,
    pressure: data.population.population[0].traits.pressure,
    temperature: data.population.population[0].traits.temperature,
    steamToCarbonRatio: data.population.population[0].traits.steamCarbonRatio,
    numberOfGenerationsRan: data.generations.length,
    stopCondition: data.stoppedBy,
    timeTaken,
    // user
  };

  return r
}