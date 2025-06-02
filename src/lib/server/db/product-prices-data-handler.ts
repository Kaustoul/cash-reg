import type { IPrice } from "$lib/shared/interfaces/product-price";
import type { Databases, Transactions } from "./db";

export interface ProductPricesDataHandler {
    fetchPricesForProduct(db: Databases | Transactions, productId: number): Promise<IPrice[]>;
    fetchPricesForVariant(db: Databases | Transactions, variantId: number): Promise<IPrice[]>;
    fetchPrice(db: Databases | Transactions, priceId: number): Promise<IPrice>;
    newPrice(db: Databases | Transactions, price: Omit<IPrice, "priceId" | "createdAt" | "modifiedAt">): Promise<number>;
    updatePrice(db: Databases | Transactions, priceId: number, price: Partial<IPrice>): Promise<void>;
    removePrice(db: Databases | Transactions, priceId: number): Promise<void>;
}