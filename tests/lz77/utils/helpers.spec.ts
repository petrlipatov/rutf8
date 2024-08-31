import { describe, expect, it } from "@jest/globals";
import {
  getOptions,
  updateLookaheadBuffer,
  updateSearchBuffer,
  getMatch,
  addMatchedPattern,
} from "../../../src/algorithms/lz77/utils/helpers";
import { Options } from "../../../src/algorithms/lz77/utils/types";

describe("Module 'lz77/helpers'", () => {
  describe("getOptions", () => {
    it("should return correct options", () => {
      const options: Options = {
        searchBufferLength: 300,
        lookaheadLength: 10,
      };
      expect(getOptions(options)).toEqual(options);
    });

    it("should not allow values bigger than max", () => {
      const options: Options = {
        searchBufferLength: 10000,
        lookaheadLength: 45,
      };
      expect(getOptions(options)).toEqual({
        searchBufferLength: 4095,
        lookaheadLength: 15,
      });
    });
  });

  describe("updateLookaheadBuffer", () => {
    it("should slice correct LookAhead Buffer from a string", () => {
      const str =
        "You have come too soon, Beast of Chaos. This blade has drunk deep of your kin's blood before.";
      let pointer = 24;
      const lookaheadLength = 14;

      expect(updateLookaheadBuffer(str, pointer, lookaheadLength)).toEqual(
        "Beast of Chaos"
      );
    });
  });

  describe("updateSearchBuffer", () => {
    it("should slice correct LookAhead Buffer from a string", () => {
      const searchBuffer =
        "You have come too soon, Beast of Chaos. This blade has drunk deep of your kin's blood before.";
      let maxLength = 53;

      expect(updateSearchBuffer(searchBuffer, maxLength)).toEqual(
        "This blade has drunk deep of your kin's blood before."
      );
    });
  });

  describe("getMatch", () => {
    it("should correctly find the best match", () => {
      const searchBuffer =
        "You have come too soon, Beast of Chaos. This blade has drunk deep of your kin's blood before.";
      const lookAhead = "This blade is not yours.";

      const match = "This blade ";
      const length = match.length;
      const matchStartIndex = searchBuffer.indexOf(match);
      const offset = searchBuffer.length - matchStartIndex;

      expect(getMatch(searchBuffer, lookAhead)).toEqual([
        offset,
        length,
        match,
      ]);
    });

    it("should correctly implement RLE encoding", () => {
      const searchBuffer = "You have come too soon, Beast of Chaos. This blade";
      const lookAhead = "bladebladeblade";

      const substringStartIndex = searchBuffer.indexOf("blade");
      const offset = searchBuffer.length - substringStartIndex;
      const length = lookAhead.length;

      expect(getMatch(searchBuffer, lookAhead)).toEqual([
        offset,
        length,
        lookAhead,
      ]);
    });
  });

  describe("addMatchedPattern", () => {
    it("should correctly repeat pattern if RLE", () => {
      const str = "abc";
      const length = 9;
      const output = "abcabcabc";

      expect(addMatchedPattern(str, length)).toBe(output);
    });

    it("should correctly return pattern if no RLE", () => {
      const str = "abc";
      const length = 3;
      const output = "abc";

      expect(addMatchedPattern(str, length)).toBe(output);
    });
  });
});
