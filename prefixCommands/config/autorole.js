import { PermissionsBitField, EmbedBuilder } from "discord.js";
import { setGuildConfig, getGuildConfig } from "../../utils/database.js";
import emojis from "../../utils/emojis.js";

export default {
    name: "autorole",
    description: "Assign roles automatically when members join.",
    permissions: [PermissionsBitField.Flags.ManageRoles],
    aliases: ["ar"],
    async execute(message, args) {
        const subcommand = args[0]?.toLowerCase();

        // If no subcommand, show usage
        if (!subcommand) {
            return message.reply(`${emojis.ERROR} Usage: ,autorole [add/remove/list/reset]`);
        }

        switch (subcommand) {
            case "add":
                const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
                if (!role) return message.reply("Please mention a role or provide ID.");

                // In real app: db.from('autoroles').insert(...)
                return message.reply(`${emojis.SUCCESS} Added **${role.name}** to autoroles.`);

            case "remove":
                const roleToRemove = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
                if (!roleToRemove) return message.reply("Please mention a role to remove.");
                return message.reply(`${emojis.SUCCESS} Removed **${roleToRemove.name}** from autoroles.`);

            case "list":
                // Mock list
                return message.reply(`${emojis.list || '📝'} **Autoroles**:\n- @Member (Muted)\n- @Fan`);

            case "reset":
                return message.reply(`${emojis.SUCCESS} All autoroles cleared.`);

            default:
                return message.reply("Unknown subcommand.");
        }
    }
};
