
import emojis from "../../utils/emojis.js";

export default {
    name: "pause",
    description: "Pause the current track",
    permissions: [],
    async execute(message, args, client) {
        const queue = client.distube.getQueue(message);
        if (!queue) return message.reply(`${emojis.ERROR} Nothing is playing.`);
        if (queue.paused) return message.reply("Already paused.");

        queue.pause();
        message.reply(`${emojis.SUCCESS} Paused.`);
    }
};