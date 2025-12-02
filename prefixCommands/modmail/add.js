import { PermissionsBitField } from "discord.js";
import db from "../../utils/database.js";

export default {
    name: "add",
    description: "Add a user to the modmail ticket channel.",
    permissions: [PermissionsBitField.Flags.ManageMessages],
    async execute(message, args, client) {
        const ticket = db.prepare('SELECT * FROM tickets WHERE channel_id = ? AND closed = 0').get(message.channel.id);

        if (!ticket) {
            return message.reply("❌ This is not an active ticket channel.");
        }

        const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
        if (!user) {
            return message.reply("❌ Please mention a user or provide a valid ID.");
        }

        await message.channel.permissionOverwrites.edit(user.id, {
            ViewChannel: true,
            SendMessages: true
        });

        message.reply(`✅ Added ${user} to the ticket.`);
    },
};
