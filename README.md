# rutf8-toolkit

A library for serialization and compression of small Cyrillic texts. It includes algorithms for encoding, compression, and decoding, such as RUTF8, Huffman, LZSS, LZ77, BWT, and RLE.

## Installation

To install **rutf8-toolkit**, use npm:

```bash
npm install rutf8-toolkit
```

ESM & CommonJS support:

```

import { rutf8BinaryEncode } from 'rutf8-toolkit';

const { rutf8BinaryEncode } = require('rutf8-toolkit');
```

## Features

- **rutf8:** Store and transmit Cyrillic letters in the uint8 format with Unicode support.
- **Huffman:** Variable-length encoding using Huffman trees.
- **LZSS and LZ77:** Text compression using sliding window algorithms.
- **BWT:** Reversible Burrows-Wheeler transformations for improved compression.
- **RLE:** Simple run-length encoding for repeated symbols.
- **Optimal compression:** Calculate the theoretically minimal\* possible string size using Shannon entropy.

## Combining Algorithms

For interesting results, it is recommended to use several algorithms in sequence. Combining different compression and encoding methods can significantly improve the efficiency of data storage and transmission. For example, you can pre-process the text using `RUTF8`, then apply `BWT`, followed by `RLE` and `Huffman` encoding.

## Modules

### 1) rutf8

A custom encoding method that swaps Cyrillic characters and ASCII characters in the Unicode table. This allows you to represent Russian text with single-byte ASCII characters while preserving full support for all other Unicode symbols.

#### How it works:

- The algorithm performs a bidirectional transformation:
  - Russian characters are replaced with corresponding ASCII during encoding.
  - ASCII characters are replaced with corresponding Russian characters during decoding.
- All symbols are supported, so nothing is lost during encoding/decoding.

#### Functions:

- `rutf8Encoder`: Encodes Russian characters into ASCII.
- `rutf8Decoder`: Decodes ASCII back into Russian characters.
- `rutf8BinaryEncode`: Encodes data with `RUTF-8` coding and stores it in a binary buffer.
- `rutf8BinaryDecode`: Decodes data from a binary buffer that was encoded with Huffman coding.

#### Examples:

```
const string = 'Карл-Франц'
const rutfEncoded = rutf8Encoder(string) // 'Larm-Vraox'
```

```
const string = 'Карл-Франц'
const rutfBinaryEncoded = binaryEncoder(string) // ArrayBuffer
```

### 2) Huffman

The Huffman coding module uses the Huffman tree algorithm for variable-length encoding, allowing data compression by assigning shorter codes to frequent symbols.

#### How it works:

- Analyzes the frequency of symbols.
- Creates variable-length codes for each symbol.
- Encodes the text using these codes and packs the Huffman tree together with the encoded data into a binary buffer.
- Decodes the text without the need for additional schema (schema-less decoding).

#### Functions:

- `huffmanBinaryEncode`: Encodes data with Huffman coding and stores it in a binary buffer.
- `huffmanBinaryDecode`: Decodes data from a binary buffer that was encoded with Huffman coding.
- `createHuffmanTree`: Creates a Huffman tree from text input (can be visualized).

#### Binary Encoding Schema

