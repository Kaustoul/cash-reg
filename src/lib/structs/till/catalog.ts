import type Decimal from "decimal.js";
import type { Item } from "../products/item";
import type { Product } from "../products/product";
import { NotFoundError } from "$lib/errors/not-found-error";
import { ErrCode } from "$lib/errors/cash-register-error";
import { createFullItemId, productIdFromFullId } from "$lib/utils";


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

    /**
     * A list of categories in the catalog.
     */
    // private categories: Category[];

    /**
     * Creates a new Catalog instance.
     */
    private constructor() {
        this.products = new Map<number, Product>();
        // this.categories = [];
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
    public getProduct(productId: number): Product | undefined {
        return this.products.get(productId);
    }

    public getItemById(fullItemId: number) {
        const productId = Math.floor(fullItemId / 1000);
        const itemId = fullItemId % 1000;
        return this.getItem(productId, itemId);
    }

    /**
     * Gets the item with the specified product ID and item ID.
     * @param productId The ID of the product to get.
     * @param itemId The ID of the item to get.
     * @returns The item with the specified item ID from the specified product ID, or throws a NotFoundError if the item does not exist.
     */
    public getItem(productId: number, itemId: number): Item {
        const product = this.products.get(productId);
        if (!product) {
            throw new NotFoundError(ErrCode.ITEM_NOT_IN_PRODUCT, createFullItemId(productId, itemId));
        }

        return product.getItem(itemId);        
    }

    /**
     * Adds a new item to the catalog.
     * @param item The item to add.
     */
    public addItem(item: Item): void {
        const product = this.products.get(item.getProductId());
        if (product) {
            product.addItem(item);
        }
    }

    /**
     * Updates an existing item in the catalog.
     * @param item The item to update.
     */
    public updateItem(item: Item): void {
        const product = this.products.get(item.getProductId());
        if (product) {
            product.updateItem(item);
        }
    }

    /**
     * Removes an item from the catalog by its ID.
     * @param itemId The ID of the item to remove.
     */
    public removeItem(itemId: number): void {
        this.getItemById(itemId)
    }

    /**
     * Gets the stock quantity of an item by its ID.
     * @param fullItemId The ID of the item to get the stock quantity for.
     * @returns The stock quantity of the item.
     */
    public getItemStock(fullItemId: number): Decimal {
        for (const product of this.products.values()) {
            const item: Item = this.getItemById(fullItemId);
            if (item) {
                return item.getStock();
            }
        }

        throw new NotFoundError(ErrCode.ITEM_NOT_IN_PRODUCT, fullItemId);
    }
}