import { BinaryWriter } from "../../../common/binary-writer";
import { MAX_LOOKAHEAD_BUF_LEN, MAX_SEARCH_BUF_LEN } from "./constants";
import { EncodedArray, Match, Options } from "./types";

export function getOptions(options: Partial<Options> = {}): Options {
  const { searchBufferLength = 5000, lookaheadLength = 100 } = options;

  return {
    searchBufferLength: Math.min(searchBufferLength, MAX_SEARCH_BUF_LEN),
    lookaheadLength: Math.min(lookaheadLength, MAX_LOOKAHEAD_BUF_LEN),
  };
}

export function updateLookaheadBuffer(
  input: string,
  pointer: number,
  lookaheadBufferLength: number
) {
  return input.substring(pointer, pointer + lookaheadBufferLength);
}

export function updateSearchBuffer(
  searchBuffer: string,
  searchBufferMaxLength: number
): string {
  return searchBuffer.length > searchBufferMaxLength
    ? searchBuffer.slice(-searchBufferMaxLength)
    : searchBuffer;
}

export function getMatch(searchBuffer: string, lookaheadBuffer: string): Match {
  const searchBufferLength = searchBuffer.length;
  const lookaheadLength = lookaheadBuffer.length;

  let offset = 0;
  let length = 0;
  let matchedChars = "";

  for (
    let lookheadPointer = 1;
    lookheadPointer <= lookaheadLength;
    lookheadPointer++
  ) {
    const substringToMatch = lookaheadBuffer.substring(0, lookheadPointer);
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
        lookheadPointer
      );
      length = matchedChars.length;
    }
  }

  return [offset, length, matchedChars];
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

    if (!remainingChars.startsWith(pattern)) break;

    expandedMatch += pattern;
    currentIndex += substringLength;
  }

  return expandedMatch;
}

function atSearchBufferEnd(
  matchIndex: number,
  substring: string,
  bufferLength: number
): boolean {
  return matchIndex + substring.length === bufferLength;
}

export function createArrayBuffer(encodedData: EncodedArray) {
  const binaryWriter = new BinaryWriter(encodedData.length * 3);

  encodedData.forEach(([offset, length, char]) => {
    binaryWriter.setUint16((offset << 4) | length);
    binaryWriter.setUint8(char.charCodeAt(0));
  });

  return binaryWriter.buffer;
}

export function addMatchedPattern(pattern: string, length: number): string {
  if (pattern.length === length) {
    return pattern;
  }

  let output = "";

  while (output.length < length) {
    output += pattern;
  }

  return output;
}
