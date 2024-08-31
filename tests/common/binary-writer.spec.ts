import { describe, test, expect, beforeEach } from "@jest/globals";
import { BinaryWriter } from "../../src/common/binary-writer";

describe("BinaryWriter", () => {
  let writer: BinaryWriter;

  beforeEach(() => {
    writer = new BinaryWriter(10);
  });

  test("should write uint8 value correctly", () => {
    writer.setUint8(42);
    const byte = new DataView(writer.buffer).getUint8(0);
    expect(byte).toBe(42);
  });

  test("should write uint16 value correctly", () => {
    writer.setUint16(0x1234);
    const word = new DataView(writer.buffer).getUint16(0);
    expect(word).toBe(0x1234);
  });

  test("should write uint32 value correctly", () => {
    writer.setUint32(0x12345678);
    const dword = new DataView(writer.buffer).getUint32(0);
    expect(dword).toBe(0x12345678);
  });

  test("should throw error when writing past end of buffer", () => {
    writer.setUint8(1);
    writer.setUint8(2);
    writer.setUint8(3);
    writer.setUint8(4);
    writer.setUint8(5);
    writer.setUint8(6);
    writer.setUint8(7);
    writer.setUint8(8);
    writer.setUint8(9);
    writer.setUint8(10);
    expect(() => writer.setUint8(10)).toThrowError(
      "Attempt to write past the end of buffer"
    );
  });

  test("should encode and write offset and length correctly", () => {
    const offsetLength = writer.setOffsetLength([4, 12]);
    expect(offsetLength).toBe((4 << 4) | 12);
    const dataView = new DataView(writer.buffer);
    const encodedValue = dataView.getUint16(0);
    expect(encodedValue).toBe((4 << 4) | 12);
  });
});
