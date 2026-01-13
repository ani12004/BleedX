import { Events, AttachmentBuilder } from 'discord.js';
import { getGuildConfig } from '../utils/database.js';
import { createCanvas, loadImage, registerFont } from 'canvas';

export default {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const config = await getGuildConfig(member.guild.id);
    if (!config.welcome_channel) return;

    const channel = member.guild.channels.cache.get(config.welcome_channel);
    if (!channel) return;

    // Canvas Setup
    const canvas = createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#23272a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add a colorful strip on the left
    ctx.fillStyle = '#ff69b4'; // Pink
    ctx.fillRect(0, 0, 15, canvas.height);

    // Load Avatar
    const avatarURL = member.user.displayAvatarURL({ extension: 'png', size: 256 });
    try {
      const avatar = await loadImage(avatarURL);
      // Draw Avatar (Right side)
      ctx.save();
      ctx.beginPath();
      // Rounded rectangle for avatar
      const avSize = 180;
      const avX = 480;
      const avY = 35;
      const radius = 20;

      ctx.moveTo(avX + radius, avY);
      ctx.lineTo(avX + avSize - radius, avY);
      ctx.quadraticCurveTo(avX + avSize, avY, avX + avSize, avY + radius);
      ctx.lineTo(avX + avSize, avY + avSize - radius);
      ctx.quadraticCurveTo(avX + avSize, avY + avSize, avX + avSize - radius, avY + avSize);
      ctx.lineTo(avX + radius, avY + avSize);
      ctx.quadraticCurveTo(avX, avY + avSize, avX, avY + avSize - radius);
      ctx.lineTo(avX, avY + radius);
      ctx.quadraticCurveTo(avX, avY, avX + radius, avY);
      ctx.closePath();

      ctx.clip();
      ctx.drawImage(avatar, avX, avY, avSize, avSize);
      ctx.restore();
    } catch (e) {
      console.error("Failed to load avatar:", e);
    }

    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Sans';
    ctx.fillText(`Welcome to ${member.guild.name}!`, 40, 60);

    ctx.font = '24px Sans';
    ctx.fillStyle = '#dddddd';
    ctx.fillText(`hello ${member.user.username}`, 40, 100);

    ctx.font = 'bold 22px Sans';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Please make sure to check:', 40, 160);

    ctx.font = '20px Sans';
    ctx.fillStyle = '#aaaaaa';
    ctx.fillText('• rules - Read our rules!', 40, 190);
    ctx.fillText('• guides - Check our guides!', 40, 220);

    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'welcome-image.png' });

    const messageContent = config.welcome_message
      ? config.welcome_message.replace('{member}', member).replace('{server}', member.guild.name)
      : `Welcome ${member} to the server!`;

    channel.send({ content: messageContent, files: [attachment] });

    // Autorole
    if (config.autorole_id) {
      const role = member.guild.roles.cache.get(config.autorole_id);
      if (role) {
        member.roles.add(role).catch(() => { });
      }
    }
  },
};
