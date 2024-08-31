import { describe, expect, it } from "@jest/globals";
import {
  traverseHuffmanTree,
  createEncodingTable,
  getCharacterEncoding,
  encodeData,
  getCharacterCode,
  mapCodeToInteger,
  getByteCount,
  calculateEntryLength,
  transformToEntry,
  extendEncodingTable,
  toArrayBuffer,
  insertIntoHuffmanTree,
} from "../../../src/algorithms/huffman/utils/helpers";

import { SP_ENG_200 } from "../../samples/common.samples";
import {
  HT_SP_ENG_200,
  FT_SP_ENG_200,
  ET_SP_ENG_200,
  EET_SP_ENG_200,
  ED_SP_ENG_200,
  A_ENCODING_SP_ENG_200,
  C_ENCODING_SP_ENG_200,
  BB_SP_ENG_200,
} from "../../samples/huffman.samples";

import { IntermediaryNode } from "../../../src/algorithms/huffman/utils/types";
import {
  NODE_CHILDREN_INDEX,
  NODE_FREQUENCY_INDEX,
  NODE_VALUE_INDEX,
} from "../../../src/algorithms/huffman/utils/constants";

describe("Module 'huffman/helpers'", () => {
  describe("traverseHuffmanTree", () => {
    const [firstNode] = HT_SP_ENG_200;
    it("should create a correct encodings for a characters in the tree", () => {
      expect(traverseHuffmanTree(firstNode, "a")).toEqual([0, 1, 1, 1]);
      expect(traverseHuffmanTree(firstNode, "l")).toEqual([0, 1, 1, 0]);
      expect(traverseHuffmanTree(firstNode, "c")).toEqual([1, 0, 0, 1, 0, 1]);
      expect(traverseHuffmanTree(firstNode, "o")).toEqual([0, 0, 1, 0]);
      expect(traverseHuffmanTree(firstNode, "m")).toEqual([0, 0, 1, 1, 0]);
      expect(traverseHuffmanTree(firstNode, "e")).toEqual([1, 1, 0, 1]);
    });

    it("should return null if the character is not in the tree", () => {
      expect(traverseHuffmanTree(firstNode, ":")).toBeNull();
    });
  });

  describe("createEncodingTable", () => {
    it("should create a correct Encoding Table", () => {
      expect(createEncodingTable(FT_SP_ENG_200, HT_SP_ENG_200)).toEqual(
        ET_SP_ENG_200
      );
    });
  });

  describe("getCharacterEncoding", () => {
    it("should correctly get encodings from Encoding Table", () => {
      expect(getCharacterEncoding(ET_SP_ENG_200, "a")).toEqual(
        A_ENCODING_SP_ENG_200
      );
      expect(() => getCharacterEncoding(ET_SP_ENG_200, "b")).toThrowError(
        "No encoding found for character: 'b'"
      );
      expect(getCharacterEncoding(ET_SP_ENG_200, "c")).toEqual(
        C_ENCODING_SP_ENG_200
      );
    });
  });

  describe("encodeData", () => {
    it("should correctly encode data", () => {
      expect(encodeData(ET_SP_ENG_200, SP_ENG_200)).toEqual(ED_SP_ENG_200);
    });
  });

  describe("getCharacterCode", () => {
    it("should correctly get character unicode", () => {
      expect(getCharacterCode("a")).toBe(97);
    });
  });

  describe("mapCodeToInteger", () => {
    it("should correctly map array of bits to its Int representation", () => {
      expect(mapCodeToInteger([0, 0, 0, 1])).toBe(1);
      expect(mapCodeToInteger([1, 0, 0, 0])).toBe(8);
    });
  });

  describe("getByteCount", () => {
    it("should correctly calculate a number of bytes needed to host a number of bits", () => {
      expect(getByteCount(3)).toBe(1);
      expect(getByteCount(8)).toBe(1);
      expect(getByteCount(9)).toBe(2);
      expect(getByteCount(15)).toBe(2);
    });
  });

  describe("calculateEntryLength", () => {
    it("should correctly calculate bytes length of an entry for Extended Encoding Table", () => {
      expect(calculateEntryLength(3)).toBe(3);
      expect(calculateEntryLength(8)).toBe(3);
      expect(calculateEntryLength(9)).toBe(4);
      expect(calculateEntryLength(12)).toBe(4);
    });
  });

  describe("transformToEntry", () => {
    it("should transform a char and it's encoding array into correct Extended Encoding Table entry ", () => {
      expect(transformToEntry("a", A_ENCODING_SP_ENG_200)).toEqual([97, 4, 7]);
    });
  });

  describe("extendEncodingTable", () => {
    it("should produce correct Extended Encoding Table", () => {
      expect(extendEncodingTable(ET_SP_ENG_200)).toEqual(EET_SP_ENG_200);
    });
  });

  describe("toArrayBuffer", () => {
    it("should produce correct binary buffer from encoded data", () => {
      expect(toArrayBuffer(ED_SP_ENG_200, ET_SP_ENG_200)).toEqual(
        BB_SP_ENG_200.buffer
      );
    });
  });

  describe("insertIntoHuffmanTree", () => {
    it("should insert a single symbol into the Huffman tree", () => {
      const root: IntermediaryNode = ["", 0, [null, null]];

      insertIntoHuffmanTree(root, "a", 1, 0b0); // Вставка символа 'a' с кодом 0

      expect(root[NODE_CHILDREN_INDEX][0]).toEqual(["a", 1]);
      expect(root[NODE_VALUE_INDEX]).toBe("a");
      expect(root[NODE_FREQUENCY_INDEX]).toBe(1);
    });

    it("should insert multiple symbols into the Huffman tree", () => {
      const root: IntermediaryNode = ["", 0, [null, null]];

      // Вставляем символы 'a' и 'b' с кодами 0 и 1 соответственно
      insertIntoHuffmanTree(root, "a", 1, 0b0); // 'a' с кодом 0
      insertIntoHuffmanTree(root, "b", 1, 0b1); // 'b' с кодом 1

      expect(root[NODE_CHILDREN_INDEX][0]).toEqual(["a", 1]); // Узел для 'a'
      expect(root[NODE_CHILDREN_INDEX][1]).toEqual(["b", 1]); // Узел для 'b'
      expect(root[NODE_VALUE_INDEX]).toBe("ab");
      expect(root[NODE_FREQUENCY_INDEX]).toBe(2);
    });

    it("should correctly insert a deep node", () => {
      const root: IntermediaryNode = ["", 0, [null, null]];

      insertIntoHuffmanTree(root, "b", 7, 0b0101011);

      const value =
        root?.[2]?.[0]?.[2]?.[1]?.[2]?.[0]?.[2]?.[1]?.[2]?.[0]?.[2]?.[1]?.[2]?.[1];

      expect(value).toEqual(["b", 1]);

      // expect(root[NODE_CHILDREN_INDEX][LEFT_CHILD_INDEX]).toEqual([
      //   "ab",
      //   2,
      //   [
      //     ["a", 1],
      //     ["b", 1],
      //   ],
      // ]);

      // expect(root[NODE_CHILDREN_INDEX][RIGHT_CHILD_INDEX]).toEqual([
      //   "c",
      //   1,
      //   [["c", 1], null],
      // ]);
      // expect(root[NODE_VALUE_INDEX]).toBe("abc");
      // expect(root[NODE_FREQUENCY_INDEX]).toBe(3);
    });
  });

  // describe("decodeHuffmanTree", () => {
  //   it("should build correct reconstructed huffman tree from binary buffer", () => {
  //     const binaryReader = new BinaryReader(BB_SP_ENG_200.buffer);
  //     const deco = decodeHuffmanTree(binaryReader);
  //     console.log(deco);
  //     expect(deco).toEqual(RHT_SP_ENG_200);
  //   });
  // });

  // describe("getDecodedData", () => {
  //   it("should getDecodedData", () => {
  //     const binaryReader = new BinaryReader(BB_SP_ENG_200.buffer);
  //     const huffmanTree = decodeHuffmanTree(binaryReader);
  //     const paddingSizeEncodedData = binaryReader.getUint8();
  //     expect(
  //       getDecodedData(binaryReader, huffmanTree, paddingSizeEncodedData)
  //     ).toBe(SP_ENG_200);
  //   });
  // });

  // describe("final", () => {
  //   it("should getDecodedData", () => {
  //     expect(
  //       getDecodedData(binaryReader, huffmanTree, paddingSizeEncodedData)
  //     ).toBe(SP_ENG_200);
  //   });
  // });
});
