import { describe, test, expect, beforeEach } from "@jest/globals";

import { BinaryReader } from "../../src/common/binary-reader";

describe("BinaryReader", () => {
  let arrayBuffer: ArrayBuffer;
  let reader: BinaryReader;

  beforeEach(() => {
    arrayBuffer = new ArrayBuffer(8);
    const view = new DataView(arrayBuffer);

    view.setUint8(0, 0x08);
    for (let i = 1; i < 8; i++) {
      view.setUint8(i, i + 1);
    }

    reader = new BinaryReader(arrayBuffer);
  });

  test("should read Uint8 values correctly", () => {
    expect(reader.getUint8()).toBe(0x08);
    expect(reader.getUint8()).toBe(0x02);
  });

  test("should read Uint16 values correctly", () => {
    expect(reader.getUint16()).toBe(0x0802);
    expect(reader.getUint16()).toBe(0x0304);
  });

  test("should read Uint32 values correctly", () => {
    expect(reader.getUint32()).toBe(0x08020304);
  });

  test("should throw RangeError when reading past the end of buffer", () => {
    reader.getUint32();
    reader.getUint32();
    expect(() => reader.getUint8()).toThrow(RangeError);
  });

  test("should correctly peek values without moving pointer", () => {
    expect(reader.peak()).toBe(0x08);
    expect(reader.getUint8()).toBe(0x08);
    expect(reader.peak()).toBe(0x02);
  });

  test("should seek to a position and return the old position", () => {
    expect(reader.seek(4)).toBe(0);
    expect(reader.getUint8()).toBe(0x05);
  });

  test("should correctly get bits from a byte", () => {
    expect(reader.getBit()).toBe(0);
    expect(reader.getBit()).toBe(0);
    expect(reader.getBit()).toBe(0);
    expect(reader.getBit()).toBe(0);
    expect(reader.getBit()).toBe(1);
    expect(reader.getBit()).toBe(0);
    expect(reader.getBit()).toBe(0);
    expect(reader.getBit()).toBe(0);
  });

  test("should correctly get offset & length tuple", () => {
    expect(reader.getOffsetLength()).toEqual([128, 2]);
  });
});
