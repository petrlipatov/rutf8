import {
  addBit,
  getMatch,
  getOptions,
  updateLookaheadBuffer,
  updateSearchBuffer,
} from "./utils/helpers";
import { BYTE_LENGTH } from "../../common/constants";
import { MIN_MATCH_LENGTH } from "./utils/constants";
import { EncodedArray, Options } from "./utils/types";

/**
 * Encodes a string using the LZSS compression algorithm.
 *
 * This function compresses the input string with the LZSS algorithm, generating encoded data
 * that includes literals and offset-length pairs, along with a schema byte array that indicates
 * the format of the encoded data. The schema helps in interpreting the encoded data during decompression.
 *
 * @param {string} input - The input string to encode using the LZSS compression algorithm.
 * @param {Partial<Options>} [options] - Optional settings to customize the compression behavior.
 *   - `searchBufferLength` (number): The maximum length of the search buffer (default is typically defined elsewhere).
 *   - `lookaheadLength` (number): The length of the lookahead buffer (default is typically defined elsewhere).
 * @returns {Object} An object containing the following properties:
 *   - `data` (EncodedArray): The encoded data, which includes literals and offset-length pairs.
 *   - `length` (number): The length of the encoded data.
 *   - `schema` (number[]): An array of bytes representing the schema for interpreting the encoded data.
 */
export function lzssEncode(
  input: string,
  options?: Partial<Options>
): {
  data: EncodedArray;
  length: number;
  schema: number[];
} {
  const encodedData: EncodedArray = [];
  // `schema` is a byte array where each bit indicates type of encoded data.
  // 0 -> represents a literal symbol;
  // 1 ->  an LZSS tuple [offset, length];
  // These bit flags will be used for interpretation from binary during decompression.
  const schema: number[] = [];

  let pointer = 0;
  let searchBuffer = "";
  let encodedDataLength = 0;
  let currentSchemaByte = 0;
  let bitIndexInSchemaByte = 0;

  const { searchBufferLength, lookaheadLength } = getOptions(options);

  while (pointer < input.length) {
    const lookaheadBuffer = updateLookaheadBuffer(
      input,
      pointer,
      lookaheadLength
    );

    const match = getMatch(searchBuffer, lookaheadBuffer, MIN_MATCH_LENGTH);

    if (match) {
      const [offset, length, matchedChars] = match;
      encodedData.push([offset, length]);
      currentSchemaByte = addBit(currentSchemaByte, 1);
      encodedDataLength += 2;
      pointer += length;
      searchBuffer += matchedChars;
    } else {
      const character = lookaheadBuffer[0];
      encodedData.push(character);
      currentSchemaByte = addBit(currentSchemaByte, 0);
      encodedDataLength++;
      pointer++;
      searchBuffer += character;
    }

    bitIndexInSchemaByte++;
    searchBuffer = updateSearchBuffer(searchBuffer, searchBufferLength);

    if (bitIndexInSchemaByte === BYTE_LENGTH) {
      schema.push(currentSchemaByte);
      bitIndexInSchemaByte = 0;
      currentSchemaByte = 0;
    }
  }

  if (bitIndexInSchemaByte) {
    schema.push((currentSchemaByte <<= BYTE_LENGTH - bitIndexInSchemaByte));
  }

  return { data: encodedData, length: encodedDataLength, schema };
}
