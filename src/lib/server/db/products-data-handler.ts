import type { ICondition } from "$lib/shared/interfaces/condition";
import type { IPrice } from "$lib/shared/interfaces/product-price";
import type { INewProduct, IProduct } from "$lib/shared/interfaces/product";
import type { Databases, Transactions } from "./db";

export interface ProductsDataHandler {
    fetchProducts(db: Databases | Transactions, fetchItems: boolean): Promise<IProduct[]>;
    fetchProduct(db: Databases | Transactions, productId: number, fetchItems: boolean): Promise<IProduct>;
    newProduct(db: Databases | Transactions, product: INewProduct): Promise<number>;
    updateProduct(db: Databases | Transactions, productId: number, update: Partial<IProduct>): Promise<void>;
    updatePrices(db: Databases | Transactions, productId: number, prices: IPrice[]): Promise<void>;
    updatePrice(db: Databases | Transactions, productId: number, priceIdx: number, price: IPrice): Promise<void>;
    newPrice(
        db: Databases | Transactions,
        productId: number,
        price: IPrice,
        addToAllItems: boolean
    ): Promise<void>; 
    removePrices(db: Databases | Transactions, productId: number, priceIdxs: number[]): Promise<void>;
    newPriceCondition(db: Databases | Transactions, productId: number, priceIdx: number, condition: ICondition): Promise<void>;
    removePriceCondition(db: Databases | Transactions, productId: number, priceIdx: number, conditionIdx: number): Promise<void>;
    removeAllPriceConditions(db: Databases | Transactions, productId: number, priceIdx: number): Promise<void>;
}
