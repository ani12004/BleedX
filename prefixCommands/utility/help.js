import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { getGuildConfig } from "../../utils/database.js";

export default {
  name: "help",
  description: "Displays a list of available commands.",
  aliases: ["h", "commands"],
  async execute(message, args, client) {
    const config = getGuildConfig(message.guild.id);
    const prefix = config.prefix || "s?";

    const embed = new EmbedBuilder()
      .setColor("#5865F2") // Blurple (Premium Default)
      .setTitle("Command Directory")
      .setDescription(`> **Prefix:** \`${prefix}\`\n> Use \`${prefix}help <command>\` for details.`)
      .setThumbnail(client.user.displayAvatarURL());

    const categories = new Map();

    const seenCommands = new Set();

    client.prefixCommands.forEach((cmd) => {
      if (seenCommands.has(cmd.name)) return;
      seenCommands.add(cmd.name);

      const category = cmd.category ? cmd.category.charAt(0).toUpperCase() + cmd.category.slice(1) : "Other";
      if (category === "Modmail") return; // Skip disabled category
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category).push(`\`${cmd.name}\``);
    });

    const sortedCategories = [...categories.keys()].sort();

    for (const category of sortedCategories) {
      const commands = categories.get(category).join(", ");
      embed.addFields({ name: `${getCategoryEmoji(category)} ${category}`, value: commands });
    }

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel("Support Server")
          .setStyle(ButtonStyle.Link)
          .setURL("https://discord.gg/tN5MvnTTXK")
      );

    message.channel.send({ embeds: [embed], components: [row] });
  },
};

function getCategoryEmoji(category) {
  const emojis = {
    Moderation: "<:moderator:123456789>", // Placeholder or use standard if ID unknown
    Utility: "🛠️",
    Economy: "💳",
    Leveling: "📊",
    Fun: "🎮",
    Image: "🖼️",
    Giveaway: "🎉",
    Tickets: "📩",
    Admin: "🔒",
    Info: "ℹ️"
  };
  return emojis[category] || "🔹";
}
// Note: User asked for "Source inspiration from emoji.gg style emojis". 
// Since I don't have custom emoji IDs for this server, I'll stick to high-quality standard or generic "Blue" emojis where possible.
// Reverting to standard high-quality Unicode for stability.
