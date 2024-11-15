/**
 * Generates a frame URL with the provided parameters
 */
export function generateFrameURL(
  baseUrl: string,
  senderAddress: string,
  safeAddress: string,
  targetAddress: string,
  etherValue: string,
  formattedTxData: string,
  safeTxHash: string,
) {
  const queryParams = new URLSearchParams({
    senderAddress,
    safeAddress,
    to: targetAddress,
    value: etherValue,
    data: formattedTxData,
    safeTxHash
  }).toString();
  
  return `${baseUrl}/frames?${queryParams}`;
}

/**
 * Formats transaction data to ensure it has proper hex format
 */
export function formatTxData(txData: string): string {
  if (txData !== '0x' && txData.length < 4) {
    const dataWithoutPrefix = txData.slice(2);
    return `0x${dataWithoutPrefix.padEnd(2, '0')}`;
  }
  return txData;
} 