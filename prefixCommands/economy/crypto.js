import { EmbedBuilder } from "discord.js";
import emojis from "../../utils/emojis.js";

export default {
    name: "crypto",
    description: "Check cryptocurrency prices.",
    permissions: [],
    aliases: ["subscribe", "transaction", "gas"],
    async execute(message, args) {
        const prefix = ",";
        const cmd = message.content.slice(prefix.length).split(/ +/)[0].toLowerCase();

        if (cmd === "crypto") {
            const coin = args[0] || "bitcoin";
            // Mock API call
            const price = (Math.random() * 50000).toFixed(2);
            return message.reply(`${emojis.bitcoin || '💰'} **${coin.toUpperCase()}**: $${price} (Simulated)`);
        }

        if (cmd === "gas") {
            return message.reply("⛽ **Gas Prices**:\nLow: 20 gwei\nAvg: 25 gwei\nHigh: 40 gwei");
        }

        if (cmd === "subscribe") {
            return message.reply(`${emojis.SUCCESS} Subscribed to transactions (Mock).`);
        }

        if (cmd === "transaction") {
            return message.reply("Transaction Info: (Stub)");
        }
    }
};
