import type { CommandGroup } from "@xmtp/message-kit";
import { handler as agent } from "./handler/agent.js";
import { handler as games } from "./handler/game.js";
import { handler as propose } from "./handler/propose.js";
import { handler as subscribeHandler } from "./handler/subscribe.js";
import { handler as getPendingTx } from "./handler/getPendingTx.js";
import { handler as signTx } from "./handler/signTx.js";
import { handler as executeTx } from "./handler/executeTx.js";

export const commands: CommandGroup[] = [
  {
    name: "Propose Transaction",
    triggers: ["/propose", "@propose"],
    description: "Propose a new transaction to the Safe wallet",
    commands: [
      {
        command: "/propose [to] [ether_amount] [data]",
        description: "Propose a transaction to the Safe with a specified target address, amount in ETH, and data.",
        handler: propose,
        params: {
          to: {
            default: "0x",
            type: "string",
          },
          ether_amount: {
            default: 0.000000000000000001, // 1 wei
            type: "number",
          },
          data: {
            default: "0x",
            type: "string",
          },
        },
      },
    ],
  },
  {
    name: "Sign Transaction",
    triggers: ["/sign", "@sign"],
    description: "Sign a pending Safe transaction",
    commands: [
      {
        command: "/sign [safe_tx_hash]",
        description: "Sign a pending Safe transaction using its hash.",
        handler: signTx,
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
        command: "/subscribe [email]",
        handler: subscribeHandler,
        description: "Subscribe to the bot with an optional email",
        params: {
          email: {
            default: "",
            type: "string",
          },
        },
      },
    ],
  }
];