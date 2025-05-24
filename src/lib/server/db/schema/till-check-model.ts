import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { tillSessionsTable } from "./till-session-model";
import type { IMoneySum } from "$lib/shared/interfaces/money-sum";
import { sql } from "drizzle-orm";

export const tillChecksTable = sqliteTable('till_checks', {
    id: integer('id')
        .primaryKey({ autoIncrement: true })
    ,

    tillSessionId: integer('tillSessionId')
        .notNull()
        .references(() => tillSessionsTable.id)
    ,

    actualBalance: text('actualBalance', { mode: 'json' })
        .notNull()
        .$type<IMoneySum[]>()
    ,

    expectedBalance: text('expectedBalance', { mode: 'json' })
        .notNull()
        .$type<IMoneySum[]>()
    ,

    difference: text('difference', { mode: 'json' })
        .notNull()
        .$type<IMoneySum[]>()
    ,

    approvedBy: integer('approvedBy') // nullable
    ,

    createdAt: integer('createdAt', { mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`)
    ,
    
    note: text('note', { length: 256 }),
});