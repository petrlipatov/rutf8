import { describe, expect, it } from "@jest/globals";
import { bwtEncode } from "../../src";
import { END_OF_STRING } from "../../src/algorithms/bwt/utils/constants";
import { SP_ENG_1000 } from "../samples/common.samples";

describe("Module 'bwt/bwtEncodee'", () => {
  describe("bwtEncode", () => {
    it("should produce correct bwt line", () => {
      const str = "banana";
      const encoded = bwtEncode(str);
      const result = { bwt: `annb${END_OF_STRING}aa`, index: 4 };
      expect(encoded).toEqual(result);
    });
  });
});
