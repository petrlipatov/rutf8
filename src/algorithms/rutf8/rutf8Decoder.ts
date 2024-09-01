import { asciiToRussianMap, russianToAsciiMap } from "./utils/constants";

/**
 * Decodes a RUTF8-encoded string into its original form by converting characters
 * from the RUTF8 encoding scheme back to their corresponding characters in the original text.
 *
 * This function maps characters from RUTF8 encoding to their original representations
 * using predefined mappings (`asciiToRussianMap` and `russianToAsciiMap`). Characters
 * that do not have corresponding mappings are left unchanged.
 *
 * @param {string} text - The RUTF8-encoded string to decode.
 * @returns {string} The decoded string, which is the original form before RUTF8 encoding.
 */
export function rutf8Decode(text: string): string {
  const output: string[] = new Array(text.length);
  let index = 0;
  for (const char of text) {
    if (asciiToRussianMap.has(char)) {
      output[index++] = asciiToRussianMap.get(char)!;
      continue;
    }
    if (russianToAsciiMap.has(char)) {
      output[index++] = russianToAsciiMap.get(char)!;
      continue;
    }
    output[index++] = char;
  }
  return output.join("");
}
