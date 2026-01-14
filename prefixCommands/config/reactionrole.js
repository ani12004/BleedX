import { PermissionsBitField, EmbedBuilder } from "discord.js";
import emojis from "../../utils/emojis.js";

export default {
    name: "reactionrole",
    description: "Self-assignable roles via reactions.",
    permissions: [PermissionsBitField.Flags.ManageRoles],
    aliases: ["rr"],
    async execute(message, args) {
        const subcommand = args[0]?.toLowerCase();

        if (!subcommand) return message.reply("Usage: ,reactionrole [add/remove/list/reset]");

        switch (subcommand) {
            case "add":
                // Usage: ,rr add [channel] [msgID] [emoji] [role]
                return message.reply(`${emojis.SUCCESS} Reaction role created (Stub).`);

            case "remove":
                return message.reply(`${emojis.SUCCESS} Reaction role removed.`);

            case "list":
                return message.reply("Current Reaction Roles: None");

            case "reset":
                return message.reply(`${emojis.SUCCESS} All reaction roles reset.`);

            default:
                return message.reply("Unknown subcommand.");
        }
    }
};
