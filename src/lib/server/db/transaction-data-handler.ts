import type { Databases, Transactions } from "./db";
import type { ITransaction } from "$lib/shared/interfaces/transaction";

export interface TransactionsDataHandler {
    fetchTransaction(db: Databases | Transactions, transactionId: number): Promise<ITransaction | null>;
    newTransaction(db: Databases | Transactions, transaction: Omit<ITransaction, "transactionId" | "createdAt">): Promise<number>;
    fetchTillTransactions(db: Databases | Transactions, tillId: number): Promise<ITransaction[]>;
}