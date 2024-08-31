import { asciiToRussianMap, russianToAsciiMap } from "./utils/constants";

export function rutf8Decode(text): string {
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
