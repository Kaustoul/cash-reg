import { drizzle, type BetterSQLite3Database} from 'drizzle-orm/better-sqlite3';
import { type DB } from '../db';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { sqliteTills } from './sqlite-tills-data-handler';
import path from 'path';
import type { TillsDataHandler, TransactionReason, TransactionResult } from '../tills-data-handler';
import type { IMoneySum, ITill } from '$lib/shared/interfaces/till';

export class SQLiteDB implements DB {
    db: BetterSQLite3Database;
    tills: TillsDataHandler = sqliteTills;

    constructor(dbFilePath: string) {
        const sqlite = new Database(dbFilePath);
        this.db = drizzle(sqlite);
        this.defaultSchema();
    }

    defaultSchema(): void {
        migrate(this.db, { migrationsFolder: path.join('src', 'lib', 'server', 'db', 'migrations')});
    }

    //---------------\\
    // --- TILLS --- \\
    //---------------\\
    
    async fetchTill(id: number) {
        return this.tills.fetchTill(this.db, id);
    }

    async fetchTills() {
        return this.tills.fetchTills(this.db);
    }

    async newTill(till: ITill) {
        return this.tills.newTill(this.db, till);
    }

    // async saveTill(till) {
    
    async changeBalanceTransaction(
        tillId: number,
        cashierId: number,
        amount: IMoneySum | IMoneySum[],
        reason: TransactionReason,
        note?: string)
    : Promise<TransactionResult>{
        return this.tills.changeBalanceTransaction(
            this.db,
            tillId,
            cashierId,
            amount,
            reason,
            note
        );
    }
}
