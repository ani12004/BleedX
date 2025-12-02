import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default {
    name: "support",
    description: "Get the link to the support server.",
    aliases: ["server", "invite"],
    async execute(message, args, client) {
        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🆘 Need Help?")
            .setDescription("Join our official support server for assistance, updates, and more!")
            .setThumbnail(client.user.displayAvatarURL());

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Join Support Server")
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://discord.gg/tN5MvnTTXK")
            );

        message.channel.send({ embeds: [embed], components: [row] });
    },
};
