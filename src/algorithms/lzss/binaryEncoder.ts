import { lzssEncode } from "./encoder";
import { createArrayBuffer } from "./utils/helpers";
import { Options } from "./utils/types";

/**
 * Encodes a string using the LZSS compression algorithm and returns the encoded data as an ArrayBuffer.
 *
 * This function compresses the input string with the LZSS algorithm, generating encoded data
 * that includes literals and offset-length pairs, along with a schema to indicate the format of the data.
 * The result is returned as an ArrayBuffer, which can be used for storage or transmission.
 *
 * @param {string} input - The input string to encode using the LZSS compression algorithm.
 * @param {Partial<Options>} [options] - Optional settings to customize the compression behavior.
 *   - `searchBufferLength` (number): The maximum length of the search buffer (default is typically defined elsewhere).
 *   - `lookaheadLength` (number): The length of the lookahead buffer (default is typically defined elsewhere).
 * @returns {ArrayBuffer} The binary encoded data in the form of an ArrayBuffer.
 */
export function lzssBinaryEncode(
  input: string,
  options?: Partial<Options>
): ArrayBuffer {
  const { data, length, schema } = lzssEncode(input, options);
  const buffer = createArrayBuffer(data, length, schema);
  return buffer;
}
