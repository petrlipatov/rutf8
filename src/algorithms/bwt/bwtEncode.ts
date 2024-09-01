import { END_OF_STRING } from "./utils/constants";

/**
 * Encodes a given string using the Burrows-Wheeler Transform (BWT).
 *
 * The function generates all cyclic permutations of the input string, sorts them
 * lexicographically, and constructs the BWT string from the last characters of each
 * permutation. It also returns the index of the original string in the sorted list of permutations.
 *
 * @param {string} input - The string to be encoded using the Burrows-Wheeler Transform.
 * @returns {{ bwt: string; index: number }} An object containing the encoded BWT string and the index of the original string.
 */
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
