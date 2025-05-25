import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const permissionsTable = sqliteTable('permissions', {
    permissionId: text('permissionId', { length: 64 })
        .primaryKey()
    ,

    name: text('name', { length: 64 })
        .notNull()
        .unique()
    ,

    description: text('description', { length: 256 })
    ,
});