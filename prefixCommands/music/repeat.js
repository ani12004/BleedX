
import emojis from "../../utils/emojis.js";

export default {
    name: "repeat",
    description: "Change the current loop mode",
    permissions: [],
    aliases: ["loop"],
    async execute(message, args, client) {
        const queue = client.distube.getQueue(message);
        if (!queue) return message.reply(`${emojis.ERROR} Nothing is playing.`);

        const mode = client.distube.setRepeatMode(queue);
        // Returns new mode: 0 = disabled, 1 = song, 2 = queue
        const map = ["Disabled", "Song", "Queue"];
        message.reply(`${emojis.SUCCESS} Repeat mode set to: **${map[mode]}**`);
    }
};