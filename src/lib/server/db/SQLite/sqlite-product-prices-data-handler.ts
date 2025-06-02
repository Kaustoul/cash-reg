import type { ProductPricesDataHandler } from "../product-prices-data-handler";
import type { IPrice } from "$lib/shared/interfaces/product-price";
import { productPricesTable } from "../schema/product-price-model";
import { eq, or } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import type { SQLiteTx } from "../db";

export const sqliteProductPrices: ProductPricesDataHandler = {
    async fetchPricesForProduct(db: BetterSQLite3Database | SQLiteTx, productId: number): Promise<IPrice[]> {
        return await db
            .select()
            .from(productPricesTable)
            .where(eq(productPricesTable.productId, productId))
            .execute();
    },

    async fetchPricesForVariant(db: BetterSQLite3Database | SQLiteTx, variantId: number): Promise<IPrice[]> {
        return await db
            .select()
            .from(productPricesTable)
            .where(eq(productPricesTable.variantId, variantId))
            .execute();
    },

    async fetchPrice(db: BetterSQLite3Database | SQLiteTx, priceId: number): Promise<IPrice> {
        const res = await db
            .select()
            .from(productPricesTable)
            .where(eq(productPricesTable.priceId, priceId))
            .limit(1)
            .execute();
        return res[0];
    },

    async newPrice(db: BetterSQLite3Database | SQLiteTx, price: Omit<IPrice, "priceId" | "createdAt" | "modiefiedAt">): Promise<number> {
        let res;
        try{ res = await db
            .insert(productPricesTable)
            .values(price)
            .returning({ priceId: productPricesTable.priceId })
            .execute();
        } catch (error) {
            console.error("Error inserting new price:", error);
            throw new Error("Failed to create new price");
        }
        return res[0].priceId;
    },

    async updatePrice(db: BetterSQLite3Database | SQLiteTx, priceId: number, price: Partial<IPrice>): Promise<void> {
        await db
            .update(productPricesTable)
            .set(price)
            .where(eq(productPricesTable.priceId, priceId))
            .execute();
    },

    async removePrice(db: BetterSQLite3Database | SQLiteTx, priceId: number): Promise<void> {
        await db
            .delete(productPricesTable)
            .where(eq(productPricesTable.priceId, priceId))
            .execute();
    }
};