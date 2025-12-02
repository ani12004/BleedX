import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = './data';
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const db = new Database(path.join(dataDir, 'bot.sqlite'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS guild_configs (
    guild_id TEXT PRIMARY KEY,
    prefix TEXT DEFAULT 's?',
    log_channel TEXT,
    welcome_channel TEXT,
    welcome_message TEXT,
    level_channel TEXT,
    ticket_category TEXT,
    autorole_id TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    user_id TEXT,
    guild_id TEXT,
    balance INTEGER DEFAULT 0,
    bank INTEGER DEFAULT 0,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 0,
    last_daily INTEGER DEFAULT 0,
    last_work INTEGER DEFAULT 0,
    last_rob INTEGER DEFAULT 0,
    PRIMARY KEY (user_id, guild_id)
  );

  CREATE TABLE IF NOT EXISTS tickets (
    ticket_id TEXT PRIMARY KEY,
    guild_id TEXT,
    user_id TEXT,
    channel_id TEXT,
    closed INTEGER DEFAULT 0,
    transcript TEXT,
    anonymous INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS giveaways (
    message_id TEXT PRIMARY KEY,
    guild_id TEXT,
    channel_id TEXT,
    prize TEXT,
    winners INTEGER,
    end_time INTEGER,
    ended INTEGER DEFAULT 0
  );
  
  CREATE TABLE IF NOT EXISTS warns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT,
    user_id TEXT,
    reason TEXT,
    timestamp INTEGER
  );
`);

// Migrations
try { db.prepare('ALTER TABLE guild_configs ADD COLUMN welcome_message TEXT').run(); } catch (e) { }
try { db.prepare('ALTER TABLE guild_configs ADD COLUMN level_channel TEXT').run(); } catch (e) { }
try { db.prepare('ALTER TABLE tickets ADD COLUMN anonymous INTEGER DEFAULT 0').run(); } catch (e) { }

export default db;

// Helper functions
export const getGuildConfig = (guildId) => {
  const stmt = db.prepare('SELECT * FROM guild_configs WHERE guild_id = ?');
  return stmt.get(guildId) || { guild_id: guildId, prefix: 's?' };
};

export const setGuildConfig = (guildId, key, value) => {
  // Ensure guild exists first
  db.prepare('INSERT OR IGNORE INTO guild_configs (guild_id) VALUES (?)').run(guildId);
  const stmt = db.prepare(`UPDATE guild_configs SET ${key} = ? WHERE guild_id = ?`);
  return stmt.run(value, guildId);
};

export const getUser = (userId, guildId) => {
  const stmt = db.prepare('SELECT * FROM users WHERE user_id = ? AND guild_id = ?');
  return stmt.get(userId, guildId) || { user_id: userId, guild_id: guildId, balance: 0, bank: 0, xp: 0, level: 0 };
};

export const updateUser = (userId, guildId, updates) => {
  db.prepare('INSERT OR IGNORE INTO users (user_id, guild_id) VALUES (?, ?)').run(userId, guildId);

  const keys = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = keys.map(k => `${k} = ?`).join(', ');

  const stmt = db.prepare(`UPDATE users SET ${setClause} WHERE user_id = ? AND guild_id = ?`);
  return stmt.run(...values, userId, guildId);
};
