import { PriorityQueue } from "./priority-queue";
import { FrequencyTable, HuffmanTree, IntermediaryNode, Node } from "./types";

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
