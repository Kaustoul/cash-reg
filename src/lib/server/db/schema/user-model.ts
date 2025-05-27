import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { IMoneySum } from "$lib/shared/interfaces/money-sum";
import type { IDiscount } from "$lib/shared/interfaces/discount";
import { groupsTable } from "./group-model";

export const usersTable = sqliteTable('users', {
    userId: integer('userId', { mode: 'number' })
        .notNull()
        .primaryKey({ autoIncrement: true }),

    name: text('name', { length: 256 })
        .notNull(),

    surname: text('surname', { length: 256 })
        .notNull(),

    email: text('email', { length: 256 }),

    passwordHash: text('passwordHash', { length: 256 })
        .notNull()
    ,
    
    pinHash: text('pinHash', { length: 256 })
    ,

    groupId: integer('groupId')
        .references(() => groupsTable.groupId)
        .notNull()
        .default(1)
    ,

    mustChangePassword: integer('mustChangePassword', { mode: 'boolean' })
        .default(false)
        .notNull()
    ,

    lastLogin: integer('lastLogin', { mode: 'timestamp' })
    ,

    lastIp: text('lastIp', { length: 64 })
    ,
    
    createdAt: integer('createdAt', { mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`),
});