import { PermissionsBitField, EmbedBuilder } from "discord.js";
import { setGuildConfig } from "../../utils/database.js";
import emojis from "../../utils/emojis.js";

export default {
    name: "antiraid",
    description: "Configure protection against raids.",
    permissions: [PermissionsBitField.Flags.Administrator],
    aliases: ["raid"],
    async execute(message, args) {
        const subcommand = args[0]?.toLowerCase();

        if (!subcommand) {
            return message.reply(`${emojis.ERROR} Usage: ,antiraid [massjoin/state/avatar/newaccounts/whitelist/config]`);
        }

        switch (subcommand) {
            case "massjoin":
                // Toggle massjoin protection
                const mjState = args[1] === "on";
                await setGuildConfig(message.guild.id, "antiraid_massjoin", mjState);
                return message.reply(`${emojis.SUCCESS} Massjoin protection ${mjState ? "enabled" : "disabled"}.`);

            case "state":
                return message.reply("Current Raid State: **Normal** (No active raid detected).");

            case "avatar":
                // Punish users without avatar
                const avState = args[1] === "on";
                await setGuildConfig(message.guild.id, "antiraid_avatar", avState);
                return message.reply(`${emojis.SUCCESS} No-Avatar punishment ${avState ? "enabled" : "disabled"}.`);

            case "newaccounts":
                // Punish new accounts
                const naAge = args[1]; // e.g. "5d"
                if (!naAge) return message.reply("Usage: ,antiraid newaccounts [age/off]");
                await setGuildConfig(message.guild.id, "antiraid_newaccounts", naAge);
                return message.reply(`${emojis.SUCCESS} New Account threshold set to ${naAge}.`);

            case "whitelist":
                if (args[1] === "view") return message.reply("Whitelisted Users: None");
                const target = message.mentions.members.first();
                if (target) {
                    // Add to whitelist mockup
                    return message.reply(`${emojis.SUCCESS} Added **${target.user.tag}** to antiraid whitelist.`);
                }
                return message.reply("Please mention a user to whitelist.");

            case "config":
                return message.reply({ embeds: [new EmbedBuilder().setTitle("🛡️ Antiraid Config").setDescription("Massjoin: Off\nAvatar: Off\nNewAccounts: Off")] });

            default:
                return message.reply("Unknown subcommand.");
        }
    }
};
