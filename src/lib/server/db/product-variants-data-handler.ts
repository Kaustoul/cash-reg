import type { IProduct } from "$lib/shared/interfaces/product";
import type { IProductVariant } from "$lib/shared/interfaces/product-variant";
import type { Databases, Transactions } from "./db";

export interface ProductVariantsDataHandler {
    fetchVariant(db: Databases | Transactions, variantId: number): Promise<IProductVariant>,
    fetchProductVariants(db: Databases | Transactions, productId: number): Promise<IProductVariant[]>,
    fetchProductVariantsCount(db: Databases | Transactions, productId: number): Promise<number>,
    newVariant(db: Databases | Transactions, productId: number): Promise<number>,
    updateVariant(db: Databases | Transactions, variantId: number, update: Partial<IProduct>): Promise<number>
}
