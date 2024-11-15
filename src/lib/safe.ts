import SafeApiKit from '@safe-global/api-kit';
import Safe from '@safe-global/protocol-kit';
import type { MetaTransactionData } from "@safe-global/types-kit";

export function validateSafeEnvironment() {
  const missingVars = [];
  
  if (!process?.env?.SAFE_ADDRESS) missingVars.push('SAFE_ADDRESS');
  if (!process.env.RPC_URL) missingVars.push('RPC_URL');
  if (!process.env.CHAIN_ID) missingVars.push('CHAIN_ID');
  if (!process.env.SIGNER_PRIVATE_KEY) missingVars.push('SIGNER_PRIVATE_KEY');
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

// API Kit related functions
function getSafeApiKit() {
  validateSafeEnvironment();
  
  return new SafeApiKit.default({
    chainId: BigInt(process.env.CHAIN_ID as string),
  });
}

async function getSafeProtocolKit() {
  validateSafeEnvironment();
  
  return await Safe.default.init({
    provider: process.env.RPC_URL,
    signer: process.env.SIGNER_PRIVATE_KEY,
    safeAddress: process.env.SAFE_ADDRESS,
  });
}

// Protocol Kit operations
export async function createTransaction(transactions: MetaTransactionData[]) {
  const protocolKit = await getSafeProtocolKit();
  return await protocolKit.createTransaction({ transactions });
}

export async function getTransactionHash(transaction: any) {
  const protocolKit = await getSafeProtocolKit();
  return await protocolKit.getTransactionHash(transaction);
}

export async function signTransactionHash(safeTxHash: string) {
  const protocolKit = await getSafeProtocolKit();
  return await protocolKit.signHash(safeTxHash);
}

// API Kit operations
export async function getTransaction(safeTxHash: string) {
  const apiKit = getSafeApiKit();
  return await apiKit.getTransaction(safeTxHash);
}

export async function getPendingTransactions() {
  const apiKit = getSafeApiKit();
  return await apiKit.getPendingTransactions(process.env.SAFE_ADDRESS as string);
}

export async function confirmTransaction(safeTxHash: string, signature: string) {
  const apiKit = getSafeApiKit();
  return await apiKit.confirmTransaction(safeTxHash, signature);
}

export async function proposeTransaction(params: {
  safeAddress: string;
  safeTransactionData: any;
  safeTxHash: string;
  senderAddress: string;
  senderSignature: string;
}) {
  const apiKit = getSafeApiKit();
  console.log('Proposing transaction:', params);
  return await apiKit.proposeTransaction(params);
}

// Combined operations
export async function signAndConfirmTransaction(safeTxHash: string) {
  const signature = await signTransactionHash(safeTxHash);
  await confirmTransaction(safeTxHash, signature.data);
  return signature;
}

export async function executeTransaction(safeTxHash: string) {
  const protocolKit = await getSafeProtocolKit();
  const apiKit = getSafeApiKit();
  
  const safeTransaction = await apiKit.getTransaction(safeTxHash);
  const executeTxResponse = await protocolKit.executeTransaction(safeTransaction);
  return await executeTxResponse.transactionResponse?.wait();
} 