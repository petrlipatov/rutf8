import { END_OF_STRING } from "./utils/constants";
import { buildSuffixArray } from "./utils/suffix-array";

/**
 * Encodes a given string using the Burrows-Wheeler Transform (BWT).
 *
 * This function constructs the suffix array for the input string using a
 * prefix doubling algorithm with radix sort, which operates in O(n log n) time.
 * The BWT string is then derived from the suffix array by taking the character
 * preceding each suffix.
 *
 * @param {string} input - The string to be encoded using the BWT.
 * @returns {{ bwt: string; index: number }} An object containing the encoded BWT string and the index of the original string.
 */
export function bwtEncode(input: string): { bwt: string; index: number } {
  input += END_OF_STRING;
  const length = input.length;

  // To construct the BWT string, we utilize the suffix array.
  // The suffix array contains the starting indixes of all suffixes of the string, sorted in lexicographical order.
  // This sorted order helps us build the BWT string by accessing the characters just before the start of each suffix
  // in the cyclic permutation of the string.
  const suffixArray = buildSuffixArray(input);

  const bwtResult: string[] = [];
  let originalIndex = -1;

  // For each suffix indexed in the suffix array, we find the character that precedes it in this cyclic view.
  // The formula (index + length - 1) % length computes the position of this preceding character:
  // - `index` is the start of the current suffix in the sorted suffix array.
  // - Add length - 1 to the index to move to the preceding position in the cyclic permutation.
  // - Use modulo length to wrap around to the start of the string if needed.
  // Example: For a suffix starting at index 5 in a string of length 6:
  // - Calculate the preceding character position: (5 + 6 - 1) % 6 = 10 % 6 = 4
  // - The character at index 4 in the string is the one just before the suffix starting at index 5.
  // Collecting these preceding characters for all suffixes in the sorted order gives us the BWT string.
  for (let i = 0; i < length; i++) {
    const index = suffixArray[i];
    bwtResult.push(input[(index + length - 1) % length]);
    if (index === 0) {
      originalIndex = i;
    }
  }

  return { bwt: bwtResult.join(""), index: originalIndex };
}
