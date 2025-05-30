import { eq, sql } from 'drizzle-orm';
import { 
    type TillsDataHandler 
} from '../tills-data-handler';
import type { SQLiteTx } from '../db';
import { tillsTable } from '$lib/server/db/schema/till-model'
import type { ITill } from '$lib/shared/interfaces/till';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { sqliteTillSessions } from './sqlite-till-sessions-data-handler';
import type { IBalance } from '$lib/shared/interfaces/balance';
import { sumBalances } from '$lib/shared/utils/balance-utils';

export const sqliteTills = {
    async fetchTill(db: BetterSQLite3Database | SQLiteTx, id: number): Promise<ITill> {
        const res = await db
            .select()
            .from(tillsTable)
            .where(eq(tillsTable.id, id))
            .limit(1)
            .execute()
        ;

        if (res.length === 0) {
            throw new Error(`Till with id ${id} not found`);
        }

        return res[0];
    },

    async fetchTills(db: BetterSQLite3Database | SQLiteTx): Promise<ITill[]> {
        const res = await db
            .select()
            .from(tillsTable)
            .execute()

        return res;
    },

    async newTill(db: BetterSQLite3Database | SQLiteTx): Promise<number> {
        const res = await db
            .insert(tillsTable)
            .values({
                balance: {},
            })
            .returning({ newId: tillsTable.id })

        if (res.length <= 0) {
            throw new Error('Failed to create new till');
        }

        return res[0].newId;
    },

    async sumAndUpdateBalance(
        db: BetterSQLite3Database | SQLiteTx,
        tillSessionId: number,
        addBalance: IBalance
    ): Promise<void> {
        await db.transaction(async (tx) => {
            // First, fetch the till ID from the session
            const tillSession = await sqliteTillSessions.fetchSession(tx, tillSessionId);
            if (!tillSession) {
                throw new Error(`Till session with ID ${tillSessionId} not found`);
            }
            
            const res = await tx
                .select({balance: tillsTable.balance})
                .from(tillsTable)
                .where(eq(tillsTable.id, tillSession.tillId))
                .limit(1)
            ;

            if (res.length === 0) {
                throw new Error(`Till with ID ${tillSession.tillId} not found`);
            }

            const balance: IBalance = res[0].balance;
            const updateBalance = sumBalances(balance, addBalance);

            await tx
                .update(tillsTable)
                .set({ balance: updateBalance })
                .where(eq(tillsTable.id, tillSession.tillId))
                .execute()
            ;
        });
    },
} satisfies TillsDataHandler;
