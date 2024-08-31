export class BinaryReader {
  protected pointer: number;
  protected view: DataView;
  protected chunk: number;
  protected chunkBitCount: number;
  protected chunkBitPointer: number;

  constructor(arrayBuffer: ArrayBuffer) {
    this.pointer = 0;
    this.view = new DataView(arrayBuffer);
    this.chunk = 0;
    this.chunkBitCount = 0;
    this.chunkBitPointer = -1;
  }

  getUint8(): number {
    if (this.pointer >= this.view.byteLength) {
      throw new RangeError("Attempt to read past the end of buffer");
    }
    const value = this.view.getUint8(this.pointer);
    this.pointer++;
    return value;
  }

  getUint16(): number {
    if (this.pointer + 1 >= this.view.byteLength) {
      throw new RangeError("Attempt to read past the end of buffer");
    }
    const value = this.view.getUint16(this.pointer);
    this.pointer += 2;
    return value;
  }

  getUint32(): number {
    if (this.pointer + 1 >= this.view.byteLength) {
      throw new RangeError("Attempt to read past the end of buffer");
    }
    const value = this.view.getUint32(this.pointer);
    this.pointer += 4;
    return value;
  }

  getOffsetLength(): [number, number] {
    const data = this.getUint16();
    return [data >>> 4, data & 0b1111];
  }

  getCharacter(): string {
    const charCode = this.getUint8();
    return String.fromCharCode(charCode);
  }

  peak(offset: number = 0): number | null {
    const index = this.pointer + offset;
    if (index < this.view.byteLength) {
      return this.view.getUint8(index);
    }
    return null;
  }

  seek(pos: number): number {
    const oldPos = this.pointer;
    this.pointer = pos;
    return oldPos;
  }

  private getUtilizedBitsInByte(int: number) {
    let bitCount = 0;
    while (int) {
      int >>= 1;
      bitCount++;
    }
    return bitCount;
  }

  private getIdleBitsInByte() {
    if (this.chunk === null) {
      return 0;
    } else {
      return 8 - this.getUtilizedBitsInByte(this.chunk);
    }
  }

  private getFirstLeftBitPos() {
    return (
      this.getUtilizedBitsInByte(this.chunk) - 1 + this.getIdleBitsInByte()
    );
  }

  getBit() {
    if (this.chunkBitPointer === -1) {
      this.chunk = this.getUint8();
      this.chunkBitPointer = this.getFirstLeftBitPos();
      this.chunkBitCount = this.getUtilizedBitsInByte(this.chunk);
    }
    if (this.chunk === null) {
      return null;
    }
    const bit = (this.chunk >> this.chunkBitPointer) & 1;
    this.chunkBitPointer--;
    return bit;
  }

  get buffer(): ArrayBuffer {
    return this.view.buffer;
  }
}
