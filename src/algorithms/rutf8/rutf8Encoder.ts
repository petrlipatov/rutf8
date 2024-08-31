import { russianToAsciiMap, asciiToRussianMap } from "./utils/constants";
/**
 * Encodes text using RUTF-8 (Russian Unicode to ASCII Format).
 *
 * This encoding maps Russian Unicode characters to predefined ASCII symbols and vice versa.
 * It allows Russian characters to be represented as single-byte ASCII characters.
 *
 * The algorithm performs a two-way mapping:
 * - Russian characters are replaced with corresponding ASCII characters when encoding.
 * - ASCII characters are replaced with their corresponding Russian characters when decoding.
 *
 * RUTF-8 does not limit itself to only specific character ranges.
 * All symbols are supported, and no characters need to be removed or replaced during encoding/decoding.
 *
 * This implementation is bidirectional, meaning it can encode text into a more compact ASCII representation
 * and decode it back to the original Russian Unicode text.
 */
export function rutf8Encode(text): string {
  const output: string[] = new Array(text.length);
  let index = 0;
  for (const char of text) {
    if (russianToAsciiMap.has(char)) {
      output[index++] = russianToAsciiMap.get(char)!;
      continue;
    }
    if (asciiToRussianMap.has(char)) {
      output[index++] = asciiToRussianMap.get(char)!;
      continue;
    }
    output[index++] = char;
  }
  return output.join("");
}
