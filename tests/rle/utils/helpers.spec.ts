import { describe, it, expect } from "@jest/globals";
import { extractSymbolAndCount } from "../../../src/algorithms/rle/utils/helpers";
import { SPECIAL_CHAR } from "../../../src/algorithms/rle/utils/constants";

describe("extractSymbolAndCount", () => {
  it("should correctly extract symbol and count when count is present", () => {
    const input = "a3b2";
    const pointer = 0;
    const result = extractSymbolAndCount(input, pointer);
    console.log(result);
    expect(result).toEqual({ char: "a", count: 3, updatedPointer: 2 });
  });

  it("should correctly extract symbol and count when count is not present", () => {
    const input = "a";
    const pointer = 0;
    const result = extractSymbolAndCount(input, pointer);
    expect(result).toEqual({ char: "a", count: 1, updatedPointer: 1 });
  });

  it("should return updatedPointer correctly when input has no digits after symbol", () => {
    const input = "e";
    const pointer = 0;
    const result = extractSymbolAndCount(input, pointer);
    expect(result).toEqual({ char: "e", count: 1, updatedPointer: 1 });
  });
});
