import type { HandlerContext } from "@xmtp/message-kit";
import { 
  validateSafeEnvironment, 
  createTransaction,
  getTransactionHash,
  signTransactionHash,
  proposeTransaction 
} from "../lib/safe.js";
import { generateFrameURL, formatTxData } from "../lib/utils.js";
import type { MetaTransactionData } from "@safe-global/types-kit";
import { OperationType } from "@safe-global/types-kit";
import { ethers } from 'ethers';

export async function handler(context: HandlerContext) {
  try {
    validateSafeEnvironment();

    if (!process.env.FRAME_BASE_URL) {
      console.log("FRAME_BASE_URL not found in .env");
      return;
    }

    const {
      message: {
        sender,
        content: {
          params: {
            to: targetAddress,
            ether_amount: etherAmount,
            data: txData,
          },
        },
      },
    } = context;

    if (!targetAddress || etherAmount === undefined || !txData) {
      context.reply("Missing required parameters. Please provide to, ether_amount, and data.");
      return;
    }

    const safeValue = ethers.parseEther(etherAmount.toString()).toString();
    const formattedTxData = formatTxData(txData);
    
    const safeTransactionData: MetaTransactionData = {
      to: targetAddress,
      value: safeValue, 
      data: formattedTxData,
      operation: OperationType.Call,
    };
    
    console.log('Safe transaction data:', safeTransactionData);

    const safeTransaction = await createTransaction([safeTransactionData]);
    const safeTxHash = await getTransactionHash(safeTransaction);
    const signature = await signTransactionHash(safeTxHash);

    await proposeTransaction({
      safeAddress: process.env.SAFE_ADDRESS as string,
      safeTransactionData: safeTransaction.data,
      safeTxHash,
      senderAddress: ethers.getAddress(sender.address),
      senderSignature: signature.data,
    });

    const frameUrl = generateFrameURL(
      process.env.FRAME_BASE_URL,
      sender.address,
      process.env.SAFE_ADDRESS as string,
      targetAddress,
      safeValue,
      formattedTxData,
      safeTxHash
    );
    
    await context.reply(frameUrl);
    
    await context.reply([
      '🎯 Transaction Successfully Proposed!',
      `🏦 Safe Address: ${process.env.SAFE_ADDRESS}`,
      `📤 To: ${targetAddress}`,
      `💰 Value: ${safeValue} ETH`,
      `📝 Data: ${formattedTxData}`,
      `🔑 Safe TX Hash: ${safeTxHash}`,
      '\n👉 Please wait for other owners to sign the transaction'
    ].join('\n'));

  } catch (error) {
    console.error('Error in propose handler:', error);
    context.reply(`❌ Failed to propose transaction: ${error.message}`);
  }
}
