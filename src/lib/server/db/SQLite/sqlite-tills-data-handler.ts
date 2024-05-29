import { eq } from 'drizzle-orm';
import { TransactionReason, TransactionResult, type SQLiteTx, type TillsDataHandler } from '../tills-data-handler';
import { tillsTable } from '$lib/server/db/schema/till-model'
import { type IMoneySum, type ITill } from '$lib/shared/interfaces/till';
import Decimal from 'decimal.js';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { transactionsTable } from '../schema/money-transfer-model';
import { ensureArray } from '$lib/shared/utils';

export const sqliteTills = {
    async fetchTill(db: BetterSQLite3Database | SQLiteTx, id: number): Promise<ITill> {
        const res = await (db)
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
    
    async changeBalanceTransaction(
        db: BetterSQLite3Database | SQLiteTx ,
        tillId: number,
        cashierId: number,
        amount: IMoneySum | IMoneySum[],
        reason: TransactionReason,
        note?: string
    ): Promise<TransactionResult> {

        const amounts: IMoneySum[] = ensureArray(amount);
        const res = await db.transaction(async (tx: SQLiteTx) => {
            let till;
            try {
                till = await this.fetchTill(tx, tillId);
            } catch (e) {
                tx.rollback();
                return false;
            }

            if (till === undefined) {
                tx.rollback();
                return false;
            }
            
            for (const _amount of amounts) {
                const sumIdx = till.balance.findIndex((balance) => balance.currency === _amount.currency);
        
                if (sumIdx === -1) {
                    till.balance.push(_amount);
                } else {
                    till.balance[sumIdx].value = new Decimal(till.balance[sumIdx].value)
                        .add(new Decimal(_amount.value)).toString()
                ;
                }
            }
        
            await db
                .update(tillsTable)
                .set({ balance: till.balance })
                .where(eq(tillsTable.id, tillId))
                .execute()
            ;

            await db
                .insert(transactionsTable)
                .values({
                    tillId: tillId,
                    cashierId: cashierId,
                    amounts: amounts,
                    reason: reason,
                    note: note,
                })
            ;

            return true;
        });

        return res ? TransactionResult.SUCCESS : TransactionResult.ERROR;
    }

} satisfies TillsDataHandler;
