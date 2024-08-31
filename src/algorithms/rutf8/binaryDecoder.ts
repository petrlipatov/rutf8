import { rutf8Decode } from "./rutf8Decoder";

export function rutf8BinaryDecode(input: ArrayBuffer) {
  const binaryEncoder = new TextDecoder();
  const decodedFromBuffer = binaryEncoder.decode(input);
  const decodedFromRutf = rutf8Decode(decodedFromBuffer);
  return decodedFromRutf;
}
