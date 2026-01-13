import { EmbedBuilder, version } from "discord.js";
import os from "os";

export default {
    name: "botinfo",
    description: "Displays information about the bot.",
    aliases: ["bi", "stats"],
    async execute(message, args, client) {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor(uptime / 3600) % 24;
        const minutes = Math.floor(uptime / 60) % 60;
        const seconds = Math.floor(uptime % 60);

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("System Diagnostics")
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: "Identity", value: `**Name:** ${client.user.tag}\n**ID:** ${client.user.id}`, inline: true },
                { name: "Statistics", value: `**Servers:** ${client.guilds.cache.size}\n**Users:** ${client.users.cache.size}`, inline: true },
                { name: "System", value: `**Uptime:** ${days}d ${hours}h ${minutes}m\n**Mem:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true }
            )
            .setFooter({ text: "Imperium • System Operational" });

        message.channel.send({ embeds: [embed] });
    },
};
