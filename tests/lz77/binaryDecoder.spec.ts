import { describe, expect, it } from "@jest/globals";
import { lz77BinaryEncode, lz77BinaryDecode } from "../../src";

import { SP_ENG_200 } from "../samples/common.samples";

describe("Module 'lz77/binaryDecoder'", () => {
  describe("full encoding & decoding process", () => {
    it("should return original text after encoding and decoding", () => {
      const encoded = lz77BinaryEncode(SP_ENG_200);
      const decoded = lz77BinaryDecode(encoded);
      expect(decoded).toBe(SP_ENG_200);
    });
  });
});
