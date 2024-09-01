import { BinaryReader } from "../../common/binary-reader";

/**
 * Decodes a string encoded with the LZSS compression algorithm from a binary buffer.
 *
 * This function reads a binary buffer containing LZSS-encoded data, which includes a schema byte
 * to indicate whether the following data is a literal character or a reference to a previously encoded
 * substring (offset-length pair). The function reconstructs the original string by expanding the
 * matched patterns and appending literal characters.
 *
 * @param {ArrayBuffer} buffer - The binary buffer containing the LZSS-encoded data.
 * @returns {string} The decoded original string.
 */
export function lzssBinaryDecode(buffer: ArrayBuffer): string {
  const binaryReader = new BinaryReader(buffer);
  let output = "";

  let schemaByte = binaryReader.getUint8();
  let schemaBitPointer = 7;

  while (binaryReader.peak() !== null) {
    const schemaBit = schemaByte & (1 << schemaBitPointer);
    if (schemaBit === 0) {
      output += binaryReader.getCharacter();
    } else {
      const [offset, length] = binaryReader.getOffsetLength();
      const startIndex = output.length - offset;
      const chars = output.substring(startIndex, startIndex + length);

      output += chars
        .repeat(Math.ceil(length / chars.length))
        .substring(0, length);
    }

    schemaBitPointer--;

    if (schemaBitPointer < 0 && binaryReader.peak(1) !== null) {
      schemaByte = binaryReader.getUint8();
      schemaBitPointer = 7;
    }
  }

  return output;
}
