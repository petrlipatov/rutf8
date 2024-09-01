import {
  getMatch,
  getOptions,
  updateLookaheadBuffer,
  updateSearchBuffer,
} from "./utils/helpers";
import { EncodedArray, Options } from "./utils/types";
import { NULL_UNICODE } from "./utils/constants";

/**
 * LZ77 encodes repeated patterns using tuples [offset, length, next-unmatched-symbol]:
 *
 * `offset` -> The distance (in characters) from the current position to the start of
 *              the previous occurrence of the repeated pattern in the window.
 *
 * `length` -> The number of characters that match the repeated pattern, indicating
 *              the length of the sequence that is duplicated.
 *
 * `next-unmatched-symbol` -> The next symbol in the stream that does not participate in
 *                             the current pattern match, which will be encoded as a literal.
 *
 * @param {string} input - The input string to encode using the LZ77 compression algorithm.
 * @param {Partial<Options>} [options] - Optional settings to customize the compression behavior.
 *   - `searchBufferLength` (number): The maximum length of the search buffer.
 *   - `lookaheadLength` (number): The length of the lookahead buffer.
 * @returns {EncodedArray} array of tuples [offset, length, next-unmatched-symbol][]
 */
export function lz77Encode(
  input: string,
  options?: Partial<Options>
): EncodedArray {
  const output: EncodedArray = [];

  let pointer = 0;
  let searchBuffer = "";

  const { searchBufferLength, lookaheadLength } = getOptions(options);

  while (pointer < input.length) {
    const lookaheadBuffer = updateLookaheadBuffer(
      input,
      pointer,
      lookaheadLength
    );

    const [offset, matchedLength, matchedChars] = getMatch(
      searchBuffer,
      lookaheadBuffer
    );

    pointer += matchedLength;

    const nextUnmatchedSymbol = input[pointer] ?? NULL_UNICODE;
    output.push([offset, matchedLength, nextUnmatchedSymbol]);

    searchBuffer += matchedChars + nextUnmatchedSymbol;
    searchBuffer = updateSearchBuffer(searchBuffer, searchBufferLength);
    pointer++;
  }

  return output;
}
