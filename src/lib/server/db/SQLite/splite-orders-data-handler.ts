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
import { sqliteTransactions } from './sqlite-transactions-data-handler';
import { sqliteTills } from './sqlite-tills-data-handler';
import { sumMoneySums } from '$lib/shared/utils/money-sum-utils';
import { sqliteCustomers } from './sqlite-customers-data-handler';
import Decimal from 'decimal.js';
import { customerPaymentsTable } from '../schema/customer-payment-model';
import { tillSessionsTable } from '../schema/till-session-model';

function matchDateString(column: Column, date: Date): SQL {
    const targetYear = date.getFullYear();
    const targetMonth = date.getMonth() + 1;  // Months are zero-based in JavaScript, not in SQL
    const targetDay = date.getDate();

    return sql`strftime('%Y', ${column}, 'unixepoch') = ${String(targetYear)}
        AND strftime('%m', ${column}, 'unixepoch') = ${String(targetMonth).padStart(2, '0')}
        AND strftime('%d', ${column}, 'unixepoch') = ${String(targetDay).padStart(2, '0')}`
}

export const sqliteOrders = {
    async fetchOrder(
        db: BetterSQLite3Database | SQLiteTx, 
        orderId: number
    ): Promise<IOrder> {
        const res = await db
            .select({
                orderId: ordersTable.orderId,
                customerId: ordersTable.customerId,
                subtotal: ordersTable.subtotal,
                discounts: ordersTable.discounts,
                total: ordersTable.total,
                paymentType: ordersTable.paymentType,
                transactionId: ordersTable.transactionId,
                createdAt: ordersTable.createdAt,
                items: ordersTable.items,
                note: ordersTable.note,
                tillId: tillSessionsTable.tillId,
                cashierId: tillSessionsTable.cashierId
            })
            .from(ordersTable)
            .innerJoin(
                tillSessionsTable,
                eq(ordersTable.tillSessionId, tillSessionsTable.tillSessionId)
            )
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
            .select({
                orderId: ordersTable.orderId,
                customerId: ordersTable.customerId,
                subtotal: ordersTable.subtotal,
                discounts: ordersTable.discounts,
                total: ordersTable.total,
                paymentType: ordersTable.paymentType,
                transactionId: ordersTable.transactionId,
                createdAt: ordersTable.createdAt,
                items: ordersTable.items,
                note: ordersTable.note,
                tillSessionId: ordersTable.tillSessionId,
                tillId: tillSessionsTable.tillId,
                cashierId: tillSessionsTable.cashierId
            })
            .from(ordersTable)
            .innerJoin(
                tillSessionsTable,
                eq(ordersTable.tillSessionId, tillSessionsTable.tillSessionId)
            )
            .where(sql`${matchDateString(ordersTable.createdAt, date)}`)
            .orderBy(desc(ordersTable.createdAt))
            .execute();

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
            .select({
                orderId: ordersTable.orderId,
                customerId: ordersTable.customerId,
                subtotal: ordersTable.subtotal,
                discounts: ordersTable.discounts,
                total: ordersTable.total,
                paymentType: ordersTable.paymentType,
                transactionId: ordersTable.transactionId,
                createdAt: ordersTable.createdAt,
                items: ordersTable.items,
                note: ordersTable.note,
                tillSessionId: ordersTable.tillSessionId,
                tillId: tillSessionsTable.tillId,
                cashierId: tillSessionsTable.cashierId
            })
            .from(ordersTable)
            .innerJoin(
                tillSessionsTable,
                eq(ordersTable.tillSessionId, tillSessionsTable.tillSessionId)
            )
            .where(
                and(
                    eq(tillSessionsTable.tillId, tillId),
                    sql`${matchDateString(ordersTable.createdAt, date)}`
                )
            )
            .orderBy(desc(ordersTable.createdAt))
            .execute();

        return res;
    },

    async newOrder(
        db: BetterSQLite3Database | SQLiteTx, 
        order: INewOrder,
    ): Promise<number> {
        // Start a SQL transaction
        return await db.transaction(async (tx) => {
            let transactionId: number | null = null;
            if (order.paymentType !== "account") {
                transactionId = await sqliteTransactions.newTransaction(tx, {
                    tillId: order.tillId,
                    amount: order.total,
                    cashierId: 0, 
                    reason: "purchase",
                    type: order.paymentType,
                    note: order.note ?? null,
                });

                if (order.paymentType === "cash") {
                    await sqliteTills.updateBalance(tx, order.tillId, order.total)
                }
            } else {
                // Check if customer has enough balance
                const customerId = order.customerId;
                if (!customerId) {
                    throw new Error('Customer ID is required for account payment');
                }
                const customer = await sqliteCustomers.fetchCustomer(tx, customerId);

                // Pay from customer balance if customer has enough balance
                if (new Decimal(order.total.value).lte(new Decimal(customer.balance[0].value))) {
                    const lastPayment = await tx
                        .select()
                        .from(customerPaymentsTable)
                        .where(
                            and(
                                eq(customerPaymentsTable.customerId, customerId),
                                eq(customerPaymentsTable.destination, 'balance')
                            )
                        )

                        .orderBy(desc(customerPaymentsTable.createdAt))
                        .limit(1)
                    ;

                    transactionId = lastPayment.length > 0 ? lastPayment[0].transactionId : null;

                    const newBalance = sumMoneySums([customer.balance, [{value: "-" + order.total.value, currency: order.total.currency}]])[0];
                    await sqliteCustomers.updateBalance(tx, customer, newBalance);
                }
            }

            const res = await tx
                .insert(ordersTable)
                .values(transactionId ? {...order, transactionId} : order)
                .returning({ orderId: ordersTable.orderId })
                .execute();

            if (res.length <= 0) {
                throw new Error('Failed to create new order');
            }

            const orderId = res[0].orderId;

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
    },

    async markOrderAsPaid(
        db: BetterSQLite3Database | SQLiteTx,
        orderId: number,
        transactionId: number
    ): Promise<void> {
        await db
            .update(ordersTable)
            .set({ transactionId })
            .where(eq(ordersTable.orderId, orderId))
            .execute();
    },

    async fetchOrderByTransactionId(
        db: BetterSQLite3Database | SQLiteTx,
        transactionId: number
    ): Promise<IOrder | null> {
        const res = await db
            .select({
                orderId: ordersTable.orderId,
                customerId: ordersTable.customerId,
                subtotal: ordersTable.subtotal,
                discounts: ordersTable.discounts,
                total: ordersTable.total,
                paymentType: ordersTable.paymentType,
                transactionId: ordersTable.transactionId,
                createdAt: ordersTable.createdAt,
                items: ordersTable.items,
                note: ordersTable.note,
                tillSessionId: ordersTable.tillSessionId,
                tillId: tillSessionsTable.tillId,
                cashierId: tillSessionsTable.cashierId
            })
            .from(ordersTable)
            .innerJoin(
                tillSessionsTable,
                eq(ordersTable.tillSessionId, tillSessionsTable.tillSessionId)
            )
            .where(eq(ordersTable.transactionId, transactionId))
            .limit(1)
            .execute();

        return res.length > 0 ? res[0] : null;
    },
} satisfies OrdersDataHandler;
