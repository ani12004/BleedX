import { EmbedBuilder } from "discord.js";
import { getEconomy, updateEconomy } from "../../utils/database.js";

export default {
    name: "disown",
    description: "Disown a child.",
    async execute(message, args) {
        const target = message.mentions.users.first();
        if (!target) return message.reply("You need to mention the child to disown.");

        const parent = await getEconomy(message.author.id);
        const currentChildren = JSON.parse(parent.children || '[]');

        if (!currentChildren.includes(target.id)) {
            return message.reply("That user is not your child!");
        }

        // Remove from parent
        const newChildren = currentChildren.filter(id => id !== target.id);
        updateEconomy(message.author.id, { children: JSON.stringify(newChildren) });

        // Remove from child
        updateEconomy(target.id, { parent_id: null });

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`💔 **${message.author.username}** has disowned **${target.username}**.`);

        message.channel.send({ embeds: [embed] });
    },
};
