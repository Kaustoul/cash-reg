import type { INewOrder, IOrder } from '$lib/shared/interfaces/order';
import { eq } from 'drizzle-orm';
import type { OrdersDataHandler } from '../orders-data-handler';
import { ordersTable } from '../schema/order-model';
import type { SQLiteTx } from '../db';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';

export const sqliteOrders = {
    async fetchOrder(
        db: BetterSQLite3Database | SQLiteTx, 
        orderId: number
    ): Promise<IOrder> {
        const res = await db
            .select()
            .from(ordersTable)
            .where(eq(ordersTable.orderId, orderId))
            .limit(1)
        ;

        if (res.length === 0) {
            throw new Error(`Order with ID ${orderId} not found`);
        }

        return res[0];
    },

    async fetchOrders(
        db: BetterSQLite3Database | SQLiteTx, 
        tillId: number
    ): Promise<IOrder[]> {
        const res = await db
            .select()
            .from(ordersTable)
            .where(eq(ordersTable.tillId, tillId))
        ;

        return res;
    },

    async newOrder(
        db: BetterSQLite3Database | SQLiteTx, 
        order: INewOrder
    ): Promise<number> {
        const res = await db
            .insert(ordersTable)
            .values(order)
            .returning({ orderId: ordersTable.orderId })
            .execute()
        ;

        if (res.length <= 0) {
            throw new Error('Failed to create new order');
        }

        return res[0].orderId;
    },
} satisfies OrdersDataHandler;
