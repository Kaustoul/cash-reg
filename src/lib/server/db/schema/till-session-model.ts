import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { tillsTable } from "./till-model";
import { type ITillSession } from "$lib/shared/interfaces/till-session";
import { sql } from "drizzle-orm";

export const tillSessionsTable = sqliteTable('till_sessions', {
    id: integer('id')
        .primaryKey({ autoIncrement: true })
    ,

    cashierId: integer('cashierId')
        .notNull()
    ,
    
    tillId: integer('tillId')
        .notNull()
        .references(() => tillsTable.id)
    ,

    type: text('type', { length: 16 })
        .$type<ITillSession['type']>()
        .notNull()
    ,

    createdAt: integer('createdAt', { mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`)
    ,
    
    note: text('note', { length: 256 }),
});