import { BinaryReader } from "../../common/binary-reader";
import { NULL_UNICODE } from "./utils/constants";
import { addMatchedPattern } from "./utils/helpers";

export function lz77BinaryDecode(buffer: ArrayBuffer) {
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
