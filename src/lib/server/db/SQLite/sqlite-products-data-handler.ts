import type { INewProduct, IProduct } from "$lib/shared/interfaces/product";
import { database, type SQLiteTx } from "../db";
import type { ProductsDataHandler } from "../products-data-handler"
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { productsTable } from "../schema/product-model";
import { asc, desc, eq } from "drizzle-orm";
import type { IProductVariant } from "$lib/shared/interfaces/product-variant";

export const sqliteProducts = {
    async fetchProducts(
        db: BetterSQLite3Database | SQLiteTx,
        fetchItems: boolean = false,
    ): Promise<IProduct[]> {
        const res = await db
            .select()
            .from(productsTable)
       
        return res;
    },

    async fetchProduct(
        db: BetterSQLite3Database | SQLiteTx,
        productId: number,
    ): Promise<IProduct> {
        const productRes = await db
            .select()
            .from(productsTable)
            .where(eq(productsTable.productId, productId))
        ;

        const res = productRes[0];

        if (!res) {
            throw new Error(`Product with ID ${productId} not found`);
        }
        
        return res;
    },

    async newProduct(db: BetterSQLite3Database | SQLiteTx, product: INewProduct): Promise<number> {
        const res = await db
            .insert(productsTable)
            .values(product)
            .returning({ newProductId: productsTable.productId })
            .execute()
        ;

        return res[0].newProductId;
    },

    async updateProduct(
        db: BetterSQLite3Database | SQLiteTx,
        productId: number,
        update: Partial<IProduct>
    ): Promise<void> {
        await db
            .update(productsTable)
            .set(update)
            .where(eq(productsTable.productId, productId))
            .execute()
        ;
    },

    async modifiedProduct(
        db: BetterSQLite3Database | SQLiteTx,
        productId: number,
    ): Promise<void> {
        await db
            .update(productsTable)
            .set({ modifiedAt: new Date() })
            .where(eq(productsTable.productId, productId))
            .execute()
        ;
    },

} satisfies ProductsDataHandler;
