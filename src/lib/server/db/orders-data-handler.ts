import type { IMoneySum } from "$lib/shared/interfaces/money-sum";
import type { INewOrder, IOrder } from "$lib/shared/interfaces/order";
import type { Databases, Transactions } from "./db";

export interface OrdersDataHandler {
    fetchOrder(db: Databases | Transactions, orderId: number): Promise<IOrder>,
    fetchOrders(db: Databases | Transactions, date: Date): Promise<IOrder[]>,
    fetchTillOrders(db: Databases | Transactions, tillId: number, date: Date): Promise<IOrder[]>,
    newOrder(db: Databases | Transactions, order: INewOrder): Promise<number>,
    fetchUnpaidOrdersForCustomer(
        db: Databases | Transactions, 
        customerId: number
    ): Promise<{ orderId: number, total: IMoneySum }[]>,
    markOrderAsPaid(
        db: Databases | Transactions,
        orderId: number,
        transactionId: number
    ): Promise<void>;
    fetchOrderByTransactionId(
        db: Databases | Transactions,
        transactionId: number
    ): Promise<IOrder | null>;
}
