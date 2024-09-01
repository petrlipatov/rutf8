import { BinaryReader } from "../../common/binary-reader";
import { NULL_UNICODE } from "./utils/constants";
import { addMatchedPattern } from "./utils/helpers";

/**
 * Decodes a string encoded with the LZ77 compression algorithm from a binary buffer.
 *
 * This function reads a binary buffer containing LZ77-encoded data, which consists of offset-length pairs
 * followed by literal characters. It reconstructs the original string by expanding the matched patterns
 * and appending the literal characters.
 *
 * @param {ArrayBuffer} buffer - The binary buffer containing the LZ77-encoded data.
 * @returns {string} The decoded original string.
 */
export function lz77BinaryDecode(buffer: ArrayBuffer): string {
  const binaryReader = new BinaryReader(buffer);

  let output = "";

  while (binaryReader.peak() !== null) {
    const [offset, length] = binaryReader.getOffsetLength();
    let nextUnmatchedChar = binaryReader.getCharacter();
    nextUnmatchedChar =
      nextUnmatchedChar === NULL_UNICODE ? "" : nextUnmatchedChar;

    if (offset === 0 && length === 0) {
      output += nextUnmatchedChar;
      continue;
    }

    const patternStartIndex = output.length - offset;

    const pattern = output.substring(
      patternStartIndex,
      patternStartIndex + length
    );
    output += addMatchedPattern(pattern, length);
    output += nextUnmatchedChar;
  }
  return output;
}
