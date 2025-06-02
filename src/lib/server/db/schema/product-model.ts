import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, } from "drizzle-orm/sqlite-core";
import type { IPrice } from "$lib/shared/interfaces/product-price";
import type { IProduct, Unit } from "$lib/shared/interfaces/product";

export const productsTable = sqliteTable('products', {
    productId: integer('productid', { mode: 'number' })
        .notNull()
        .primaryKey({ autoIncrement: true })
    ,

    name: text('name', { length: 256 })
        .notNull()
    ,

    units: text('units')
        .notNull()
        .$type<IProduct['units']>()
    ,

    status: text('status', { length: 16 })
        .$type<IProduct['status']>()
        .notNull()
        .default('draft')
    ,

    createdAt: integer('createdAt', { mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`)
    ,
    
    modifiedAt: integer('modifiedAt', { mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`)
    ,
});
