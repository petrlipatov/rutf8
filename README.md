# rutf8-toolkit

**rutf8-toolkit** is a library designed for serialization and compression of small cyrillic payloads. This toolkit offers a variety of algorithms to encode, compress, and decode text data, supporting multiple encoding and compression methods such as RUTF-8, Huffman, LZSS, LZ77, BWT, and RLE.

## Features

- **rutf8:** Store and transmit cyrillic letters as uint8.
- **Huffman:** Apply variable-length encoding to text using the Huffman tree algorithm.
- **LZSS & LZ77:** Utilize sliding window-based algorithms to compress text data.
- **BWT:** Reversibly sort text data to improve compression efficiency with the Burrows-Wheeler Transform.
- **RLE:** Implement Run-Length Encoding, especially effective with repetitive data.
- **Optimal Compression:** Calculate the theoretical optimal compression size for a string based on Shannon entropy.

## Combining Algorithms

To achieve the best results with Cyrillic text, it is recommended to apply these algorithms sequentially. Combining multiple compression and encoding techniques can significantly enhance the overall efficiency of data storage and transmission. For example, preprocessing text with the RUTF8 or BWT before applying RLE or Huffman encoding often yields more effective compression.

## Modules

### 1) rutf8

RUTF-8 is a custom encoding system that maps Russian Unicode characters to predefined ASCII symbols and vice versa. This allows Russian text to be encoded as single-byte ASCII characters, while maintaining full support for all other characters.

#### Functions:

- `rutf8Encoder`: Encodes Russian characters to ASCII.
- `rutf8Decoder`: Decodes ASCII back to Russian characters.
- `binaryEncoder`: Encodes binary data using RUTF-8.
- `binaryDecoder`: Decodes binary data encoded with RUTF-8.

### 2) Huffman

The Huffman module applies variable-length encoding to text content using the Huffman tree algorithm. This technique helps compress data by assigning shorter codes to more frequent characters.

#### Functions:

- `binaryEncoder`: Encodes binary data using Huffman encoding.
- `binaryDecoder`: Decodes binary data using Huffman decoding.
- `createHuffmanTree`: Generates a Huffman tree based on text input (allows to see literal tree).

#### Binary Encoding

![title](Images/huffman-schema.png)

### 3) LZSS

LZSS is an optimized version of the LZ77 algorithm, offering text data compression using a sliding window technique.

#### Functions:

- `binaryEncoder`: Encodes text data using LZSS compression.
- `binaryDecoder`: Decodes text data compressed with LZSS.
- `encoder`: Encodes text data using LZSS compression (allows to see literal encoding).

#### Binary Encoding

![title](Images/lzss-schema.png)

### 4) LZ77

LZ77 is one of the fundamental algorithms in text compression, invented by Abraham Lempel and Jacob Ziv in 1977. It uses a sliding window to find repeating sequences.

#### Functions:

- `binaryEncoder`: Encodes text data using LZ77 compression.
- `binaryDecoder`: Decodes text data compressed with LZ77.
- `encoder`: Encodes text data using LZ77 compression (allows to see literal encoding).

#### Binary Encoding

![title](Images/lz77-schema.png)

### 5) BWT (Burrows-Wheeler Transform)

The Burrows-Wheeler Transform (BWT) is a data preprocessing algorithm that rearranges text data in a reversible way, making it more suitable for compression.

#### Functions:

- `bwtEncode`: Encodes text data using BWT.
- `bwtDecode`: Decodes BWT-encoded data back to the original form.

### 6) RLE (Run-Length Encoding)

Run-Length Encoding (RLE) is a simple and effective compression algorithm, especially useful for data with long sequences of repeated characters.

#### Functions:

- `rleEncoder`: Encodes data using RLE compression.
- `rleDecoder`: Decodes data compressed with RLE.

### 7) Miscellaneous

- `calculateOptimalBytesCompression`: This function calculates the theoretically optimal compression size for a given string based on Shannon entropy. Note: This metric is not definitive and can often be surpassed by other methods.

## Installation

To install the **rutf8-toolkit** library, use npm:

```bash
npm install rutf8-toolkit
```
