import { PermissionsBitField, EmbedBuilder } from "discord.js";
import { setGuildConfig } from "../../utils/database.js";
import emojis from "../../utils/emojis.js";

export default {
    name: "clownboard",
    description: "Showcase the worst messages in your server.",
    permissions: [PermissionsBitField.Flags.ManageGuild],
    aliases: ["cb"],
    async execute(message, args) {
        const subcommand = args[0]?.toLowerCase();

        if (!subcommand) {
            return message.reply(`${emojis.ERROR} Usage: ,clownboard [set/off/emoji/threshold/color...]`);
        }

        // Common Config Logic
        // In a real implementation, we would fetch current config to show in 'config' command

        switch (subcommand) {
            case "set":
                const channel = message.mentions.channels.first() || message.channel;
                await setGuildConfig(message.guild.id, "clownboard_channel", channel.id);
                return message.reply(`${emojis.SUCCESS} Clownboard channel set to ${channel}.`);

            case "lock":
            case "off":
                await setGuildConfig(message.guild.id, "clownboard_enabled", false);
                return message.reply(`${emojis.SUCCESS} Clownboard disabled.`);

            case "unlock":
            case "on":
                await setGuildConfig(message.guild.id, "clownboard_enabled", true);
                return message.reply(`${emojis.SUCCESS} Clownboard enabled.`);

            case "emoji":
                const emoji = args[1];
                if (!emoji) return message.reply("Please provide an emoji.");
                // Simple unicode/id validation would go here
                await setGuildConfig(message.guild.id, "clownboard_emoji", emoji);
                return message.reply(`${emojis.SUCCESS} Clownboard emoji set to ${emoji}.`);

            case "threshold":
            case "limit":
                const num = parseInt(args[1]);
                if (isNaN(num) || num < 1) return message.reply("Invalid number.");
                await setGuildConfig(message.guild.id, "clownboard_threshold", num);
                return message.reply(`${emojis.SUCCESS} Threshold set to **${num}**.`);

            case "color":
                const color = args[1];
                if (!color) return message.reply("Usage: #hex");
                await setGuildConfig(message.guild.id, "clownboard_color", color);
                return message.reply(`${emojis.SUCCESS} Color updated.`);

            case "selfstar":
                // Toggle
                return message.reply(`${emojis.SUCCESS} Self-starring toggle updated (Stub).`);

            case "ignore":
                // usage: ,clownboard ignore [channel/user]
                return message.reply(`${emojis.SUCCESS} Updated ignore list (Stub).`);

            case "reset":
                // Clear all generic CB configs
                await setGuildConfig(message.guild.id, "clownboard_channel", null);
                await setGuildConfig(message.guild.id, "clownboard_enabled", false);
                return message.reply(`${emojis.SUCCESS} Clownboard configuration reset.`);

            case "config":
                // Mock view
                const embed = new EmbedBuilder()
                    .setTitle("🤡 Clownboard Settings")
                    .setDescription("Channel: Not Set\nEmoji: 🤡\nThreshold: 3\nEnabled: False")
                    .setColor("#ff0000");
                return message.channel.send({ embeds: [embed] });

            default:
                return message.reply("Unknown subcommand.");
        }
    }
};
