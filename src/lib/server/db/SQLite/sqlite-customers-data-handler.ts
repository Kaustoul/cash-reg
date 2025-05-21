import type { ICustomer } from "$lib/shared/interfaces/customer";
import type { IMoneySum } from "$lib/shared/interfaces/money-sum";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { customersTable } from "../schema/customer-model";
import { ordersTable } from "../schema/order-model";
import { eq, and, isNull } from "drizzle-orm";
import { sqliteOrders } from "./splite-orders-data-handler"; // adjust import as needed
import { combineSums } from "$lib/shared/utils/money-sum-utils";
import type { SQLiteTx } from "../db";

export const sqliteCustomers = {
    async fetchCustomer(db: BetterSQLite3Database, customerId: number): Promise<ICustomer> {
        const res = await db
            .select()
            .from(customersTable)
            .where(eq(customersTable.customerId, customerId))
            .limit(1)
            .execute();

        if (res.length === 0) throw new Error(`Customer with ID ${customerId} not found`);
        const customer = res[0];

        // Fetch unpaid orders for this customer using the orders data handler
        const unpaidOrders = await sqliteOrders.fetchUnpaidOrdersForCustomer(db, customer.customerId);
        const unpaidSums = unpaidOrders.map(o => o.total);

        return {
            ...customer,
            unpaidAmount: unpaidSums.length > 0 ? combineSums(unpaidSums) : [],
            unpaidOrders: unpaidOrders.map(o => o.orderId),
        };
    },

    async fetchCustomers(db: BetterSQLite3Database): Promise<ICustomer[]> {
        const customers = await db.select().from(customersTable).execute();
        let updatedCustomers: ICustomer[] = [];
        // For each customer, fetch their unpaid orders and calculate unpaidAmount and unpaidOrders (as order IDs)
        for (const customer of customers) {
            const unpaidOrders = await sqliteOrders.fetchUnpaidOrdersForCustomer(db, customer.customerId);
            const unpaidSums = unpaidOrders.map(o => o.total);

            updatedCustomers.push({
                ...customer,
                unpaidAmount: unpaidSums.length > 0 ? combineSums(unpaidSums) : [],
                unpaidOrders: unpaidOrders.map(o => o.orderId),
            });
        }

        return updatedCustomers;
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

    async updateBalance(db: BetterSQLite3Database | SQLiteTx, customer: ICustomer, newBalance: IMoneySum | IMoneySum[]): Promise<void> {
        if (newBalance instanceof Array) {
            await db
                .update(customersTable)
                .set({ balance: newBalance })
                .where(eq(customersTable.customerId, customer.customerId))
                .execute();
        } else {
            customer.balance.forEach((b) => {
                if (b.currency === newBalance.currency) {
                    console.log("Updating balance for customer:", customer.customerId);
                    console.log("Old balance:", b);
                    console.log("New balance:", newBalance);
                    b = newBalance;
                }
            });

            await db
                .update(customersTable)
                .set({ balance: customer.balance })
                .where(eq(customersTable.customerId, customer.customerId))
                .execute();
        }
    }
};