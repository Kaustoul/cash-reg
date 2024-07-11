import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { tillsTable } from "./till-model";
import { sql } from "drizzle-orm";
import type { IOrder, IOrderItem } from "$lib/shared/interfaces/order";

export const ORDERS_TABLE_NAME = 'orders';
export const ordersTable = sqliteTable(ORDERS_TABLE_NAME, {
    orderId: integer('orderid', { mode: 'number' })
       .notNull() 
       .primaryKey({ autoIncrement: true })
    ,

    tillId: integer('tillid', { mode: 'number' })
        .notNull()
        .references(() => tillsTable.id)
    ,
    
    items: text('items', { mode: 'json' })
        .notNull()
        .$type<IOrder["items"]>()
    ,

    discounts: text('discounts', {mode: 'json'})
        .$type<IOrder['discounts']>()
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
        
});
