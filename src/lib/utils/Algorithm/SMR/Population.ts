import { SMRIndividual } from './Individual';
import { AlgoConfig, Compositions, IndividualConfig } from './types';

export class Population {
  population: SMRIndividual[] = []; // holds current population
  children: SMRIndividual[] = []; // holds the current population's offsprings after crossover and mutation
  size = 0;
  composition?: Compositions;

  constructor(popSize?: number, compositions?: Compositions) {
    this.population = [];
    this.size = popSize ?? 20;
    this.composition = compositions;
  }

  spawnPopulation({
    mbConfig,
    traitBoundaries,
    standardPressure,
    flareGasComposition
  }: {
    mbConfig: AlgoConfig;
    traitBoundaries: IndividualConfig;
    standardPressure: number
    flareGasComposition: Compositions
  }): SMRIndividual[] {
    for (let i = 0; i < this.size; i++) {
      const sol = new SMRIndividual({
        mbConfig,
        traitBoundaries,
        standardPressure,
        flareGasComposition
      });
      this.population.push(sol);
    }
    this.orderAccordingToFitness(this.population);
    return this.population;
  }

  generateNewPopulation(): void {
    const populationPlusChildren = this.population.concat(this.children);
    this.orderAccordingToFitness(populationPlusChildren);
    this.population = populationPlusChildren.slice(0, this.size);
    this.children = [];
  }

  // Sorts individuals in population according to their fitness in place
  orderAccordingToFitness(population: SMRIndividual[]): void {
    // console.log('unordered pop: ', population.map((el)=>el.fitness))
    population.sort((a, b) => {
      return b.fitness - a.fitness;
    });
    // console.log('ordered pop: ', population.map((el)=>el.fitness))
  }

  // Checks if the fitness of all individuals are same
  // return true if so
  get isFit(): boolean {
    const sum = this.population
      .map(el => el.fitness)
      .reduce((prev, curr) => {
        return prev + curr;
      });
    const fit = sum === this.size * this.population[0].fitness;
    if (fit) console.log(`========== IS FIT ============`);

    return fit;
  }
}
