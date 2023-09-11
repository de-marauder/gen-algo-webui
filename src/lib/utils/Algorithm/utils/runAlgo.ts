import { main as genAlgo } from '../../Algorithm/main';
import fs from 'fs';
import yaml from 'js-yaml';
import { Config, ValidRunOptions } from '../types';


export function runAlgo(opts: ValidRunOptions) {
    const config = yaml.load(fs.readFileSync(opts.config, 'utf8')) as Config;
    if (opts.outdir) config.outputFile = opts.outdir;

    genAlgo({
      populationResultsFile: config.outputFile,
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
    });
}