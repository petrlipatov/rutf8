import { describe, it, expect } from "@jest/globals";
import { rleEncode } from "../../src";

describe("Module 'rle/encode'", () => {
  describe("rleEncode", () => {
    it("should correctly encode string with RLE", () => {
      const str = "aaabbbb1i";
      const result = "a3b41i";
      expect(rleEncode(str)).toBe(result);
    });
  });
});
