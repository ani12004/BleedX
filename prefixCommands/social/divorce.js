import { EmbedBuilder } from "discord.js";
import { getEconomy, updateEconomy } from "../../utils/database.js";

export default {
    name: "divorce",
    description: "Divorce your partner.",
    async execute(message, args) {
        const user = await getEconomy(message.author.id);

        if (!user.partner_id) return message.reply("You are not married!");

        const partnerId = user.partner_id;

        updateEconomy(message.author.id, { partner_id: null, marriage_time: null });
        updateEconomy(partnerId, { partner_id: null, marriage_time: null });

        const embed = new EmbedBuilder()
            .setColor("Grey")
            .setDescription(`💔 **${message.author.username}** has divorced their partner.`);

        message.channel.send({ embeds: [embed] });
    },
};
