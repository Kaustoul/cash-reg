import { drizzle, type BetterSQLite3Database} from 'drizzle-orm/better-sqlite3';
import { type DB } from '../db';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { sqliteTills } from './sqlite-tills-data-handler';
import path from 'path';
import type { TillsDataHandler, TransactionReason, TransactionResult } from '../tills-data-handler';
import type { IMoneySum, ITill, TillStatus } from '$lib/shared/interfaces/till';
import { sql } from 'drizzle-orm';

export class SQLiteDB implements DB {
    readonly db: BetterSQLite3Database;
    readonly _tills: TillsDataHandler;

    constructor(dbFilePath: string) {
        const sqlite = new Database(dbFilePath);
        this.db = drizzle(sqlite);
        this.defaultSchema();

        this._tills = sqliteTills;
    }

    defaultSchema(): void {
        console.log('Creating default schema');
        migrate(this.db, { migrationsFolder: path.join('src', 'lib', 'server', 'db', 'migrations')});
    }

    //---------------\\
    // --- TILLS --- \\
    //---------------\\
    
    async fetchTill(id: number) {
        return await this._tills.fetchTill(this.db, id);
    }

    async fetchTills() {
        return await this._tills.fetchTills(this.db);
    }

    async newTill() {
        return await this._tills.newTill(this.db);
    }

    async changeStatus(tillId: number, status: TillStatus) {
        return await this._tills.changeStatus(this.db, tillId, status);
    }

    // async saveTill(till) {
    
    async changeBalanceTransaction(
        tillId: number,
        cashierId: number,
        amount: IMoneySum | IMoneySum[],
        reason: TransactionReason,
        note?: string)
    : Promise<TransactionResult>{
        return this._tills.changeBalanceTransaction(
            this.db,
            tillId,
            cashierId,
            amount,
            reason,
            note
        );
    }
}
