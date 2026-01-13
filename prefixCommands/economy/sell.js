import { EmbedBuilder } from "discord.js";
import { getInventory, removeItem, getEconomy, updateEconomy } from "../../utils/database.js";
import { getAnimal, animals } from "../../utils/animals.js";
import { checkRules } from "../../utils/checkRules.js";

export default {
    name: "sell",
    description: "Sell animals from your zoo.",
    async execute(message, args) {
        if (!await checkRules(message, message.author.id)) return;

        const type = args[0]?.toLowerCase();

        if (!type) {
            return message.reply("Usage: `s?sell <animal_name|all>`");
        }

        const inventory = getInventory(message.author.id);
        if (!inventory || inventory.length === 0) {
            return message.reply("You don't have anything to sell.");
        }

        let totalEarned = 0;
        let soldCount = 0;

        if (type === "all") {
            for (const item of inventory) {
                const animal = getAnimal(item.item_id);
                if (animal) {
                    const earnings = animal.price * item.count;
                    totalEarned += earnings;
                    soldCount += item.count;
                    removeItem(message.author.id, item.item_id, item.count);
                }
            }

            if (soldCount === 0) return message.reply("Nothing to sell.");

        } else {
            // Find animal by name (partial match)
            const animal = animals.find(a => a.name.toLowerCase().includes(type) || a.id === type);
            if (!animal) return message.reply("❌ Animal not found.");

            const item = inventory.find(i => i.item_id === animal.id);
            if (!item) return message.reply(`❌ You don't have any **${animal.name}**.`);

            // Sell all of that type
            const earnings = animal.price * item.count;
            totalEarned = earnings;
            soldCount = item.count;
            removeItem(message.author.id, animal.id, item.count);
        }

        const user = await getEconomy(message.author.id);
        updateEconomy(message.author.id, { balance: user.balance + totalEarned });

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`💰 You sold **${soldCount}** animals for **$${totalEarned}**!`);

        message.channel.send({ embeds: [embed] });
    },
};
