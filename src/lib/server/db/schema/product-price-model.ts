import { is, sql } from "drizzle-orm";
import { check, integer, primaryKey, sqliteTable, text,  } from "drizzle-orm/sqlite-core";
import { productsTable } from "./product-model";
import type { DecimalStr } from "$lib/shared/interfaces/money-sum";
import type { IPrice } from "$lib/shared/interfaces/product-price";

export const productPricesTable = sqliteTable('productPrices', {
    priceId: integer('variantId', { mode: 'number' })
        .notNull()
        .primaryKey({ autoIncrement: true })
    ,

    productId: integer('productid')
        .references(() => productsTable.productId, { onDelete: 'restrict' })
    ,

    variantId: integer('variantId')
        .references(() => productsTable.productId, { onDelete: 'restrict' })
    ,

    priceType: text('priceType', { length: 16 })
        .notNull()
        .$type<IPrice['priceType']>()
        .default('base')
    ,

    amount: text('amount', { mode: 'json'})
        .notNull()
        .$type<IPrice['amount']>()
    ,

    minQuantity: text('minQuantity')
        .$type<IPrice['minQuantity']>()
    ,

    maxQuantity: text('maxQuantity')
        .$type<IPrice['maxQuantity']>()
    ,

    isActive: integer('isActive', { mode: 'boolean' })
        .notNull()
        .default(true)
    ,

    createdAt: integer('createdAt', { mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`)
    ,

    modifiedAt: integer('modifiedAt', { mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`)
    ,
}) 
// (table) => [
//     return check("itemExists",
//       sql`(
//         (productId IS NOT NULL AND variantId IS NULL)
//         OR
//         (productId IS NULL     AND variantId IS NOT NULL)
//       )`
//     )
// ]);
