import { describe, it, expect } from "@jest/globals";
import { rutf8Encode } from "../../src";
import { SP_RUS_30, SP_RUS_200 } from "../samples/common.samples";
import { RUTF8_SP_RUS_200, RUTF8_SP_RUS_30 } from "../samples/rutf8.samples";

describe("Module 'rutf/encode'", () => {
  describe("rutf8Encode", () => {
    it("should correctly encode string of 30 unicode cyrillic symbols ", () => {
      expect(rutf8Encode(SP_RUS_30)).toBe(RUTF8_SP_RUS_30);
    });
    it("should correctly encode string of 200 unicode cyrillic symbols ", () => {
      expect(rutf8Encode(SP_RUS_200)).toBe(RUTF8_SP_RUS_200);
    });
  });
});
