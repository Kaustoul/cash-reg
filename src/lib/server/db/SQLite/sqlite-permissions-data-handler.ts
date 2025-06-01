import { permissionsTable } from '../schema/permissions-model';
import type { IProductVariant } from "$lib/shared/interfaces/product-variant";
import { eq , and, max, asc } from 'drizzle-orm';
import type { SQLiteTx } from "../db";
import type { ItemsDataHandler } from "../items-data-handler";
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { productVariantsTable } from "../schema/product-variant-model";
import { itemIdFromFullId, productIdFromFullId } from "$lib/shared/utils";
import type { SQLiteDB } from './sqlite-db';
import type { PermissionLeaf } from '$lib/shared/permissions';
import { flattenPermissions } from '$lib/shared/utils/permission-utils';
import { PERMISSIONS } from '$lib/shared/permissions';
import type { PermissionsDataHandler } from '../permissions-data-handler';
import { groupPermissionsTable } from '../schema/group-permission-model';

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
    },

    async groupHasPermission(db: BetterSQLite3Database | SQLiteTx, groupId: number, permissionId: string): Promise<boolean> {
        const res = await db
            .select({ hasPermission: max(permissionsTable.permissionId) })
            .from(groupPermissionsTable)
            .where(
                and(
                    eq(groupPermissionsTable.groupId, groupId),
                    eq(groupPermissionsTable.permissionId, permissionId)
                )
            )
            .groupBy(groupPermissionsTable.groupId)
            .execute();

        return res.length > 0 && res[0].hasPermission === permissionId;
    }
} satisfies PermissionsDataHandler;