export function buildSuffixArray(input: string): number[] {
  const length = input.length;
  // The `ranks` array holds the `rank` of each suffix.
  // As comparisonRange increases, these ranks begin to represent the order of suffixes based
  // on multiple characters.
  //
  // Example for the string "banana":
  // Initially, `ranks` contains ASCII codes of the characters:
  // String:  "banana"
  // Indexes:  0  1   2   3   4   5
  // ranks:  [98, 97, 110, 97, 110, 97]
  //
  // After the first iteration (`comparisonSpan = 1`), ranks get updated:
  // Now `ranks` represents the relative order of suffixes based on the first character
  // (and the second character, if available): [1, 0, 2, 0, 2, 0]
  let ranks = new Array(length);
  // `nextRanks` is a temp array where new ranks are stored after recalculating them during
  // each iteration. After updating, these ranks will be copied back to ranks for the next iteration.
  let nextRanks = new Array(length);
  // `comparisonRange` controls how many characters we compare in each iteration. Initially, it’s set to 1
  // (compare only the first character), then it doubles (compare first two characters,
  // then four, and so on) until all characters in the suffix are considered.
  let comparisonRange = 1;

  // indexes of sorted suffixes
  const sortedSuffixes = new Array(length);

  // set initial values for `ranks` and `orderedSuffixes`
  for (let i = 0; i < length; i++) {
    ranks[i] = input.charCodeAt(i);
    sortedSuffixes[i] = i;
  }

  while (comparisonRange < length) {
    // Step 1: Sort suffixes based on ranks starting `comparisonRange` positions ahead.
    // Example: Suppose `comparisonRange` = 1.
    // - `ranks` = [98, 97, 110, 97, 110, 97] (character codes for suffixes).
    // - Suffixes are sorted based on ranks of positions one ahead:
    //   - For suffix starting at index 0, rank is ranks[(0 + 1) % 6] = ranks[1] = 97.
    //   - For suffix starting at index 1, rank is ranks[(1 + 1) % 6] = ranks[2] = 110.
    //   - Continue similarly for all suffixes.
    // - Sorting the suffix array based on these "ahead" ranks gives us a new order.
    radixSort(sortedSuffixes, (i) => ranks[(i + comparisonRange) % length]);
    // Step 2: Sort suffixes based on current ranks.
    // Example: Suppose after the previous sorting, the ranks are as follows:
    // - `ranks` = [1, 0, 2, 0, 2, 0] (ranks of suffixes based on initial comparison).
    // - Sorting `suffixArray` directly by these ranks would order suffixes based on current rank values.
    radixSort(sortedSuffixes, (i) => ranks[i]);
    recalculateRanks(ranks, nextRanks, sortedSuffixes, comparisonRange, length);

    [ranks, nextRanks] = [nextRanks, ranks];
    comparisonRange *= 2;
  }

  return sortedSuffixes;
}

/**
 * Sorts the `suffixIndexes` array using radix sort based on the ranks of suffixes.
 * @param suffixIndexes - An array of suffix indices to be sorted.
 * @param getRank - A function that returns the rank of a given suffix index.
 */
const radixSort = (
  sortedSuffixes: number[],
  getRank: (index: number) => number
) => {
  const buckets: number[][] = Array.from({ length: 16 }, () => []);

  let bitPointer = 0;
  let maxValue = Math.max(...sortedSuffixes.map(getRank));
  const bitsCount = Math.ceil(Math.log2(maxValue + 1));

  // We sort suffix indexes using radix sort, processing the rank bits in chunks of 4 bits.
  // 1. Loop over `suffixIndexes` and determine the rank for each suffix.
  // 2. Extract 4 bits from the rank, starting from `bitPointer`.
  // 3. Use these 4 bits to decide the bucket where the suffix index will go.
  // 4. After distributing all suffixes into buckets based on the current 4-bit segment,
  //    move to the next 4-bit segment by incrementing `bitPointer` by 4.
  while (bitPointer < bitsCount) {
    for (let i = 0; i < sortedSuffixes.length; i++) {
      const rank = getRank(sortedSuffixes[i]);
      const bucketIndex = (rank >> bitPointer) & 0b1111;
      buckets[bucketIndex].push(sortedSuffixes[i]);
    }

    sortedSuffixes.length = 0;
    for (const bucket of buckets) {
      sortedSuffixes.push(...bucket);
      bucket.length = 0;
    }
    bitPointer += 4;
  }

  return sortedSuffixes;
};

function recalculateRanks(
  currentRanks: number[],
  nextRanks: number[],
  suffixArray: number[],
  comparisonSpan: number,
  length: number
): void {
  let rank = 1;
  nextRanks[suffixArray[0]] = rank;

  for (let i = 1; i < length; i++) {
    const currentSuffix = suffixArray[i];
    const previousSuffix = suffixArray[i - 1];

    const differentRanks =
      currentRanks[currentSuffix] !== currentRanks[previousSuffix];
    const differentNextRanks =
      currentRanks[(currentSuffix + comparisonSpan) % length] !==
      currentRanks[(previousSuffix + comparisonSpan) % length];

    if (differentRanks || differentNextRanks) {
      rank++;
    }
    nextRanks[currentSuffix] = rank;
  }
}
