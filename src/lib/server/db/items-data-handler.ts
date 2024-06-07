import type { IItem } from "$lib/shared/interfaces/item";
import type { Databases, Transactions } from "./db";

export interface ItemsDataHandler {
    fetchItem(db: Databases | Transactions, fullId: number): Promise<IItem>,
    fetchProductItems(db: Databases | Transactions, productId: number): Promise<IItem[]>,

    newItem(db: Databases | Transactions, item: IItem): Promise<void>
}
