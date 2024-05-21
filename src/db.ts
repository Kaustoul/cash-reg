import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

export function defaultSchema(db: BetterSQLite3Database) {
    migrate(db, { migrationsFolder: 'src/db/migrations' });
}

const sqlite = new Database('.db');
const db = drizzle(sqlite);
defaultSchema(db);
// if (!db._.schema) {
// }

export { db };