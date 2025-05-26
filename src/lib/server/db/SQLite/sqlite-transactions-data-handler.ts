import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import type { SQLiteTx } from "../db";
import { transactionsTable } from "../schema/money-transfer-model";
import { tillSessionsTable } from "../schema/till-session-model";
import type { ITransaction } from "$lib/shared/interfaces/transaction";
import { eq } from "drizzle-orm";

export const sqliteTransactions = {
    async fetchTransaction(db: BetterSQLite3Database | SQLiteTx, transactionId: number): Promise<ITransaction | null> {
        const res = await db
            .select({
                transactionId: transactionsTable.transactionId,
                tillSessionId: tillSessionsTable.tillSessionId,
                amount: transactionsTable.amount,
                type: transactionsTable.type,
                reason: transactionsTable.reason,
                note: transactionsTable.note,
                createdAt: transactionsTable.createdAt,
            })
            .from(transactionsTable)
            .innerJoin(
                tillSessionsTable,
                eq(transactionsTable.tillSessionId, tillSessionsTable.tillSessionId)
            )
            .where(eq(transactionsTable.transactionId, transactionId))
            .limit(1)
            .execute();
        return res.length > 0 ? res[0] : null;
    },

    async newTransaction(db: BetterSQLite3Database | SQLiteTx, transaction: Omit<ITransaction, "transactionId" | "createdAt">): Promise<number> {
        const res = await db
            .insert(transactionsTable)
            .values(transaction)
            .returning({ transactionId: transactionsTable.transactionId })
            .execute();
        return res[0].transactionId;
    },

    async fetchTillTransactions(db: BetterSQLite3Database | SQLiteTx, tillId: number): Promise<ITransaction[]> {
        return await db
            .select({
                transactionId: transactionsTable.transactionId,
                tillSessionId: tillSessionsTable.tillSessionId,
                cashierId: tillSessionsTable.cashierId,
                amount: transactionsTable.amount,
                type: transactionsTable.type,
                reason: transactionsTable.reason,
                note: transactionsTable.note,
                createdAt: transactionsTable.createdAt,
            })
            .from(transactionsTable)
            .innerJoin(
                tillSessionsTable,
                eq(transactionsTable.tillSessionId, tillSessionsTable.tillSessionId)
            )
            .where(eq(tillSessionsTable.tillSessionId, tillSessionsTable.tillSessionId))
            .execute();
    }
};