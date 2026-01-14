import { Events, EmbedBuilder } from "discord.js";
import { getGuildConfig } from "../utils/database.js";

export default {
    name: Events.MessageReactionAdd,
    async execute(reaction, user, client) {
        if (user.bot) return;
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                return;
            }
        }

        const message = reaction.message;
        const guildId = message.guild.id;
        const config = await getGuildConfig(guildId);

        // --- REACTION ROLES ---
        // (Stub logic: In a real app, you'd fetch from a 'reaction_roles' table matching msgId + emoji)
        // const rr = await db.from('reaction_roles').select('*').eq('message_id', message.id).eq('emoji', reaction.emoji.name).single();
        // if (rr) { member.roles.add(rr.role_id); }

        // --- STARBOARD ---
        if (config.starboard_enabled) {
            // Helper to extract ID from "<:name:id>" or use raw unicode
            const defaultStar = "⭐"; // Fallback
            // But we want to use the Custom Emoji from utils if possible?
            // The config usually stores the string. 
            // If config is null, use logic to compare vs emojis.STAR

            // For checking reaction equality:
            // Custom emojis: reaction.emoji.id
            // Unicode emojis: reaction.emoji.name

            const targetEmojiStr = config.starboard_emoji || "⭐";
            let isMatch = false;

            if (targetEmojiStr.startsWith("<:")) {
                const targetId = targetEmojiStr.split(":")[2].replace(">", "");
                if (reaction.emoji.id === targetId) isMatch = true;
            } else {
                if (reaction.emoji.name === targetEmojiStr) isMatch = true;
            }

            if (isMatch) {
                const threshold = config.starboard_threshold || 3;
                if (reaction.count >= threshold) {
                    const sbChannelId = config.starboard_channel;
                    if (sbChannelId) {
                        const sbChannel = message.guild.channels.cache.get(sbChannelId);
                        if (sbChannel) {
                            const embed = new EmbedBuilder()
                                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                                .setDescription(message.content || "Image/Attachment")
                                .setColor(config.starboard_color || "#FFD700")
                                .addFields({ name: "Source", value: `[Jump](${message.url})` })
                                .setFooter({ text: `${reaction.count} | ${message.id}` }) // Simplify footer
                                .setTimestamp();

                            if (message.attachments.first()) {
                                embed.setImage(message.attachments.first().url);
                            }
                            sbChannel.send({ content: `${targetEmojiStr} **${reaction.count}** | <#${message.channel.id}>`, embeds: [embed] });
                        }
                    }
                }
            }
        }

        // --- CLOWNBOARD ---
        if (config.clownboard_enabled) {
            const targetEmojiStr = config.clownboard_emoji || "🤡";
            let isMatch = false;

            if (targetEmojiStr.startsWith("<:")) {
                const targetId = targetEmojiStr.split(":")[2].replace(">", "");
                if (reaction.emoji.id === targetId) isMatch = true;
            } else {
                if (reaction.emoji.name === targetEmojiStr) isMatch = true;
            }

            if (isMatch) {
                const threshold = config.clownboard_threshold || 3;
                if (reaction.count >= threshold) {
                    const cbChannelId = config.clownboard_channel;
                    if (cbChannelId) {
                        const cbChannel = message.guild.channels.cache.get(cbChannelId);
                        if (cbChannel) {
                            const embed = new EmbedBuilder()
                                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                                .setDescription(message.content || "Image/Attachment")
                                .setColor(config.clownboard_color || "#FF0000")
                                .addFields({ name: "Source", value: `[Jump](${message.url})` })
                                .setFooter({ text: `${reaction.count} | ${message.id}` })
                                .setTimestamp();

                            if (message.attachments.first()) {
                                embed.setImage(message.attachments.first().url);
                            }
                            cbChannel.send({ content: `${targetEmojiStr} **${reaction.count}** | <#${message.channel.id}>`, embeds: [embed] });
                        }
                    }
                }
            }
        }
    }
};
