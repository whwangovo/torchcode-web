import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { dirname } from 'path';
import { DB_PATH } from './constants';
import { ProblemProgress, ProgressMap } from './types';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    mkdirSync(dirname(DB_PATH), { recursive: true });
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeSchema();
  }
  return db;
}

function initializeSchema() {
  getDb().exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_token TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      task_id TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('todo', 'attempted', 'solved')),
      best_time_ms REAL,
      attempts INTEGER DEFAULT 0,
      solved_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, task_id)
    );
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      task_id TEXT NOT NULL,
      code TEXT NOT NULL,
      passed INTEGER NOT NULL,
      total_tests INTEGER NOT NULL,
      exec_time_ms REAL,
      submitted_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
}

export function getOrCreateUser(sessionToken: string): number {
  const existing = getDb()
    .prepare('SELECT id FROM users WHERE session_token = ?')
    .get(sessionToken) as { id: number } | undefined;
  if (existing) return existing.id;
  const result = getDb()
    .prepare('INSERT INTO users (session_token) VALUES (?)')
    .run(sessionToken);
  return result.lastInsertRowid as number;
}

export function getProgress(userId: number): ProgressMap {
  const rows = getDb()
    .prepare('SELECT task_id, status, best_time_ms, attempts, solved_at FROM progress WHERE user_id = ?')
    .all(userId) as any[];
  const result: ProgressMap = {};
  for (const row of rows) {
    result[row.task_id] = {
      status: row.status,
      bestTimeMs: row.best_time_ms,
      attempts: row.attempts,
      solvedAt: row.solved_at,
    };
  }
  return result;
}

export function saveProgress(
  userId: number,
  taskId: string,
  status: 'todo' | 'attempted' | 'solved',
  execTimeMs?: number
): void {
  const existing = getDb()
    .prepare('SELECT * FROM progress WHERE user_id = ? AND task_id = ?')
    .get(userId, taskId) as any;

  if (existing) {
    if (status === 'solved') {
      const bestTime = existing.best_time_ms
        ? Math.min(existing.best_time_ms, execTimeMs ?? Infinity)
        : execTimeMs;
      getDb()
        .prepare(`UPDATE progress SET status = ?, best_time_ms = ?, attempts = attempts + 1, solved_at = datetime('now') WHERE user_id = ? AND task_id = ?`)
        .run(status, bestTime, userId, taskId);
    } else {
      getDb()
        .prepare(`UPDATE progress SET status = ?, attempts = attempts + 1 WHERE user_id = ? AND task_id = ?`)
        .run(status, userId, taskId);
    }
  } else {
    getDb()
      .prepare(`INSERT INTO progress (user_id, task_id, status, best_time_ms, attempts, solved_at) VALUES (?, ?, ?, ?, 1, datetime('now'))`)
      .run(userId, taskId, status, execTimeMs ?? null);
  }
}
