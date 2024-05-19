import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex,  } from "drizzle-orm/sqlite-core";
import type { Price } from "../../src/lib/structs/prices/price";
import { Unit } from "../../src/lib/structs/products/product";

export const productsTable = sqliteTable('products', {
    productId: integer('productid', { mode: 'number' })
        .notNull()
        .primaryKey({ autoIncrement: true })
    ,

    name: text('name', { length: 256 })
    ,

    prices: text('prices', {mode: 'json'})
        .notNull()
        .$type<Price[]>()
    ,

    units: text('units')
        .notNull()
        .$type<Unit>()
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
