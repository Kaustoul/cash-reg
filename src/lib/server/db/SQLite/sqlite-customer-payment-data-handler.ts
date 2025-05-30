import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { customerPaymentsTable } from "../schema/customer-payment-model";
import type { ICustomerPayment } from "$lib/shared/interfaces/customer-payment";
import { eq } from "drizzle-orm";
import type { SQLiteTx } from "../db";
import { sqliteOrders } from "./splite-orders-data-handler";
import Decimal from "decimal.js";
import { sqliteCustomers } from "./sqlite-customers-data-handler";
import { sqliteTransactions } from "./sqlite-transactions-data-handler";
import { sqliteTills } from "./sqlite-tills-data-handler";
import type { IFrontEndBalance } from "$lib/shared/interfaces/balance";
import { balanceToMoneySum, getBalancePaymentTypes } from "$lib/shared/utils/balance-utils";
import { asMoneySum, isZero, sumMoneySums } from "$lib/shared/utils/money-sum-utils";

export const sqliteCustomerPayments = {
    async fetchPaymentsForCustomer(db: BetterSQLite3Database | SQLiteTx, customerId: number): Promise<ICustomerPayment[]> {
        return await db
            .select()
            .from(customerPaymentsTable)
            .where(eq(customerPaymentsTable.customerId, customerId))
            .execute();
    },

    async newCustomerPayment(db: BetterSQLite3Database | SQLiteTx, payment: Omit<ICustomerPayment, "customerPaymentId" | "createdAt">): Promise<number> {
        const res = await db.transaction( async (tx) => {
            const res = await tx
                .insert(customerPaymentsTable)
                .values(payment)
                .returning({ paymentId: customerPaymentsTable.customerPaymentId })
                .execute();
            return res[0].paymentId;
        });

        return res;
    },

    async processCustomerDeposit(
        db: BetterSQLite3Database | SQLiteTx,
        tillSessionId: number,
        customerId: number,
        amount: IFrontEndBalance,
    ) {
        await db.transaction( async (tx) => {
            const customer = await sqliteCustomers.fetchCustomer(db, customerId);
            const unpaidOrders = await sqliteOrders.fetchUnpaidOrdersForCustomer(db, customerId);

            const paymentTotal = balanceToMoneySum(amount);

            let remaining = sumMoneySums(customer.balance, paymentTotal)
        
            const transactionId = await sqliteTransactions.newTransaction(tx, {
                amount,
                tillSessionId,
                reason: 'customer-deposit',
                isPaid: true,
                paymentType: getBalancePaymentTypes(amount).type,
            });

            if (remaining && !isZero(remaining)) {
                for (const order of unpaidOrders) {
                    const orderAmount = new Decimal(order.total["CZK"]);
                    
                    if (remaining["CZK"].lte(0)) break;
                    if (!order.total["CZK"]) continue;
                    if (orderAmount.gt(remaining["CZK"])) continue;
            
                    // Log payment for this order
                    await sqliteCustomerPayments.newCustomerPayment(tx, {
                        customerId,
                        transactionId,
                        orderId: order.orderId,
                        amount: order.total,
                        destination: 'order-payment',
                    });
                
                    await sqliteOrders.markOrderAsPaid(tx, order.orderId, transactionId);

                    remaining["CZK"] = remaining["CZK"].minus(orderAmount);
                }
            }    
            
            await sqliteCustomers.updateBalance(tx, customer, asMoneySum(remaining) ?? {});

            await sqliteCustomerPayments.newCustomerPayment(tx, {
                customerId,
                transactionId,
                orderId: null,
                amount: asMoneySum(remaining) ?? {},
                destination: 'balance',
            });

            // Finally update the till balance for cash payments
            if (amount["CZK"].cash !== undefined) {
                await sqliteTills.sumAndUpdateBalance(
                    tx,
                    tillSessionId,
                    amount
                );
            }
        });
    }
};

