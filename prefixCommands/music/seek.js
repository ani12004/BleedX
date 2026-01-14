
import emojis from "../../utils/emojis.js";

export default {
    name: "fastforward",
    description: "Fast forward to a desired position",
    permissions: [],
    aliases: ["rewind", "seek"],
    async execute(message, args, client) {
        const queue = client.distube.getQueue(message);
        if (!queue) return message.reply(`${emojis.ERROR} Nothing is playing.`);
        
        const time = parseInt(args[0]);
        if (!time) return message.reply("Usage: ,seek [seconds]");
        
        queue.seek(queue.currentTime + time);
        message.reply(`${emojis.SUCCESS} Seeked to ${queue.formattedCurrentTime}`);
    }
};