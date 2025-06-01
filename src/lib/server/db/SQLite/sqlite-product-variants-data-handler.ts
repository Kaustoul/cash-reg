import type { ProductVariantsDataHandler } from "../product-variants-data-handler";
import type { IProductVariant } from "$lib/shared/interfaces/product-variant";
import { productVariantsTable } from "../schema/product-variant-model";
import { eq } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import type { SQLiteTx } from "../db";

export const sqliteProductVariants: ProductVariantsDataHandler = {
    async fetchVariant(db: BetterSQLite3Database | SQLiteTx, variantId: number): Promise<IProductVariant> {
        const res = await db
            .select()
            .from(productVariantsTable)
            .where(eq(productVariantsTable.variantId, variantId))
            .limit(1)
            .execute();

        if (res.length === 0) {
            throw new Error(`Variant with ID ${variantId} not found`);
        }

        return res[0];
    },

    async fetchVariantsForProduct(db: BetterSQLite3Database | SQLiteTx, productId: number): Promise<IProductVariant[]> {
        return await db
            .select()
            .from(productVariantsTable)
            .where(eq(productVariantsTable.productId, productId))
            .execute();
    },

    async newVariant(db: BetterSQLite3Database | SQLiteTx, variant: Omit<IProductVariant, "variantId" | "createdAt">): Promise<number> {
        const res = await db
            .insert(productVariantsTable)
            .values(variant)
            .returning({ variantId: productVariantsTable.variantId })
            .execute();
        return res[0].variantId;
    },

    async updateVariant(db: BetterSQLite3Database | SQLiteTx, variantId: number, data: Partial<IProductVariant>): Promise<void> {
        await db
            .update(productVariantsTable)
            .set(data)
            .where(eq(productVariantsTable.variantId, variantId))
            .execute();
    },

    async removeVariant(db: BetterSQLite3Database | SQLiteTx, variantId: number): Promise<void> {
        await db
            .delete(productVariantsTable)
            .where(eq(productVariantsTable.variantId, variantId))
            .execute();
    }
};