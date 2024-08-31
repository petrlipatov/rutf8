import { BinaryReader } from "../../common/binary-reader";

export function lzssBinaryDecode(buffer: ArrayBuffer) {
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
