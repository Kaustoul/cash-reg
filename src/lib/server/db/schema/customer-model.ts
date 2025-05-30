import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { IMoneySum } from "$lib/shared/interfaces/money-sum";
import type { IDiscount } from "$lib/shared/interfaces/discount";

export const customersTable = sqliteTable('customers', {
    customerId: integer('customerId', { mode: 'number' })
        .notNull()
        .primaryKey({ autoIncrement: true })
    ,

    name: text('name', { length: 256 })
        .notNull()
    ,

    surname: text('surname', { length: 256 })
        .notNull()
    ,

    email: text('email', { length: 256 })
    ,

    balance: text('balance', { mode: 'json' })
        .notNull()
        .$type<IMoneySum>()
    ,

    discount: text('discount', { mode: 'json' })
        .$type<IDiscount | null>()
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