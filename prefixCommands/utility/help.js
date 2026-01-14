import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType, ButtonBuilder, ButtonStyle } from "discord.js";
import { getGuildConfig } from "../../utils/database.js";
import emojis from "../../utils/emojis.js";

export default {
  name: "help",
  description: "Displays a list of available commands via an interactive menu.",
  aliases: ["h", "commands", "menu"],
  async execute(message, args, client) {
    const config = await getGuildConfig(message.guild.id);
    const prefix = config.prefix || ",";

    // 1. Group commands by category
    const categories = new Map();
    const seenCommands = new Set(); // To avoid duplicates from aliases if internally stored that way (though map keys are unique, value objects are same)

    client.prefixCommands.forEach((cmd) => {
      // We iterate the map, which might have aliases as keys.
      // We only want unique command objects.
      if (seenCommands.has(cmd.name)) return;
      seenCommands.add(cmd.name);

      const rawCategory = cmd.category || "Other";
      const category = rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1);

      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category).push(cmd);
    });

    const sortedCategories = [...categories.keys()].sort();

    // 2. Create the Select Menu
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('help_category_select')
      .setPlaceholder('Select a category to view commands')
      .addOptions(
        sortedCategories.map(cat =>
          new StringSelectMenuOptionBuilder()
            .setLabel(cat)
            .setValue(cat)
            .setEmoji(getCategoryEmoji(cat))
            .setDescription(`View ${categories.get(cat).length} commands`)
        )
      );

    // 3. Create Home Embed
    const homeEmbed = new EmbedBuilder()
      .setColor("#5865F2")
      .setTitle(`Imperium Command Directory`)
      .setDescription(`Hello **${message.author.username}**! \n\nI am **Imperium**, an advanced multipurpose bot. Use the menu below to explore my commands.\n\n**Info:**\n> **Prefix:** \`${prefix}\`\n> **Total Commands:** \`${seenCommands.size}\`\n> **Categories:** \`${sortedCategories.length}\``)
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({ text: "Use the dropdown below to browse categories", iconURL: message.guild.iconURL() });

    // Add Support Button
    const buttonRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel("Support Server")
          .setStyle(ButtonStyle.Link)
          .setURL("https://discord.gg/tN5MvnTTXK")
      );

    const menuRow = new ActionRowBuilder().addComponents(selectMenu);

    const initialMessage = await message.channel.send({
      embeds: [homeEmbed],
      components: [menuRow, buttonRow]
    });

    // 4. Collector
    const collector = initialMessage.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 60000 * 5 // 5 minutes
    });

    collector.on('collect', async (interaction) => {
      if (interaction.user.id !== message.author.id) {
        return interaction.reply({ content: `❌ Only ${message.author} can use this menu.`, ephemeral: true });
      }

      const selectedCategory = interaction.values[0];
      const commands = categories.get(selectedCategory);

      // Format commands list
      const commandList = commands.map(cmd => `\`${cmd.name}\``).join(", ");

      const categoryEmbed = new EmbedBuilder()
        .setColor("#5865F2")
        .setTitle(`${getCategoryEmoji(selectedCategory)} ${selectedCategory} Commands`)
        .setDescription(`**Prefix:** \`${prefix}\`\n\n${commandList}`)
        .setFooter({ text: `Page ${sortedCategories.indexOf(selectedCategory) + 1}/${sortedCategories.length}`, iconURL: client.user.displayAvatarURL() });

      await interaction.update({ embeds: [categoryEmbed] });
    });

    collector.on('end', () => {
      // Disable components on timeout
      const disabledMenu = StringSelectMenuBuilder.from(selectMenu).setDisabled(true);
      const disabledRow = new ActionRowBuilder().addComponents(disabledMenu);
      initialMessage.edit({ components: [disabledRow, buttonRow] }).catch(() => { });
    });
  },
};

function getCategoryEmoji(category) {
  // Normalize category for matching
  const cat = category.toLowerCase();

  // Map based on folder names or display names
  if (cat.includes("admin")) return emojis.LOCK || "🔒";
  if (cat.includes("config")) return emojis.LOCK || "⚙️"; // Fallback to gear
  if (cat.includes("economy")) return emojis.COIN || "💰";
  if (cat.includes("emote")) return emojis.STAR || "⭐";
  if (cat.includes("fun")) return emojis.DICE || "🎲";
  if (cat.includes("giveaway")) return emojis.TROPHY || "🎉";
  if (cat.includes("image")) return emojis.STAR || "🖼️";
  if (cat.includes("level")) return emojis.TROPHY || "📈";
  if (cat.includes("mod")) return emojis.SHIELD || "🛡️";
  if (cat.includes("owner")) return emojis.STAFF || "👑";
  if (cat.includes("role")) return emojis.SHIELD || "🎭";
  if (cat.includes("social")) return emojis.HEART || "❤️";
  if (cat.includes("ticket")) return emojis.TICKET || "🎫";
  if (cat.includes("utility")) return emojis.PING || "🛠️";
  if (cat.includes("voice")) return emojis.PING || "🔊";

  return emojis.STAR || "✨";
}
