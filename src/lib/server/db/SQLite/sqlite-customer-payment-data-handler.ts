import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { customerPaymentsTable } from "../schema/customer-payment-model";
import type { ICustomerPayment } from "$lib/shared/interfaces/customer-payment";
import { eq } from "drizzle-orm";
import type { SQLiteTx } from "../db";
import { sqliteOrders } from "./splite-orders-data-handler";
import type { IMoneySum } from "$lib/shared/interfaces/money-sum";
import Decimal from "decimal.js";
import { sqliteCustomers } from "./sqlite-customers-data-handler";
import { sqliteTransactions } from "./sqlite-transactions-data-handler";
import type { PaymentType, TransactionType } from "$lib/shared/interfaces/transaction";
import { sqliteTills } from "./sqlite-tills-data-handler";

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
        customerId: number,
        amount: IMoneySum,
        paymentType: TransactionType
    ) {
        // Fetch unpaid orders
        const customer = await sqliteCustomers.fetchCustomer(db, customerId);
        const unpaidOrders = await sqliteOrders.fetchUnpaidOrdersForCustomer(db, customerId);
        let remaining = new Decimal(amount.value)

        if (customer && customer.balance && customer.balance.length > 0) {
            remaining = remaining.add(new Decimal(customer.balance[0].value));
        }
        
        await db.transaction( async (tx) => {
            
            const transactionId = await sqliteTransactions.newTransaction(tx, {
                amount,
                tillId: 1,
                cashierId: 0,
                reason: 'customer-deposit',
                type: paymentType,
            });

            for (const order of unpaidOrders) {

                const orderAmount = new Decimal(order.total.value);
                if (remaining.lte(0)) break;
                if (orderAmount.gt(remaining)) continue;
            
                // Log payment for this order
                await sqliteCustomerPayments.newCustomerPayment(tx, {
                    customerId,
                    transactionId,
                    orderId: order.orderId,
                    amount: order.total,
                    destination: 'order-payment',
                });
                
                await sqliteOrders.markOrderAsPaid(tx, order.orderId, transactionId);

                remaining = remaining.minus(orderAmount);
            }    
            
            // If any remainder, add to customer balance and log as 'remainder'
            // Update customer balance (implement this in your customer handler)
            await sqliteCustomers.updateBalance(tx, customer, {
                value: remaining.toString(),
                currency: amount.currency,
            });

            await sqliteCustomerPayments.newCustomerPayment(tx, {
                customerId,
                transactionId,
                orderId: null,
                amount: { value: remaining.toString(), currency: amount.currency },
                destination: 'balance',
            });

            // Finally update the till balance for cash payments
            if (paymentType === 'cash') {
                await sqliteTills.updateBalance(
                    tx,
                    1,
                    amount
                );
            }
        });
    }
};

