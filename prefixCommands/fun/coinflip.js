import { EmbedBuilder } from "discord.js";
import { getEconomy, updateEconomy } from "../../utils/database.js";
import { checkRules } from "../../utils/checkRules.js";

export default {
    name: "coinflip",
    description: "Flip a coin and bet money.",
    aliases: ["cf", "flip"],
    async execute(message, args) {
        if (!await checkRules(message, message.author.id)) return;

        const amount = parseInt(args[0]);
        const choice = args[1]?.toLowerCase();

        if (!amount || isNaN(amount) || amount <= 0) {
            // Just flip without betting
            const result = Math.random() < 0.5 ? "Heads" : "Tails";
            const embed = new EmbedBuilder()
                .setColor("Gold")
                .setTitle("🪙 Coin Flip")
                .setDescription(`The coin landed on **${result}**!`);
            return message.channel.send({ embeds: [embed] });
        }

        if (!choice || (choice !== "heads" && choice !== "tails" && choice !== "h" && choice !== "t")) {
            return message.reply("Usage: `s?cf <amount> <heads/tails>`");
        }

        const user = await getEconomy(message.author.id);
        if (user.balance < amount) {
            return message.reply("❌ You don't have enough money.");
        }

        const result = Math.random() < 0.5 ? "heads" : "tails";
        const win = (choice.startsWith(result.charAt(0)));

        if (win) {
            updateEconomy(message.author.id, { balance: user.balance + amount });
            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("🪙 Coin Flip - You Won!")
                .setDescription(`The coin landed on **${result}**! You won **$${amount}**.`);
            message.channel.send({ embeds: [embed] });
        } else {
            updateEconomy(message.author.id, { balance: user.balance - amount });
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("🪙 Coin Flip - You Lost")
                .setDescription(`The coin landed on **${result}**. You lost **$${amount}**.`);
            message.channel.send({ embeds: [embed] });
        }
    },
};
