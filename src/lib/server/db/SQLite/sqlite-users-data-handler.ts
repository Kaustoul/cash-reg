import { usersTable } from "../schema/user-model";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import type { SQLiteTx } from "../db";
import type { IUser, INewUser } from "$lib/shared/interfaces/user";
import { eq } from "drizzle-orm";
import { cleanObject } from "$lib/shared/utils";

export const sqliteUsers = {
    async newUser(db: BetterSQLite3Database | SQLiteTx, user: INewUser): Promise<number> {
        const res = await db
            .insert(usersTable)
            .values({...user, lastIp: null, lastLogin: null})
            .returning({ userId: usersTable.userId })
            .execute();
        return res[0].userId;
    },

    async fetchUserById(db: BetterSQLite3Database | SQLiteTx, userId: number): Promise<IUser | null> {
        const res = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.userId, userId))
            .limit(1)
            .execute();
        return res.length ? res[0] : null;
    },

    async fetchAllUsers(db: BetterSQLite3Database | SQLiteTx): Promise<IUser[]> {
        return await db
            .select()
            .from(usersTable)
            .execute();
    },

    async updateUserGroup(db: BetterSQLite3Database | SQLiteTx, userId: number, groupId: number): Promise<void> {
        await db
            .update(usersTable)
            .set({ groupId })
            .where(eq(usersTable.userId, userId))
            .execute();
    },

    async updateUserPassword(db: BetterSQLite3Database | SQLiteTx, userId: number, passwordHash: string, mustChangePassword: boolean): Promise<void> {
        await db
            .update(usersTable)
            .set({ passwordHash, mustChangePassword })
            .where(eq(usersTable.userId, userId))
            .execute();
    },

    async onUserLogin(db: BetterSQLite3Database | SQLiteTx, userId: number, ip: string): Promise<void> {
        await db
            .update(usersTable)
            .set({ lastLogin: new Date(), lastIp: ip })
            .where(eq(usersTable.userId, userId))
            .execute();
    },

    async updateUserInfo(db: BetterSQLite3Database | SQLiteTx, userId: number, data: {name?: string, surname?: string}): Promise<void> {
        await db
            .update(usersTable)
            .set(cleanObject(data))
            .where(eq(usersTable.userId, userId))
            .execute();
    },
};