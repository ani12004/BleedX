
import emojis from "../../utils/emojis.js";
export default {
    name: "choose",
    description: "Pick from choices",
    permissions: [],
    aliases: ["pick"],
    async execute(message, args) {
        if (args.length < 2) return message.reply("Give me at least two choices!");
        const choice = args[Math.floor(Math.random() * args.length)];
        message.reply(`I choose: **${choice}**`);
    }
};