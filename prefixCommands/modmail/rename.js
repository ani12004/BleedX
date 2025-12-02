import { PermissionsBitField } from "discord.js";
import db from "../../utils/database.js";

export default {
    name: "rename",
    description: "Rename the ticket channel.",
    permissions: [PermissionsBitField.Flags.ManageMessages],
    async execute(message, args, client) {
        const ticket = db.prepare('SELECT * FROM tickets WHERE channel_id = ? AND closed = 0').get(message.channel.id);

        if (!ticket) {
            return message.reply("❌ This is not an active ticket channel.");
        }

        const newName = args.join("-");
        if (!newName) {
            return message.reply("❌ Please provide a new name.");
        }

        await message.channel.setName(newName);
        message.reply(`✅ Channel renamed to **${newName}**.`);
    },
};
