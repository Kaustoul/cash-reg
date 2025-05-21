import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { customersTable } from "./customer-model";
import { transactionsTable } from "./money-transfer-model";
import { ordersTable } from "./order-model";
import type { IMoneySum } from "$lib/shared/interfaces/money-sum";
import type { CustomerPaymentDestination } from "$lib/shared/interfaces/customer-payment";

export const customerPaymentsTable = sqliteTable('customer_payments', {
    customerPaymentId: integer('paymentId').primaryKey({ autoIncrement: true }),
    customerId: integer('customerId')
        .notNull()
        .references(() => customersTable.customerId)
    ,
    
    transactionId: integer('transactionId')
        .notNull()
        .references(() => transactionsTable.transactionId)
    ,
    
    orderId: integer('orderId')
        .references(() => ordersTable.orderId)
    ,
    
    amount: text('amount', { mode: 'json' })
        .notNull()
        .$type<IMoneySum>()
    ,

    destination: text('type', { length: 16 })
        .$type<CustomerPaymentDestination>()
        .notNull()
    ,

    createdAt: integer('createdAt', { mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`)
});