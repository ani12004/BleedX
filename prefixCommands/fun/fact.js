import fetch from "node-fetch";
import { EmbedBuilder } from "discord.js";

export default {
    name: "fact",
    description: "Get a random useless fact.",
    async execute(message, args, client) {
        try {
            const response = await fetch("https://uselessfacts.jsph.pl/random.json?language=en");
            const data = await response.json();

            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("🧠 Random Fact")
                .setDescription(data.text)
                .setFooter({ text: "Powered by uselessfacts.jsph.pl" });

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Fact command error:", error);
            message.reply("Couldn't fetch a fact right now. Try again later!");
        }
    },
};
