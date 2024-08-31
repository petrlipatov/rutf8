import { BinaryWriter } from "../../../common/binary-writer";
import { MAX_LOOKAHEAD_BUF_LEN, MAX_SEARCH_BUF_LEN } from "./constants";
import { EncodedArray, Match, Options } from "./types";

// ---- getMatch()
// looks for a match between lookaheadBuffer and searchBuffer
// starting from minMatchLength

export function getMatch(
  searchBuffer: string,
  lookaheadBuffer: string,
  minMatchLength: number
): Match | null {
  const searchBufferLength = searchBuffer.length;
  const lookaheadLength = lookaheadBuffer.length;

  let offset = 0;
  let length = 0;
  let matchedChars = "";

  for (
    let lookheadCursor = minMatchLength;
    lookheadCursor < lookaheadLength;
    lookheadCursor++
  ) {
    const substringToMatch = lookaheadBuffer.substring(0, lookheadCursor);
    const matchIndex = searchBuffer.lastIndexOf(substringToMatch);

    if (matchIndex === -1) {
      break;
    }

    offset = searchBufferLength - matchIndex;
    length = substringToMatch.length;
    matchedChars = substringToMatch;

    // ----* Run-length Encoding *----
    // if match found at the end of searchBuffer
    // function looks if matched sequence gets repeated again
    // in lookaheadBuffer

    if (atSearchBufferEnd(matchIndex, substringToMatch, searchBufferLength)) {
      matchedChars = expandMatchToLookahead(
        matchedChars,
        lookaheadBuffer,
        lookheadCursor
      );
      length = matchedChars.length;
    }
  }

  if (length > minMatchLength) {
    return [offset, length, matchedChars];
  }

  return null;
}

function atSearchBufferEnd(
  matchIndex: number,
  substring: string,
  bufferLength: number
): boolean {
  return matchIndex + substring.length === bufferLength;
}

function expandMatchToLookahead(
  pattern: string,
  lookaheadBuffer: string,
  lookaheadPointer: number
): string {
  const substringLength = pattern.length;
  let currentIndex = lookaheadPointer;
  let expandedMatch = pattern;

  while (currentIndex < lookaheadBuffer.length) {
    const remainingChars = lookaheadBuffer.substring(currentIndex);

    if (!remainingChars.startsWith(pattern)) {
      break;
    }

    expandedMatch += pattern;
    currentIndex += substringLength;
  }
  return expandedMatch;
}

// ---- updateLookaheadBuffer()
// shifts lookahead forward acc to pointer

export function updateLookaheadBuffer(
  input: string,
  pointer: number,
  lookaheadBufferLength: number
) {
  return input.substring(pointer, pointer + lookaheadBufferLength);
}

// ---- updateSearchBuffer()
// controls searchBuffer len acc to searchBufferMaxLength

export function updateSearchBuffer(
  searchBuffer: string,
  searchBufferMaxLength: number
): string {
  return searchBuffer.length > searchBufferMaxLength
    ? searchBuffer.slice(-searchBufferMaxLength)
    : searchBuffer;
}

// ---- addBit()
// adds 1 or 0 bit from right to schema byte

export function addBit(schema: number, bit: 1 | 0): number {
  switch (bit) {
    case 1:
      schema = (schema << 1) | 1;
      break;
    case 0:
      schema <<= 1;
      break;
  }
  return schema;
}

// ---- createArrayBuffer()
// transforms 'EncodedArray' and 'schema' into arrayBuffer

export function createArrayBuffer(
  data: EncodedArray,
  length: number,
  schema: number[]
): ArrayBuffer {
  const binaryWriter = new BinaryWriter(length + schema.length);

  data.forEach((item, index) => {
    if (shouldWriteSchemaByte(index, data.length)) {
      binaryWriter.setUint8(schema[Math.floor(index / 8)]);
    }

    if (typeof item === "string") {
      binaryWriter.setUint8(item.charCodeAt(0));
    } else {
      binaryWriter.setOffsetLength(item);
    }
  });

  return binaryWriter.buffer;
}

// ---- shouldWriteSchemaByte()
// adds schema byte into binary stream
// each byte contains 8 bit flags, which control subsequent 8 symbols
// each bit signal type of the encoding for a symbol:
//    0 -> represents a literal symbol;
//    1 ->  an LZSS tuple [offset, length];

export function shouldWriteSchemaByte(
  currentIndex: number,
  totalEncodedDataLength: number
): boolean {
  const isFirstItem = currentIndex === 0;
  const isSchemaBytePosition = currentIndex % 8 === 0;
  const isWithinBounds = currentIndex < totalEncodedDataLength;

  return (
    isFirstItem ||
    (totalEncodedDataLength > 8 && isSchemaBytePosition && isWithinBounds)
  );
}

// ---- getOptions()

export function getOptions(options: Partial<Options> = {}): Options {
  const { searchBufferLength = 255, lookaheadLength = 15 } = options;

  return {
    searchBufferLength: Math.min(searchBufferLength, MAX_SEARCH_BUF_LEN),
    lookaheadLength: Math.min(lookaheadLength, MAX_LOOKAHEAD_BUF_LEN),
  };
}
