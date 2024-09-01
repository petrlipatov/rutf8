import { PriorityQueue } from "./priority-queue";
import { FrequencyTable, HuffmanTree, IntermediaryNode, Node } from "./types";

/**
 * Creates a Huffman Tree from a frequency table.
 *
 * This function constructs a Huffman Tree by taking a frequency table as input,
 * where each entry represents a character and its frequency. It uses a priority queue
 * to build the tree, combining the two least frequent nodes until a single tree remains.
 *
 * @param {FrequencyTable} frequencyTable - A table that maps characters to their frequencies.
 * @returns {HuffmanTree} The constructed Huffman Tree.
 */
export const createHuffmanTree = (
  frequencyTable: FrequencyTable
): HuffmanTree => {
  const priorityQueue = new PriorityQueue<Node>();

  for (const entry of frequencyTable) {
    priorityQueue.enqueue(entry);
  }

  while (priorityQueue.length() > 1) {
    const leafLeft = priorityQueue.dequeue();
    const leafRight = priorityQueue.dequeue();

    if (!leafLeft || !leafRight) {
      throw new Error(
        "Invalid state: queue should contain at least two elements"
      );
    }

    const [charLeft, frequencyLeft] = leafLeft;
    const [charRight, frequencyRight] = leafRight;

    const combinedChars = `${charLeft}${charRight}`;
    const combinedFrequency = frequencyLeft + frequencyRight;

    const intermediaryNode: IntermediaryNode = [
      combinedChars,
      combinedFrequency,
      [leafLeft, leafRight],
    ];

    priorityQueue.enqueue(intermediaryNode);
  }

  return priorityQueue.getArray() as HuffmanTree;
};
