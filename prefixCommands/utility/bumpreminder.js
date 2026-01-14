import { PermissionsBitField, EmbedBuilder } from "discord.js";
import { setGuildConfig } from "../../utils/database.js";
import emojis from "../../utils/emojis.js";

export default {
    name: "bumpreminder",
    description: "Navigate Disboard bump reminders.",
    permissions: [PermissionsBitField.Flags.ManageGuild],
    aliases: ["br", "bump"],
    async execute(message, args) {
        const subcommand = args[0]?.toLowerCase();

        if (!subcommand) {
            return message.reply(`${emojis.ERROR} Usage: ,bumpreminder [channel/message/thankyou/autolock/autoclean/config]`);
        }

        switch (subcommand) {
            case "channel":
                const channel = message.mentions.channels.first() || message.channel;
                await setGuildConfig(message.guild.id, "bumpreminder_channel", channel.id);
                return message.reply(`${emojis.SUCCESS} Bump channel set to ${channel}.`);

            case "message":
                const msg = args.slice(1).join(" ");
                if (!msg) return message.reply("Please provide a reminder message.");
                await setGuildConfig(message.guild.id, "bumpreminder_message", msg);
                return message.reply(`${emojis.SUCCESS} Reminder message updated.`);

            case "message":
                if (args[1] === "view") {
                    // Mock fetch
                    return message.reply("Current Reminder: **Time to bump!** (Default)");
                }
                break;

            case "thankyou":
                const tyMsg = args.slice(1).join(" ");
                if (!tyMsg && args[1] !== "view") return message.reply("Please provide a message or 'view'.");
                if (args[1] === "view") return message.reply("Current Thank You: **Thanks for bumping!** (Default)");

                await setGuildConfig(message.guild.id, "bumpreminder_thankyou", tyMsg);
                return message.reply(`${emojis.SUCCESS} Thank you message updated.`);

            case "autolock":
                const lock = args[1] === "on"; // simplified toggle
                await setGuildConfig(message.guild.id, "bumpreminder_autolock", lock);
                return message.reply(`${emojis.SUCCESS} Autolock set to ${lock}.`);

            case "autoclean":
                const clean = args[1] === "on";
                await setGuildConfig(message.guild.id, "bumpreminder_autoclean", clean);
                return message.reply(`${emojis.SUCCESS} Autoclean set to ${clean}.`);

            case "config":
                const embed = new EmbedBuilder()
                    .setTitle("Bump Reminder Config")
                    .setDescription("Channel: Not Set\nAutoLock: Off\nAutoClean: Off")
                    .setColor("#2f3136");
                return message.channel.send({ embeds: [embed] });

            default:
                return message.reply("Unknown subcommand.");
        }
    }
};
