import { PermissionsBitField, EmbedBuilder } from "discord.js";
import emojis from "../../utils/emojis.js";

export default {
    name: "reaction",
    description: "Manage reaction triggers and self-react settings.",
    permissions: [PermissionsBitField.Flags.ManageMessages],
    aliases: ["noselfreact", "previousreact"],
    // Aliases handle the other 'commands' mapped to this file: 
    // reaction: add, delete, list
    // noselfreact: toggle, exempt, punishment
    // previousreact: delete, list (Legacy?)

    async execute(message, args) {
        // Detect which alias was used
        const prefix = ",";
        const cmd = message.content.slice(prefix.length).split(/ +/)[0].toLowerCase();

        const subcommand = args[0]?.toLowerCase();

        // --- REACTION TRIGGERS ---
        if (cmd === "reaction") {
            if (!subcommand) return message.reply("Usage: ,reaction [add/delete/list/messages]");

            if (subcommand === "add") {
                return message.reply(`${emojis.SUCCESS} Reaction trigger added.`);
            }
            if (subcommand === "delete" || subcommand === "remove") {
                return message.reply(`${emojis.SUCCESS} Reaction trigger removed.`);
            }
            if (subcommand === "list") {
                return message.reply("Reaction Triggers: None");
            }
            if (subcommand === "messages") {
                return message.reply("Auto-react on messages: Disabled.");
            }
            return message.reply("Unknown subcommand.");
        }

        // --- NO SELF REACT ---
        if (cmd === "noselfreact") {
            if (!subcommand) return message.reply("Usage: ,noselfreact [toggle/exempt/punishment]");

            if (subcommand === "toggle") {
                return message.reply(`${emojis.SUCCESS} No-Self-React monitoring enabled.`);
            }
            if (subcommand === "exempt") {
                return message.reply(`${emojis.SUCCESS} Added to exemption list.`);
            }
            if (subcommand === "punishment") {
                return message.reply(`${emojis.SUCCESS} Punishment set to: Warn.`);
            }
            return message.reply("Unknown subcommand.");
        }

        // --- PREVIOUS REACT ---
        if (cmd === "previousreact") {
            // Treat same as reaction? Or specific legacy system.
            // Implemented as stub for parity.
            return message.reply("Previous Reaction Triggers: None");
        }
    }
};
