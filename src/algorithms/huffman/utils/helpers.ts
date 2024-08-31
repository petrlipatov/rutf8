import { BinaryWriter } from "../../../common/binary-writer";
import { BinaryReader } from "../../../common/binary-reader";

import {
  BYTE_LENGTH,
  UINT16_BYTE_SIZE,
  UINT8_BYTE_SIZE,
} from "../../../common/constants";
import {
  CHAR_LENGTH,
  LENGTH_VALUE_LENGTH,
  NODE_CHILDREN_INDEX,
  NODE_FREQUENCY_INDEX,
  NODE_VALUE_INDEX,
} from "./constants";

import {
  FrequencyTable,
  Encoding,
  Node,
  HuffmanTree,
  EncodingTable,
  EncodedData,
  IntermediaryNode,
  ExtendedEncodingTable,
  LeafNode,
} from "./types";

/**
 * Produces a binary encoding for a character
 * by traversing a Huffman Tree
 */

export const traverseHuffmanTree = (
  node: Node,
  char: string,
  encoding: Encoding = []
): Encoding | null => {
  const [chars, _count, children] = node;

  if (char === chars) {
    return encoding;
  }

  if (children) {
    const [left, right] = children;

    if (left?.[0].includes(char)) {
      return traverseHuffmanTree(left, char, [...encoding, 0]);
    }

    if (right?.[0].includes(char)) {
      return traverseHuffmanTree(right, char, [...encoding, 1]);
    }
  }

  return null;
};

/**
 * By itself provides an error handling.
 *
 * Calls traverseHuffmanTree to create an encoding for a character.
 */

export const createCharacterEncoding = (
  huffmanTree: HuffmanTree,
  char: string
): Encoding => {
  const [rootNode] = huffmanTree;
  const encoding = traverseHuffmanTree(rootNode, char);
  if (encoding === null) {
    throw new Error(`No match found for: ${char}`);
  }
  return encoding;
};

/**
 * Creates Map where chars are keys and values are binary encodings
 */
export const createEncodingTable = (
  frequencyTable: FrequencyTable,
  huffmanTree: HuffmanTree
): EncodingTable => {
  const encodingTable: EncodingTable = new Map();

  for (const [char] of frequencyTable) {
    encodingTable.set(char, createCharacterEncoding(huffmanTree, char));
  }

  return encodingTable;
};

/**
 * Gets character encoding from an Encoding Table
 */
export const getCharacterEncoding = (
  encodingTable: EncodingTable,
  char: string
): Encoding => {
  const encoding = encodingTable.get(char);
  if (encoding === undefined) {
    throw new Error(`No encoding found for character: '${char}'`);
  }
  return encoding;
};

/**
 * Iterates over text input swapping symbols with encodings from an Encoding Table.
 */
export const encodeData = (
  encodingTable: EncodingTable,
  input: string
): EncodedData => {
  return input
    .split("")
    .flatMap((char) => getCharacterEncoding(encodingTable, char));
};

export const getCharacterCode = (char: string) => char.charCodeAt(0);

/**
 * Takes encoding array gets each bit and binary-shifts it to acc
 */
export const mapCodeToInteger = (code: Encoding) => {
  return code.reduce((acc, bit) => (acc << 1) | bit, 0);
};

/**
 * Calculates number of bytes needed to host a number of bits.
 *
 * Adds an appropriate padding to round up.
 */
export const getByteCount = (bitCount: number) => {
  const remainder = bitCount % 8;
  return (bitCount + (remainder ? BYTE_LENGTH - remainder : 0)) / 8;
};

/**
 *  Calculates a length in bytes for an entry of `Extended Encoding Table`
 *
 *  `Length` = Char length + Encoding length + Encoding
 *
 *  `Encoding` could 1 or 2 Bytes in length
 *  */
export const calculateEntryLength = (codeLength: number): number => {
  return (
    CHAR_LENGTH +
    LENGTH_VALUE_LENGTH +
    (codeLength > BYTE_LENGTH ? UINT16_BYTE_SIZE : UINT8_BYTE_SIZE)
  );
};

/**
 *  Produces an `Entry` tuple for an Extended Encoding Table.
 *
 * `Entry` tuple: [char unicode, encoding bits length, encoding as Int]
 */
export const transformToEntry = (
  char: string,
  code: Encoding
): [number, number, number] => {
  const charCode = getCharacterCode(char);
  const integerCode = mapCodeToInteger(code);
  return [charCode, code.length, integerCode];
};

/**
 *  Returns a tuple [ `entries[]` , `length`]
 *
 * `Entries` are entries of an `Encodig Table` extended with entry length value.
 *
 * `Entry` tuple: [char unicode, encoding bits length, encoding as Int]
 *
 * `Length` is a total bit length of an `Extended Encoding Table`
 */
export const extendEncodingTable = (
  encodingTable: EncodingTable
): ExtendedEncodingTable => {
  let length = 0;

  const encodedEntries = Array.from(encodingTable, ([char, code]) => {
    length += calculateEntryLength(code.length);
    return transformToEntry(char, code);
  });

  return [encodedEntries, length];
};

/**
 *  Writes EncodedData and EncodingTable into buffer.
 */
