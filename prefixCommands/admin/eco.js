import { EmbedBuilder } from "discord.js";
import { updateUser, getUser } from "../../utils/database.js";

const OWNER_ID = "1157205021008609311";

export default {
    name: "eco",
    description: "Manage user currency (Owner Only).",
    async execute(message, args, client) {
        if (message.author.id !== OWNER_ID) {
            return message.reply("❌ **Access Denied.** This command is reserved for the bot owner.");
        }

        const action = args[0]?.toLowerCase();
        const target = message.mentions.users.first() || await client.users.fetch(args[1]).catch(() => null);
        const amount = parseInt(args[2]);

        if (!action || !target || isNaN(amount)) {
            return message.reply("Usage: `s?eco <add|remove|set> <@user> <amount>`");
        }

        const userData = getUser(target.id, message.guild.id);
        let newBalance = userData.balance;

        if (action === "add") {
            newBalance += amount;
        } else if (action === "remove") {
            newBalance -= amount;
        } else if (action === "set") {
            newBalance = amount;
        } else {
            return message.reply("❌ Invalid action. Use `add`, `remove`, or `set`.");
        }

        updateUser(target.id, message.guild.id, { balance: newBalance });

        const embed = new EmbedBuilder()
            .setColor("Gold")
            .setTitle("💰 Currency Update")
            .setDescription(`Successfully updated balance for ${target}.`)
            .addFields(
                { name: "Action", value: action.toUpperCase(), inline: true },
                { name: "Amount", value: `${amount}`, inline: true },
                { name: "New Balance", value: `${newBalance}`, inline: true }
            )
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
