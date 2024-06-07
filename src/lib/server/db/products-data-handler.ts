import type { IProduct } from "$lib/shared/interfaces/product";
import type { Databases, Transactions } from "./db";

export interface ProductsDataHandler {
    getProducts(db: Databases | Transactions): Promise<IProduct[]>;
    getProduct(db: Databases | Transactions, productId: number): Promise<IProduct>;
    newProduct(db: Databases | Transactions, product: IProduct): Promise<void>;
}
