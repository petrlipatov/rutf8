import { describe, expect, it } from "@jest/globals";
import { buildSuffixArray } from "../../../src/algorithms/bwt/utils/suffix-array";

describe("Module 'bwt/suffix-array'", () => {
  describe("buildSuffixArray", () => {
    it("should build correct suffix array", () => {
      expect(buildSuffixArray("banana")).toEqual([5, 3, 1, 0, 4, 2]);
    });
  });
});
