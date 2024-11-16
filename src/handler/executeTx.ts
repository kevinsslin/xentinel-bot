import type { HandlerContext } from "@xmtp/message-kit";
import { validateSafeEnvironment, getTransaction, executeTransaction } from "../lib/safe.js";
import { generateFrameURL } from "../lib/utils.js";

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
            safeTxHash,
          },
        },
      },
    } = context;

    if (!safeTxHash) {
      context.reply("Please provide a valid transaction hash to execute.");
      return;
    }

    const tx = await getTransaction(safeTxHash);
    
    if (!tx) {
      context.reply("Transaction not found.");
      return;
    }

    try {
      const receipt = await executeTransaction(safeTxHash);
      
      // First send success message with emojis
      await context.reply([
        '🚀 Transaction Successfully Executed!',
        `🏦 Safe Address: ${process.env.SAFE_ADDRESS}`,
        `🔑 Safe TX Hash: ${safeTxHash}`,
        `📝 Transaction Hash: ${receipt.transactionHash}`,
        `🔢 Block Number: ${receipt.blockNumber}`,
        `⛽ Gas Used: ${receipt.gasUsed.toString()}`,
        `🔍 View on BaseScan: sepolia.basescan.org/${receipt.transactionHash}`,
        `🔗 View on Blockscout: base-sepolia.blockscout.com/tx/${receipt.transactionHash}`
      ].join('\n'));

      // Then send frame URL
      const frameUrl = generateFrameURL(
        process.env.FRAME_BASE_URL,
        sender.address,
        process.env.SAFE_ADDRESS as string,
        tx.to,
        tx.value,
        tx.data || '0x',
        safeTxHash
      );
      await context.reply(frameUrl);

    } catch (execError) {
      context.reply([
        '❌ Failed to execute transaction:',
        `🔑 Transaction Hash: ${safeTxHash}`,
        `⚠️ Error: ${execError.message}`,
        '💡 Please verify that all required signatures are collected and you have enough gas.'
      ].join('\n'));
    }

  } catch (error) {
    console.error('Error in execute handler:', error);
    context.reply([
      '❌ Failed to process transaction:',
      `⚠️ Error: ${error.message}`,
      '💡 Please check your parameters and try again.'
    ].join('\n'));
  }
} 