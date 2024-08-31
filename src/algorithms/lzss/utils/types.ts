export type Encoding = string | [number, number];
export type Match = [number, number, string];
export type EncodedArray = Encoding[];
export type Options = {
  searchBufferLength: number;
  lookaheadLength: number;
};
