export type FrequencyTable = Map<string, number>;

export type HuffmanTree = [IntermediaryNode];
export type Node = IntermediaryNode | LeafNode;
export type IntermediaryNode = [string, number, [Node | null, Node | null]];
export type LeafNode = [string, number];

export type Encoding = number[];
export type EncodingTable = Map<string, Encoding>;
export type ExtendedEncodingTable = [[number, number, number][], number];
export type EncodedData = number[];
