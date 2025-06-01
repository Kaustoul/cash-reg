import { is, sql } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text,  } from "drizzle-orm/sqlite-core";
import { productsTable } from "./product-model";
import type { DecimalStr } from "$lib/shared/interfaces/money-sum";

export const productVariantsTable = sqliteTable('productVariants', {
    variantId: integer('variantId', { mode: 'number' })
        .notNull()
        .primaryKey({ autoIncrement: true })
    ,

    productId: integer('productid')
        .notNull()
        .references(() => productsTable.productId, { onDelete: 'restrict' })
    ,

    subname: text('name', { length: 256 })
        .notNull()
        .default('')
    ,

    ean: text('ean', { length: 128 })
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
