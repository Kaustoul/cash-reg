import { type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { type RunResult } from 'better-sqlite3';
import type { SQLiteTransaction } from 'drizzle-orm/sqlite-core';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { TillsDataHandler } from './tills-data-handler';
import { SQLiteDB } from './SQLite/sqlite-db';
import type { ItemsDataHandler } from './items-data-handler';
import type { ProductsDataHandler } from './products-data-handler';
import type { OrdersDataHandler } from './orders-data-handler';
import { join } from 'path';

export type SQLiteTx = SQLiteTransaction<
    "sync",
    RunResult, 
    Record<string, never>, 
    ExtractTablesWithRelations<Record<string, never>>
>

export type Transactions = SQLiteTx; 
export type Databases = BetterSQLite3Database;

export interface DB {
    readonly db: Databases;
    readonly _tills: TillsDataHandler;
    readonly _products: ProductsDataHandler;
    readonly _items: ItemsDataHandler;
    readonly _orders: OrdersDataHandler;

    defaultSchema(): void;
}

export const database = new SQLiteDB('.db');
export const db = database.db;

export function getMigrationsPath() {
    if (process.env.NODE_ENV === 'production') {
        if (!process.env.APP_PATH) throw new Error('APP_PATH not set');

        return join(process.env.APP_PATH, 'migrations');
    } else {
        return join('src', 'lib', 'server', 'db', 'migrations');
    }
}
