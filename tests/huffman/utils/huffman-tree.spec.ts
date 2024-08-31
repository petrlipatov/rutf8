import { describe, expect, it } from "@jest/globals";
import { createHuffmanTree } from "../../../src/algorithms/huffman/utils/huffman-tree";

import { HT_SP_ENG_200, FT_SP_ENG_200 } from "../../samples/huffman.samples";

describe("Module 'huffman/huffman-tree'", () => {
  describe("createHuffmanTree", () => {
    it("should build correct huffman tree", () => {
      expect(createHuffmanTree(FT_SP_ENG_200)).toEqual(HT_SP_ENG_200);
    });
  });
});
