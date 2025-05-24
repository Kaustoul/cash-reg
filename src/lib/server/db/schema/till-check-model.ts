import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { tillSessionsTable } from "./till-session-model";
import { sql } from "drizzle-orm";
import type { ITillCheck } from "$lib/shared/interfaces/till-check";

export const tillChecksTable = sqliteTable('till_checks', {
    id: integer('id')
        .primaryKey({ autoIncrement: true })
    ,

    tillSessionId: integer('tillSessionId')
        .notNull()
        .references(() => tillSessionsTable.id)
    ,

    type: text('type', { length: 16 })
        .notNull()
        .$type<ITillCheck['type']>()
    ,

    actualBalance: text('actualBalance', { mode: 'json' })
        .notNull()
        .$type<ITillCheck['actualBalance']>()
    ,

    expectedBalance: text('expectedBalance', { mode: 'json' })
        .notNull()
        .$type<ITillCheck['expectedBalance']>()
    ,

    difference: text('difference', { mode: 'json' })
        .notNull()
        .$type<ITillCheck['difference']>()
    ,

    approvedBy: integer('approvedBy') // nullable
    ,

    createdAt: integer('createdAt', { mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`)
    ,

    note: text('note', { length: 256 }),
});