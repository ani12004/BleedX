import { PermissionsBitField, EmbedBuilder } from "discord.js";
import { getWarnings, clearWarnings } from "../../utils/database.js";

export default {
    name: "warnings",
    description: "Check warnings of a user.",
    permissions: [PermissionsBitField.Flags.ManageMessages],
    aliases: ["warns"],
    async execute(message, args) {
        const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null) || message.member;

        if (args[1] === "clear") {
            if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply("❌ You need Administrator permission to clear warnings.");
            await clearWarnings(message.guild.id, target.id);
            return message.reply(`✅ Cleared all warnings for **${target.user.tag}**.`);
        }

        const warnings = await getWarnings(message.guild.id, target.id);

        if (warnings.length === 0) {
            return message.reply(`✅ **${target.user.tag}** has no warnings.`);
        }

        const embed = new EmbedBuilder()
            .setColor("#FFA500")
            .setTitle(`⚠️ Warnings for ${target.user.tag}`)
            .setDescription(warnings.map((w, i) => `**${i + 1}.** ${w.reason} - <t:${Math.floor(w.timestamp / 1000)}:R>`).join("\n"))
            .setFooter({ text: `Total Warnings: ${warnings.length}` });

        message.channel.send({ embeds: [embed] });
    },
};
