import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { groupsTable } from "./group-model";
import { permissionsTable } from "./permissions-model";

export const groupPermissionsTable = sqliteTable('groupPermissions', {
    groupId: integer('groupId')
        .references(() => groupsTable.groupId)
    ,

    permissionId: text('permissionId', { length: 64 })
        .references(() => permissionsTable.permissionId)
    , 
});