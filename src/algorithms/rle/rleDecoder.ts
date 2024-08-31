import { extractSymbolAndCount } from "./utils/helpers";

export function rleDecompress(input: string): string {
  if (input.length === 0) return "";

  let output = "";
  let pointer = 0;

  while (pointer < input.length) {
    const { char, count, updatedPointer } = extractSymbolAndCount(
      input,
      pointer
    );
    output += char.repeat(count);
    pointer = updatedPointer;
  }

  return output;
}
