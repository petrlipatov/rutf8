import { describe, expect, it } from "@jest/globals";
import {
  getOptions,
  updateLookaheadBuffer,
  updateSearchBuffer,
  getMatch,
  addBit,
  shouldWriteSchemaByte,
} from "../../../src/algorithms/lzss/utils/helpers";
import { Options } from "../../../src/algorithms/lzss/utils/types";

describe("Module 'lzss/helpers'", () => {
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

      expect(getMatch(searchBuffer, lookAhead, 3)).toEqual([
        offset,
        length,
        match,
      ]);
    });

    it("should return null if match is less than minLength", () => {
      const searchBuffer =
        "You have come too soon, Beast of Chaos. This blade has drunk deep of your kin's blood before.";
      const lookAhead = "This red line";
      const minMatchLength = 5;

      expect(getMatch(searchBuffer, lookAhead, minMatchLength)).toBeNull();
    });

    it("should correctly implement RLE encoding", () => {
      const searchBuffer = "You have come too soon, Beast of Chaos. This blade";
      const lookAhead = "bladebladeblade";

      const substringStartIndex = searchBuffer.indexOf("blade");
      const offset = searchBuffer.length - substringStartIndex;
      const length = lookAhead.length;
      const minMatchLength = 3;

      expect(getMatch(searchBuffer, lookAhead, minMatchLength)).toEqual([
        offset,
        length,
        lookAhead,
      ]);
    });
  });

  describe("addBit", () => {
    it("should correctly add bits to a schema", () => {
      let schema = 0;

      expect((schema = addBit(schema, 1))).toBe(1);
      expect((schema = addBit(schema, 0))).toBe(2);
      expect((schema = addBit(schema, 1))).toBe(5);
    });
  });

  describe("shouldWriteSchemaByte", () => {
    it("should return true if index is 0", () => {
      expect(shouldWriteSchemaByte(0, 100)).toBe(true);
    });
    it("should return false if index / byteLength !== 0 ", () => {
      expect(shouldWriteSchemaByte(3, 34)).toBe(false);
    });
    it("should return true if index / byteLength === 0 ", () => {
      expect(shouldWriteSchemaByte(8, 923)).toBe(true);
    });
  });
});
