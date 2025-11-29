# Discord Bot Universal

A complete, multi-purpose Discord bot built with **Discord.js v14**. This bot features a robust command handler, economy system, moderation tools, leveling, tickets, and more.

**🌐 Website:** [universalgg.netlify.app](https://universalgg.netlify.app/)

## 🚀 Features

- **Advanced Moderation**: Ban, kick, timeout, nuke, and lock channels.
- **Economy System**: Work, daily rewards, banking, and leaderboards.
- **Leveling System**: XP tracking and rank cards.
- **Ticket System**: Support ticket management.
- **Fun & Games**: 8ball, RPS, dice, memes, and more.
- **Utility**: User info, server info, polls, and avatars.
- **Dynamic Prefix**: Customizable prefix per server (default: `s?`).
- **Database**: SQLite-based persistence using `better-sqlite3`.

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) (v16.9.0 or higher)
- **Library**: [Discord.js v14](https://discord.js.org/)
- **Database**: [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3)
- **Process Manager**: [PM2](https://pm2.keymetrics.io/) (optional, for production)
- **Configuration**: [Dotenv](https://github.com/motdotla/dotenv)

## � Project Structure

```
discord-bot-2.0/
├── events/             # Event handlers (ready, messageCreate, etc.)
├── handlers/           # Command loaders
├── prefixCommands/     # Command files categorized by folder
│   ├── admin/          # Admin commands (setprefix, setup)
│   ├── economy/        # Economy commands (balance, work, pay)
│   ├── fun/            # Fun commands (joke, meme, 8ball)
│   ├── moderation/     # Moderation tools (ban, kick, nuke)
│   ├── utility/        # Utility tools (ping, help, poll)
│   └── ...             # Other categories
├── utils/              # Helper functions and database connection
├── data/               # SQLite database storage
├── .env                # Environment variables (Token)
├── index.js            # Main entry point
└── ecosystem.config.js # PM2 configuration
```

## �📋 Prerequisites

- Node.js v16.9.0 or higher
- A Discord Bot Token (Get it from the [Discord Developer Portal](https://discord.com/developers/applications))
- **Privileged Intents**: You must enable **Message Content Intent**, **Server Members Intent**, and **Presence Intent** in the Discord Developer Portal for this bot to work correctly.

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/discord-bot-2.0.git
   cd discord-bot-2.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - Rename `.env.example` to `.env`.
   - Open `.env` and paste your Discord Bot Token.
   ```env
   DISCORD_TOKEN=your_token_here
   ```

4. **Start the Bot**
   - **Development Mode**:
     ```bash
     npm start
     ```
   - **Production Mode (using PM2)**:
     ```bash
     npm install -g pm2
     pm2 start ecosystem.config.js
     pm2 save
     pm2 logs
     ```

## 🎮 Commands

The default prefix is `s?`. You can change it using `s?setprefix`.

### 🛡️ Admin
- `s?setprefix <newPrefix>` - Change the bot's prefix for the server.
- `s?setup` - Run server setup configuration.

### 💰 Economy
- `s?balance` - Check your wallet and bank balance.
- `s?daily` - Claim your daily cash reward.
- `s?leaderboard` - View the richest users.
- `s?pay <user> <amount>` - Transfer money to another user.
- `s?work` - Work to earn money.

### 🎲 Fun
- `s?8ball <question>` - Ask the magic 8-ball.
- `s?coinflip` - Flip a coin.
- `s?dice` - Roll a die.
- `s?fact` - Get a random useless fact.
- `s?joke` - Get a random joke.
- `s?meme` - Get a random meme.
- `s?rps <rock|paper|scissors>` - Play Rock, Paper, Scissors.

### 🎉 Giveaway
- `s?gstart <duration> <winners> <prize>` - Start a giveaway.

### 🖼️ Image
- `s?banner <user>` - View a user's banner.
- `s?cat` - Get a random cat picture.
- `s?dog` - Get a random dog picture.

### 📈 Leveling
- `s?levels` - View the server XP leaderboard.
- `s?rank <user>` - View your or another user's rank card.

### 🛡️ Moderation
- `s?ban <user>` - Ban a member.
- `s?kick <user>` - Kick a member.
- `s?timeout <user> <duration>` - Timeout a member.
- `s?unban <userID>` - Unban a user.
- `s?nuke` - Delete and recreate the current channel.
- `s?purge <amount>` - Delete a bulk amount of messages.
- `s?lock` - Lock the current channel.
- `s?unlock` - Unlock the current channel.
- `s?close` - Close a moderation ticket/thread (if applicable).

### 🎫 Tickets
- `s?tsetup` - Setup the ticket system panel.
- `s?close` - Close an active ticket.

### 🛠️ Utility
- `s?help` - Show the help menu.
- `s?avatar <user>` - View a user's avatar.
- `s?botinfo` - View bot statistics.
- `s?serverinfo` - View server information.
- `s?userinfo <user>` - View user information.
- `s?ping` - Check bot latency.
- `s?poll <question>` - Create a simple yes/no poll.
- `s?invite` - Get the bot's invite link.
- `s?say <message>` - Make the bot say something.
- `s?review <text>` - Leave a review.

## ❓ Troubleshooting

### Bot not responding?
- Check if the bot is online.
- Ensure you have enabled **Message Content Intent** in the Discord Developer Portal.
- Check the console for errors.

### Database errors?
- Ensure the `data` folder exists and is writable.
- If the database is corrupted, delete `data/bot.sqlite` (Warning: This will reset all data).

### "Missing Permissions" error?
- Ensure the bot has the `Administrator` permission or the specific permissions required for the command (e.g., `Ban Members` for `s?ban`).
# Discord Bot Universal

A complete, multi-purpose Discord bot built with **Discord.js v14**. This bot features a robust command handler, economy system, moderation tools, leveling, tickets, and more.

## 🚀 Features

- **Advanced Moderation**: Ban, kick, timeout, nuke, and lock channels.
- **Economy System**: Work, daily rewards, banking, and leaderboards.
- **Leveling System**: XP tracking and rank cards.
- **Ticket System**: Support ticket management.
- **Fun & Games**: 8ball, RPS, dice, memes, and more.
- **Utility**: User info, server info, polls, and avatars.
- **Dynamic Prefix**: Customizable prefix per server (default: `s?`).
- **Database**: SQLite-based persistence using `better-sqlite3`.

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) (v16.9.0 or higher)
- **Library**: [Discord.js v14](https://discord.js.org/)
- **Database**: [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3)
- **Process Manager**: [PM2](https://pm2.keymetrics.io/) (optional, for production)
- **Configuration**: [Dotenv](https://github.com/motdotla/dotenv)

##  Project Structure

```
discord-bot-2.0/
├── events/             # Event handlers (ready, messageCreate, etc.)
├── handlers/           # Command loaders
├── prefixCommands/     # Command files categorized by folder
│   ├── admin/          # Admin commands (setprefix, setup)
│   ├── economy/        # Economy commands (balance, work, pay)
│   ├── fun/            # Fun commands (joke, meme, 8ball)
│   ├── moderation/     # Moderation tools (ban, kick, nuke)
│   ├── utility/        # Utility tools (ping, help, poll)
│   └── ...             # Other categories
├── utils/              # Helper functions and database connection
├── data/               # SQLite database storage
├── .env                # Environment variables (Token)
├── index.js            # Main entry point
└── ecosystem.config.js # PM2 configuration
```

## 📋 Prerequisites

- Node.js v16.9.0 or higher
- A Discord Bot Token (Get it from the [Discord Developer Portal](https://discord.com/developers/applications))
- **Privileged Intents**: You must enable **Message Content Intent**, **Server Members Intent**, and **Presence Intent** in the Discord Developer Portal for this bot to work correctly.

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/discord-bot-2.0.git
   cd discord-bot-2.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - Rename `.env.example` to `.env`.
   - Open `.env` and paste your Discord Bot Token.
   ```env
   DISCORD_TOKEN=your_token_here
   ```

4. **Start the Bot**
   - **Development Mode**:
     ```bash
     npm start
     ```
   - **Production Mode (using PM2)**:
     ```bash
     npm install -g pm2
     pm2 start ecosystem.config.js
     pm2 save
     pm2 logs
     ```

## 🎮 Commands

The default prefix is `s?`. You can change it using `s?setprefix`.

### 🛡️ Admin
- `s?setprefix <newPrefix>` - Change the bot's prefix for the server.
- `s?setup` - Run server setup configuration.

### 💰 Economy
- `s?balance` - Check your wallet and bank balance.
- `s?daily` - Claim your daily cash reward.
- `s?leaderboard` - View the richest users.
- `s?pay <user> <amount>` - Transfer money to another user.
- `s?work` - Work to earn money.

### 🎲 Fun
- `s?8ball <question>` - Ask the magic 8-ball.
- `s?coinflip` - Flip a coin.
- `s?dice` - Roll a die.
- `s?fact` - Get a random useless fact.
- `s?joke` - Get a random joke.
- `s?meme` - Get a random meme.
- `s?rps <rock|paper|scissors>` - Play Rock, Paper, Scissors.

### 🎉 Giveaway
- `s?gstart <duration> <winners> <prize>` - Start a giveaway.

### 🖼️ Image
- `s?banner <user>` - View a user's banner.
- `s?cat` - Get a random cat picture.
- `s?dog` - Get a random dog picture.

### 📈 Leveling
- `s?levels` - View the server XP leaderboard.
- `s?rank <user>` - View your or another user's rank card.

### 🛡️ Moderation
- `s?ban <user>` - Ban a member.
- `s?kick <user>` - Kick a member.
- `s?timeout <user> <duration>` - Timeout a member.
- `s?unban <userID>` - Unban a user.
- `s?nuke` - Delete and recreate the current channel.
- `s?purge <amount>` - Delete a bulk amount of messages.
- `s?lock` - Lock the current channel.
- `s?unlock` - Unlock the current channel.
- `s?close` - Close a moderation ticket/thread (if applicable).

### 🎫 Tickets
- `s?tsetup` - Setup the ticket system panel.
- `s?close` - Close an active ticket.

### 🛠️ Utility
- `s?help` - Show the help menu.
- `s?avatar <user>` - View a user's avatar.
- `s?botinfo` - View bot statistics.
- `s?serverinfo` - View server information.
- `s?userinfo <user>` - View user information.
- `s?ping` - Check bot latency.
- `s?poll <question>` - Create a simple yes/no poll.
- `s?invite` - Get the bot's invite link.
- `s?say <message>` - Make the bot say something.
- `s?review <text>` - Leave a review.

## ❓ Troubleshooting

### Bot not responding?
- Check if the bot is online.
- Ensure you have enabled **Message Content Intent** in the Discord Developer Portal.
- Check the console for errors.

### Database errors?
- Ensure the `data` folder exists and is writable.
- If the database is corrupted, delete `data/bot.sqlite` (Warning: This will reset all data).

### "Missing Permissions" error?
- Ensure the bot has the `Administrator` permission or the specific permissions required for the command (e.g., `Ban Members` for `s?ban`).
- Ensure the bot's role is higher than the user it's trying to moderate.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

**© 2025 ANIL SUTHAR. All Rights Reserved.**

This project is proprietary and confidential. Unauthorized copying, distribution, modification, or use of this file, via any medium, is strictly prohibited without the express written permission of the owner.
