import type { IItem } from "$lib/shared/interfaces/item";
import { eq , and, max } from 'drizzle-orm';
import type { SQLiteTx } from "../db";
import type { ItemsDataHandler } from "../items-data-handler";
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { itemsTable } from "../schema/item-model";
import { itemIdFromFullId, productIdFromFullId } from "$lib/shared/utils";

export const sqliteItems = {
    async fetchItem(db: BetterSQLite3Database | SQLiteTx, fullId: number): Promise<IItem> {
        const itemId = itemIdFromFullId(fullId);
        const productId = productIdFromFullId(fullId);
        const res = await db
            .select()
            .from(itemsTable)
            .where(and(eq(itemsTable.itemId, itemId), eq(itemsTable.productId, productId)))
            .limit(1)
            .execute()
        ;

        if (res.length === 0) {
            throw new Error(`Item with full id ${fullId} not found`);
        }

        return res[0];
    },

    async fetchProductItems(db: BetterSQLite3Database | SQLiteTx, productId: number): Promise<IItem[]> {
        const res = await db
            .select()
            .from(itemsTable)
            .where(eq(itemsTable.productId, productId))
            .execute()
        ;
        
        return res;
    },

    async newItem(db: BetterSQLite3Database | SQLiteTx, item: IItem): Promise<void> {
        if (item.itemId === undefined) {
            const idRes = await db
                .select({ maxId: max(itemsTable.itemId) })
                .from(itemsTable)
                .where(eq(itemsTable.productId, item.productId))
            ;
            
            if (idRes.length === 0 || idRes[0].maxId === null) {
                throw new Error(`Failed to fetch next item ID for product ${item.productId}`);
            }

            item.itemId = idRes[0].maxId + 1;
        }

        await db
            .insert(itemsTable)
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
            .select({priceIdxs: itemsTable.priceIdxs})
            .from(itemsTable)
            .where(and(
                eq(itemsTable.productId, productId), eq(itemsTable.itemId, itemId)
            ))
        ;
        if (res.length > 0 && res[0].priceIdxs) {
            priceIdxs.push(...res[0].priceIdxs);
        }

        await db
            .update(itemsTable)
            .set({ priceIdxs: priceIdxs })
            .where(and(
                eq(itemsTable.productId, productId), eq(itemsTable.itemId, itemId)
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
            .select({priceIdxs: itemsTable.priceIdxs})
            .from(itemsTable)
            .where(and(
                eq(itemsTable.productId, productId), eq(itemsTable.itemId, itemId)
            ))
        ;
        if (res.length === 0 || !res[0].priceIdxs) {
            return;
        }

        const newPriceIdxs = res[0].priceIdxs.filter((idx) => !priceIdxs.includes(idx));

        await db
            .update(itemsTable)
            .set({ priceIdxs: newPriceIdxs })
            .where(and(
                eq(itemsTable.productId, productId), eq(itemsTable.itemId, itemId)
            ))
            .execute()
        ;   
    },
} satisfies ItemsDataHandler;
