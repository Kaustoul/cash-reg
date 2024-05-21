import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex,  } from "drizzle-orm/sqlite-core";
import type { Price } from "../../lib/structs/prices/price";
import type { MoneySum } from "../../lib/structs/prices/money-sum";


export const tills = sqliteTable('tills', {
    id: integer('tillId', { mode: 'number' })
        .notNull()
        .primaryKey({ autoIncrement: true })
    ,

    prices: text('balance', {mode: 'json'})
        .notNull()
        .$type<[MoneySum]>()
    ,
    
    note: text('note', { length: 256 })
    ,
    
    createdAt: integer('createdAt', { mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`)
    ,
    
    modifiedAt: integer('createdAt', { mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`)
        .$onUpdate(() => sql`(unixepoch())`)
    ,
});
