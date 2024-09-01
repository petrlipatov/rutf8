import { rutf8Encode } from "./rutf8Encoder";

/**
 * Encodes a string into a binary buffer using the RUTF8 encoding scheme followed by UTF-8 encoding.
 *
 * This function first encodes the input string using the RUTF8 encoding scheme and then converts
 * the RUTF8-encoded string into a binary buffer using UTF-8 encoding.
 *
 * @param {string} input - The input string to encode using the RUTF8 encoding scheme.
 * @returns {Uint8Array} The binary buffer containing the UTF-8 encoded RUTF8 data.
 */
export function rutf8BinaryEncode(input: string): Uint8Array {
  const binaryEncoder = new TextEncoder();
  const rutfEncoded = rutf8Encode(input);
  const buffer = binaryEncoder.encode(rutfEncoded);
  return buffer;
}
