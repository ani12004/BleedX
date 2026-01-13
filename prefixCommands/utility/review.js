export default {
  name: "review",

  async execute(message, args, client) {
    const review = args.join(" ");
    if (!review) return message.reply("❌ Please type your review.");

    const targetChannelId = '1445657963640651877';
    // const targetChannelId = 'YOUR_CHANNEL_ID'; // Testing

    try {
      const targetChannel = await client.channels.fetch(targetChannelId).catch(() => null);

      if (targetChannel) {
        const { EmbedBuilder } = await import('discord.js');
        const embed = new EmbedBuilder()
          .setColor("#F47FFF") // Pink/Purple
          .setTitle("New Review")
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setDescription(review)
          .addFields(
            { name: 'User ID', value: message.author.id, inline: true },
            { name: 'Server', value: message.guild.name, inline: true }
          )
          .setTimestamp();

        await targetChannel.send({ embeds: [embed] });
        return message.reply("💖 Thanks for your review! It has been sent to our support team.");
      } else {
        console.error(`Review channel ${targetChannelId} not found.`);
        return message.reply("❌ Could not send review (Support channel setup error).");
      }

    } catch (error) {
      console.error("Review Error:", error);
      message.reply("❌ An error occurred while sending your review.");
    }
  }
};
