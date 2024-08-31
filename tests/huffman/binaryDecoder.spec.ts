import { describe, expect, it } from "@jest/globals";
import {
  huffmanBinaryEncode,
  huffmanBinaryDecode,
} from "../../src/algorithms/huffman";

import { SP_ENG_200 } from "../samples/common.samples";

describe("Module 'huffman/binaryDecoder'", () => {
  describe("full encoding & decoding process", () => {
    const encoded = huffmanBinaryEncode(SP_ENG_200);
    const decoded = huffmanBinaryDecode(encoded);
    it("should return original text after encoding and decoding", () => {
      expect(decoded).toBe(SP_ENG_200);
    });
  });
});
