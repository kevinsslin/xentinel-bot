import { run } from "@xmtp/message-kit";
import type { HandlerContext } from "@xmtp/message-kit";
import { handler as agent } from "./handler/agent.js";
import { handler as getPendingTx } from "./handler/getPendingTx.js";
import { ethers } from "ethers";

// Main function to run the app
run(async (context: HandlerContext) => {

  const {
    message: { typeId },
  } = context;
  
  switch (typeId) {
    case "reaction":
      handleReaction(context);
      break;
    case "reply":
      handleReply(context);
      break;
    case "text":
      handleTextMessage(context);
      break;
  }
});

async function handleReply(context: HandlerContext) {
  const {
    v2client,
    getReplyChain,
    version,
    message: {
      content: { reference },
    },
  } = context;

  const { chain, isSenderInChain } = await getReplyChain(
    reference,
    version,
    v2client.address,
  );
  console.log(chain);
  handleTextMessage(context);
}
// Handle reaction messages
async function handleReaction(context: HandlerContext) {
  const {
    v2client,
    getReplyChain,
    version,
    message: {
      content: { content: emoji, action, reference },
    },
  } = context;

  const { chain, isSenderInChain } = await getReplyChain(
    reference,
    version,
    v2client.address,
  );
  console.log(chain);
}

// Handle text messages
async function handleTextMessage(context: HandlerContext) {
  const {
    message: {
      content: { content: text },
      sender: { address, username }
    },
  } = context;

  // console.log(`Message received from ${username} (${address}): ${text}`);

  console.log("Received text:", text);

  const wallet = new ethers.Wallet(`${process.env.KEY}`);

  switch (true) {
    case text.includes("/help"):
      await helpHandler(context);
      break;

    case text.startsWith("@agent"):
      await agent(context);
      break;

    case text.includes("/pending"):
      await getPendingTx(context);
      break;

    default:
      if (context.message.sender.address !== wallet.address) {
        console.log("Routing to intent:", text);
        await context.intent(text);
      }
  }
}

export async function helpHandler(context: HandlerContext) {
  const { commands = [] } = context;
  const intro = `Available experiences:
${commands
  .flatMap((app) => app.commands)
  .map((command) => `${command.command} - ${command.description}`)
  .join("\n")}
Use these commands to interact with specific apps.`;
  
  context.send(intro);
}