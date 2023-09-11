import { main as genAlgo } from './Algorithm/main';
import fs from 'fs';
import { Config, ValidRunOptions } from './types';


export async function runAlgo(config: Config) {

  try {
    return {
      run: genAlgo({
        compositions: {
          ...config.flareGasComposition
        },
        smrConfig: {
          ...config.smrConfig
        },
        mbConfig: {
          ...config.mbConfig
        },
        traitBoundaries: {
          ...config.traitBoundaries
        },
        standardPressure: config.standardPressure
      }),
      error: null
    }
  } catch (error) {
    return { error: error as Error, run: null }
  }
}