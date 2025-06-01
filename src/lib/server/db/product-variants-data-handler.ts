import type { IProductVariant } from "$lib/shared/interfaces/product-variant";
import type { Databases, Transactions } from "./db";

export interface ProductVariantsDataHandler {
    fetchVariant(db: Databases | Transactions, variantId: number): Promise<IProductVariant>;
    fetchVariantsForProduct(db: Databases | Transactions, productId: number): Promise<IProductVariant[]>;
    newVariant(db: Databases | Transactions, variant: Omit<IProductVariant, "variantId" | "createdAt">): Promise<number>;
    updateVariant(db: Databases | Transactions, variantId: number, data: Partial<IProductVariant>): Promise<void>;
    removeVariant(db: Databases | Transactions, variantId: number): Promise<void>;
}