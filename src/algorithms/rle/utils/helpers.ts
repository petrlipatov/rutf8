import { SPECIAL_CHAR } from "./constants";

export function extractSymbolAndCount(
  input: string,
  pointer: number
): { char: string; count: number; updatedPointer: number } {
  let char = input[pointer];

  let countStr = "";
  let i = pointer + 1;

  if (char === SPECIAL_CHAR) {
    char = input[i];
    i++;
  } else {
    while (i < input.length && /\d/.test(input[i])) {
      countStr += input[i];
      i++;
    }
  }

  const count = countStr ? parseInt(countStr, 10) : 1;

  return { char, count, updatedPointer: i };
}
