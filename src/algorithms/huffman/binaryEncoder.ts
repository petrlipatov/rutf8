import { createFrequencyMap } from "../../common/utils";
import { huffmanBinaryDecode } from "./binaryDecoder";
import {
  encodeData,
  toArrayBuffer,
  createEncodingTable,
} from "./utils/helpers";
import { createHuffmanTree } from "./utils/huffman-tree";

export const huffmanBinaryEncode = (input: string) => {
  const frequencyTable = createFrequencyMap(input);
  const huffmanTree = createHuffmanTree(frequencyTable);
  const encodingTable = createEncodingTable(frequencyTable, huffmanTree);
  const encodedData = encodeData(encodingTable, input);
  const buffer = toArrayBuffer(encodedData, encodingTable);
  return buffer;
};
