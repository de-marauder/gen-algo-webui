import fs from 'fs';
export function roundToNearestInteger(number: number): number {
	const integerPart = Math.floor(number);
	const decimalPart = number - integerPart;

	if (decimalPart < 0.4) {
		return integerPart;
	} else {
		return integerPart + 1;
	}
}

export function getRandomNumberInRange(min: number, max: number): number {
	return +(Math.random() * (max - min) + min).toFixed(4);
}

export const defaultNewIndividualTraits = {
	pressure: 0,
	temperature: 0,
	steamCarbonRatio: 0
};
