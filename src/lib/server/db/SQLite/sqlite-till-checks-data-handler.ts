import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import type { SQLiteTx } from "../db";
import { tillChecksTable } from "../schema/till-check-model";
import { tillSessionsTable } from "../schema/till-session-model";
import type { ITillCheck, INewTillCheck } from "$lib/shared/interfaces/till-check";
import { eq, and, sql } from "drizzle-orm";

export const sqliteTillChecks = {
    async fetchCheck(db: BetterSQLite3Database | SQLiteTx, tillCheckId: number): Promise<ITillCheck | null> {
        const res = await db
            .select()
            .from(tillChecksTable)
            .where(eq(tillChecksTable.tillCheckId, tillCheckId))
            .limit(1)
            .execute();
        return res.length > 0 ? res[0] : null;
    },

    async fetchChecksForSession(db: BetterSQLite3Database | SQLiteTx, tillSessionId: number): Promise<ITillCheck[]> {
        return await db
            .select()
            .from(tillChecksTable)
            .where(eq(tillChecksTable.tillSessionId, tillSessionId))
            .execute();
    },

    async newCheck(db: BetterSQLite3Database | SQLiteTx, check: INewTillCheck): Promise<number> {
        const res = await db
            .insert(tillChecksTable)
            .values(check)
            .returning({ id: tillChecksTable.tillCheckId })
            .execute();
        return res[0].id;
    },

    async fetchChecksForTill(
        db: BetterSQLite3Database | SQLiteTx,
        tillSessionId: number,
        date?: Date
    ): Promise<ITillCheck[]> {
        let conditions = [eq(tillSessionsTable.tillSessionId, tillSessionId)];

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            conditions.push(
                sql`${tillChecksTable.createdAt} >= ${Math.floor(startOfDay.getTime() / 1000)}`,
                sql`${tillChecksTable.createdAt} <= ${Math.floor(endOfDay.getTime() / 1000)}`
            );
        }

        const res = await db
            .select()
            .from(tillChecksTable)
            .innerJoin(tillSessionsTable, eq(tillChecksTable.tillSessionId, tillSessionsTable.tillSessionId))
            .where(and(...conditions))
            .execute();

        // Map to just ITillCheck:
        return res.map(r => r.till_checks ?? r);
    }
};