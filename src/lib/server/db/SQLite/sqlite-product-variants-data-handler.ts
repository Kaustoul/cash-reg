import type { ProductVariantsDataHandler } from "../product-variants-data-handler";
import type { IProductVariant } from "$lib/shared/interfaces/product-variant";
import { productVariantsTable } from "../schema/product-variant-model";
import { and, count, eq, ne } from "drizzle-orm";
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

    async fetchProductVariants(db: BetterSQLite3Database | SQLiteTx, productId: number): Promise<IProductVariant[]> {
        return await db
            .select()
            .from(productVariantsTable)
            .where(and(
                eq(productVariantsTable.productId, productId),
                ne(productVariantsTable.status, 'deleted' as const)
            ))
            .execute();
    },

    async newVariant(db: BetterSQLite3Database | SQLiteTx, productId: number): Promise<number> {
        const res = await db
            .insert(productVariantsTable)
            .values({productId, subname: 'Nová varianta'})
            .returning({ variantId: productVariantsTable.variantId })
            .execute();
        return res[0].variantId;
    },

    async updateVariant(db: BetterSQLite3Database | SQLiteTx, variantId: number, data: Partial<IProductVariant>): Promise<number> {
        const res = await db
            .update(productVariantsTable)
            .set(data)
            .where(eq(productVariantsTable.variantId, variantId))
            .returning({ productId: productVariantsTable.productId })
            .execute();

        return res[0].productId;
    },

    async fetchProductVariantsCount(db: BetterSQLite3Database | SQLiteTx, productId: number): Promise<number> {
        const res = await db
            .select({ count: count() })
            .from(productVariantsTable)
            .where(eq(productVariantsTable.productId, productId))
            .execute();

        return res[0].count;
    }
    

    // async removeVariant(db: BetterSQLite3Database | SQLiteTx, variantId: number): Promise<void> {
    //     await db
    //         .delete(productVariantsTable)
    //         .where(eq(productVariantsTable.variantId, variantId))
    //         .execute();
    // }
};