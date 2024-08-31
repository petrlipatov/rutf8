export type Encoding = [number, number, string];
export type Match = Encoding;
export type EncodedArray = Encoding[];
export type Options = {
  // charEncodingLength: "UTF8" | "UTF16";
  searchBufferLength: number;
  lookaheadLength: number;
};
