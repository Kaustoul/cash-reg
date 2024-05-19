import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, foreignKey, primaryKey } from "drizzle-orm/sqlite-core";
import { MoneySum } from "../../src/lib/structs/prices/money-sum";
import { tills } from "./till-model";

export const moneyTransfers = sqliteTable('money_transfers', {
    transferId: integer('transferId')
        .notNull()
        .default(sql`(newid())`)
    ,
    
    tillId: integer('tillId')
        .notNull()
        .references(() => tills.id, { onDelete: 'no action' })
    ,

    moneySums: text('moneySums', { mode: 'json' })
        .notNull()
        .$type<[MoneySum]>()
    ,

    transactionId: integer('transactionId')
    ,

    cashierId: integer('cashierId')
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