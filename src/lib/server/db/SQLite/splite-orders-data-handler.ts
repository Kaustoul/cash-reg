import type { INewOrder, IOrder } from '$lib/shared/interfaces/order';
import { eq, and, desc, sql, Column, SQL } from 'drizzle-orm';
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
        date: Date = new Date()
    ): Promise<IOrder[]> {
        const res = await db
            .select()
            .from(ordersTable)
            .where(sql`${matchDateString(ordersTable.createdAt, date)}`)
            .orderBy(desc(ordersTable.createdAt))
        ;

        return res;
    },

    async fetchTillOrders(
        db: BetterSQLite3Database | SQLiteTx, 
        tillId: number,
        date: Date = new Date()
    ): Promise<IOrder[]> {

        const res = await db
            .select()
            .from(ordersTable)
            .where(and(eq(ordersTable.tillId, tillId), sql`${matchDateString('', date)}`))
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


function matchDateString(column: Column, date: Date): SQL {
    const targetYear = date.getFullYear();
    const targetMonth = date.getMonth() + 1;  // Months are zero-based in JavaScript, not in SQL
    const targetDay = date.getDate();

    return sql`strftime('%Y', ${column}, 'unixepoch') = ${String(targetYear)}
        AND strftime('%m', ${column}, 'unixepoch') = ${String(targetMonth).padStart(2, '0')}
        AND strftime('%d', ${column}, 'unixepoch') = ${String(targetDay).padStart(2, '0')}`
}
