import { describe, expect, it, beforeEach } from "@jest/globals";
import { PriorityQueue } from "../../../src/algorithms/huffman/utils/priority-queue"; // Замените на корректный путь к вашему классу

describe("Module 'huffman/priority-queue'", () => {
  let pq: PriorityQueue<[string, number]>;

  beforeEach(() => {
    pq = new PriorityQueue<[string, number]>();
  });

  it("should start empty", () => {
    expect(pq.isEmpty()).toBe(true);
    expect(pq.length()).toBe(0);
  });

  it("should enqueue elements and maintain priority", () => {
    pq.enqueue(["A", 5]);
    pq.enqueue(["B", 3]);
    pq.enqueue(["C", 8]);
    pq.enqueue(["D", 1]);

    expect(pq.length()).toBe(4);
    expect(pq.getArray()).toEqual([
      ["D", 1],
      ["B", 3],
      ["C", 8],
      ["A", 5],
    ]);
  });

  it("should dequeue elements in priority order", () => {
    pq.enqueue(["A", 5]);
    pq.enqueue(["B", 3]);
    pq.enqueue(["C", 8]);
    pq.enqueue(["D", 1]);

    expect(pq.dequeue()).toEqual(["D", 1]);
    expect(pq.dequeue()).toEqual(["B", 3]);
    expect(pq.dequeue()).toEqual(["A", 5]);
    expect(pq.dequeue()).toEqual(["C", 8]);

    expect(pq.isEmpty()).toBe(true);
  });

  it("should handle dequeue on empty queue", () => {
    expect(pq.dequeue()).toBeNull();
  });

  it("should maintain heap property after multiple enqueues and dequeues", () => {
    pq.enqueue(["A", 10]);
    pq.enqueue(["B", 5]);
    pq.enqueue(["C", 15]);
    pq.enqueue(["D", 1]);

    expect(pq.dequeue()).toEqual(["D", 1]);
    pq.enqueue(["E", 3]);
    expect(pq.dequeue()).toEqual(["E", 3]);
    expect(pq.dequeue()).toEqual(["B", 5]);
    expect(pq.dequeue()).toEqual(["A", 10]);
    expect(pq.dequeue()).toEqual(["C", 15]);

    expect(pq.isEmpty()).toBe(true);
  });

  it("should return the correct length of the queue", () => {
    pq.enqueue(["A", 7]);
    pq.enqueue(["B", 2]);
    expect(pq.length()).toBe(2);

    pq.dequeue();
    expect(pq.length()).toBe(1);
  });

  it("should correctly handle complex insertion patterns", () => {
    pq.enqueue(["X", 12]);
    pq.enqueue(["Y", 9]);
    pq.enqueue(["Z", 4]);
    pq.enqueue(["W", 7]);

    expect(pq.dequeue()).toEqual(["Z", 4]);
    expect(pq.dequeue()).toEqual(["W", 7]);
    pq.enqueue(["V", 5]);
    expect(pq.dequeue()).toEqual(["V", 5]);
  });
});
