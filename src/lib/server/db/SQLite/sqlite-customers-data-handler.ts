import type { ICustomer } from "$lib/shared/interfaces/customer";
import type { IMoneySum } from "$lib/shared/interfaces/money-sum";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { customersTable } from "../schema/customer-model";
import { ordersTable } from "../schema/order-model";
import { eq, and, isNull } from "drizzle-orm";
import { sqliteOrders } from "./splite-orders-data-handler"; // adjust import as needed
import type { SQLiteTx } from "../db";
import { cleanObject } from "$lib/shared/utils";
import type { IDiscount } from "$lib/shared/interfaces/discount";
import { asMoneySum, sumMoneySums } from "$lib/shared/utils/money-sum-utils";

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
            unpaidAmount: unpaidSums.length > 0 ? asMoneySum(sumMoneySums(...unpaidSums)) : null,
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
                unpaidAmount: unpaidSums.length > 0 ? asMoneySum(sumMoneySums(...unpaidSums)) : null,
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

    async updateCustomer(db: BetterSQLite3Database, customerId: number, data: {name?: string, surname?: string, email?: string, discount?: IDiscount | undefined}): Promise<void> {
        await db
            .update(customersTable)
            .set(cleanObject(data))
            .where(eq(customersTable.customerId, customerId))
            .execute();
    },

    async removeCustomer(db: BetterSQLite3Database, customerId: number): Promise<void> {
        await db
            .delete(customersTable)
            .where(eq(customersTable.customerId, customerId))
            .execute();
    },

    async updateBalance(db: BetterSQLite3Database | SQLiteTx, customer: ICustomer, newBalance: IMoneySum): Promise<void> {
        await db
            .update(customersTable)
            .set({ balance: newBalance })
            .where(eq(customersTable.customerId, customer.customerId))
            .execute();

        //     let newBalances = []
        //     for (let balance of customer.balance) {
        //         if (balance.currency === newBalance.currency) {
        //             balance.value = newBalance.value;
        //         }

        //         newBalances.push(balance);
        //     }

        //     await db
        //         .update(customersTable)
        //         .set({ balance: newBalances })
        //         .where(eq(customersTable.customerId, customer.customerId))
        //         .execute();
        // }
    }
};