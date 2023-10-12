export type TypeRun = {
  _id: string;
  no: number;
  config: string;
  outputCH4: number;
  outputCO: number;
  outputCO2: number;
  outputH2: number;
  outputH2O: number;
  pressure: number;
  temperature: number;
  steamToCarbonRatio: number;
  numberOfGenerationsRan: number;
  stopCondition: string;
  timeTaken: string;
  error: number,
  userid: string
}