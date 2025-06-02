import type { ICondition } from "$lib/shared/interfaces/condition";
import type { IPrice } from "$lib/shared/interfaces/product-price";
import type { INewProduct, IProduct } from "$lib/shared/interfaces/product";
import type { Databases, Transactions } from "./db";

export interface ProductsDataHandler {
    fetchProducts(db: Databases | Transactions): Promise<IProduct[]>;
    fetchProduct(db: Databases | Transactions, productId: number): Promise<IProduct>;
    newProduct(db: Databases | Transactions, product: INewProduct): Promise<number>;
    updateProduct(db: Databases | Transactions, productId: number, update: Partial<IProduct>): Promise<void>;
    modifiedProduct(db: Databases | Transactions, productId: number): Promise<void>
}
