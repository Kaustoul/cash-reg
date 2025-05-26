import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import type { SQLiteTx } from "../db";
import { tillSessionsTable } from "../schema/till-session-model";
import type { ITillSession, INewTillSession } from "$lib/shared/interfaces/till-session";
import { eq } from "drizzle-orm";

export const sqliteTillSessions = {
    async fetchSession(db: BetterSQLite3Database | SQLiteTx, id: number): Promise<ITillSession | null> {
        const res = await db
            .select()
            .from(tillSessionsTable)
            .where(eq(tillSessionsTable.tillSessionId, id))
            .limit(1)
            .execute();
        return res.length > 0 ? res[0] : null;
    },

    async fetchSessionsForTill(db: BetterSQLite3Database | SQLiteTx, tillId: number): Promise<ITillSession[]> {
        return await db
            .select()
            .from(tillSessionsTable)
            .where(eq(tillSessionsTable.tillId, tillId))
            .execute();
    },

    async newSession(db: BetterSQLite3Database | SQLiteTx, session: INewTillSession): Promise<number> {
        const res = await db
            .insert(tillSessionsTable)
            .values(session)
            .returning({ id: tillSessionsTable.tillSessionId })
            .execute();
        return res[0].id;
    }
};