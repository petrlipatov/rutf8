import { END_OF_STRING } from "./utils/constants";

/**
 * Decodes a string that was encoded using the Burrows-Wheeler Transform (BWT).
 *
 * The function reconstructs the original string by progressively building up the rows of the sorted
 * permutation table from the BWT string, and then retrieving the row at the specified index.
 *
 * @param {string} bwt - The Burrows-Wheeler Transform (BWT) encoded string to decode.
 * @param {number} index - The index of the original string in the sorted permutation table.
 * @returns {string} The decoded original string.
 */
export function bwtDecode(bwt: string, index: number): string {
  const length = bwt.length;
  const table = Array.from({ length }, () => "");
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      table[j] = bwt[j] + table[j];
    }
    table.sort();
  }
  return table[index].replace(END_OF_STRING, "");
}
