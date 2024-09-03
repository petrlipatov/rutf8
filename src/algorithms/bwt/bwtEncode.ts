import { END_OF_STRING } from "./utils/constants";

/**
 * Encodes a given string using the Burrows-Wheeler Transform (BWT).
 *
 * The function virtualizes all cyclic permutations of the input string, sorts them
 * lexicographically, and constructs the BWT string from the last characters of each
 * permutation. It also returns the index of the original string in the sorted list of permutations.
 *
 * @param {string} input - The string to be encoded using the Burrows-Wheeler Transform.
 * @returns {{ bwt: string; index: number }} An object containing the encoded BWT string and the index of the original string.
 */
export function bwtEncode(input: string): { bwt: string; index: number } {
  input += END_OF_STRING;
  const length = input.length;

  const permutationsIndexes = Array.from({ length }, (_, i) => i);

  // sorting all permutations
  // using indexes
  // without creating actual strings
  permutationsIndexes.sort((a, b) => {
    for (let i = 0; i < length; i++) {
      const charA = input[(a + i) % length];
      const charB = input[(b + i) % length];
      if (charA < charB) return -1;
      if (charA > charB) return 1;
    }
    return 0;
  });

  const bwtResult: string[] = [];
  let originalIndex = -1;

  for (let i = 0; i < length; i++) {
    const index = permutationsIndexes[i];
    bwtResult.push(input[(index + length - 1) % length]);
    if (index === 0) {
      originalIndex = i;
    }
  }

  return { bwt: bwtResult.join(""), index: originalIndex };
}
