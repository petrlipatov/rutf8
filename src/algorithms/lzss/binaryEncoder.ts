import { lzssEncode } from "./encoder";
import { createArrayBuffer } from "./utils/helpers";
import { Options } from "./utils/types";

export function lzssBinaryEncode(input: string, options?: Partial<Options>) {
  const { data, length, schema } = lzssEncode(input, options);
  const buffer = createArrayBuffer(data, length, schema);
  return buffer;
}
