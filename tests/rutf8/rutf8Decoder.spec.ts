import { describe, expect, it } from "@jest/globals";
import { rutf8Decode } from "../../src/algorithms/rutf8";
import { SP_RUS_30, SP_RUS_200 } from "../samples/common.samples";
import { RUTF8_SP_RUS_200, RUTF8_SP_RUS_30 } from "../samples/rutf8.samples";

describe("Module 'rutf/decode' ", () => {
  describe("rutf8Decode", () => {
    it("should correctly decode buffer of 30 rutf8 symbols ", () => {
      expect(rutf8Decode(RUTF8_SP_RUS_30)).toBe(SP_RUS_30);
    });
    it("should correctly decode buffer of 200 rutf8 cyrillic symbols ", () => {
      expect(rutf8Decode(RUTF8_SP_RUS_200)).toBe(SP_RUS_200);
    });
  });
});
