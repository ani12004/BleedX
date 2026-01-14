
import emojis from "../../utils/emojis.js";

// Map presets to distube filters
const filters = {
    "nightcore": "nightcore",
    "vaporwave": "vaporwave",
    "bassboost": "bassboost", // mapped to 'boost'
    "boost": "bassboost",
    "karaoke": "karaoke",
    "flat": "off", // special case
    "chipmunk": "chipmunk", // requires custom filter? Distube standard: 3d, bassboost, echo, karaoke, nightcore, vaporwave, flanger, gate, haas, reverse, surround, mcompand, phaser, tremolo, earwax
    "soft": "mcompand", // approx
    "vibrato": "tremolo",
    "8d": "surround", // approx
    "metal": "flanger" // approx
};

export default {
    name: "preset",
    description: "Use a preset for Music",
    permissions: [],
    aliases: ["filters"],
    async execute(message, args, client) {
         const queue = client.distube.getQueue(message);
        if (!queue) return message.reply(`${emojis.ERROR} Nothing is playing.`);

        const preset = args[0]?.toLowerCase();
        if (!preset) return message.reply("Usage: ,preset [nightcore/vaporwave/karaoke/flat/boost/vibrato/8d/metal]");

        if (preset === "active" || preset === "list") {
             return message.reply(`Active filters: ${queue.filters.names.join(", ") || "None"}`);
        }

        if (preset === "flat") {
            queue.filters.clear();
            return message.reply(`${emojis.SUCCESS} All filters cleared.`);
        }

        const filterName = filters[preset] || preset; // Allow direct access if mapped

        // Check if valid filter in distube
        // For simplicity we try to add it
        try {
            if (queue.filters.names.includes(filterName)) {
                queue.filters.remove(filterName);
                message.reply(`${emojis.SUCCESS} Disabled ${preset}.`);
            } else {
                queue.filters.add(filterName);
                message.reply(`${emojis.SUCCESS} Enabled ${preset}.`);
            }
        } catch (e) {
            message.reply(`${emojis.ERROR} Invalid preset. Available: nightcore, vaporwave, boost, karaoke, soft, vibrato, 8d, metal.`);
        }
    }
};