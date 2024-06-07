import { sql } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text,  } from "drizzle-orm/sqlite-core";
import Decimal from "decimal.js";
import { productsTable } from "./product-model";
import type { DecimalStr } from "$lib/shared/interfaces/money-sum";

export const itemsTable = sqliteTable('items', {
    itemId: integer('itemid', { mode: 'number' })
        .notNull()
        .default(sql`(0)`)
    ,

    productId: integer('productid')
        .notNull()
        .references(() => productsTable.productId, { onDelete: 'restrict' })
    ,

    subname: text('name', { length: 256 })
        .notNull()
    ,

    priceIdxs: text('priceIdxs', {mode: 'json'})
        .notNull()
        .$type<number[]>()
    ,

    itemDiscountIdxs: text('itemDiscountIdxs', {mode: 'json'})
        .notNull()
        .$type<number[]>()
    ,

    stock: text('stock')
        .$type<DecimalStr>()
    ,

    ean: text('ean', { length: 128 })
    ,

    createdAt: integer('createdAt', { mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`)
    ,

    modifiedAt: integer('modifiedAt', { mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`)
        // .$onUpdate(() => sql`(unixepoch())`)
    ,
}, (table) => {
    return {
        fullItemId: primaryKey({ name: "fullItemId", columns: [table.productId, table.itemId] }),
    };
});
