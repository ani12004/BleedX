import { PermissionsBitField, EmbedBuilder } from "discord.js";
import { setGuildConfig } from "../../utils/database.js";
import emojis from "../../utils/emojis.js";

export default {
    name: "timer",
    description: "Post repeating messages in your server.",
    permissions: [PermissionsBitField.Flags.ManageMessages],
    async execute(message, args) {
        const subcommand = args[0]?.toLowerCase(); // add, remove, list, view, activity

        if (!subcommand) return message.reply("Usage: ,timer [add/remove/list/view/activity]");

        switch (subcommand) {
            case "add":
                // usage: ,timer add [channel] [interval] [message]
                return message.reply(`${emojis.SUCCESS} Timer added (Stub).`);

            case "remove":
                return message.reply(`${emojis.SUCCESS} Timer removed.`);

            case "list":
                return message.reply("Active Timers: None");

            case "view":
                return message.reply("Timer Content: (Stub)");

            case "activity":
                // usage: activity [channel] [on/off]
                return message.reply(`${emojis.SUCCESS} Activity check updated.`);

            default:
                return message.reply("Unknown subcommand.");
        }
    }
};
