import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

const OWNER_ID = "1157205021008609311";

export default {
    name: "eco",
    description: "Manage user currency (Owner Only).",
    async execute(message, args, client) {
        if (message.author.id !== OWNER_ID) {
            return message.reply("❌ **Access Denied.** This command is reserved for the bot owner.");
        }

        const embed = new EmbedBuilder()
            .setColor("Gold")
            .setTitle("💰 Economy Management")
            .setDescription("Click the button below to manage user balances.");

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('manage_economy_btn')
                    .setLabel('Manage Economy')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('💵')
            );

        message.channel.send({ embeds: [embed], components: [row] });
    },
};
