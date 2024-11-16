import type { HandlerContext } from "@xmtp/message-kit";
import { validateSafeEnvironment, getTransaction, signAndConfirmTransaction } from "../lib/safe.js";
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
      context.reply("Please provide a valid transaction hash to sign.");
      return;
    }

    const tx = await getTransaction(safeTxHash);
    
    if (!tx) {
      context.reply("Transaction not found.");
      return;
    }

    try {
      const signature = await signAndConfirmTransaction(safeTxHash);
      
      // First send success message with emojis
      await context.reply([
        '✅ Transaction Successfully Signed!',
        `🏦 Safe Address: ${process.env.SAFE_ADDRESS}`,
        `🔑 Transaction Hash: ${safeTxHash}`,
        `👤 Signer: ${sender.address}`,
        `📝 Signature: ${signature.data}`
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

    } catch (signError) {
      context.reply([
        '❌ Failed to sign transaction:',
        `🔑 Transaction Hash: ${safeTxHash}`,
        `⚠️ Error: ${signError.message}`,
        '💡 Please verify that you are an owner of this Safe and try again.'
      ].join('\n'));
    }

  } catch (error) {
    console.error('Error in sign handler:', error);
    context.reply([
      '❌ Failed to process transaction:',
      `⚠️ Error: ${error.message}`,
      '💡 Please check your parameters and try again.'
    ].join('\n'));
  }
} 