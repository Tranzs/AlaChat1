import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database path
const DB_PATH = join(__dirname, '..', 'database.sqlite');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

// Initialize database schema
function initDatabase() {
  db.serialize(() => {
    // Create users table with password support
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        avatar TEXT,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_active DATETIME
      )
    `);

    // Check if password column exists (for existing databases)
    db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name='users'", [], (err, row) => {
      if (row && row.sql && !row.sql.includes('password')) {
        db.run('ALTER TABLE users ADD COLUMN password TEXT');
        db.run('ALTER TABLE users ADD COLUMN username TEXT UNIQUE');
      }
    });

    // Create messages table
    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_user_id INTEGER NOT NULL,
        to_user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_read INTEGER DEFAULT 0,
        delete_at DATETIME,
        FOREIGN KEY (from_user_id) REFERENCES users(id),
        FOREIGN KEY (to_user_id) REFERENCES users(id)
      )
    `);

    // Create reactions table
    db.run(`
      CREATE TABLE IF NOT EXISTS reactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        emoji TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (message_id) REFERENCES messages(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(message_id, user_id, emoji)
      )
    `);

    // Create indexes for better query performance
    db.run(`CREATE INDEX IF NOT EXISTS idx_messages_from ON messages(from_user_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_messages_to ON messages(to_user_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_reactions_message ON reactions(message_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_reactions_user ON reactions(user_id)`);

    console.log('Database tables initialized');
  });
}

// Export database for use in other modules
export default db;

// Helper functions
export function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

export function getOne(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
}

export function getAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}
