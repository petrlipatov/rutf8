import { describe, test, expect } from "@jest/globals";
import { createKMPTable, KMPSearch } from "../../src/common/kmp-search";

describe("Module 'common/kmp-search' ", () => {
  describe("createKMPTable", () => {
    test("should build correct suffix table", () => {
      const pattern = "zmsdfjszmsdfnzm";
      expect(createKMPTable(pattern)).toEqual([
        0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 0, 1, 2,
      ]);
    });
  });

  describe("KMPSearch", () => {
    test("should return correct index of a substring", () => {
      const text =
        "Early Years In 2470 IC Emperor Luitpold I and his infant son";
      const pattern = " Emperor";

      expect(KMPSearch(text, pattern)).toBe(22);
    });
  });
});
