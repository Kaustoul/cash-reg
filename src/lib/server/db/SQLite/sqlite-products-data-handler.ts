import type { INewProduct, IProduct } from "$lib/shared/interfaces/product";
import { database, type SQLiteTx } from "../db";
import type { ProductsDataHandler } from "../products-data-handler"
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { productsTable } from "../schema/product-model";
import { asc, desc, eq } from "drizzle-orm";
import type { IProductVariant } from "$lib/shared/interfaces/product-variant";
import type { IPrice } from "$lib/shared/interfaces/price";
import type { ICondition } from "$lib/shared/interfaces/condition";
import { sqliteItems } from "./sqlite-items-data-handler";

export const sqliteProducts = {
    async fetchProducts(
        db: BetterSQLite3Database | SQLiteTx,
        fetchItems: boolean = false,
    ): Promise<IProduct[]> {
        const products: IProduct[] = [];
        const res = await db
            .select()
            .from(productsTable)
        
        for (const product of res) {
            let items: IProductVariant[] = []; 
            if (fetchItems) {
                items = await database.fetchProductItems(product.productId);
        
            }
            products.push({ 
                ...product,
                items: items,
                itemDiscounts: [],
            });
        }
       
        return products;
    },

    async fetchProduct(
        db: BetterSQLite3Database | SQLiteTx,
        productId: number,
        fetchItems: boolean = false
    ): Promise<IProduct> {
        const productRes = await db
            .select()
            .from(productsTable)
            .where(eq(productsTable.productId, productId))
        ;
        const res = productRes[0];
        
        if (!fetchItems) {
            return { ...res, items: [], itemDiscounts: [] };
        }

        const items = await database.fetchProductItems(productId);

        return { ...res, items: items, itemDiscounts: [] };
    },

    /**
     * Does not insert items or item discounts
     */
    async newProduct(db: BetterSQLite3Database | SQLiteTx, product: INewProduct): Promise<number> {
        const res = await db
            .insert(productsTable)
            .values(product)
            .returning({ newProductId: productsTable.productId })
            .execute()
        ;

        return res[0].newProductId;
    },

    async updatePrices(
        db: BetterSQLite3Database | SQLiteTx,
        productId: number,
        prices: IPrice[]
    ): Promise<void> {
        await db
            .update(productsTable)
            .set({
                prices: prices
            })
            .where(eq(productsTable.productId, productId))
            .execute()
        ; 
    },

    async updatePrice(
        db: BetterSQLite3Database | SQLiteTx,
        productId: number,
        priceIdx: number,
        price: IPrice
    ): Promise<void> {
        const product = await this.fetchProduct(db, productId, false);
        product.prices[priceIdx] = price;
        await this.updatePrices(db, productId, product.prices);
    },

    async newPrice(
        db: BetterSQLite3Database | SQLiteTx,
        productId: number,
        price: IPrice,
        addToAllItems: boolean
    ) {
        const product = await this.fetchProduct(db, productId, addToAllItems);
        product.prices.push(price);
        await this.updatePrices(db, productId, product.prices);

        if (addToAllItems) {
            for (const item of Object.values(product.items)) {
                await sqliteItems.newItemPriceIdxs(db, product.productId, item.itemId, [product.prices.length - 1]);
            }
        }
    },

    async removePrices(
        db: BetterSQLite3Database | SQLiteTx,
        productId: number,
        priceIdxs: number[]
    ) {
        const product = await this.fetchProduct(db, productId, true); 
        product.prices = product.prices.filter((_, index) => !priceIdxs.includes(index));
        
        for (const item of Object.values(product.items)) {
            await sqliteItems.removeItemPriceIdxs(db, productId, item.itemId, priceIdxs);
        }

        await this.updatePrices(db, productId, product.prices);
    },

    async newPriceCondition(
        db: BetterSQLite3Database | SQLiteTx,
        productId: number,
        priceIdx: number,
        condition: ICondition
    ) {
        const product = await this.fetchProduct(db, productId, false);
        product.prices[priceIdx].conditions.push(condition);
        await this.updatePrices(db, productId, product.prices);
    },

    async removePriceCondition(
        db: BetterSQLite3Database | SQLiteTx,
        productId: number,
        priceIdx: number,
        conditionIdx: number
    ) {
        const product = await this.fetchProduct(db, productId, false);
        product.prices[priceIdx].conditions.splice(conditionIdx, 1);
        await this.updatePrices(db, productId, product.prices);
    },

    async removeAllPriceConditions(
        db: BetterSQLite3Database | SQLiteTx,
        productId: number,
        priceIdx: number
    ) {
        const product = await this.fetchProduct(db, productId, false);
        product.prices[priceIdx].conditions = [];
        await this.updatePrices(db, productId, product.prices);
    }
} satisfies ProductsDataHandler;
