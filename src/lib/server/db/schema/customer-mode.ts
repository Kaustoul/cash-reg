import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const customersTable = sqliteTable('customers', {
    customerId: integer('customerId', { mode: 'number' })
        .notNull()
        .primaryKey({ autoIncrement: true }),

    name: text('name', { length: 256 })
        .notNull(),

    surname: text('name', { length: 256 })
        .notNull(),

    email: text('email', { length: 256 }),

    createdAt: integer('createdAt', { mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`),

    modifiedAt: integer('modifiedAt', { mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`)
});