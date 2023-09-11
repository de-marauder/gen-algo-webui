import { Compositions } from '../SMR/types';
import { MBIndividual } from './Individual';
import { MBConfig } from './types';
import { AlgoConfig } from '../SMR/types';

export class MBPopulation {
	population: MBIndividual[] = []; // holds current population
	children: MBIndividual[] = []; // holds the current population's offsprings after crossover and mutation
	size;
	// composition: MBConfig['composition']
	individualConfig: MBConfig;

	constructor({
		individualConfig,
		mbConfig
	}: {
		individualConfig: MBConfig;
		mbConfig: AlgoConfig;
	}) {
		this.population = [];
		this.individualConfig = individualConfig;
		this.size = mbConfig.popSize;
		// this.composition = individualConfig.compositions
	}

	spawnPopulation(): MBIndividual[] {
		for (let i = 0; i < this.size; i++) {
			const sol = new MBIndividual(this.individualConfig);
			this.population.push(sol);
		}
		this.orderAccordingToFitness(this.population);
		return this.population;
	}

	generateNewPopulation(): void {
		// console.log('==========================================')
		const populationPlusChildren = this.population.concat(this.children);
		// console.log(this.population)
		this.orderAccordingToFitness(populationPlusChildren);
		this.population = populationPlusChildren.slice(0, this.size);
		this.children = [];
		// console.log(this.population)
		// console.log('==========================================')
	}

	// Sorts individuals in population according to their fitness in place.
	orderAccordingToFitness(population: MBIndividual[]): void {
		population.sort((a, b) => {
			// lower fitness values are better
			// therefore order is ascending
			return a.fitness - b.fitness;
		});
	}

	// Checks if the fitness of all individuals are same
	// return true if so
	get isFit(): boolean {
		const sum = this.population
			.map(el => el.fitness)
			.reduce((prev, curr) => {
				return prev + curr;
			});
		return sum === this.size * this.population[0].fitness;
	}
}
