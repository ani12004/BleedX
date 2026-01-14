import { PermissionsBitField, EmbedBuilder } from "discord.js";
import emojis from "../../utils/emojis.js";

// In-memory snipe cache (Note: this wipes on restart)
// In prod, use Redis or similar if persistence across restarts is needed, 
// but usually snipes are ephemeral.
export const snipeCache = new Map();
export const editSnipeCache = new Map();
export const reactionSnipeCache = new Map();

export default {
    name: "snipe",
    description: "Snipe the latest deleted message.",
    permissions: [],
    aliases: ["editsnipe", "reactionsnipe", "clearsnipe", "reactionhistory"],
    async execute(message, args) {
        const prefix = ",";
        const cmd = message.content.slice(prefix.length).split(/ +/)[0].toLowerCase();

        if (cmd === "snipe") {
            const sniped = snipeCache.get(message.channel.id);
            if (!sniped) return message.reply("Nothing to snipe!");

            const embed = new EmbedBuilder()
                .setAuthor({ name: sniped.author.tag, iconURL: sniped.author.displayAvatarURL() })
                .setDescription(sniped.content || "Image")
                .setTimestamp(sniped.timestamp)
                .setFooter({ text: "Sniped!" });
            if (sniped.image) embed.setImage(sniped.image);

            return message.channel.send({ embeds: [embed] });
        }

        if (cmd === "editsnipe") {
            const sniped = editSnipeCache.get(message.channel.id);
            if (!sniped) return message.reply("Nothing to editsnipe!");
            return message.reply(`Old Content: ${sniped.content}`);
        }

        if (cmd === "reactionsnipe") {
            return message.reply("No recent reaction removals found.");
        }

        if (cmd === "clearsnipe") {
            snipeCache.delete(message.channel.id);
            editSnipeCache.delete(message.channel.id);
            return message.reply(`${emojis.SUCCESS} Snipes cleared for this channel.`);
        }
    }
};
