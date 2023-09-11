import { getRandomNumberInRange } from '../helpers/functions';
import { MBConfig } from './types';
import { GasComponent } from '../SMR/types';
import randomatic from 'randomatic';

export class MBIndividual {
	_id: string;
	x: number = 0; // H2
	y: number = 0; // CO2
	a: number = 0; // CH4
	b: number = 0; // CO
	h: number = 0; // H2O
	fn: number = 0;
	fitness: number;
	config: MBConfig;

	// Sum is total input
	amountOfCarbon: number = 0;
	amountOfWater: number = 0;
	amountOfHydrogen: number = 0;
	amountOfOxygen: number = 0;

	changeInCarbon: number = 0;
	changeInHydrogen: number = 0;
	changeInOxygen: number = 0;

	pco2: number = 0;
	pch4: number = 0;
	ph2o: number = 0;
	ph2: number = 0;

	constructor(config: MBConfig, x?: number, y?: number) {
		this.config = config;
		this.spawnIndividual(x, y);
		this._id = randomatic('0a')
		let count = 0;
		while (
			this.x < 0 ||
			this.y < 0 ||
			this.a < 0 || 
			this.b < 0 ||
			this.h < 0 ||
			this.changeInCarbon < -1 ||
			this.changeInCarbon > 1 ||
			this.changeInHydrogen < -1 ||
			this.changeInHydrogen > 1 ||
			this.changeInOxygen < -1 ||
			this.changeInOxygen > 1
		) {
			if (count > 1000) {
				this.spawnIndividual(0, 0);
				if (count > 5050) {
					(this.x = 0), (this.y = 0), (this.a = 0), (this.h = 0);
					break;
				}
			}
			this.spawnIndividual(x, y);
			count++;
		}
		const total = this.x + this.y + this.a + this.h;
		this.pco2 =
			((this.y / total) * this.config.totalPressure) /
			this.config.standardPressure;
		this.pch4 =
			((this.a / total) * this.config.totalPressure) /
			this.config.standardPressure;
		this.ph2 =
			((this.x / total) * this.config.totalPressure) /
			this.config.standardPressure;
		this.ph2o =
			((this.h / total) * this.config.totalPressure) /
			this.config.standardPressure;
		this.fitness = this.getFitness();
	}

	// Implements the fitness function on an individual
	getFitness() {
		const fn =
			(this.pco2 * this.ph2 ** 4) / (this.pch4 * this.ph2o ** 2) || 0;
		this.fn = +fn.toFixed(4);

		this.fitness = +Math.abs(this.config.K - fn).toFixed(4);
		return this.fitness;
	}

	// Creates an individual
	spawnIndividual(x?: number, y?: number): void {
		const {
			amountOfCarbon,
			amountOfWater,
			amountOfHydrogen,
			amountOfOxygen
		} = this.calculateAmountOfCarbonAndWater();
		this.amountOfCarbon = amountOfCarbon;
		this.amountOfWater = amountOfWater;
		this.amountOfHydrogen = amountOfHydrogen;
		this.amountOfOxygen = amountOfOxygen;

		if (!x)
			x = getRandomNumberInRange(
				0.5 * this.amountOfCarbon,
				5 * this.amountOfCarbon
			);
		if (!y)
			y = getRandomNumberInRange(
				0.5 * this.amountOfCarbon,
				2 * this.amountOfCarbon
			);

		this.x = +x.toFixed(4); // H2
		this.y = +y.toFixed(4); // CO2
		this.a = +((this.y - this.x + (this.amountOfHydrogen - this.amountOfOxygen + this.amountOfCarbon)) / 3).toFixed(4); // CH4
		this.b = +(this.amountOfCarbon - this.a - this.y).toFixed(4)  // CO
		this.h = +(
			this.amountOfWater +
			this.amountOfHydrogen -
			this.x -
			2 * this.a
		).toFixed(4); // H2O

		const { changeInCarbon, changeInHydrogen, changeInOxygen } =
			this.doElementalBalance();

		this.changeInCarbon = changeInCarbon;
		this.changeInHydrogen = changeInHydrogen;
		this.changeInOxygen = changeInOxygen;
	}

	private calculateAmountOfCarbonAndWater(): {
		amountOfCarbon: number;
		amountOfWater: number;
		amountOfHydrogen: number;
		amountOfOxygen: number;
	} {
		// Calculate amount of H2O based on the composition and steamCarbonRatio
		let amountOfCarbon = 0;
		let amountOfHydrogen = 0;
		let amountOfOxygen = 0;
		for (const [component, amount] of Object.entries(
			this.config.flareGasComposition //?? { CH4: 100 }
		)) {
			switch (component as GasComponent) {
				case 'ch4':
					amountOfCarbon += 1 * amount;
					amountOfHydrogen += 2 * amount;
					break;
				case 'c2h6':
					amountOfCarbon += 2 * amount;
					amountOfHydrogen += 3 * amount;
					break;
				case 'c3h8':
					amountOfCarbon += 3 * amount;
					amountOfHydrogen += 4 * amount;
					break;
				case 'i-c4':
					amountOfCarbon += 4 * amount;
					amountOfHydrogen += 5 * amount;
					break;
				case 'i-c5':
					amountOfCarbon += 5 * amount;
					amountOfHydrogen += 6 * amount;
					break;
				case 'n-c5':
					amountOfCarbon += 5 * amount;
					amountOfHydrogen += 6 * amount;
					break;
				case 'i-c6':
					amountOfCarbon += 6 * amount;
					amountOfHydrogen += 7 * amount;
					break;
				case 'n-c6':
					amountOfCarbon += 6 * amount;
					amountOfHydrogen += 7 * amount;
					break;
				case 'co2':
					amountOfCarbon += 1 * amount;
					amountOfOxygen += 2 * amount;
					break;
				case 'co':
					amountOfCarbon += 1 * amount;
					amountOfOxygen += 1 * amount;
					break;
				default:
					amountOfCarbon += 0 * amount;
					break;
			}
		}

		const amountOfWater = +(
			amountOfCarbon * this.config.steamCarbonRatio
		).toFixed(4);

		return {
			amountOfCarbon,
			amountOfWater,
			amountOfHydrogen,
			amountOfOxygen
		};
	}

	doElementalBalance(): {
		changeInCarbon: number;
		changeInHydrogen: number;
		changeInOxygen: number;
	} {
		// balance C (carbon)
		// output => CH4, CO, CO2, H2, H2O
		const changeInCarbon = this.amountOfCarbon - (this.y + this.a + this.b);

		// balance H2 (hydrogen)
		const changeInHydrogen =
			this.amountOfWater +
			this.amountOfHydrogen -
			(this.x + this.h + 2 * this.a);

		// balance O (oxygen)
		const changeInOxygen =
			this.amountOfWater + this.amountOfOxygen - (this.b + this.h + 2 * this.y);

		return { changeInCarbon, changeInHydrogen, changeInOxygen };
	}
}
