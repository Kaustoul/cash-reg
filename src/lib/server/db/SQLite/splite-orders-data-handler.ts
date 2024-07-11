import type { INewOrder, IOrder } from '$lib/shared/interfaces/order';
import { eq, and, desc, sql, inArray, Column, SQL } from 'drizzle-orm';
import type { OrdersDataHandler } from '../orders-data-handler';
import { ordersTable } from '../schema/order-model';
import type { SQLiteTx } from '../db';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { productsTable } from '../schema/product-model';
import { itemsTable } from '../schema/item-model';
import { parseFullItemId, parseItemName, reduceFullItemId } from '$lib/shared/utils/item-utils';

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

        for (const order of res) {
            const productIds = []
            const itemIds = []
            for (const key of order.items) {
                const [productId, itemId] = reduceFullItemId(key.fullId);
                productIds.push(productId);
                itemIds.push(itemId);
            }

            const names = await db
                .select({
                    productId: itemsTable.productId,
                    itemId: itemsTable.itemId,
                    name: productsTable.name,
                    subname: itemsTable.subname
                })
                .from(itemsTable)
                .innerJoin(productsTable, eq(productsTable.productId, itemsTable.productId))
                .where(inArray(itemsTable.productId, productIds))
            ;

            const nameMap = names.reduce((map, name) => {
                map[parseFullItemId(name.productId, name.itemId)] = parseItemName(name.name, name.subname);
                return map;
            }, {} as Record<number, string>);


            for (const item of order.items) {
                item.name = nameMap[Number(item.fullId)];
            }
        }

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
