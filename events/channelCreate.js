import { Events, EmbedBuilder } from "discord.js";
import { getGuildConfig } from "../utils/database.js";

export default {
    name: Events.ChannelCreate,
    async execute(channel) {
        if (!channel.guild) return;
        const config = await getGuildConfig(channel.guild.id);

        // --- ANTINUKE CHANNEL CREATE PROTECTION ---
        if (config.antinuke_channel) {
            // Stub: Limit channel creation rate
        }

        // --- LOGGING ---
        if (config.mod_log_channel) {
            const logChannel = channel.guild.channels.cache.get(config.mod_log_channel);
            if (logChannel) {
                logChannel.send(`📗 **Channel Created**: #${channel.name}`).catch(() => { });
            }
        }
    }
};
