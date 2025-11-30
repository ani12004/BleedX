import { Events, ActivityType } from 'discord.js';
import logger from '../utils/logger.js';

export default {
  name: Events.ClientReady,
  once: true,

  execute(client) {
    logger.success(`Logged in as ${client.user.tag}!`);
    logger.info(`Serving ${client.guilds.cache.size} guild(s)`);
    logger.info(`Loaded ${client.prefixCommands.size} command(s)`);

    client.user.setPresence({
      activities: [
        {
          name: 'DM me to open ModMail 📩',
          type: ActivityType.Listening,
        }
      ],
      status: 'online',
    });
  },
};
