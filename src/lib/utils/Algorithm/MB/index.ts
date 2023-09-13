import { MBIndividual } from './Individual';
import { MBPopulation } from './Population';
import {
	roundToNearestInteger
} from '../helpers/functions';
import { MBConfig } from './types';
import { AlgoConfig, Compositions } from '../SMR/types';

type ConstructorArgs = {
	mbConfig: Required<AlgoConfig>;
	individualConfig: MBConfig;
};

export class MBGeneticsAlgorithm {
	generations: MBIndividual[][] = [];
	population: MBPopulation;
	mbConfig: Required<AlgoConfig>;
	individualConfig: MBConfig;

	// Creates initial random population
	constructor({ mbConfig, individualConfig }: ConstructorArgs) {
		this.mbConfig = mbConfig;
		this.individualConfig = individualConfig;
		this.population = new MBPopulation({
			individualConfig: this.individualConfig,
			mbConfig: this.mbConfig
		});
		this.population.spawnPopulation();
	}

	// Implements the breeding process to create a new generation and update the current population
	createNextGeneration(): void {
		for (let i = 0; i < this.population.size; i++) {
			const { individualA, individualB } = this.selectIndividuals();
			let newIndividual = this.crossover(individualA, individualB);
			const willMutate = this.willMutate();

			if (willMutate) {
				// mutatate new individual in place
				newIndividual = this.mutation(newIndividual);
			}

			this.population.children.push(newIndividual);
		}
		this.generations.push([...this.population.population]);
		this.population.generateNewPopulation();
	}

	// Selects two Individuals to mate for crossover
	// Selection favours better fit individuals in the population
	selectIndividuals(): {
		individualA: MBIndividual;
		individualB: MBIndividual;
	} {
		// Selection will be based on two modes with 50% probability of either
		// Mode 1: Tournament Selection
		// Mode 2: Biased Roulette Selection
		const probability = Math.random();

		let individualA: MBIndividual;
		let individualB: MBIndividual;
		if (probability > 0.5) {
			// Do tournament selection
			individualA = this.tournamentSelection();
			individualB = this.tournamentSelection();
			while (individualA === individualB)
				individualB = this.tournamentSelection();
		} else {
			// Do biased roulette selection
			individualA = this.biasedRouletteSelection();
			individualB = this.biasedRouletteSelection();
			let counter = 0;
			while (individualA === individualB) {
				if (counter <= 50) {
					individualB = this.biasedRouletteSelection();
				}
				else if (counter > 50) {
					individualB = this.tournamentSelection();
				}
				else if (counter > 100) {
					// console.log('Same individuals picked', individualA, individualB)
					// console.log(this.population.population)
					// console.log(this.population.population.length)
					throw Error('Biased roulette failed to select')
				}
				counter++
			}
		}

		return { individualA, individualB };
	}

	// Implements the tournament selection procedure
	// Two unique individuals are chosen from the population at random
	// The better fit individual out of the two is returned
	tournamentSelection(): MBIndividual {
		const a = roundToNearestInteger(
			Math.random() * (this.mbConfig.popSize - 1)
		);
		let b = roundToNearestInteger(
			Math.random() * (this.mbConfig.popSize - 1)
		);
		while (a === b)
			b = roundToNearestInteger(
				Math.random() * (this.mbConfig.popSize - 1)
			);

		const individualA = this.population.population[a];
		const individualB = this.population.population[b];

		if (individualA.fitness > individualB.fitness) return individualA;
		else return individualB;
	}

	// Implements the biased roulette wheel selection approach
	// A probability distribution is created based on the fitness of each individual
	// A cummulation of the distribution is evaluated
	// An individual is then selected randomly from the cummulated probabilitomy distribution
	biasedRouletteSelection(): MBIndividual {
		const fitnessArr = this.population.population.map(el => el.fitness);
		// Since lower fitness values is preferred
		// we normalize the fitnessArr so that lower fitness => higher probability
		// then  we just take the quotient of the fitness and sum of fitnesses
		const sum = fitnessArr.reduce((prev, curr) => prev + curr);
		const probabilityDistribution = fitnessArr.map(el => sum / el);
		// const probabilityDistribution = fitnessArr.map(el => el / sum);
		const sum2 = probabilityDistribution.reduce((prev, curr) => prev + curr);
		const probabilityDistribution2 = probabilityDistribution.map(el => el / sum2);

		const cummulatedProbabilityDistribution: number[] = [];
		let cummulatedSum = 0;
		for (let i = 0; i < probabilityDistribution2.length; i++) {
			cummulatedSum = cummulatedSum + probabilityDistribution2[i];
			cummulatedProbabilityDistribution.push(cummulatedSum);
		}

		const randProb = Math.random();

		for (let i = 0; i < cummulatedProbabilityDistribution.length; i++) {
			if (cummulatedProbabilityDistribution[i] > randProb) {
				return this.population.population[i];
			}
		}
		// console.log('fitnessArr: ', fitnessArr)
		// console.log('sum: ', sum)
		// console.log('sum2: ', sum2)
		// console.log('randProb: ', randProb)
		// console.log('probabilityDistribution: ', probabilityDistribution)
		// console.log('probabilityDistribution2: ', probabilityDistribution2)
		// console.log('cummulatedProbabilityDistribution: ', cummulatedProbabilityDistribution)
		throw new Error(
			'Biased roulette selection could not select an individual'
		);
	}

