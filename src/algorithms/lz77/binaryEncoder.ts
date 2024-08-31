import { lz77Encode } from "./encoder";
import { createArrayBuffer } from "./utils/helpers";
import { Options } from "./utils/types";

export function lz77BinaryEncode(input: string, options?: Partial<Options>) {
  const encodedData = lz77Encode(input, options);
  const buffer = createArrayBuffer(encodedData);
  return buffer;
}
