import Decimal from "decimal.js";
import { Item } from "../products/item";
import { Product, type Unit } from "../products/product";
import { NotFoundError } from "$lib/shared/errors/not-found-error";
import { CashRegisterError, ErrCode } from "$lib/shared/errors/cash-register-error";
import { createFullItemId, ensureArray, productIdFromFullId } from "$lib/shared/utils";
import { Price } from "$lib/shared/prices/price";
import { productsTable } from "../db/schema/product-model";
import { itemsTable } from "../db/schema/item-model";
import { eq, sql } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { db } from "../db/db";

/**
 * Represents a catalog of products.
 */
export class Catalog {
    /**
     * The singleton instance of the Catalog class.
     */
    private static instance: Catalog;

    /**
     * A map of products in the catalog, where the key is the product ID and the value is the product object.
     */
    private products: Map<number, Product>;
    private productsFetched: boolean = false;

    /**
     * A list of categories in the catalog.
     */
    // private categories: Category[];

    /**
     * Creates a new Catalog instance.
     */
    private constructor() {
        this.products = new Map<number, Product>();
    }

    public static async fetchAll(database: BetterSQLite3Database = db) {
        if (Catalog.getInstance().productsFetched) {
            return
        }   

        Catalog.getInstance().products = await this.fetchAllProductsAndItems(database);
        Catalog.getInstance().productsFetched = true;
    }

    public static async insertNewProduct(database: any, name: string | null, prices: Price | Price[], unit: Unit, productId?: number) : Promise<number> {
        // if (productId === undefined) {
        //     productId = await Catalog.fetchNextProductId(database);
        // }
        console.log(unit) 
        const res = await database.insert(productsTable)
            .values({
                // productId: productId,
                name: name,
                prices: ensureArray(prices),
                units: unit,
            })
            .returning({newId: productsTable.productId})
            .execute()
        ;
    
        return res[0]['newId'];
    }

    public static async fetchNextProductId(database: any): Promise<number> {
        const res = await database
            .select({nextProductId: sql<number>`MAX(productId) + 1`})
            .from(productsTable)
            // .orderBy({productId: 'desc'})
            // .limit(1)
        ;
        if (res.length === 0 || res[0]['nextProductId'] === null) {
            return 1;
        }

        return res[0]['nextProductId'];
    }

    public static async fetchNextItemId(database: any, productId: number): Promise<number> {
        const res = await database
            .select({nextItemId: sql<number>`MAX(itemId) + 1`})
            .from(itemsTable)
            .where(eq(itemsTable.productId, productId))
        ;

        if (res.length === 0 || res[0]['nextItemId'] === null) {
            return 1;
        } 
        
        return res[0]['nextItemId'];
    }

    public static async insertNewItem(database: any, productId: number, subname: string, priceIdxs: number[], stock?: Decimal, ean?: string, itemId?: number) : Promise<number> {
        if (itemId === undefined) {
            itemId = await this.fetchNextItemId(database, productId);
        }
        
        const res = await database.insert(itemsTable)
            .values({
                itemId: itemId,
                productId: productId,
                subname: subname,
                priceIdxs: priceIdxs,
                itemDiscountIdxs: [],
                stock: stock === undefined ? null : stock.toString(),
                ean: ean,
            })
            .returning({newId: itemsTable.itemId})
            .execute()
        ;
    
        return res[0]['newId'];
    }

    public static async fetchAllProductsAndItems(database: BetterSQLite3Database = db): Promise<Map<number, Product>> {
        const products = await Catalog.fetchAllProducts(database);
        for (const product of products.values()) {
            await Catalog.fetchAllItems(database, product);
        }
        return products;
    }

    private static async fetchAllProducts(database: BetterSQLite3Database) : Promise<Map<number, Product>> {
        const res = await database
            .select()
            .from(productsTable)
        ;

        const products = new Map<number, Product>();

        for (const productObj of res) {
            const product = new Product(productObj.productId, productObj.name, productObj.units, productObj.prices);
            products.set(productObj.productId, product);
        }

        return products;
    }

    private static async fetchAllItems(database: BetterSQLite3Database, product: Product) : Promise<void> {
        const res = await database
            .select()
            .from(itemsTable)
            .where(eq(itemsTable.productId, product.getProductId()));
        ;

        for (const itemObj of res) {
            const item = new Item(product, itemObj.itemId, itemObj.subname, itemObj.stock, itemObj.priceIdxs, itemObj.itemDiscountIdxs, itemObj.ean);
            product.addItem(item);
        }
    }

    /**
     * Gets the singleton instance of the Catalog class.
     * @returns The singleton instance of the Catalog class.
     */
    public static getInstance(): Catalog {
        if (!Catalog.instance) {
            Catalog.instance = new Catalog();
        }
        return Catalog.instance;
    }

    /**
     * Gets the product with the specified product ID.
     * @param productId The ID of the product to get.
     * @returns The product with the specified product ID, or undefined if the product does not exist.
     */
    public static getProduct(productId: number): Product {
        const product = Catalog.getInstance().products.get(productId);
        if (!product) {
            throw new CashRegisterError("Product with ID " + productId + " does not exist in the catalog.");
        }
        return product;
    }

    public static getItemById(fullItemId: number) {
        const productId = Math.floor(fullItemId / 1000);
        const itemId = fullItemId % 1000;
        return Catalog.getItem(productId, itemId);
    }

    /**
     * Gets the item with the specified product ID and item ID.
     * @param productId The ID of the product to get.
     * @param itemId The ID of the item to get.
     * @returns The item with the specified item ID from the specified product ID, or throws a NotFoundError if the item does not exist.
     */
    public static getItem(productId: number, itemId: number): Item {
        const product = Catalog.getInstance().products.get(productId);
        if (!product) {
            throw new NotFoundError(ErrCode.ITEM_NOT_IN_PRODUCT, createFullItemId(productId, itemId));
        }

        return product.getItem(itemId);        
    }

    /**
     * Adds a new item to the catalog.
     * @param item The item to add.
     */
    public static addItem(item: Item): void {
        const product = Catalog.getInstance().products.get(item.getProductId());
        if (product) {
            product.addItem(item);
        }
    }

    /**
     * Updates an existing item in the catalog.
     * @param item The item to update.
     */
    public static updateItem(item: Item): void {
        const product = Catalog.getInstance().products.get(item.getProductId());
        if (product) {
            product.updateItem(item);
        }
    }

    /**
     * Removes an item from the catalog by its ID.
     * @param itemId The ID of the item to remove.
     */
    public static removeItem(itemId: number): void {
        Catalog.getItemById(itemId)
    }

    /**
     * Gets the stock quantity of an item by its ID.
     * @param fullItemId The ID of the item to get the stock quantity for.
     * @returns The stock quantity of the item.
     */
    public static getItemStock(fullItemId: number): Decimal | null {
        const item: Item = Catalog.getItemById(fullItemId);
        if (item) {
            return item.getStock();
        }

        throw new NotFoundError(ErrCode.ITEM_NOT_IN_PRODUCT, fullItemId);
    }

    public static containsProduct(productId: number): boolean {
        return Catalog.getInstance().products.has(productId);
    }

    public static containsItem(productId: number, itemId: number): boolean {
        return Catalog.getProduct(productId)?.getItems().has(itemId) ?? false;
    }

    public static getProducts(): Product[] {
        return Array.from(Catalog.getInstance().products.values());
    }
}
