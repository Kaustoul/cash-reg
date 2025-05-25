import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import type { IOrder, IOrderItem } from "$lib/shared/interfaces/order";
import { transactionsTable } from "./money-transfer-model";
import { customersTable } from "./customer-model";
import { tillSessionsTable } from "./till-session-model";

export const ORDERS_TABLE_NAME = 'orders';
export const ordersTable = sqliteTable(ORDERS_TABLE_NAME, {
    orderId: integer('orderid', { mode: 'number' })
       .notNull() 
       .primaryKey({ autoIncrement: true })
    ,

    tillSessionId: integer('tillSessionId', { mode: 'number' })
        .notNull()
        .references(() => tillSessionsTable.tillSessionId, { onDelete: 'no action' })
    ,
    
    items: text('items', { mode: 'json' })
        .notNull()
        .$type<IOrder["items"]>()
    ,

    discounts: text('discounts', {mode: 'json'})
        .$type<IOrder['discounts']>()
    ,

    subtotal: text('subtotal', { mode: 'json' })
        .notNull()
        .$type<IOrder["subtotal"]>()
    ,

    total: text('total', { mode: 'json' })
        .notNull()
        .$type<IOrder["total"]>()
    ,

    paymentType: text('paymentType', { length: 16 })
        .notNull()
        .$type<IOrder["paymentType"]>()
    ,

    note: text('note', { length: 256 })
    ,

    createdAt: integer('createdAt', { mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`)
    ,
        
    customerId: integer('customerId', { mode: 'number' })
        .references(() => customersTable.customerId)
    ,

    transactionId: integer('transactionId', { mode: 'number' })
        .$type<number | null>()
        .references(() => transactionsTable.transactionId)
        .default(null)
    ,
});
