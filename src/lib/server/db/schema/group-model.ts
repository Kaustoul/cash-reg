import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const groupsTable = sqliteTable('groups', {
    groupId: integer('groupId')
        .primaryKey({ autoIncrement: true })
    ,

    name: text('name', { length: 64 })
        .notNull()
        .unique()
    ,

    description: text('description', { length: 256 })
    ,
});