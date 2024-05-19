import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

const sqlite = new Database('.db');
export const db = drizzle(sqlite);

export function defaultSchema(db: BetterSQLite3Database) {
    migrate(db, { migrationsFolder: 'db/migrations' });
}
