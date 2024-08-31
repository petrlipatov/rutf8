import { createFrequencyMap } from "../common/utils";

/**
 * Utilizes Shannon entropy to calculate the theoretical limit
 * of compression efficiency.
 */
export function calculateEntropy(text: string): number {
  const length = text.length;

  if (length === 0) {
    throw Error("Unexpected: The input string is empty (length is 0)");
  }

  const frequencyTable = createFrequencyMap(text);

  let entropy = 0;
  for (const symbolFrequency of frequencyTable.values()) {
    const p = symbolFrequency / length;
    entropy -= p * Math.log2(p);
  }

  return entropy;
}

/**
 * Calculates optimal bytes compression using Shannon Entropy
 */
export function calculateOptimalBytesCompression(text: string): number {
  const e = calculateEntropy(text);
  const optimalCompression = (text.length * e) / 8;
  return Math.ceil(optimalCompression);
}
