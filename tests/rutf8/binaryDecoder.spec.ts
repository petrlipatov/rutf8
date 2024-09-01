import { describe, expect, it } from "@jest/globals";
import { rutf8BinaryEncode, rutf8BinaryDecode } from "../../src";

import { SP_ENG_200 } from "../samples/common.samples";

describe("Module 'rutf8/binaryDecoder'", () => {
  describe("full encoding & decoding process", () => {
    it("should return original text after encoding and decoding", () => {
      const encoded = rutf8BinaryEncode(SP_ENG_200);
      const decoded = rutf8BinaryDecode(encoded);
      expect(decoded).toBe(SP_ENG_200);
    });
  });
});
