import type { IProduct } from "$lib/shared/interfaces/product";
import type { SQLiteTx } from "../db";
import type { ProductsDataHandler } from "../products-data-handler"
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { productsTable } from "../schema/product-model";
import { eq } from "drizzle-orm";
import { itemsTable } from "../schema/item-model";
import type { IItem } from "$lib/shared/interfaces/item";

export const sqliteProducts = {
    async getProducts(db: BetterSQLite3Database | SQLiteTx): Promise<IProduct[]> {
        const products: IProduct[] = [];
        const res = await db
            .select()
            .from(productsTable)

        const items: {[itemId: number]: IItem} = {};

        for (const product of res) {
            const itemsRes = await db
                .select()
                .from(itemsTable)
                .where(eq(itemsTable.productId, product.productId))
            ;

            for (const item of itemsRes) {
                items[item.itemId] = item;
            }
            
            products.push({ 
                ...product,
                items: items,
                itemDiscounts: [],
            });
        }

        return products;
    },

    async getProduct(db: BetterSQLite3Database | SQLiteTx, productId: number): Promise<IProduct> {
        const productRes = await db
            .select()
            .from(productsTable)
            .where(eq(productsTable.productId, productId))
        ;

        const itemsRes = await db
            .select()
            .from(itemsTable)
            .where(eq(itemsTable.productId, productId))
        ;

        const res = productRes[0];

        return res[0];
    },

    async newProduct(db: BetterSQLite3Database | SQLiteTx, product: IProduct): Promise<void> {

    }
} satisfies ProductsDataHandler;
