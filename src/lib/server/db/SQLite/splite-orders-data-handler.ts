import type { INewOrder, IOrder } from '$lib/shared/interfaces/order';
import { eq, and, desc, sql, inArray, Column, SQL, isNull } from 'drizzle-orm';
import type { OrdersDataHandler } from '../orders-data-handler';
import { ordersTable } from '../schema/order-model';
import type { SQLiteTx } from '../db';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { productsTable } from '../schema/product-model';
import { itemsTable } from '../schema/item-model';
import { parseFullItemId, parseItemName, reduceFullItemId } from '$lib/shared/utils/item-utils';
import { transactionsTable } from '../schema/money-transfer-model'; // Make sure this import exists
import type { IMoneySum } from '$lib/shared/interfaces/money-sum';

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
        // Start a SQL transaction
        return await db.transaction(async (tx) => {
            // 1. Insert the order
            const res = await tx
                .insert(ordersTable)
                .values(order)
                .returning({ orderId: ordersTable.orderId })
                .execute();

            if (res.length <= 0) {
                throw new Error('Failed to create new order');
            }
            const orderId = res[0].orderId;

            // 2. Create a transaction for the order, except for account payments
            let transactionId: number | null = null;
            if (order.paymentType !== "account") {
                // Find the next transactionId for this till
                const txRes = await tx
                    .select({ newId: sql`MAX(${transactionsTable.transactionId})` })
                    .from(transactionsTable)
                    .where(eq(transactionsTable.tillId, order.tillId));

                transactionId = 1;
                if (txRes.length !== 0 && txRes[0].newId !== null) {
                    transactionId = Number(txRes[0].newId) + 1;
                }

                await tx
                    .insert(transactionsTable)
                    .values({
                        transactionId: transactionId,
                        tillId: order.tillId,
                        amount: order.total,
                        cashierId: 0, // Set appropriately if you have cashier info
                        reason: order.paymentType,
                        orderId: orderId,
                        note: order.note ?? null,
                    })
                    .execute();

                // 3. Update the order with the transactionId
                await tx
                    .update(ordersTable)
                    .set({ transactionId })
                    .where(eq(ordersTable.orderId, orderId))
                    .execute();
            }

            return orderId;
        });
    },

    async fetchUnpaidOrdersForCustomer(
        db: BetterSQLite3Database,
        customerId: number
    ): Promise<{ orderId: number, total: IMoneySum }[]> {
        const res = await db
            .select({ orderId: ordersTable.orderId, total: ordersTable.total })
            .from(ordersTable)
            .where(
                and(
                    eq(ordersTable.customerId, customerId),
                    eq(ordersTable.paymentType, 'account'),
                    isNull(ordersTable.transactionId)
                )
            )
            .execute();
        
        return res;
    }
} satisfies OrdersDataHandler;


function matchDateString(column: Column, date: Date): SQL {
    const targetYear = date.getFullYear();
    const targetMonth = date.getMonth() + 1;  // Months are zero-based in JavaScript, not in SQL
    const targetDay = date.getDate();

    return sql`strftime('%Y', ${column}, 'unixepoch') = ${String(targetYear)}
        AND strftime('%m', ${column}, 'unixepoch') = ${String(targetMonth).padStart(2, '0')}
        AND strftime('%d', ${column}, 'unixepoch') = ${String(targetDay).padStart(2, '0')}`
}
