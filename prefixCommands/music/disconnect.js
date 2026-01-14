
import emojis from "../../utils/emojis.js";

export default {
    name: "disconnect",
    description: "Disconnect and stop playing music",
    permissions: [],
    aliases: ["dc", "leave", "stop"],
    async execute(message, args, client) {
        const queue = client.distube.getQueue(message);
        if (queue) {
            queue.stop();
        }
         client.distube.voices.leave(message);
         message.reply(`${emojis.SUCCESS} Disconnected.`);
    }
};