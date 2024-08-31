import { BinaryReader } from "./binary-reader";

export class BinaryWriter extends BinaryReader {
  constructor(length: number) {
    if (length <= 0) {
      throw new Error("Buffer length must be greater than 0.");
    }
    super(new ArrayBuffer(length));
  }

  setOffsetLength([offset, length]: [number, number]): number {
    const encodedValue = (offset << 4) | length;
    this.setUint16(encodedValue);
    return (offset << 4) | length;
  }

  setUint8(value: number): void {
    if (this.pointer >= this.view.byteLength) {
      throw new RangeError("Attempt to write past the end of buffer");
    }
    this.view.setUint8(this.pointer, value);
    this.pointer++;
  }

  setUint16(value: number): void {
    if (this.pointer + 1 >= this.view.byteLength) {
      throw new RangeError("Attempt to write past the end of buffer");
    }
    this.view.setUint16(this.pointer, value);
    this.pointer += 2;
  }

  setUint32(value: number): void {
    if (this.pointer + 3 >= this.view.byteLength) {
      throw new RangeError("Attempt to write past the end of buffer");
    }
    this.view.setUint32(this.pointer, value);
    this.pointer += 4;
  }
}
