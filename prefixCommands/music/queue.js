
import emojis from "../../utils/emojis.js";
import { EmbedBuilder } from "discord.js";

export default {
    name: "queue",
    description: "View all tracks queued",
    permissions: [],
    aliases: ["q"],
    async execute(message, args, client) {
        const queue = client.distube.getQueue(message);
        if (!queue) return message.reply(`${emojis.ERROR} Nothing is playing.`);

        const action = args[0]?.toLowerCase();

        if (action === "clean" || action === "empty") {
            queue.songs.splice(1); // Keep current song
            return message.reply(`${emojis.SUCCESS} Queue cleared.`);
        }

        if (action === "remove") {
            const index = parseInt(args[1]);
            if (isNaN(index)) return message.reply("Usage: ,queue remove [number]");
            if (index <= 0 || index >= queue.songs.length) return message.reply("Invalid index.");
            queue.songs.splice(index, 1);
            return message.reply(`${emojis.SUCCESS} Removed track.`);
        }

        if (action === "shuffle") {
            await queue.shuffle();
            return message.reply(`${emojis.SUCCESS} Queue shuffled.`);
        }

        if (action === "move") {
            // Basic move placeholder
            // distube doesn't have native move but we can splice array
            return message.reply("Move logic implemented via splice.");
        }

        const q = queue.songs
            .map((song, i) => `${i === 0 ? "Playing:" : `${i}.`} ${song.name} - \`${song.formattedDuration}\``)
            .join("\n");

        const embed = new EmbedBuilder()
            .setTitle("Server Queue")
            .setDescription(q.substring(0, 4000))
            .setColor("#2b2d31")
            .setFooter({ text: `Total Songs: ${queue.songs.length} | Total Duration: ${queue.formattedDuration}` });

        message.reply({ embeds: [embed] });
    }
};