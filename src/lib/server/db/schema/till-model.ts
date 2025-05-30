import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, } from "drizzle-orm/sqlite-core";
import type { IMoneySum } from "$lib/shared/interfaces/money-sum";
import type { IBalance } from "$lib/shared/interfaces/balance";


export const tillsTable = sqliteTable('tills', {
    id: integer('tillId', { mode: 'number' })
        .notNull()
        .primaryKey({ autoIncrement: true })
    ,

    balance: text('balance', {mode: 'json'})
        .notNull()
        .$type<IBalance>()
    ,

    name: text('name', { length: 64 })
    ,

    createdAt: integer('createdAt', { mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`)
    ,
    
    modifiedAt: integer('createdAt', { mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`)
    ,
});
