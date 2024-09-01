import { SPECIAL_CHAR } from "./utils/constants";

export function rleEncode(input: string): string {
  if (input.length === 0) {
    throw new Error("Input string cannot be empty.");
  }

  const output: string[] = [];
  let count = 1;

  for (let i = 1; i < input.length; i++) {
    if (input[i] === input[i - 1]) {
      count++;
    } else {
      output.push(input[i - 1]);
      if (count > 1) {
        output.push(count.toString());
      }
      count = 1;

      // ----* Numbers in input text *----
      // if there are numbers in input text
      // it's nessesery to add a special char
      // that would allow to differentiate literal numbers
      // and numbers that represent RL

      if (/\d/.test(input[i])) {
        output.push(SPECIAL_CHAR);
      }
    }
  }

  output.push(input[input.length - 1]);
  if (count > 1) {
    output.push(count.toString());
  }

  return output.join("");
}
