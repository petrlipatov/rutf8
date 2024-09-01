import { lz77Encode } from "./encoder";
import { createArrayBuffer } from "./utils/helpers";
import { Options } from "./utils/types";

/**
 * Encodes a string using the LZ77 compression algorithm and returns the encoded data as an ArrayBuffer.
 *
 * This function compresses the input string with the LZ77 algorithm, generating encoded data
 * that includes offset-length pairs and literal characters. The result is returned as an ArrayBuffer,
 * which can be used for storage or transmission.
 *
 * @param {string} input - The input string to encode using the LZ77 compression algorithm.
 * @param {Partial<Options>} [options] - Optional settings to customize the compression behavior.
 *   - `searchBufferLength` (number): The maximum length of the search buffer.
 *   - `lookaheadLength` (number): The length of the lookahead buffer.
 * @returns {ArrayBuffer} The binary encoded data in the form of an ArrayBuffer.
 */
export function lz77BinaryEncode(
  input: string,
  options?: Partial<Options>
): ArrayBuffer {
  const encodedData = lz77Encode(input, options);
  const buffer = createArrayBuffer(encodedData);
  return buffer;
}
