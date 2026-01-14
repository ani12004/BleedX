
import emojis from "../../utils/emojis.js";

export default {
    name: "skip",
    description: "Skip to the next track",
    permissions: [],
    aliases: ["s"],
    async execute(message, args, client) {
        const queue = client.distube.getQueue(message);
        if (!queue) return message.reply(`${emojis.ERROR} Nothing is playing.`);

        try {
            await queue.skip();
            message.react('⏭️');
        } catch (e) {
            message.reply(`${emojis.ERROR} ${e.message}`);
        }
    }
};