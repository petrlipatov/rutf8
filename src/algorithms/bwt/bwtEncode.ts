import { END_OF_STRING } from "./utils/constants";

export function bwtEncode(input: string): { bwt: string; index: number } {
  input += END_OF_STRING;

  const permutations: string[] = [];
  for (let i = 0; i < input.length; i++) {
    permutations.push(input.slice(i) + input.slice(0, i));
  }

  permutations.sort();

  let bwtResult = "";
  let originalIndex = -1;

  for (let i = 0; i < permutations.length; i++) {
    bwtResult += permutations[i][input.length - 1];
    if (permutations[i] === input) {
      originalIndex = i;
    }
  }

  return { bwt: bwtResult, index: originalIndex };
}
