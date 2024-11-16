import type { CommandGroup } from "@xmtp/message-kit";
import { handler as agent } from "./handler/agent.js";
import { handler as games } from "./handler/game.js";
import { handler as subscribeHandler } from "./handler/subscribe.js";
import { handler as getPendingTx } from "./handler/getPendingTx.js";
import { handler as executeTx } from "./handler/executeTx.js";

export const commands: CommandGroup[] = [
  {
    name: "Execute Transaction",
    triggers: ["/execute", "@execute"],
    description: "Execute a signed Safe transaction",
    commands: [
      {
        command: "/execute [safe_tx_hash]",
        description: "Execute a Safe transaction that has collected required signatures.",
        handler: executeTx,
        params: {
          safeTxHash: {
            default: "",
            type: "string",
          },
        },
      },
    ],
  },
  {
    name: "Pending Transactions",
    triggers: ["/pending", "@pending"],
    description: "View pending Safe transactions",
    commands: [
      {
        command: "/pending",
        description: "Get list of pending transactions for the Safe",
        handler: getPendingTx,
        params: {},
      }
    ],
  },
  {
    name: "Games",
    triggers: ["/game", "@game", "🔎", "🔍"],
    description: "Provides various gaming experiences.",
    commands: [
      {
        command: "/game [game]",
        handler: games,
        description: "Play a game.",
        params: {
          game: {
            default: "",
            type: "string",
            values: ["wordle", "slot", "help"],
          },
        },
      },
    ],
  },
  {
    name: "Agent",
    triggers: ["/agent", "@agent", "@bot"],
    description: "AI assistant for help and commands.",
    commands: [
      {
        command: "/agent [prompt]",
        handler: agent,
        description: "Ask the AI agent for help.",
        params: {
          prompt: {
            default: "",
            type: "prompt",
          },
        },
      },
    ],
  },
  {
    name: "Subscribe",
    triggers: ["/subscribe"],

    description: "Subscribe to the bot.",
    commands: [
      {
        command: "/subscribe",
        handler: subscribeHandler,
        description: "Subscribe to the bot.",
        params: {},
      },
    ],
  }
];