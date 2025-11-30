import { Events, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import db from '../utils/database.js';

export default {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    // Handle Buttons
    if (interaction.isButton()) {
      const { customId, guild, user } = interaction;

      // --- Create Ticket ---
      if (customId === 'create_ticket') {
        // Check if user already has an open ticket
        const existingTicket = db.prepare('SELECT * FROM tickets WHERE user_id = ? AND guild_id = ? AND closed = 0').get(user.id, guild.id);

        if (existingTicket) {
          // Check if channel still exists
          const channel = guild.channels.cache.get(existingTicket.channel_id);
          if (channel) {
            return interaction.reply({ content: `You already have an open ticket: ${channel}`, ephemeral: true });
          } else {
            // Clean up ghost ticket from DB if channel was manually deleted
            db.prepare('UPDATE tickets SET closed = 1 WHERE ticket_id = ?').run(existingTicket.ticket_id);
          }
        }

        try {
          // Create Channel
          const channel = await guild.channels.create({
            name: `ticket-${user.username}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
              {
                id: guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
              },
              {
                id: user.id,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles],
              },
              {
                id: client.user.id,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
              }
            ],
          });

          // Add to DB
          const ticketId = `${guild.id}-${user.id}-${Date.now()}`;
          db.prepare('INSERT INTO tickets (ticket_id, guild_id, user_id, channel_id) VALUES (?, ?, ?, ?)').run(ticketId, guild.id, user.id, channel.id);

          // Send Welcome Message
          const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle(`Ticket for ${user.username}`)
            .setDescription('Support will be with you shortly.\nClick the button below to close this ticket.');

          const closeButton = new ButtonBuilder()
            .setCustomId('close_ticket')
            .setLabel('Close Ticket')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔒');

          const row = new ActionRowBuilder().addComponents(closeButton);

          await channel.send({ content: `${user}`, embeds: [embed], components: [row] });

          await interaction.reply({ content: `✅ Ticket created: ${channel}`, ephemeral: true });

        } catch (error) {
          console.error(error);
          await interaction.reply({ content: 'Failed to create ticket channel. Check my permissions!', ephemeral: true });
        }
        return;
      }

      // --- Close Ticket ---
      if (customId === 'close_ticket') {
        // Check if it is a ticket channel
        const ticket = db.prepare('SELECT * FROM tickets WHERE channel_id = ?').get(interaction.channelId);
        if (!ticket) {
          return interaction.reply({ content: 'This is not a valid ticket channel or it is not in the database.', ephemeral: true });
        }

        await interaction.reply('🔒 Closing ticket in 5 seconds...');

        // Update DB
        db.prepare('UPDATE tickets SET closed = 1 WHERE ticket_id = ?').run(ticket.ticket_id);

        setTimeout(() => {
          interaction.channel.delete().catch(() => { });
        }, 5000);
        return;
      }
    }

    // Handle Select Menus
    if (interaction.isStringSelectMenu()) {
      // Server Setup logic will go here
      if (interaction.customId === 'setup_menu') {
        await interaction.reply({ content: `Selected: ${interaction.values[0]} (Feature coming soon)`, ephemeral: true });
      }
      return;
    }
  },
};
