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
import type { CustomersDataHandler } from './customers-data-handler';
import type { CustomerPaymentDataHandler } from './customer-payment-data-handler';
import type { TransactionsDataHandler } from './transaction-data-handler';
import type { TillSessionsDataHandler } from './till-sessions-data-handler';
import type { TillChecksDataHandler } from './till-checks-data-handler';
import type { PermissionsDataHandler } from './permissions-data-handler';
import type { UserDataHandler } from './users-data-handler';
import type { GroupsDataHandler } from './groups-data-handler';

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
    readonly _customers: CustomersDataHandler;
    readonly _customerPayments: CustomerPaymentDataHandler;
    readonly _transactions: TransactionsDataHandler;
    readonly _tillSessions: TillSessionsDataHandler;
    readonly _tillChecks: TillChecksDataHandler;
    readonly _permissions: PermissionsDataHandler;
    readonly _users: UserDataHandler;
    readonly _groups: GroupsDataHandler;

    defaultSchema(): void;

    markOrderAsPaid(orderId: number, transactionId: number): Promise<void>;
}

export function getMigrationsPath() {
    if (process.env.NODE_ENV === 'production') {
        if (!process.env.APP_PATH) throw new Error('APP_PATH not set');

        return join(process.env.APP_PATH, 'migrations');
    } else {
        return join('src', 'lib', 'server', 'db', 'migrations');
    }
}

export const database = new SQLiteDB('.db');
export const db = database.db;


