
import emojis from "../../utils/emojis.js";

export default {
    name: "shuffle",
    description: "Shuffle the queue",
    permissions: [],
    async execute(message, args, client) {
        const queue = client.distube.getQueue(message);
        if (!queue) return message.reply(`${emojis.ERROR} Nothing is playing.`);
        await queue.shuffle();
        message.reply(`${emojis.SUCCESS} Shuffled.`);
    }
};