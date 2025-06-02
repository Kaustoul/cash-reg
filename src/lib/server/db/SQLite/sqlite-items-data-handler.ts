import type { IProductVariant } from "$lib/shared/interfaces/product-variant";
import { eq , and, max, asc } from 'drizzle-orm';
import type { SQLiteTx } from "../db";
import type { ItemsDataHandler } from "../product-variants-data-handler";
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { productVariantsTable } from "../schema/product-variant-model";
import { itemIdFromFullId, productIdFromFullId } from "$lib/shared/utils";

export const sqliteItems = {
    async fetchVariants(db: BetterSQLite3Database | SQLiteTx, fullId: number): Promise<IProductVariant> {
        const itemId = itemIdFromFullId(fullId);
        const productId = productIdFromFullId(fullId);
        const res = await db
            .select()
            .from(productVariantsTable)
            .where(and(eq(productVariantsTable.itemId, itemId), eq(productVariantsTable.productId, productId)))
            .limit(1)
            .execute()
        ;

        if (res.length === 0) {
            throw new Error(`Item with full id ${fullId} not found`);
        }

        return res[0];
    },

    async fetchProductVariants(db: BetterSQLite3Database | SQLiteTx, productId: number): Promise<IProductVariant[]> {
        const res = await db
            .select()
            .from(productVariantsTable)
            .where(eq(productVariantsTable.productId, productId))
            .execute()
        ;
        
        return res;
    },

    async newVariant(db: BetterSQLite3Database | SQLiteTx, item: IProductVariant): Promise<void> {
        if (item.itemId === undefined) {
            const idRes = await db
                .select({ maxId: max(productVariantsTable.itemId) })
                .from(productVariantsTable)
                .where(eq(productVariantsTable.productId, item.productId))
            ;
            
            if (idRes.length === 0 || idRes[0].maxId === null) {
                throw new Error(`Failed to fetch next item ID for product ${item.productId}`);
            }

            item.itemId = idRes[0].maxId + 1;
        }

        await db
            .insert(productVariantsTable)
            .values(item)
            .execute()
        ;
    },

    async newItemPriceIdxs(
        db: BetterSQLite3Database | SQLiteTx,
        productId: number,
        itemId:number,
        priceIdxs: number[]
    ): Promise<void> {
        const res = await db
            .select({priceIdxs: productVariantsTable.priceIdxs})
            .from(productVariantsTable)
            .where(and(
                eq(productVariantsTable.productId, productId), eq(productVariantsTable.itemId, itemId)
            ))
        ;
        if (res.length > 0 && res[0].priceIdxs) {
            priceIdxs.push(...res[0].priceIdxs);
        }

        await db
            .update(productVariantsTable)
            .set({ priceIdxs: priceIdxs })
            .where(and(
                eq(productVariantsTable.productId, productId), eq(productVariantsTable.itemId, itemId)
            ))
            .execute()
        ;
    },

    async removeItemPriceIdxs(
        db: BetterSQLite3Database | SQLiteTx,
        productId: number,
        itemId:number,
        priceIdxs: number[]
    ): Promise<void> {
        const res = await db
            .select({priceIdxs: productVariantsTable.priceIdxs})
            .from(productVariantsTable)
            .where(and(
                eq(productVariantsTable.productId, productId), eq(productVariantsTable.itemId, itemId)
            ))
        ;
        if (res.length === 0 || !res[0].priceIdxs) {
            return;
        }

        const newPriceIdxs = res[0].priceIdxs.filter((idx) => !priceIdxs.includes(idx));

        await db
            .update(productVariantsTable)
            .set({ priceIdxs: newPriceIdxs })
            .where(and(
                eq(productVariantsTable.productId, productId), eq(productVariantsTable.itemId, itemId)
            ))
            .execute()
        ;   
    },
} satisfies ItemsDataHandler;
