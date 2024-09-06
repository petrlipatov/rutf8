import { describe, it, expect } from "@jest/globals";
import { rleDecode } from "../../src";

describe("Module 'rle/decode'", () => {
  describe("rleDecode", () => {
    it("should correctly decode RLE string", () => {
      const str = "a3b41i";
      const result = "aaabbbb1i";
      expect(rleDecode(str)).toBe(result);
    });
  });
});
