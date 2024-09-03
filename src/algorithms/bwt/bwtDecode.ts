import { createFrequencyMap } from "../../common/utils";
import { END_OF_STRING } from "./utils/constants";

/**
 * Decodes a string that was encoded using the Burrows-Wheeler Transform (BWT).
 *

 * 1. Create a createFrequencyMap for chars from input string.
 *
 * 2. Construct a mapping (`firstOccurrenceTable`) that indicates the starting position of each character in the sorted BWT string.
 *
 * 3. Compute the index of each character in the BWT string as it appears in the sorted BWT string. 
 *
 * 4. Using the `charsIndexesInSortedInput` array, trace back from the given index to reconstruct the original string.
 *
 * @param {string} input - BWT encoded string to decode.
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