export const toArrayBuffer = (
  data: EncodedData,
  encodingTable: EncodingTable
) => {
  const BYTE_LENGTH_ENCODING_TABLE = 2;
  const BYTE_LENGTH_ENCODED_DATA = 4;
  const PADDING_ENCODED_DATA = 1;

  const [entries, lengthEncodingTable] = extendEncodingTable(encodingTable);

  const { length: encodedDataBitCount } = data;

  const byteCount = getByteCount(encodedDataBitCount);

  const bitPaddingEncodedData =
    encodedDataBitCount % 8 === 0 ? 0 : 8 - (encodedDataBitCount % 8);

  const totalEncodingLength =
    byteCount +
    BYTE_LENGTH_ENCODING_TABLE +
    BYTE_LENGTH_ENCODED_DATA +
    PADDING_ENCODED_DATA +
    lengthEncodingTable;

  const binaryWriter = new BinaryWriter(totalEncodingLength);

  binaryWriter.setUint16(lengthEncodingTable);

  entries.forEach(([charCode, length, code]) => {
    binaryWriter.setUint8(charCode);
    binaryWriter.setUint8(length);

    if (length > BYTE_LENGTH) {
      binaryWriter.setUint16(code);
    } else {
      binaryWriter.setUint8(code);
    }
  });

  // At this point `Extended Encoded Table` was written to binary buffer.
  // It's time to transform `Encoded Data`.

  let byteChunk = 0;
  let encodedDataPointer = 0;

  binaryWriter.setUint32(byteCount);
  binaryWriter.setUint8(bitPaddingEncodedData);

  while (encodedDataPointer < encodedDataBitCount) {
    if (encodedDataPointer % 8 === 0 && encodedDataPointer !== 0) {
      binaryWriter.setUint8(byteChunk);
      byteChunk = 0;
    }

    byteChunk = (byteChunk << 1) | data[encodedDataPointer];
    encodedDataPointer++;
  }

  if (byteChunk) {
    for (let pad = 0; pad < bitPaddingEncodedData; pad++) {
      byteChunk = byteChunk << 1;
    }
    binaryWriter.setUint8(byteChunk);
  }

  return binaryWriter.buffer;
};

function isIntermediaryNode(
  node: unknown
): node is [string, number, [Node, Node]] {
  if (!Array.isArray(node)) {
    return false;
  }

  if (node.length !== 3) {
    return false;
  }

  if (typeof node[0] !== "string") {
    return false;
  }

  if (typeof node[1] !== "number") {
    return false;
  }

  if (!Array.isArray(node[2]) || node[2].length !== 2) {
    return false;
  }

  return true;
}

/**
 *  Reads `Extended Encoding Table` from `BinaryReader` instance
 *  and reconstructs a Huffman Tree
 */
export const decodeHuffmanTree = (binaryReader: BinaryReader): HuffmanTree => {
  const root: IntermediaryNode = ["", 0, [null, null]];
  const encodingTableLength = binaryReader.getUint16();

  let pointer = 0;

  while (pointer < encodingTableLength) {
    const { char, length, code } = readEncodingTableEntry(binaryReader);
    insertIntoHuffmanTree(root, char, length, code);

    pointer +=
      UINT16_BYTE_SIZE +
      (length > BYTE_LENGTH ? UINT16_BYTE_SIZE : UINT8_BYTE_SIZE);
  }

  return [root] as HuffmanTree;
};

/**
 *  Reads an `entry` tuple of `Extended Encoding Table` from BinaryReader instance
 *
 * `Entry` [char unicode, encoding bits length, encoding as Int]
 */
const readEncodingTableEntry = (binaryReader: BinaryReader) => {
  const char = String.fromCharCode(binaryReader.getUint8());
  const length = binaryReader.getUint8();
  const code =
    length > BYTE_LENGTH ? binaryReader.getUint16() : binaryReader.getUint8();
  return { char, length, code };
};

/**
 *  Inserts a char into a reconstructed HuffmanTree
 */
export const insertIntoHuffmanTree = (
  root: IntermediaryNode,
  symbol: string,
  length: number,
  codePath: number
) => {
  let currentNode: Node = root;
  let bitIndex = length - 1;

  while (bitIndex >= 0) {
    const bit = (codePath >> bitIndex) & 1;

    currentNode[NODE_VALUE_INDEX] += symbol;
    currentNode[NODE_FREQUENCY_INDEX] += 1;

    if (!currentNode[NODE_CHILDREN_INDEX]) {
      currentNode[NODE_CHILDREN_INDEX] = [null, null];
    }

    const children = currentNode[NODE_CHILDREN_INDEX] as [
      Node | null,
      Node | null
    ];

    if (bitIndex === 0) {
      children[bit] = [symbol, 1];
    } else {
      if (!children[bit]) {
        children[bit] = ["", 0, [null, null]];
      }
      currentNode = children[bit]!;
    }

    bitIndex--;
  }
};
/**
 * Reads Encoded Data from BinaryReader instance.
 *
 * And builds origin text via bits and a reconstructed Huffman Tree.
 */
export function getDecodedData(
  binaryReader: BinaryReader,
  huffmanTree: HuffmanTree,
  bitCountEncodedData: number
): string {
  const [root] = huffmanTree;

  let pointer = 0;
  let decodedData = "";

  while (pointer < bitCountEncodedData) {
    let node: Node | IntermediaryNode = root;

    while (node && node[NODE_CHILDREN_INDEX]) {
      const bit = binaryReader.getBit();

      if (bit === null) {
        throw new Error("Unexpected: bit should not be null");
      }

      node = node[NODE_CHILDREN_INDEX][bit]!;
      pointer++;
    }

    decodedData += node[NODE_VALUE_INDEX];
  }

  return decodedData;
}

/**
 * Calculates bit length of Encoded Data by removing a bit padding.
 */
export const getBitLengthOfEncodedData = (
  byteCountEncodedData: number,
  paddingSizeEncodedData: number
) => byteCountEncodedData * 8 - paddingSizeEncodedData;
