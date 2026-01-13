import { EmbedBuilder, ChannelType } from "discord.js";
import moment from "moment";

export default {
    name: "serverinfo",
    description: "Displays information about the server.",
    aliases: ["si"],
    async execute(message, args) {
        const guild = message.guild;
        const owner = await guild.fetchOwner();

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
            .setTitle(guild.name)
            .setDescription(`> **ID:** ${guild.id}\n> **Owner:** <@${guild.ownerId}>`)
            .addFields(
                { name: "Members", value: `${guild.memberCount}`, inline: true },
                { name: "Channels", value: `${guild.channels.cache.size}`, inline: true },
                { name: "Roles", value: `${guild.roles.cache.size}`, inline: true },
                { name: "Created", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true }
            )
            .setFooter({ text: `Imperium • Requested by ${message.author.username}` })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
