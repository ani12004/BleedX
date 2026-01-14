import { Events, EmbedBuilder } from "discord.js";
import { getGuildConfig } from "../utils/database.js";

export default {
    name: Events.GuildRoleCreate,
    async execute(role) {
        const config = await getGuildConfig(role.guild.id);

        // --- ANTINUKE ROLE CREATE PROTECTION ---
        if (config.antinuke_role) {
            // Stub: Limit role creation rate
        }

        // --- LOGGING ---
        if (config.mod_log_channel) {
            const logChannel = role.guild.channels.cache.get(config.mod_log_channel);
            if (logChannel) {
                logChannel.send(`🛡️ **Role Created**: ${role.name}`).catch(() => { });
            }
        }
    }
};
