import { BinaryReader } from "../../common/binary-reader";
import {
  decodeHuffmanTree,
  getBitLengthOfEncodedData,
  getDecodedData,
} from "./utils/helpers";

export const huffmanBinaryDecode = (buffer: ArrayBuffer) => {
  const binaryReader = new BinaryReader(buffer);
  const huffmanTree = decodeHuffmanTree(binaryReader);
  const byteCountEncodedData = binaryReader.getUint32();
  const paddingSizeEncodedData = binaryReader.getUint8();
  const decodedData = getDecodedData(
    binaryReader,
    huffmanTree,
    getBitLengthOfEncodedData(byteCountEncodedData, paddingSizeEncodedData)
  );
  return decodedData;
};