![Huffman Binary Schema](https://i.imgur.com/XtOWnG0.jpeg)

### 3) LZSS

`LZSS` is an optimized version of `LZ77` that compresses text data using a sliding window.

#### How it works:

- `Lookahead Buffer` The `Lookahead Buffer` contains symbols that the algorithm will try to match with the `Search Buffer`. This helps the algorithm find repeating patterns.
- `The Search Buffer` contains already processed symbols and is used to find matches with the Lookahead Buffer.
- LZSS encodes repeating patterns as `[offset, length]` tuples::
  - Encoding happens only if the repeating pattern length > 2 characters.
  - Otherwise, characters are encoded as uint8 (ASCII).
  - If a match is found at the end of the Search Buffer, the algorithm checks if RLE can be applied.

#### Functions:

- `lzssBinaryEncode:` Encodes data with LZSS coding and stores it in a binary buffer.
- `lzssBinaryDecode:` Decodes data from a binary buffer that was encoded with LZSS coding.
- `lzssEncode:` Allows you to see the literal LZSS encoding schema.

#### Examples:

```
const string =
  "Император Карл-Франц обычно одет в полный доспех. Император Карл-Франц. обычно одет. в полный доспех.";

const lzssEncoded = lzssEncode(string)

lzssEncoded.length // 63
lzssEncoded.schema // [ 0, 0, 0, 0, 0, 0, 53, 0 ]
lzssEncoded.data // [ 'И','м','п','е','р','а','т','о','р',' ','К','а','р','л','-','Ф','р','а','н','ц',' ','о','б','ы','ч','н','о',' ','о','д','е','т',' ','в',' ','п','о','л','н','ы','й',' ','д','о','с','п','е','х','.',' ',[ 50, 14 ],[ 50, 6 ],'.',[ 51, 12 ],'.',[ 52, 14 ],'е','х','.' ],
```

#### Binary Encoding Schema

![LZSS Schema](https://i.imgur.com/aqZbYui.jpeg)

### 4) LZ77

LZ77 is one of the foundational text compression algorithms proposed by Lempel and Ziv in 1977. This algorithm also uses a sliding window to find repeating sequences of characters.

- LZ77 encodes symbols and repeating patterns using `[offset, length, next symbol]` tuples.
- If a match is found at the end of the `Search Buffer`, the algorithm checks and applies `RLE` if possible.

#### Functions:

- `lz77BinaryEncode:` Encodes data with LZ77 coding and stores it in a binary buffer.
- `lz77BinaryDecode:` Decodes data from a binary buffer that was encoded with LZ77 coding.
- `lz77Encode:` Allows you to see the LZ77 encoding schema.

#### Examples:

```
const string =
  "Император Карл-Франц обычно одет в полный доспех. Император Карл-Франц. обычно одет. в полный доспех.";

const lz77Encoded = lz77Encode(string)

lz77Encoded // [ [ 0, 0, 'И' ],[ 0, 0, 'м' ],[ 0, 0, 'п' ],[ 0, 0, 'е' ],[ 0, 0, 'р' ],[ 0, 0, 'а' ],[ 0, 0, 'т' ],[ 0, 0, 'о' ],[ 4, 1, ' ' ],[ 0, 0, 'К' ],[ 6, 1, 'р' ],[ 0, 0, 'л' ],[ 0, 0, '-' ],[ 0, 0, 'Ф' ],[ 12, 2, 'н' ],[ 0, 0, 'ц' ],[ 11, 1, 'о' ],[ 0, 0, 'б' ],[ 0, 0, 'ы' ],[ 0, 0, 'ч' ],[ 7, 1, 'о' ],[ 7, 2, 'д' ],[ 27, 1, 'т' ],[ 5, 1, 'в' ],[ 2, 1, 'п' ],[ 8, 1, 'л' ],[ 13, 1, 'ы' ],[ 0, 0, 'й' ],[ 7, 1, 'д' ],[ 7, 1, 'с' ],[ 43, 2, 'х' ],[ 0, 0, '.' ],[ 8, 1, 'И' ],[ 50, 15, 'р' ],[ 50, 3, '.' ],[ 51, 12, '.' ],[ 52, 15, 'х' ],[ 17, 1, '\u0000' ] ]
```

#### Binary Encoding Schema

![LZ77 Schema](https://i.imgur.com/j25RpK8.jpeg)

### 5) BWT

The Burrows-Wheeler Transform (BWT) is a reversible data pre-processing algorithm that rearranges the symbols of a text to improve subsequent compression. One advantage of this method is the simplicity of restoring the original text—just one number needs to be saved.

#### Functions:

- `bwtEncode:` Encodes text using BWT.
- `bwtDecode:` Restores the original text from BWT-encoded data.

#### Examples:

```
const string = 'banana'
const bwtEncoded = bwtEncode(string) // { bwt: 'annb$aa', index: 4 }

const bwtDecoded = bwtDecode(bwtEncoded.bwt, bwtEncoded.index) // 'banana'
```

### 6) RLE (Run-Length Encoding)

Run-Length Encoding (RLE) is a simple compression technique that replaces sequences of the same character with a single character and a number indicating the length of the sequence.

#### Functions:

- `rleEncode:` Compresses text using RLE.
- `rleDecode:` Restores text compressed with RLE.

#### Examples:

```
const string = 'aaab4bbbbbcc'
const rleEncoded = rleEncode(string) // "a3b4b5c2"
```

### 7) Miscellaneous

- `getByteLength:` This function returns the size of a string in bytes.

- `calculateOptimalBytesCompression:` This function calculates the theoretically possible minimal number of bytes for compressing a string based on Shannon entropy. Note that this estimate may not match the actual result from other compression methods.
