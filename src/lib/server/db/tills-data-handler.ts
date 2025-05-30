import type { ITill } from "$lib/shared/interfaces/till";
import type { IMoneySum } from "$lib/shared/interfaces/money-sum";
import type { Databases, Transactions } from "./db";
import type { IBalance } from "$lib/shared/interfaces/balance";

export interface TillsDataHandler {
    fetchTill(db: Databases | Transactions, tillId: number): Promise<ITill>;
    fetchTills(db: Databases | Transactions): Promise<ITill[]>;
    newTill(db: Databases | Transactions): Promise<number>;
    //saveTill(db: Databases | Transactions, till: ITill): Promise<void>;
    //saveTills(db: Databases | Transactions, tills: ITill[]): Promise<void>;
    // changeStatus(db: Databases | Transactions, tillId: number, status: TillStatus): Promise<void>;
    sumAndUpdateBalance(db: Databases | Transactions, tillSessionId: number, balance: IBalance): Promise<void>;
}
