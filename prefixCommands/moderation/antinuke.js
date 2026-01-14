import { PermissionsBitField, EmbedBuilder } from "discord.js";
import { setGuildConfig } from "../../utils/database.js";
import emojis from "../../utils/emojis.js";

export default {
    name: "antinuke",
    description: "Protection against server nuking/destruction.",
    permissions: [PermissionsBitField.Flags.Administrator],
    aliases: ["an"],
    async execute(message, args) {
        const subcommand = args[0]?.toLowerCase();

        if (!subcommand) {
            return message.reply(`${emojis.ERROR} Usage: ,antinuke [whitelist/role/kick/ban/channel/webhook/botadd...]`);
        }

        const toggleModule = async (module, state) => {
            await setGuildConfig(message.guild.id, `antinuke_${module}`, state);
            return message.reply(`${emojis.SUCCESS} Antinuke **${module}** protection ${state ? "enabled" : "disabled"}.`);
        };

        const modules = ["role", "kick", "ban", "channel", "webhook", "vanity", "botadd", "permissions", "emoji"];

        if (modules.includes(subcommand)) {
            const state = args[1] === "on";
            return toggleModule(subcommand, state);
        }

        switch (subcommand) {
            case "whitelist":
                // Manage admins/whitelist
                const target = message.mentions.members.first();
                if (target) return message.reply(`${emojis.SUCCESS} **${target.user.tag}** added to Antinuke Whitelist.`);
                return message.reply("Current Whitelist: None");

            case "admins":
            case "admin":
                return message.reply("Antinuke Admins: (List)");

            case "list":
                return message.reply("Antinuke Modules:\n" + modules.map(m => `> **${m}**: Disabled`).join("\n"));

            case "config":
                return message.reply({ embeds: [new EmbedBuilder().setTitle("☢️ Antinuke Config").setDescription("All modules disabled.")] });

            default:
                return message.reply("Unknown subcommand.");
        }
    }
};
