import type { IProductVariant } from "$lib/shared/interfaces/product-variant";
import type { Databases, Transactions } from "./db";

export interface ItemsDataHandler {
    fetchItem(db: Databases | Transactions, fullId: number): Promise<IProductVariant>,
    fetchProductItems(db: Databases | Transactions, productId: number): Promise<IProductVariant[]>,

    newItem(db: Databases | Transactions, item: IProductVariant): Promise<void>
    newItemPriceIdxs(db: Databases | Transactions, product: number, itemId: number, priceIdxs: number[]): Promise<void>
    removeItemPriceIdxs(db: Databases | Transactions, product: number, itemId: number, priceIdxs: number[]): Promise<void>
}
