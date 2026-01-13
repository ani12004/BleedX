import { EmbedBuilder } from "discord.js";
import { getUser } from "../../utils/database.js";

export default {
    name: "level",
    description: "Check your level and XP.",
    permissions: [],
    aliases: ["lvl", "xp"],
    async execute(message, args) {
        const target = message.mentions.members.first() || message.member;
        const user = await getUser(target.id, message.guild.id);

        const nextLevelXp = (user.level + 1) * 100;
        const progress = Math.floor((user.xp / nextLevelXp) * 100);
        const progressBar = "🟩".repeat(Math.floor(progress / 10)) + "⬜".repeat(10 - Math.floor(progress / 10));

        const embed = new EmbedBuilder()
            .setColor("#00f3ff")
            .setAuthor({ name: target.user.username, iconURL: target.user.displayAvatarURL() })
            .setTitle("Level Statistics")
            .addFields(
                { name: "Level", value: `${user.level}`, inline: true },
                { name: "XP", value: `${user.xp} / ${nextLevelXp}`, inline: true },
                { name: "Progress", value: `${progressBar} ${progress}%`, inline: false }
            )
            .setThumbnail(target.user.displayAvatarURL());

        message.channel.send({ embeds: [embed] });
    },
};
