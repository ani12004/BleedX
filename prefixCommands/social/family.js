import { EmbedBuilder } from "discord.js";
import { getEconomy } from "../../utils/database.js";

export default {
    name: "family",
    description: "View your family tree.",
    aliases: ["fam"],
    async execute(message, args, client) {
        const target = message.mentions.users.first() || message.author;
        const user = getEconomy(target.id);

        let partnerName = "None";
        if (user.partner_id) {
            const partner = await client.users.fetch(user.partner_id).catch(() => null);
            partnerName = partner ? partner.username : "Unknown";
        }

        let parentName = "None";
        if (user.parent_id) {
            const parent = await client.users.fetch(user.parent_id).catch(() => null);
            parentName = parent ? parent.username : "Unknown";
        }

        const childrenIds = JSON.parse(user.children || '[]');
        let childrenNames = "None";

        if (childrenIds.length > 0) {
            const names = [];
            for (const id of childrenIds) {
                const child = await client.users.fetch(id).catch(() => null);
                if (child) names.push(child.username);
            }
            if (names.length > 0) childrenNames = names.join(", ");
        }

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle(`${target.username}'s Family Tree 🌳`)
            .setThumbnail(target.displayAvatarURL())
            .addFields(
                { name: "👪 Parent", value: parentName, inline: true },
                { name: "💍 Partner", value: partnerName, inline: true },
                { name: "👶 Children", value: childrenNames, inline: false }
            );

        message.channel.send({ embeds: [embed] });
    },
};
