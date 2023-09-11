import { getRandomNumberInRange } from '../helpers/functions';
import {
	AlgoConfig,
	Compositions,
	GasComponent,
	IndividualConfig,
	SMRIndividualType,
	SMRTraits
} from './types';
import { MBGeneticsAlgorithm } from '../MB';

export class SMRIndividual {
	traits: SMRIndividualType;
	static traitBoundaries: IndividualConfig;
	standardPressure: number
	flareGasComposition: Compositions;

	gasComponents: GasComponent[];

	mbConfig: AlgoConfig;

	fitness: number;
	y: number;
	a: number;
	b: number;
	h: number;
	f: number;
	k: number;
	K1: number = 0;
	K2: number = 0;
	K1K2: number = 0;
	K3: number = 0;
	error: number;

	changeInCarbon: number;
	changeInHydrogen: number;
	changeInOxygen: number;
	amountOfCarbon: number;
	amountOfHydrogen: number;
	amountOfOxygen: number;
	amountOfWater: number;

	constructor(
		config: {
			mbConfig: AlgoConfig;
			traitBoundaries: IndividualConfig;
			standardPressure: number,
			flareGasComposition: Compositions
		},
		traits?: SMRIndividualType
	) {
		this.mbConfig = { ...config.mbConfig };
		this.traits = this.spawnIndividual(traits);
		SMRIndividual.traitBoundaries = { ...config.traitBoundaries };
		this.standardPressure = config.standardPressure
		this.flareGasComposition = config.flareGasComposition

		this.gasComponents = Object.keys(
			this.flareGasComposition
		) as GasComponent[];

		const {
			x,
			y,
			a,
			b,
			h,
			f,
			fn,
			changeInCarbon,
			changeInHydrogen,
			changeInOxygen,
			amountOfCarbon,
			amountOfHydrogen,
			amountOfOxygen,
			amountOfWater
		} = this.getFitness();
		this.fitness = x;
		this.y = y;
		this.a = a;
		this.b = b;
		this.h = h;
		this.f = fn;
		this.k = this.equilibrumConstant;
		this.error = f;

		this.changeInCarbon = changeInCarbon;
		this.changeInHydrogen = changeInHydrogen;
		this.changeInOxygen = changeInOxygen;
		this.amountOfCarbon = amountOfCarbon;
		this.amountOfHydrogen = amountOfHydrogen;
		this.amountOfOxygen = amountOfOxygen;
		this.amountOfWater = amountOfWater;
	}

	// Implements the fitness function on an individual
	getFitness() {
		// Perform elemental balance to obtain the conc. of H2 produced as an unknown

		try {
			const mbAlgo = new MBGeneticsAlgorithm({
				mbConfig: this.mbConfig,
				individualConfig: {
					K: this.equilibrumConstant,
					steamCarbonRatio: this.traits.steamCarbonRatio,
					totalPressure: this.traits.pressure,
					flareGasComposition: this.flareGasComposition,
					standardPressure: this.standardPressure,
				}
			});
			let id = 0;
			while (!mbAlgo.stop) {
				mbAlgo.createNextGeneration();
				id++;
			}
			
			const {
				x,
				y,
				a,
				b,
				h,
				fitness: f,
				fn,
				changeInCarbon,
				changeInHydrogen,
				changeInOxygen,
				amountOfCarbon,
				amountOfHydrogen,
				amountOfOxygen,
				amountOfWater
			} = mbAlgo.population.population[0];
			this.fitness = x;
			
			return {
				x,
				y,
				a,
				b,
				h,
				f,
				fn,
				changeInCarbon,
				changeInHydrogen,
				changeInOxygen,
				amountOfCarbon,
				amountOfHydrogen,
				amountOfOxygen,
				amountOfWater
			};
		} catch (error) {
			console.log('An Error occured: \n', error);
			throw error;
		}
	}

	get equilibrumConstant() {
		const R = 8.314
		
		const E1 = 240.1;
		const A1 = 4.225 * 10 ^ 15;
		const K1 = A1 * Math.exp((E1 / (R * this.traits.temperature)));
		this.K1 = K1
		/////////////////////////////
		const E2 = 67.13;
		const A2 = 1.955 * 10 ^ 6;
		const K2 = A2 * Math.exp((E2 / (R * this.traits.temperature)));
		this.K2 = K2

		this.K1K2 = this.K1 * this.K2
		/////////////////////////////
		const E3 = 243.9;
		const A3 = 1.020 * 10 ^ 15;
		const K3 = A3 * Math.exp((E3 / (R * this.traits.temperature)));
		return +K3.toFixed(4);
	}

	// Creates an individual
	spawnIndividual(traits?: SMRIndividualType): SMRIndividualType {
		// Define rules and bounds for selecting each gene [P, T, C/S]
		const pressure =
			traits?.pressure ?? SMRIndividual.generateTrait('pressure');
		const temperature =
			traits?.temperature ?? SMRIndividual.generateTrait('temperature');
		const steamCarbonRatio =
			traits?.steamCarbonRatio ??
			SMRIndividual.generateTrait('steamCarbonRatio');

		return {
			pressure,
			temperature,
			steamCarbonRatio
		};
	}

	static generateTrait(trait: SMRTraits): number {
		if (trait === 'pressure') {
			return this.generatePressureValue();
		} else if (trait === 'temperature') {
			return this.generateTemperatureValue();
		} else if (trait === 'steamCarbonRatio') {
			return this.generateCarbonSteamRatioValue();
		}
		return 0;
	}

	// Generate trait values within specified ranges
	private static generatePressureValue(): number {
		const lowerBound = this.traitBoundaries.pressureLowerbound;
		const upperBound = this.traitBoundaries.pressureUpperbound;
		const p = getRandomNumberInRange(lowerBound, upperBound);
		console.log('generated pressure: ', p)
		return p;
	}
	
	private static generateTemperatureValue(): number {
		const lowerBound = this.traitBoundaries.temperatureLowerbound;
		const upperBound = this.traitBoundaries.temperatureUpperbound;
		
		const p = getRandomNumberInRange(lowerBound, upperBound);
		console.log('generated TemperatureValue: ', p)
		return p;
	}

	private static generateCarbonSteamRatioValue(): number {
		const lowerBound = this.traitBoundaries.steamCarbonRatioLowerbound;
		const upperBound = this.traitBoundaries.steamCarbonRatioUpperbound;
		
		const p = getRandomNumberInRange(lowerBound, upperBound);
		console.log('generated CarbonSteamRatioValue: ', p)
		return p;
	}
}
