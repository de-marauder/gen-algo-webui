type MutableCompositionTypes<T> = {
	n2: T;
	co2: T;
	ch4: T;
	c2h6: T;
	c3h8: T;
	'i-c4': T;
	'n-c4': T;
	'i-c5': T;
	'n-c5': T;
	'i-c6': T;
	'n-c6': T;
	co: T;
	h2: T;
};

// export type Compositions = Partial<Omit<MutableCompositionTypes<number>, 'CO' | 'H2'>>
export type Compositions = Partial<MutableCompositionTypes<number>>;

export type GasComponent = keyof Compositions;

export type ReactionComponentsBeforeCalculation = MutableCompositionTypes<
	[number, number | undefined]
>;
export type ReactionComponents = MutableCompositionTypes<[number, number]>;

export type MBIndividualType = number;
export type SMRIndividualType = {
	pressure: number;
	temperature: number;
	steamCarbonRatio: number;
};

export type SMRTraits = keyof SMRIndividualType;

export type SMRPopulationType = SMRIndividualType[];

export type AlgoConfig = {
	popSize: number;
	genSize: number;
	movingAverage: number;
	mutationProbability: number;
};

export type IndividualConfig = {
	pressureUpperbound: number;
	pressureLowerbound: number;
	temperatureUpperbound: number;
	temperatureLowerbound: number;
	steamCarbonRatioUpperbound: number;
	steamCarbonRatioLowerbound: number;
};

export type Config = {
	algoConfig: AlgoConfig;
	individualTraitBoundaries: IndividualConfig;
	gasComposition: Compositions;
};
