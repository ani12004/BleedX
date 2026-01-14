import { Client, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for .env loading if run from root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '../.env') });

const client = new Client({ intents: [] });

client.once('ready', async () => {
    console.log("Logged in as " + client.user.tag);
    console.log("Fetching application emojis...");
    try {
        const emojis = await client.application.emojis.fetch();
        console.log("--- START EMOJI LIST ---");
        emojis.forEach(e => {
            console.log(`${e.name}|<:${e.name}:${e.id}>`);
        });
        console.log("--- END EMOJI LIST ---");
    } catch (e) {
        console.error("Error fetching emojis:", e);
    }
    process.exit(0);
});

client.login(process.env.DISCORD_TOKEN);
