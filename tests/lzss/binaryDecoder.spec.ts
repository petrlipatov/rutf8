import { describe, expect, it } from "@jest/globals";
import { lzssBinaryEncode, lzssBinaryDecode } from "../../src/algorithms/lzss";

import { SP_ENG_200 } from "../samples/common.samples";

describe("Module 'lzss/binaryDecoder'", () => {
  describe("full encoding & decoding process", () => {
    it("should return original text after encoding and decoding", () => {
      const encoded = lzssBinaryEncode(SP_ENG_200);
      const decoded = lzssBinaryDecode(encoded);
      expect(decoded).toBe(SP_ENG_200);
    });
  });
});
