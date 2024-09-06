import { extractSymbolAndCount } from "./utils/helpers";

/**
 * Decodes a string encoded with the Run-Length Encoding (RLE) algorithm.
 *
 * This function reconstructs the original string from its RLE-encoded form by expanding sequences
 * of repeated characters based on the counts specified in the encoded string.
 *
 * @param {string} input - The RLE-encoded string to decode.
 * @returns {string} The decoded original string.
 */
export function rleDecode(input: string): string {
  if (input.length === 0) return "";

  const output = [];
  let pointer = 0;

  while (pointer < input.length) {
    const { char, count, updatedPointer } = extractSymbolAndCount(
      input,
      pointer
    );
    output.push(char.repeat(count));
    pointer = updatedPointer;
  }

  return output.join("");
}
