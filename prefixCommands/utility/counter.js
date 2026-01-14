import { PermissionsBitField, EmbedBuilder } from "discord.js";
import { setGuildConfig } from "../../utils/database.js";
import emojis from "../../utils/emojis.js";

export default {
    name: "counter",
    description: "Create counters for everybody to see.",
    permissions: [PermissionsBitField.Flags.ManageChannels],
    async execute(message, args) {
        const subcommand = args[0]?.toLowerCase();

        if (!subcommand) return message.reply("Usage: ,counter [add/remove/list]");

        switch (subcommand) {
            case "add":
                // usage: ,counter add [members/bots/roles]
                // This would create a locked voice channel with name "Members: 123"
                const type = args[1] || "members";
                await message.guild.channels.create({
                    name: `${type}: ${message.guild.memberCount}`,
                    type: 2, // Voice
                    permissionOverwrites: [{ id: message.guild.roles.everyone.id, deny: ["Connect"] }]
                });
                return message.reply(`${emojis.SUCCESS} Counter created.`);

            case "remove":
                return message.reply(`${emojis.SUCCESS} Counter removed (Stub).`);

            case "list":
                return message.reply("Active Counters: None");

            default:
                return message.reply("Unknown subcommand.");
        }
    }
};
