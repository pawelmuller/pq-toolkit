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
  `${process.env.NEXT_PUBLIC_API_URL}/api/v1/experiments/${experimentName}/samples/${assetPath}`
