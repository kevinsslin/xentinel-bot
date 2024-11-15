import type { HandlerContext } from "@xmtp/message-kit";
import { validateSafeEnvironment, getPendingTransactions } from "../lib/safe.js";
import { generateFrameURL } from "../lib/utils.js";

export async function handler(context: HandlerContext) {
  try {
    validateSafeEnvironment();

    if (!process.env.FRAME_BASE_URL) {
      console.log("FRAME_BASE_URL not found in .env");
      return;
    }

    const pendingTransactions = await getPendingTransactions();

    if (pendingTransactions.results.length === 0) {
      context.reply("✨ No pending transactions found.");
      return;
    }

    for (const tx of pendingTransactions.results) {
      const frameUrl = generateFrameURL(
        process.env.FRAME_BASE_URL,
        tx.proposer,
        process.env.SAFE_ADDRESS,
        tx.to,
        tx.value,
        tx.data || '0x',
        tx.safeTxHash
      );
      await context.reply(frameUrl);

      const txInfo = [
        '📋 Transaction Details:',
        `📤 To: ${tx.to}`,
        `💰 Value: ${tx.value}`,
        `🔑 Safe TX Hash: ${tx.safeTxHash}`,
        `✍️ Confirmations: ${tx.confirmations?.length || 0}`,
        `⏰ Created: ${new Date(tx.submissionDate).toLocaleString()}`,
        `🔢 Nonce: ${tx.nonce}`,
        `${tx.isExecuted ? '✅ Status: Executed' : '⏳ Status: Pending'}`
      ].join('\n');
      
      await context.reply(txInfo);
    }
  } catch (error) {
    console.error('Error fetching pending transactions:', error);
    context.reply("❌ Failed to fetch pending transactions. Please try again later.");
  }
} 