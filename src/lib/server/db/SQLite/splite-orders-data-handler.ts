import type { INewOrder, IOrder } from '$lib/shared/interfaces/order';
import { eq, and, desc, sql, inArray, Column, SQL, isNull, is } from 'drizzle-orm';
import type { OrdersDataHandler } from '../orders-data-handler';
import { ordersTable } from '../schema/order-model';
import type { SQLiteTx } from '../db';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { productsTable } from '../schema/product-model';
import { productVariantsTable } from '../schema/product-variant-model';
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
import type { IShoppingCart } from '$lib/shared/interfaces/shopping-cart';
import { sqliteCustomerPayments } from './sqlite-customer-payment-data-handler';

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
                transactionId: ordersTable.transactionId,
                createdAt: ordersTable.createdAt,
                items: ordersTable.items,
                note: ordersTable.note,
                tillSessionId: tillSessionsTable.tillSessionId,
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
                    productId: productVariantsTable.productId,
                    itemId: productVariantsTable.itemId,
                    name: productsTable.name,
                    subname: productVariantsTable.subname
                })
                .from(productVariantsTable)
                .innerJoin(productsTable, eq(productsTable.productId, productVariantsTable.productId))
                .where(inArray(productVariantsTable.productId, productIds))
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
        order: IShoppingCart,
    ): Promise<number> {
        if (!order.checkout || !order.checkout["CZK"]) {
            // Currently only CZK currency is supported for orders
            throw new Error('Order must have a checkout with CZK currency');
        }

        return await db.transaction(async (tx) => {
            if (order.checkout.cash) {
                // If there is a cash payment, we need to update the till balance
                await sqliteTills.sumAndUpdateBalance(tx, order.tillSessionId, order.checkout)
            }

            const isCashPayment = order.checkout.cash !== undefined;
            const isCardPayment = order.checkout.cash !== undefined;
            const isQrPayment = order.checkout.cash !== undefined;
            const isAccountPayment = order.checkout.cash !== undefined;

            if (!isCashPayment && !isCardPayment && !isQrPayment && !isAccountPayment) {
                throw new Error('Order must have at least one payment method');
            }
            
            let customer = null;
            let customerRemainder = null
            let isPaid = !order.checkout["CZK"].account;

            if (isAccountPayment) {
                if (!order.customerId) {
                    throw new Error('Customer ID is required for account payment');
                }

                customer = await sqliteCustomers.fetchCustomer(tx, order.customerId);
                if (!customer) {
                    throw new Error(`Customer with ID ${order.customerId} not found`);
                }

                // TODO Implement currency conversions
                // For now, we assume all account payments are in the same currency
                customerRemainder = new Decimal(customer.balance["CZK"]).sub(new Decimal(order.total["CZK"]))
                if (!customer.balance["CZK"] || customerRemainder.lt(0)) {
                    isPaid = false;                    
                } 
            }

            const transactionId = await sqliteTransactions.newTransaction(tx, {
                tillSessionId: order.tillSessionId,
                amount: order.checkout,
                isPaid: !customerRemainder || customerRemainder.gte(0),
                paymentType: isPaid ? 'account' : 'mixed',
                reason: "purchase",
                note: order.note ?? null,
            });

            const orderItems: IOrder["items"] = order.items.map(item => {
                return {
                    fullId: parseFullItemId(item.productId, item.itemId),
                    quantity: item.quantity.toString(),
                    price: item.prices[item.priceIdx],
                    discounts: item.discounts,
                    subtotal: item.subtotal.toString(),
                    total: item.total.toString(),
                    name: item.name
                }
            });

            const newOrder = await tx
                .insert(ordersTable)
                .values({...order, items: orderItems, transactionId})
                .returning({ orderId: ordersTable.orderId })
                .execute()
            ;

            if (!newOrder || newOrder.length === 0) {
                throw new Error('Failed to create new order');
            }

            const newOrderId = newOrder[0].orderId;

            if (order.checkout["CZK"].account && customerRemainder && customer && isPaid) {
                await sqliteCustomerPayments.newCustomerPayment(tx, {
                    customerId: customer.customerId,
                    transactionId,
                    orderId: newOrderId, 
                    amount: order.total, 
                    destination: 'balance'
                });
                
                await sqliteCustomers.updateBalance(tx, customer, {...customer.balance, "CZK": customerRemainder.toString()});
            }

            return newOrderId;
        });
    },

    async fetchUnpaidOrdersForCustomer(
        db: BetterSQLite3Database,
        customerId: number
    ): Promise<{ orderId: number, total: IMoneySum }[]> {
        const res = await db
            .select({ orderId: ordersTable.orderId, total: ordersTable.total })
            .from(ordersTable)
            .innerJoin(transactionsTable,
                eq(ordersTable.transactionId, transactionsTable.transactionId)
            )
            .where(
                and(
                    eq(ordersTable.customerId, customerId),
                    eq(transactionsTable.paymentType, 'account'),
                    eq(transactionsTable.isPaid, false),
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

    async fetchCustomerOrders(
        db: BetterSQLite3Database | SQLiteTx,
        customerId: number,
    ): Promise<IOrder[]> {
        const res = await db
            .select({
                orderId: ordersTable.orderId,
                customerId: ordersTable.customerId,
                subtotal: ordersTable.subtotal,
                discounts: ordersTable.discounts,
                total: ordersTable.total,
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
            .where(eq(ordersTable.customerId, customerId))
            .execute();

        return res;
    }
} satisfies OrdersDataHandler;
