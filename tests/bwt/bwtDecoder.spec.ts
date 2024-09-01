import { describe, expect, it } from "@jest/globals";
import { bwtDecode } from "../../src";

import { END_OF_STRING } from "../../src/algorithms/bwt/utils/constants";

describe("Module 'bwt/bwtDecode'", () => {
  describe("bwtDecode", () => {
    it("should correctly decode bwt line", () => {
      const encoded = { bwt: `annb${END_OF_STRING}aa`, index: 4 };
      const decoded = bwtDecode(encoded.bwt, encoded.index);

      const result = "banana";

      expect(decoded).toEqual(result);
    });
  });
});
