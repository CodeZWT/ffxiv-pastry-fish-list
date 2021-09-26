/* eslint-disable prettier/prettier */
interface FishCondition {
  etHourStart: number;
  etHourEnd: number; // not included
  prevWeathers: number[];
  weathers: number[];
}

export const windowOf = (condition: FishCondition) => [condition]
