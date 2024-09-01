import { BinaryReader } from "../../common/binary-reader";
import {
  decodeHuffmanTree,
  getBitLengthOfEncodedData,
  getDecodedData,
} from "./utils/helpers";

/**
 * Decodes data encoded with the Huffman coding algorithm from a binary buffer.
 *
 * This function reads a binary buffer that contains Huffman-encoded data, decodes the Huffman tree,
 * and then decodes the original data using the Huffman tree and the encoded binary data.
 *
 * @param {ArrayBuffer} buffer - The binary buffer containing the Huffman-encoded data.
 * @returns {string} The decoded data from the Huffman-encoded binary buffer.
 */
export const huffmanBinaryDecode = (buffer: ArrayBuffer): string => {
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
