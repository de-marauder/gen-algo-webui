import { Compositions } from '../SMR/types';

export type MBConfig = {
	// min: number;
	// max: number;
	K: number;
	totalPressure: number;
	steamCarbonRatio: number;
	standardPressure: number;
	flareGasComposition: Compositions;
};

// export type MBAlgoConfig = {
// 	popSize: number;
// 	mutationProbability: number;
// 	movingAverage: number;
// 	genSize: number;
// };
