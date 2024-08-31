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
 * LZSS encodes repeated patterns with tuples [offset, length]:
 * `offset` -> The distance (in characters) that points back to the earlier
 *             occurrence of the repeated pattern.
 * `length` -> The number of characters that match  representing the length
 *             of the repeated sequence.
 */
export function lzssEncode(input: string, options?: Partial<Options>) {
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
