import { createFrequencyMap } from "../../common/utils";
import { END_OF_STRING } from "./utils/constants";

/**
 * Decodes a string that was encoded using the Burrows-Wheeler Transform (BWT).
 *
 * The function reconstructs the original string from its BWT representation by:
 *
 * 1. Building a frequency table of characters from the BWT string.
 * 2. Creating a table that maps each character to its first occurrence in the sorted version of the BWT string.
 * 3. Generating a `nextRow` table that helps in reconstructing the original string by indicating the position of each character in the sorted table.
 * 4. Using the `nextRow` table and starting from the provided index to rebuild the original string in reverse order.
 *
 * Instead of concatenating strings repeatedly, the function constructs the result using an array and then converts it to a string for improved performance.
 *
 * @param {string} bwt - The Burrows-Wheeler Transform (BWT) encoded string to decode.
 * @param {number} index - The index of the original string in the sorted permutation table.
 * @returns {string} The decoded original string.
 */
export function bwtDecode(input: string, index: number): string {
  const length = input.length;

  const frequencyTable = createFrequencyMap(input);
  const sortedChars = Array.from(frequencyTable.keys()).sort();

  // the first accurance of a char
  // in sorted bwt string
  const firstOccurrenceTable = new Map<string, number>();
  let position = 0;
  for (const char of sortedChars) {
    firstOccurrenceTable.set(char, position);
    position += frequencyTable.get(char)!;
  }

  const charCountTable = new Map<string, number>();
  const charsIndexesInSortedInput = Array(length).fill(0);
  for (let i = 0; i < length; i++) {
    const char = input[i];
    charCountTable.set(char, (charCountTable.get(char) || 0) + 1);
    charsIndexesInSortedInput[i] =
      firstOccurrenceTable.get(char)! + charCountTable.get(char)! - 1;
  }

  const output = new Array(length);
  let currentIndex = index;
  for (let i = length - 1; i >= 0; i--) {
    output[i] = input[currentIndex];
    currentIndex = charsIndexesInSortedInput[currentIndex];
  }

  return output.join("").replace(END_OF_STRING, "");
}
