
import emojis from "../../utils/emojis.js";

export default {
    name: "volume",
    description: "Change the volume",
    permissions: [],
    aliases: ["vol"],
    async execute(message, args, client) {
        const queue = client.distube.getQueue(message);
        if (!queue) return message.reply(`${emojis.ERROR} Nothing is playing.`);

        const volume = parseInt(args[0]);
        if (isNaN(volume)) return message.reply(`Current Volume: ${queue.volume}%`);

        queue.setVolume(volume);
        message.reply(`${emojis.SUCCESS} Volume set to ${volume}%`);
    }
};