/**
 * Get the URL for a sample asset
 * @param experimentName
 * @param assetPath
 * @returns asset URL
 */
export const getSampleUrl = (
  experimentName: string,
  assetPath: string
): string =>
  `${process.env.NEXT_PUBLIC_API_URL}/api/v1/experiments/${experimentName}/samples/${assetPath}`;

export function shuffleArray<ArrayItemType>(
  array: ArrayItemType[]
): ArrayItemType[] {
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ];
  }

  return array;
}
