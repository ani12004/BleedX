
import { PermissionsBitField, EmbedBuilder } from "discord.js";
import db from "../../utils/database.js";
import emojis from "../../utils/emojis.js";

export default {
    name: "autoresponder",
    description: "Set up automatic replies",
    permissions: [PermissionsBitField.Flags.ManageGuild],
    aliases: ["ar"],
    async execute(message, args) {
        const subcommand = args[0]?.toLowerCase();
        const guildId = message.guild.id;

        if (!subcommand) {
             return message.reply("Usage: ,ar [add/remove/list/update/reset] ...");
        }

        if (subcommand === "add") {
            const trigger = args[1];
            const reply = args.slice(2).join(" ");
            if (!trigger || !reply) return message.reply("Usage: ,ar add [trigger] [reply]");

            const { error } = await db.from('autoresponders').insert({ guild_id: guildId, trigger, reply });
            if (error) return message.reply(`${emojis.ERROR} Failed to add: ${error.message}`);
            
            return message.reply(`${emojis.SUCCESS} Added autoresponder for **${trigger}**`);
        }

        if (subcommand === "remove") {
             const trigger = args[1];
             if (!trigger) return message.reply("Usage: ,ar remove [trigger]");
             
             const { error } = await db.from('autoresponders').delete().match({ guild_id: guildId, trigger });
             if (error) return message.reply(`${emojis.ERROR} Error: ${error.message}`);
             
             return message.reply(`${emojis.SUCCESS} Removed autoresponder **${trigger}**`);
        }

        if (subcommand === "list") {
             const { data } = await db.from('autoresponders').select('*').eq('guild_id', guildId);
             if (!data || data.length === 0) return message.reply("No autoresponders set.");
             
             const list = data.map(ar => `• **${ar.trigger}**: ${ar.reply.substring(0, 50)}...`).join("\n");
             const embed = new EmbedBuilder().setTitle("Autoresponders").setDescription(list).setColor("#2b2d31");
             return message.reply({ embeds: [embed] });
        }
        
        if (subcommand === "reset") {
            await db.from('autoresponders').delete().eq('guild_id', guildId);
            return message.reply(`${emojis.SUCCESS} All autoresponders cleared.`);
        }

        return message.reply("Usage: ,ar [add/remove/list/update/reset]");
    }
};