import type { ICustomer } from "$lib/shared/interfaces/customer";
import type { IMoneySum } from "$lib/shared/interfaces/money-sum";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { customersTable } from "../schema/customer-model";
import { eq } from "drizzle-orm";

export const sqliteCustomers = {
    async fetchCustomer(db: BetterSQLite3Database, customerId: number): Promise<ICustomer> {
        const res = await db
            .select()
            .from(customersTable)
            .where(eq(customersTable.customerId, customerId))
            .limit(1)
        ;
        
        if (res.length === 0) throw new Error(`Customer with ID ${customerId} not found`);
        return res[0];
    },

    async fetchCustomers(db: BetterSQLite3Database): Promise<ICustomer[]> {
        return await db.select().from(customersTable).execute();
    },

    async newCustomer(db: BetterSQLite3Database, customer: Omit<ICustomer, "customerId" | "createdAt" | "modifiedAt">): Promise<number> {
        const res = await db
            .insert(customersTable)
            .values(customer)
            .returning({ newId: customersTable.customerId })
            .execute();
        return res[0].newId;
    },

    async updateCustomer(db: BetterSQLite3Database, customer: ICustomer): Promise<void> {
        await db
            .update(customersTable)
            .set(customer)
            .where(eq(customersTable.customerId, customer.customerId))
            .execute();
    },

    async removeCustomer(db: BetterSQLite3Database, customerId: number): Promise<void> {
        await db
            .delete(customersTable)
            .where(eq(customersTable.customerId, customerId))
            .execute();
    },

    async updateBalance(db: BetterSQLite3Database, customerId: number, balance: IMoneySum[]): Promise<void> {
        await db
            .update(customersTable)
            .set({ balance })
            .where(eq(customersTable.customerId, customerId))
            .execute();
    }
};