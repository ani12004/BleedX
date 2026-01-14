
import emojis from "../../utils/emojis.js";
export default {
    name: "duckduckgo",
    description: "Search DDG",
    permissions: [],
    aliases: ["ddg"],
    async execute(message, args) {
        const query = args.join(" ");
        if (!query) return message.reply("Provide a query.");
        message.reply(`Search results for **${query}**: https://duckduckgo.com/?q=${encodeURIComponent(query)}`);
    }
};