/**
 * Calculate byte size of a string
 * @param {string} input - The string whose byte size is to be calculated.
 * @returns {number} The number of bytes required to encode the string in UTF-8.
 */
export function getByteLength(input: string): number {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(input);
  return encoded.length;
}
