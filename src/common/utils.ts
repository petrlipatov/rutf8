export function createFrequencyMap(text: string): Map<string, number> {
  const frequency = new Map<string, number>();

  for (const char of text) {
    frequency.set(char, (frequency.get(char) || 0) + 1);
  }

  return frequency;
}
