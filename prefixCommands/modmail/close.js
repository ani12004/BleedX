import { PermissionsBitField, EmbedBuilder } from "discord.js";
import db from "../../utils/database.js";

export default {
    name: "close",
    description: "Close the ticket channel & delete it.",
    permissions: [PermissionsBitField.Flags.ManageMessages],
    async execute(message, args, client) {
        const ticket = db.prepare('SELECT * FROM tickets WHERE channel_id = ? AND closed = 0').get(message.channel.id);

        if (!ticket) {
            return message.reply("❌ This is not an active ticket channel.");
        }

        message.channel.send("🔒 Closing ticket in 5 seconds...");

        // Notify user
        const user = await client.users.fetch(ticket.user_id).catch(() => null);
        if (user) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Ticket Closed")
                .setDescription(`Your ticket in **${message.guild.name}** has been closed by staff.`)
                .setTimestamp();
            user.send({ embeds: [embed] }).catch(() => { });
        }

        // Update DB
        db.prepare('UPDATE tickets SET closed = 1 WHERE ticket_id = ?').run(ticket.ticket_id);

        setTimeout(() => {
            message.channel.delete().catch(() => { });
        }, 5000);
    },
};
