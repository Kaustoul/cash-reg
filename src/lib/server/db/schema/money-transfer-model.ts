import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, foreignKey, primaryKey } from "drizzle-orm/sqlite-core";
import { tillsTable } from "./till-model";
import type { IMoneySum } from "$lib/shared/interfaces/money-sum";
import { ordersTable } from "./order-model";
import { type PaymentType, type TransactionReason, type TransactionType } from "$lib/shared/interfaces/transaction";
import { tillSessionsTable } from "./till-session-model";

export const transactionsTable = sqliteTable('money_transfers', {
    transactionId: integer('transactionId')
        .notNull()
        .primaryKey({ autoIncrement: true })
    ,

    tillSessionId: integer('tillSessionId')
        .notNull()
        .references(() => tillSessionsTable.tillSessionId, { onDelete: 'no action' })
    ,

    amount: text('moneySums', { mode: 'json' })
        .notNull()
        .$type<IMoneySum>()
    ,

    type: text('type', { length: 16 })
        .notNull()
        .$type<TransactionType>()
        .default('unknown')
    ,
    
    reason: text('reason', { length: 32 })
        .$type<TransactionReason>()
        .notNull()
    ,

    note: text('note', { length: 256 })
    ,

    createdAt: integer('createdAt', { mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`)
    ,
});
