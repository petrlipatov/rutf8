import { Node } from "./types";

export class PriorityQueue<T> {
  private heap: T[] = [];

  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private hasLeftChild(index: number): boolean {
    return this.getLeftChildIndex(index) < this.heap.length;
  }

  private hasRightChild(index: number): boolean {
    return this.getRightChildIndex(index) < this.heap.length;
  }

  private getLeftChildIndex(index: number): number {
    return 2 * index + 1;
  }

  private getRightChildIndex(index: number): number {
    return 2 * index + 2;
  }

  private getLeftChildValue(index: number): number {
    return this.heap[this.getLeftChildIndex(index)][1];
  }

  private getRightChildValue(index: number): number {
    return this.heap[this.getRightChildIndex(index)][1];
  }

  private getValue(index: number): number {
    return this.heap[index][1];
  }

  private swap(index1: number, index2: number): void {
    [this.heap[index1], this.heap[index2]] = [
      this.heap[index2],
      this.heap[index1],
    ];
  }

  enqueue(node: T): void {
    this.heap.push(node);
    this.heapifyUp();
  }

  dequeue(): T | null {
    if (this.isEmpty()) return null;
    if (this.heap.length === 1) return this.heap.pop()!;

    const root = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown();
    return root;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  length(): number {
    return this.heap.length;
  }

  private heapifyUp(): void {
    let index = this.heap.length - 1;
    while (
      index > 0 &&
      this.heap[this.getParentIndex(index)][1] > this.heap[index][1]
    ) {
      this.swap(index, this.getParentIndex(index));
      index = this.getParentIndex(index);
    }
  }

  private heapifyDown(): void {
    let index = 0;
    while (this.hasLeftChild(index)) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      if (
        this.hasRightChild(index) &&
        this.getRightChildValue(index) < this.getLeftChildValue(index)
      ) {
        smallerChildIndex = this.getRightChildIndex(index);
      }

      if (this.getValue(index) <= this.getValue(smallerChildIndex)) {
        break;
      }

      this.swap(index, smallerChildIndex);
      index = smallerChildIndex;
    }
  }

  printQueue(): void {
    console.log(this.heap.map((node) => `${node[0]} (${node[1]})`).join(", "));
  }

  getArray(): T[] {
    return this.heap;
  }
}
