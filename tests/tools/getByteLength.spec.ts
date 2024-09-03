import { describe, expect, it } from "@jest/globals";
import { getByteLength } from "../../src/tools/getByteLength";

describe("Module 'tools'", () => {
  describe("calculates actual byte size of a string", () => {
    it("should return correct byte size of a string", () => {
      const asciiStr = "abcde";
      const cyrillicStr = "абвгд";
      expect(getByteLength(asciiStr)).toBe(5);
      expect(getByteLength(cyrillicStr)).toBe(10);
    });
  });
});
