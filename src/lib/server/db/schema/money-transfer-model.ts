import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, foreignKey, primaryKey } from "drizzle-orm/sqlite-core";
import { tillsTable } from "./till-model";
import type { IMoneySum } from "$lib/shared/interfaces/till";

export const transactionsTable = sqliteTable('money_transfers', {
    transactionId: integer('transferId')
        .notNull()
        .default(sql`(newid())`)
    ,
    
    tillId: integer('tillId')
        .notNull()
        .references(() => tillsTable.id, { onDelete: 'no action' })
    ,

    amounts: text('moneySums', { mode: 'json' })
        .notNull()
        .$type<IMoneySum[]>()
    ,

    cashierId: integer('cashierId')
    ,
    
    reason: text('reason', { length: 32 })
        .notNull()
    ,

    note: text('note', { length: 256 })
    ,

    createdAt: integer('createdAt', { mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`)
    ,
}, (table) => {
    return {
        pk: primaryKey({columns: [table.tillId, table.transactionId]})
    };
});
