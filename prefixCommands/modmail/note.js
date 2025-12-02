import { EmbedBuilder, PermissionsBitField } from "discord.js";
import db from "../../utils/database.js";

export default {
    name: "note",
    description: "Add an internal staff-only note inside the ticket.",
    permissions: [PermissionsBitField.Flags.ManageMessages],
    async execute(message, args, client) {
        const ticket = db.prepare('SELECT * FROM tickets WHERE channel_id = ? AND closed = 0').get(message.channel.id);

        if (!ticket) {
            return message.reply("❌ This is not an active ticket channel.");
        }

        const note = args.join(" ");
        if (!note) {
            return message.reply("❌ Please provide a note.");
        }

        const embed = new EmbedBuilder()
            .setColor("Yellow")
            .setAuthor({ name: `Note by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setDescription(note)
            .setTimestamp();

        message.delete().catch(() => { });
        message.channel.send({ embeds: [embed] });
    },
};
