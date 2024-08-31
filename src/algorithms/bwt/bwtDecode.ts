import { END_OF_STRING } from "./utils/constants";

export function bwtDecode(bwt: string, index: number): string {
  const length = bwt.length;
  const table = Array.from({ length }, () => "");
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      table[j] = bwt[j] + table[j];
    }
    table.sort();
  }
  return table[index].replace(END_OF_STRING, "");
}
