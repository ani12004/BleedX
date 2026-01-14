
import emojis from "../../utils/emojis.js";
export default {
    name: "giphy",
    description: "Search Giphy",
    permissions: [],
    aliases: ["gif"],
    async execute(message, args) {
        const query = args.join(" ");
        if (!query) return message.reply("Provide a query.");
        // Mock result as we don't have API key inserted
        message.reply(`Here is a GIF for **${query}**: https://giphy.com/explore/${encodeURIComponent(query)}`);
    }
};