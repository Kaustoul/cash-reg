import { permissionsTable } from '../schema/permissions-model';
import type { IItem } from "$lib/shared/interfaces/item";
import { eq , and, max, asc } from 'drizzle-orm';
import type { SQLiteTx } from "../db";
import type { ItemsDataHandler } from "../items-data-handler";
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { itemsTable } from "../schema/item-model";
import { itemIdFromFullId, productIdFromFullId } from "$lib/shared/utils";
import type { SQLiteDB } from './sqlite-db';
import type { PermissionLeaf } from '$lib/shared/permissions';
import { flattenPermissions } from '$lib/shared/utils/permission-utils';
import { PERMISSIONS } from '$lib/shared/permissions';
import type { PermissionsDataHandler } from '../permissions-data-handler';

export const sqlitePermissions = {
    async newPermission(db: BetterSQLite3Database | SQLiteTx, key: string, data: PermissionLeaf): Promise<void> {
        await db.insert(permissionsTable)
            .values({ permissionId: key, ...data })
            .onConflictDoNothing()
            .execute();
    },

    async fetchPermissionById(db: BetterSQLite3Database | SQLiteTx, key: string): Promise<PermissionLeaf | null> {
        const res = await db
            .select()
            .from(permissionsTable)
            .where(eq(permissionsTable.permissionId, key))
            .limit(1)
            .execute();

        return res.length ? res[0] as PermissionLeaf : null;
    },

    async fetchAllPermissions(db: BetterSQLite3Database | SQLiteTx): Promise<PermissionLeaf[]> {
        const res =  await db
            .select()
            .from(permissionsTable)
            .execute();

        return res as PermissionLeaf[];
    },
    
    async setupPermissions(db: BetterSQLite3Database | SQLiteTx) {
        const flat = flattenPermissions(PERMISSIONS);
        for (const [key, { name, description }] of Object.entries(flat)) {
            await sqlitePermissions.newPermission(db, key, { name, description });
        }
    }
} satisfies PermissionsDataHandler;