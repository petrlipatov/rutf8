import { createFrequencyMap } from "../../common/utils";
import { huffmanBinaryDecode } from "./binaryDecoder";
import {
  encodeData,
  toArrayBuffer,
  createEncodingTable,
} from "./utils/helpers";
import { createHuffmanTree } from "./utils/huffman-tree";

/**
 * Encodes a string using Huffman coding and returns the binary encoded data as an ArrayBuffer.
 *
 * This function takes an input string, generates a frequency map, creates a Huffman tree,
 * and produces a binary encoding of the input string based on the Huffman encoding scheme.
 * The result is returned as an ArrayBuffer, which contains the encoded data along with
 * the necessary metadata to decode it later.
 *
 * @param {string} input - The input string to encode using Huffman coding.
 * @returns {ArrayBuffer} The binary encoded data in the form of an ArrayBuffer.
 */
export const huffmanBinaryEncode = (input: string): ArrayBuffer => {
  const frequencyTable = createFrequencyMap(input);
  const huffmanTree = createHuffmanTree(frequencyTable);
  const encodingTable = createEncodingTable(frequencyTable, huffmanTree);
  const encodedData = encodeData(encodingTable, input);
  const buffer = toArrayBuffer(encodedData, encodingTable);
  return buffer;
};
