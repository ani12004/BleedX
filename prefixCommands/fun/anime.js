
import { EmbedBuilder } from "discord.js";
// import fetch from "node-fetch";

export default {
    name: "anime",
    description: "Search Anime",
    permissions: [],
    aliases: ["mal"],
    async execute(message, args) {
        const query = args.join(" ");
        if (!query) return message.reply("Provide a name.");
        
        // Real logic would fetch Jikan API
        // const res = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=1`);
        // const data = await res.json();
        
        message.reply(`Found Anime: **${query}** (Search initiated)`);
    }
};