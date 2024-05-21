import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex,  } from "drizzle-orm/sqlite-core";
import type { Price, PriceModel } from "../../lib/structs/prices/price";
import { Unit } from "../../lib/structs/products/product";
import { priceListModel } from "./price-model";

export const productsTable = sqliteTable('products', {
    productId: integer('productid', { mode: 'number' })
        .notNull()
        .primaryKey({ autoIncrement: true })
    ,

    name: text('name', { length: 256 })
    ,

    prices: priceListModel('prices')
        .notNull()
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
        // .$onUpdate(() => sql`(unixepoch())`)
    ,
    
});
