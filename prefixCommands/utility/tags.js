
import { PermissionsBitField, EmbedBuilder } from "discord.js";
import db from "../../utils/database.js";
import emojis from "../../utils/emojis.js";

export default {
    name: "tags",
    description: "Manage tags",
    permissions: [], // Everyone can view, specific perms for add handled inside
    aliases: ["tag"],
    async execute(message, args) {
        const subcommand = args[0]?.toLowerCase();
        const guildId = message.guild.id;

        if (!subcommand) return message.reply("Usage: ,tags [add/remove/list/edit/search/author] [name]");

        // ,tag name (View tag)
        if (!["add", "remove", "list", "edit", "search", "author", "reset", "random", "rename"].includes(subcommand)) {
             const tagName = subcommand;
             const { data } = await db.from('tags').select('*').match({ guild_id: guildId, name: tagName }).single();
             if (data) {
                 return message.reply(data.content);
             }
             return message.reply(`${emojis.ERROR} Tag not found.`);
        }

        if (subcommand === "add" || subcommand === "create") {
            if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return message.reply("Missing Permissions.");
            const name = args[1];
            const content = args.slice(2).join(" ");
            if (!name || !content) return message.reply("Usage: ,tags add [name] [content]");
            
            const { error } = await db.from('tags').insert({
                guild_id: guildId,
                name,
                content,
                author_id: message.author.id,
                created_at: Date.now()
            });
            if (error) return message.reply(`${emojis.ERROR} Failed (maybe duplicate?): ${error.message}`);
            return message.reply(`${emojis.SUCCESS} Tag **${name}** created.`);
        }

        if (subcommand === "remove" || subcommand === "delete") {
            if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return message.reply("Missing Permissions.");
             const name = args[1];
             if (!name) return message.reply("Usage: ,tags remove [name]");
             
             const { error } = await db.from('tags').delete().match({ guild_id: guildId, name });
             if (error) return message.reply(`${emojis.ERROR} Error: ${error.message}`);
             return message.reply(`${emojis.SUCCESS} Tag **${name}** deleted.`);
        }
        
         if (subcommand === "list") {
             const { data } = await db.from('tags').select('name').eq('guild_id', guildId);
             if (!data || data.length === 0) return message.reply("No tags.");
             return message.reply(`Tags: ${data.map(t => t.name).join(", ")}`);
        }

        return message.reply("Usage: ,tags [add/remove/list/edit/search/author] [name]");
    }
};