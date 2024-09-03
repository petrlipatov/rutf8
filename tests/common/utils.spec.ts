import { describe, test, expect } from "@jest/globals";
import { createFrequencyMap } from "../../src/common/utils";

describe("Module 'common/utils' ", () => {
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
