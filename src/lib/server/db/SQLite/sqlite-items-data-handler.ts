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
        console.log(res)

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
} satisfies ItemsDataHandler;
