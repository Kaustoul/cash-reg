import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, foreignKey, primaryKey } from "drizzle-orm/sqlite-core";
import type { IMoneySum } from "$lib/shared/interfaces/money-sum";
import { type PaymentType, type TransactionReason, type TransactionType } from "$lib/shared/interfaces/transaction";
import { tillSessionsTable } from "./till-session-model";
import type { IBalance } from "$lib/shared/interfaces/balance";

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
        .$type<IBalance>()
    ,

    isPaid: integer('isPaid', { mode: 'boolean' })
        .notNull()
    ,

    paymentType: text('paymentType', { length: 16 })
        .$type<PaymentType>()
        .notNull()
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
