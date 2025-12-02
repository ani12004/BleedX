import { PermissionsBitField } from "discord.js";
import db from "../../utils/database.js";

export default {
    name: "anon",
    aliases: ["a", "af"],
    description: "Toggle anonymous mode for the ticket.",
    permissions: [PermissionsBitField.Flags.ManageMessages],
    async execute(message, args, client) {
        const ticket = db.prepare('SELECT * FROM tickets WHERE channel_id = ? AND closed = 0').get(message.channel.id);

        if (!ticket) {
            return message.reply("❌ This is not an active ticket channel.");
        }

        const commandName = message.content.split(" ")[0].slice(2).toLowerCase(); // s?a or s?af
        const isAnon = commandName === "a";

        db.prepare('UPDATE tickets SET anonymous = ? WHERE ticket_id = ?').run(isAnon ? 1 : 0, ticket.ticket_id);

        if (isAnon) {
            message.reply("🕵️ **Anonymous Mode Enabled.** Your identity will be hidden in replies.");
        } else {
            message.reply("👤 **Anonymous Mode Disabled.** Your identity will be shown in replies.");
        }
    },
};
