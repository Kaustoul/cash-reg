import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, } from "drizzle-orm/sqlite-core";
import type { IPrice } from "$lib/shared/interfaces/price";
import type { IUnit } from "$lib/shared/interfaces/product";

export const productsTable = sqliteTable('products', {
    productId: integer('productid', { mode: 'number' })
        .notNull()
        .primaryKey({ autoIncrement: true })
    ,

    name: text('name', { length: 256 })
        .notNull()
    ,

    prices: text('prices', { mode: 'json' })
        .notNull()
        .$type<IPrice[]>()
    ,

    units: text('units')
        .notNull()
        .$type<IUnit>()
    ,

    isActive: integer('isActive', { mode: 'boolean' })
        .notNull()
        .default(true)
    ,

    createdAt: integer('createdAt', { mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`)
    ,
    
});