	// Combines two individual's traits to form a new individual
	// Mode 1: Averaging
	// Mode 2: random selection of certain traits
	// Mode 3:
	crossover(
		individualA: MBIndividual,
		individualB: MBIndividual
	): MBIndividual {
		const modeSelectorProbabilty = Math.random();
		// console.log('==============================')
		if (modeSelectorProbabilty > 0.2) {
			// Do Mode 1
			return this.crossOverByNormalAveraging(individualA, individualB);
		} else {
			// Do mode 2
			return this.crossOverByRandomBiasedAveraging(
				individualA,
				individualB
			);
		}
	}

	// Averages all the individual traits
	crossOverByNormalAveraging(
		individualA: MBIndividual,
		individualB: MBIndividual
	): MBIndividual {
		const x = +((individualA.x + individualB.x) / 2).toFixed(2);
		const y = +((individualA.y + individualB.y) / 2).toFixed(2);
		// console.log('cross over done')
		return new MBIndividual(this.individualConfig, x, y);
	}

	// averages the values of individual based on a random probability
	// Weights for averaging are selected randomly and
	// Biased to favour better parent's traits
	crossOverByRandomBiasedAveraging(
		individualA: MBIndividual,
		individualB: MBIndividual
	): MBIndividual {
		const probability = Math.random();
		const better = Math.max(individualA.fitness, individualB.fitness);
		let x = [individualA, individualB].find(el => {
			el.fitness === better;
		})?.x;
		let y = [individualA, individualB].find(el => {
			el.fitness === better;
		})?.y;
		if (individualA.fitness === better && probability > 0.5) {
			x = +(
				probability * individualA.x +
				(1 - probability) * individualB.x
			).toFixed(4);
			y = +(
				probability * individualA.y +
				(1 - probability) * individualB.y
			).toFixed(4);
		} else if (individualA.fitness === better && probability < 0.5) {
			x = +(
				(1 - probability) * individualA.x +
				probability * individualB.x
			).toFixed(4);
			y = +(
				(1 - probability) * individualA.y +
				probability * individualB.y
			).toFixed(4);
		} else if (individualB.fitness === better && probability > 0.5) {
			x = +(
				(1 - probability) * individualA.x +
				probability * individualB.x
			).toFixed(4);
			y = +(
				(1 - probability) * individualA.y +
				probability * individualB.y
			).toFixed(4);
		} else if (individualB.fitness === better && probability < 0.5) {
			x = +(
				probability * individualA.x +
				(1 - probability) * individualB.x
			).toFixed(4);
			y = +(
				probability * individualA.y +
				(1 - probability) * individualB.y
			).toFixed(4);
		}
		return new MBIndividual(this.individualConfig, x, y);
	}

	// Changes an individual to encourage randomness in algorithm
	mutation(individualA: MBIndividual): MBIndividual {
		const newIndividual = new MBIndividual(this.individualConfig);
		return newIndividual;
	}

	// Evalutes whether mutation should occur based on a 2% probability
	willMutate(): boolean {
		const n = Math.random() * 100;
		return +n.toFixed(0) < this.mbConfig.mutationProbability;
	}

	// eveluates stopping criteria
	get stop(): boolean {
		return (
			this.population.isFit ||
			this.hasConverged ||
			this.generations.length >= this.mbConfig.genSize ||
			this.population.population[0].fitness === 0
		);
	}

	// Checks convergence based on a moving average over a specific number of points.
	// If the last 10 best points are identical, convergence has been reached
	get hasConverged() {
		const movingAverageSize = this.mbConfig.movingAverage;
		if (this.generations.length > movingAverageSize) {
			const listOfBestIndividuals = this.generations
				.slice(-1 * movingAverageSize)
				.map(el => el[0]);
			const listOfBestIndividualsFitness = listOfBestIndividuals.map(
				el => el.fitness
			);

			const movingAverage = +(
				listOfBestIndividualsFitness.reduce(
					(prev, curr) => prev + curr
				) / movingAverageSize
			).toFixed(4);

			const converged =
				+movingAverage.toFixed(4) === listOfBestIndividualsFitness[0];
			// if (converged)
			// 	console.log(
			// 		`========== MB HAS CONVERGED after ${this.generations.length} genenrations ============`
			// 	);
			return converged;
		}
		return false;
	}
}
