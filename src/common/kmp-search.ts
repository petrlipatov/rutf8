export function createKMPTable(substring: string): number[] {
  const results: number[] = Array(substring.length).fill(0);

  let pointer = 1;
  let cnd = 0;

  while (pointer < substring.length) {
    if (substring[pointer] === substring[cnd]) {
      cnd++;
      results[pointer] = cnd;
      pointer++;
    } else if (cnd > 0) {
      cnd = results[cnd - 1];
    } else {
      results[pointer] = 0;
      pointer++;
    }
  }

  return results;
}

export function KMPSearch(text: string, pattern: string): number {
  const patternLength = pattern.length;
  const textLength = text.length;
  const prefixTable = createKMPTable(pattern);

  let patternIndex = 0;
  let textIndex = 0;

  while (textIndex < textLength) {
    if (pattern[patternIndex] === text[textIndex]) {
      patternIndex++;
      textIndex++;

      if (patternIndex === patternLength) {
        return textIndex - patternIndex;
      }
    } else if (patternIndex > 0) {
      patternIndex = prefixTable[patternIndex - 1];
    } else {
      textIndex++;
    }
  }

  return -1;
}
