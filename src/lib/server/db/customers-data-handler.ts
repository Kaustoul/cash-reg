import type { ICustomer } from "$lib/shared/interfaces/customer";
import type { IMoneySum } from "$lib/shared/interfaces/money-sum";
import type { Databases, Transactions } from "./db";

export interface CustomersDataHandler {
    fetchCustomer(db: Databases | Transactions, customerId: number): Promise<ICustomer>;
    fetchCustomers(db: Databases | Transactions): Promise<ICustomer[]>;
    newCustomer(db: Databases | Transactions, customer: Omit<ICustomer, "customerId" | "createdAt" | "modifiedAt">): Promise<number>;
    updateCustomer(db: Databases | Transactions, customer: ICustomer): Promise<void>;
    removeCustomer(db: Databases | Transactions, customerId: number): Promise<void>;
    updateBalance(db: Databases | Transactions, customer: ICustomer, balance: IMoneySum[]): Promise<void>; // <-- Add this
}