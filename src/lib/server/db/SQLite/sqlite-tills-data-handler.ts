import { eq, sql } from 'drizzle-orm';
import { 
    type TillsDataHandler 
} from '../tills-data-handler';
import type { SQLiteTx } from '../db';
import { tillsTable } from '$lib/server/db/schema/till-model'
import type { ITill, TillStatus } from '$lib/shared/interfaces/till';
import type { IMoneySum } from '$lib/shared/interfaces/money-sum';
import Decimal from 'decimal.js';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { transactionsTable } from '../schema/money-transfer-model';

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
                balance: [],
            })
            .returning({ newId: tillsTable.id })

        if (res.length <= 0) {
            throw new Error('Failed to create new till');
        }

        return res[0].newId;
    },

    async changeStatus(db: BetterSQLite3Database | SQLiteTx, tillId: number, status: TillStatus): Promise<void> {
        await db
            .update(tillsTable)
            .set({ status: status })
            .where(eq(tillsTable.id, tillId))
            .execute()
        ;  
    },

    async updateBalance(
        db: BetterSQLite3Database | SQLiteTx,
        tillId: number,
        updateValue: IMoneySum
    ): Promise<void> {
        const res = await db
            .select({balance: tillsTable.balance})
            .from(tillsTable)
            .where(eq(tillsTable.id, tillId))
            .limit(1)
        ;

        if (res.length === 0) {
            throw new Error(`Till with ID ${tillId} not found`);
        }

        const balances: IMoneySum[] = res[0].balance;
        let sumIdx = balances.findIndex((balance) => balance.currency === updateValue.currency);

        if (sumIdx === -1) {
            balances.push({value: "0", currency: updateValue.currency});
            sumIdx = 0;
        }

        balances[sumIdx] = {
            value: new Decimal(balances[sumIdx].value).add(new Decimal(updateValue.value)).toString(),
            currency: balances[sumIdx].currency,
        };

        await db
            .update(tillsTable)
            .set({ balance: balances })
            .where(eq(tillsTable.id, tillId))
            .execute()
        ;
    },

    async recordBalanceUpdate(
        db: BetterSQLite3Database | SQLiteTx,
        tillId: number, 
        updateAmount: IMoneySum,
        reason: 'cash-payment', 
        orderId?: number,
        note?: string
    ): Promise<void> {
        const res = await db
            .select({ newId: sql`MAX(${transactionsTable.transactionId})` })
            .from(transactionsTable)
            .where(eq(transactionsTable.tillId, tillId))
        ;

        let newId = 1;
        if (res.length !== 0 && res[0].newId !== null) {
            newId = Number(res[0].newId) + 1;
        }

        await db
            .insert(transactionsTable)
            .values({
                transactionId: newId,
                tillId: tillId,
                amount: updateAmount,
                cashierId: 0,
                reason: reason,
                orderId: orderId,
                note: note,
            })
            .execute()
        ;

    },
} satisfies TillsDataHandler;
