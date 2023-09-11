import yaml from 'js-yaml';
import fs from 'fs';
import { DEFAULT_PATH_TO_CONFIG } from ".."
import { Config, UpdateConfigOptions } from "../types"
import { green, bold, yellow, italic, dim } from 'chalk';


export function updateConfig(opts: UpdateConfigOptions, defaultConfig: Config) {

  if (opts.path !== DEFAULT_PATH_TO_CONFIG) {
    // check all new configurations for validity
    const newConfig = yaml.load(fs.readFileSync(opts.path, 'utf8')) as Partial<Config>
    console.log(dim(
      JSON.stringify(newConfig)
        .split('{').join(' {\n\t')
        .split('}').join('\n}')
        .split('},').join('\n\t},\n\t')
        .split(',').join(', \n\t')
        .split('\n\n\t},').join('\n\t},')
        .split('},\n\n\t').join('},\n')
        .slice(0, -1) + '}'
    ))
    // return
    const validConfig = checkConfig(newConfig, defaultConfig)
    // update the default
    defaultConfig = { ...defaultConfig, ...validConfig };
    const yamlConfig = yaml.dump(defaultConfig)
    fs.writeFileSync(DEFAULT_PATH_TO_CONFIG, yamlConfig, 'utf8')
    console.log()
    console.log(bold(green('Update successful!')))
    console.log()
    console.log('Updated Config')
    console.log()
    console.log(yellow(italic(yamlConfig)))
  }

  function checkConfig(config: Partial<Config>, defaultConfig: Config) {
    const dconf = { ...defaultConfig }

    const configCheck = (defaultParams: Record<string, any>, param: Record<string, number>, validOpts: string[]) => {

      for (let opt in param) {
        if (validOpts.includes(opt)) {
          if (typeof param[opt as keyof typeof param] !== 'number')
            throw new Error(`Invalid Configuration.\n${opt} should be a number. Received ${param[opt as keyof typeof param]}`)
          if (param[opt as keyof typeof param] < 0)
            throw new Error(`Invalid Configuration.\n${opt} should be greater than or equal to zero. Received ${param[opt as keyof typeof param]}`)

          defaultParams[opt as keyof typeof dconf.smrConfig] = param[opt as keyof typeof param]
        } else {
          throw new Error(`Invalid Configuration.\n${opt} is not a valid entry`)
        }
      }

    }
    if (config.smrConfig) {
      const validOpts = ['smrPopSize', 'smrGenSize', 'smrMovingAverage', 'smrMutationProbability']
      const s = defaultConfig.smrConfig
      configCheck(s, config.smrConfig, validOpts)
      dconf.smrConfig = s
    }

    if (config.mbConfig) {
      const validOpts = ['mbPopSize', 'mbGenSize', 'mbMovingAverage', 'mbMutationProbability']
      const m = defaultConfig.mbConfig
      configCheck(m, config.mbConfig, validOpts)
      dconf.mbConfig = m
    }

    // if (config.standardPressure) {
    //   // standardPressure: 1.01325
    // }

    if (config.flareGasComposition) {
      const validOpts = ['ch4', 'c2h6', 'c3h8', 'i-c4', 'n-c4', 'i-c5', 'n-c5', 'i-c6', 'n-c6', 'h2', 'n2', 'co2'];
      const composition = { ...defaultConfig.flareGasComposition };
      configCheck(composition, config.flareGasComposition, validOpts);

      const sum = Object.values(composition).reduce((prev, curr) => prev + curr);
      if (sum !== 100)
        throw new Error(`Invalid Configuration.\nflareGasComposition total should be 100. Received ${sum}`);

      dconf.flareGasComposition = composition;
    }
    if (config.traitBoundaries) {
      const validOpts = ['pressureLowerbound', 'pressureUpperbound', 'temperatureLowerbound', 'temperatureUpperbound', 'steamCarbonRatioLowerbound', 'steamCarbonRatioUpperbound'];
      const traitBoundaries = { ...defaultConfig.traitBoundaries };
      configCheck(traitBoundaries, config.traitBoundaries, validOpts);

      dconf.traitBoundaries = traitBoundaries;
    }
    if ('outputFile' in config) {
      if (typeof config.outputFile !== 'string')
        throw new Error(`Invalid configuration.\nOutputFile expects a string [name of output file]`)
      if (config.outputFile.length < 1)
        throw new Error(`Invalid configuration.\nOutputFile expects a string [name of output file]`)
      dconf.outputFile = config.outputFile
    }

    return dconf
  }
}