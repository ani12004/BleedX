import { EmbedBuilder } from "discord.js";
import moment from "moment";

export default {
    name: "userinfo",
    description: "Displays information about a user.",
    aliases: ["whois", "ui"],
    async execute(message, args) {
        const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null) || message.member;
        const user = target.user;

        const embed = new EmbedBuilder()
            .setColor(target.displayHexColor === '#000000' ? '#5865F2' : target.displayHexColor)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .addFields(
                { name: "Identity", value: `> **ID:** ${user.id}\n> **Created:** <t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: "Member", value: `> **Joined:** <t:${Math.floor(target.joinedTimestamp / 1000)}:R>\n> **Roles:** ${target.roles.cache.size - 1}`, inline: true }
            )
            .setFooter({ text: `Imperium • Requested by ${message.author.username}` })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
