import { EmbedBuilder } from "discord.js";
import { getEconomy, updateEconomy } from "../../utils/database.js";

export default {
    name: "deposit",
    description: "Deposit money into your bank.",
    aliases: ["dep"],
    async execute(message, args) {
        const user = getEconomy(message.author.id);
        let amount = args[0];

        if (!amount) return message.reply("Usage: `s?dep <amount|all>`");

        if (amount.toLowerCase() === "all") {
            amount = user.balance;
        } else {
            amount = parseInt(amount);
        }

        if (isNaN(amount) || amount <= 0) {
            return message.reply("❌ Please provide a valid amount.");
        }

        if (user.balance < amount) {
            return message.reply("❌ You don't have enough money in your wallet.");
        }

        updateEconomy(message.author.id, {
            balance: user.balance - amount,
            bank: user.bank + amount
        });

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`🏦 You deposited **$${amount}** into your bank.`);

        message.channel.send({ embeds: [embed] });
    },
};
