import type { IMoneySum, ITill } from "$lib/shared/interfaces/till";
import type { Databases, Transactions } from "./db";

export enum TransactionReason {
    DEPOSIT = "DEPOSIT",
    WITHDRAW = "WITHDRAW",
    PAYMENT = "PAYMENT",
    PURCHASE = "PURCHASE",
    REFUND = "REFUND",
    TRANSFER = "TRANSFER",
    UNKNOWN = "UNKNOWN",
}

export enum TransactionResult {
    SUCCESS = "SUCCESS",
    INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS",
    ERROR = "ERROR",
}



export interface TillsDataHandler {
    fetchTill(db: Databases | Transactions, id: number): Promise<ITill>;
    fetchTills(db: Databases | Transactions): Promise<ITill[]>;
    newTill(db: Databases | Transactions, till: ITill): Promise<number>;
    //saveTill(db: Databases | Transactions, till: ITill): Promise<void>;
    //saveTills(db: Databases | Transactions, tills: ITill[]): Promise<void>;

    changeBalanceTransaction(
        db: Databases | Transactions,
        tillId: number,
        cashierId: number,
        amount: IMoneySum | IMoneySum[],
        reason: TransactionReason,
        note?: string
    ): Promise<TransactionResult>;
}
