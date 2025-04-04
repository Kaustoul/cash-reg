import type { INewOrder, IOrder } from "$lib/shared/interfaces/order";
import type { Databases, Transactions } from "./db";

export interface OrdersDataHandler {
    fetchOrder(db: Databases | Transactions, orderId: number): Promise<IOrder>,
    fetchOrders(db: Databases | Transactions, date: Date): Promise<IOrder[]>,
    fetchTillOrders(db: Databases | Transactions, tillId: number, date: Date): Promise<IOrder[]>,
    newOrder(db: Databases | Transactions, order: INewOrder): Promise<number>
}
