import { groupsTable } from "../schema/group-model";
import { groupPermissionsTable } from "../schema/group-permission-model";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import type { SQLiteTx } from "../db";
import type { IGroup, INewGroup } from "$lib/shared/interfaces/user";
import { and, eq } from "drizzle-orm";

export const sqliteGroups = {
    async newGroup(db: BetterSQLite3Database | SQLiteTx, group: INewGroup): Promise<number> {
        const res = await db
            .insert(groupsTable)
            .values(group)
            .returning({ groupId: groupsTable.groupId })
            .execute();
        return res[0].groupId;
    },

    async fetchGroupById(db: BetterSQLite3Database | SQLiteTx, groupId: number): Promise<IGroup | null> {
        const res = await db
            .select()
            .from(groupsTable)
            .where(eq(groupsTable.groupId, groupId))
            .limit(1)
            .execute();
        return res.length ? res[0] : null;
    },

    async fetchGroups(db: BetterSQLite3Database | SQLiteTx): Promise<IGroup[]> {
        return await db.select().from(groupsTable).execute();
    },

    async updateGroup(db: BetterSQLite3Database | SQLiteTx, groupId: number, group: Partial<INewGroup>): Promise<void> {
        await db.update(groupsTable).set(group).where(eq(groupsTable.groupId, groupId)).execute();
    },

    async setGroupPermission(db: BetterSQLite3Database | SQLiteTx, groupId: number, permissionId: string, enabled: boolean): Promise<void> {
        if (enabled) {
            await db.insert(groupPermissionsTable)
                .values({ groupId, permissionId })
                .onConflictDoNothing()
                .execute();
        } else {
            await db.delete(groupPermissionsTable)
                .where(and(
                    eq(groupPermissionsTable.groupId, groupId),
                    eq(groupPermissionsTable.permissionId, permissionId))
                )
                .execute();
        }
    },

    async fetchGroupPermissions(db: BetterSQLite3Database | SQLiteTx, groupId: number): Promise<string[]> {
        const res = await db
            .select({ permissionId: groupPermissionsTable.permissionId })
            .from(groupPermissionsTable)
            .where(eq(groupPermissionsTable.groupId, groupId))
            .execute();
        return res.filter(r => r.permissionId !== null).map(r => r.permissionId as string);
    }
};