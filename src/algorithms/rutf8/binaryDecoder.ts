import { rutf8Decode } from "./rutf8Decoder";

/**
 * Decodes a UTF-8 encoded binary buffer into a string using the RUTF8 encoding scheme.
 *
 * This function first decodes the binary buffer into a UTF-8 string and then applies the RUTF8
 * decoding to obtain the final decoded string.
 *
 * @param {ArrayBuffer} input - The binary buffer containing UTF-8 encoded data.
 * @returns {string} The decoded string after applying RUTF8 decoding.
 */
export function rutf8BinaryDecode(input: ArrayBuffer): string {
  const binaryEncoder = new TextDecoder();
  const decodedFromBuffer = binaryEncoder.decode(input);
  const decodedFromRutf = rutf8Decode(decodedFromBuffer);
  return decodedFromRutf;
}
