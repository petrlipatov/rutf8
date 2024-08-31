import { rutf8Encode } from "./rutf8Encoder";

export function rutf8BinaryEncode(input: string) {
  const binaryEncoder = new TextEncoder();
  const rutfEncoded = rutf8Encode(input);
  const buffer = binaryEncoder.encode(rutfEncoded);
  return buffer;
}
