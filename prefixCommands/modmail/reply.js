import { EmbedBuilder, PermissionsBitField } from "discord.js";
import db from "../../utils/database.js";

export default {
    name: "reply",
    description: "Reply to the user in the active ticket.",
    permissions: [PermissionsBitField.Flags.ManageMessages],
    async execute(message, args, client) {
        const ticket = db.prepare('SELECT * FROM tickets WHERE channel_id = ? AND closed = 0').get(message.channel.id);

        if (!ticket) {
            return message.reply("❌ This is not an active ticket channel.");
        }

        const content = args.join(" ");
        if (!content && message.attachments.size === 0) {
            return message.reply("❌ Please provide a message or attachment to send.");
        }

        const user = await client.users.fetch(ticket.user_id).catch(() => null);
        if (!user) {
            return message.reply("❌ User not found or has blocked the bot.");
        }

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(content || "*Attachment/No Content*")
            .setTimestamp();

        if (ticket.anonymous) {
            embed.setAuthor({ name: "Staff Team", iconURL: message.guild.iconURL() });
        } else {
            embed.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() });
        }

        if (message.attachments.size > 0) {
            embed.setImage(message.attachments.first().url);
        }

        try {
            await user.send({ embeds: [embed] });
            message.react('✅');
        } catch (error) {
            message.reply("❌ Failed to send message. User might have DMs disabled.");
        }
    },
};
