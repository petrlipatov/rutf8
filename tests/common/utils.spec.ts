import { describe, test, expect } from "@jest/globals";
import { createFrequencyMap, getByteLength } from "../../src/common/utils";

describe("Module 'common/utils' ", () => {
  describe("getByteLength", () => {
    test("should return correct byte length for a single unicode english symbol (ASCII)", () => {
      expect(getByteLength("a")).toBe(1);
    });
    test("should return correct byte length for a single unicode cyrillic symbol", () => {
      expect(getByteLength("щ")).toBe(2);
    });
    test("should return correct byte length for 10 unicode english symbols (ASCII)", () => {
      expect(getByteLength("abcdefghij")).toBe(10);
    });
    test("should return correct byte length for 10 unicode cyrillic symbols", () => {
      expect(getByteLength("абвгдежзий")).toBe(20);
    });
  });

  describe("createFrequencyMap", () => {
    test("should return correct frequency map for the given string", () => {
      const input = "lkjlbaefdsuhhasda";
      const expectedMap = new Map([
        ["l", 2],
        ["k", 1],
        ["j", 1],
        ["b", 1],
        ["a", 3],
        ["e", 1],
        ["f", 1],
        ["d", 2],
        ["s", 2],
        ["u", 1],
        ["h", 2],
      ]);
      expect(createFrequencyMap(input)).toEqual(expectedMap);
    });
  });
});
