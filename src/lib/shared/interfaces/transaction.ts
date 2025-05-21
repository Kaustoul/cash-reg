import type { IMoneySum } from "./money-sum";

export type TransactionReason = "deposit" | "withdraw" | "payment" | "purchase" | "refund" | "transfer" | "unknown" | "customer-deposit";
export type PaymentType = "cash" | "card" | "qr" | "account" | "unknown";
export type TransactionType = Exclude<PaymentType, "account">;

export interface ITransaction {
    transactionId: number;
    tillId: number;
    amount: IMoneySum;
    cashierId?: number | null;
    type: TransactionType;
    reason: TransactionReason;
    note?: string | null;
    createdAt: Date;
}
