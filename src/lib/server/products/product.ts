/**
 * A base product class, encapsulates a non-zero amount of items (variants)
 * The product itself only carries the items common names
 * 
 * @author: Radek Sverak
 * @version: 1.0
 */

import { ErrCode } from "$lib/shared/errors/cash-register-error";
import { DuplicateError } from "$lib/shared/errors/duplicate-error";
import { NotFoundError } from "$lib/shared/errors/not-found-error";
import { createFullItemId } from "$lib/shared/utils";
import { eq } from "drizzle-orm";
import { productsTable } from "../db/schema/product-model";
import type { Condition } from "$lib/shared/prices/condition";
import type { ItemDiscount } from "$lib/shared/prices/item-discount";
import type { Price } from "$lib/shared/prices/price";
import type { Item } from "./item";
import { db } from "../db/db";

export enum Unit {
    UNIT = 'ks',
    KG = 'Kg',
    G = 'g'
}

export class Product {
    /**
     * Unique identifier for the product
     * Together with item id uniquily identifies an item
     * Id format: '{productId}{itemId}'
     */
    private productId: number;
  
    /**
     * Name of the product
     */
    private name: string | null;
  
    /**
     * Mapping of item IDs to their corresponding Item objects
     */
    private items: Map<number, Item>;

    public lastItemId: number = 1;
    /**
     * In what unit is this prodcut
     */
    private units: Unit;

    /**
     * Mapping of prices to Item ids
     */
    private prices: Price[];

    /**
     * Mapping of discounts to Item ids
     */
    private itemDiscounts: ItemDiscount[];
    
    /**
     * Constructs a new Product instance with the given product ID, name, units, items, and prices
     * @param productid The ID of the product
     * @param name The name of the product
     * @param units The units of the product
     * @param prices The prices of the product, either as a single Price object or a Map of Price objects indexed by item ID
     */
    public constructor(
        productid: number,
        name: string | null,
        units: Unit,
        prices: Price | Price[],
    ) {
        this.productId = productid;
        this.name = name;
        this.items = new Map();
        this.units = units;

        if (!Array.isArray(prices)) {
            prices = [prices];
        } 

        this.prices = prices;
        this.itemDiscounts = [];
    }

    /**
     * Gets the name of the product.
     * 
     * @returns The name of the product.
     */
    public getName(): string | null {
        return this.name;
    }

    /**
     * Retrieves an item from the product using the full item ID.
     *
     * @param {number} fullItemID - The full item ID.
     * @return {Item} The item corresponding to the full item ID.
     */
    public getItemByFullId(fullItemID: number): Item {
        const itemId = fullItemID % 1000;
        return this.getItem(itemId);
    }

    /**
     * Retrieves an item from the product using the item ID.
     *
     * @param {number} itemId - The ID of the item to retrieve.
     * @return {Item} The item corresponding to the given item ID.
     * @throws {ItemNotInProductError} If the item with the given ID does not exist in the product.
     */
    public getItem(itemId: number): Item {
        const item = this.items.get(itemId);
        if (!item) {
            throw new NotFoundError(ErrCode.ITEM_NOT_IN_PRODUCT, createFullItemId(this.productId, itemId));
        }

        return item;
    }

    /**
     * Returns the product id of this product.
     * 
     * @returns {number} The product id.
     */
    public getProductId(): number {
        return this.productId;
    }

    /**
     * Returns the unit of measurement for this product.
     * 
     * @returns {Unit} The unit of measurement.
     */
    public getUnits(): Unit {
        return this.units;
    }

    public getPrices(): Price[] {
        return this.prices;
    }

    // /**
    //  * Gets the prices associated with the given ItemId.
    //  * 
    //  * @param itemId The ID of the item to get prices for.
    //  * @returns An array of Price objects associated with the given itemId, or an empty array if no prices are found.
    //  */
    // public getItemPrices(itemId: number): Price[] {
    //     const prices: Price[] = [];

    //     this.prices.forEach((itemIds, price) => {
    //         if (itemIds.includes(itemId)) {
    //             prices.push(price);
    //         }
    //     });

    //     return prices;
    // }
    
    /**
     * Adds a new item discount to the item
     * @param newItemDiscounts The discount or array of discounts to add
     */
    public addItemDiscount(newItemDiscounts: ItemDiscount | ItemDiscount[] ): void {
        if (Array.isArray(newItemDiscounts)) {
            this.itemDiscounts.push(...newItemDiscounts);
        } else {
            this.itemDiscounts.push(newItemDiscounts);
        }
    }

    /**
     * Removes an item discount from the item
     * @param discount The discount to remove
     */
    public removeItemDiscount(discount: ItemDiscount): void {
        this.itemDiscounts = this.itemDiscounts.filter(itemDiscount => itemDiscount!== discount);
    }

    public async addPrice(price: Price, applyToItems: boolean = false): Promise<void> {
        const idx = this.prices.push(price) - 1;

        // Update the database
        await this.updatePrices();

        if (applyToItems) {
            for (const item of this.items.values()) {
                console.log(idx)
                await item.addPriceIdx(idx);
            }
        }
    }

    // Remove a price from the prices array by index
    public async removePrice(idx: number): Promise<void> {
        if (idx < 0 || idx >= this.prices.length) {
            throw new Error("Price index out of bounds");
        }

        this.prices.splice(idx, 1);

        for (const item of this.items.values()) {
            await item.removePriceIdx(idx);
        }

        await this.updatePrices();
    }

    public async updatePrices() {
        await db
            .update(productsTable)
            .set({
                prices: this.prices
            })
            .where(eq(productsTable.productId, this.productId))
            .execute()
        ;
    }

    public async addPriceCondition(priceIdx: number, condition: Condition): Promise<void> {
        this.getPrice(priceIdx).addCondition(condition);

        await this.updatePrices();
    }

    public async removeAllPriceConditions(priceIdx: number): Promise<void> {
        this.getPrice(priceIdx).eraseConditions();

        await this.updatePrices();
    }

    public getPrice(idx: number): Price {
        if (idx >= this.prices.length)  {
            throw new Error("Price index out of bounds");
        }
        
        return this.prices[idx];
    }

    /**
     * Retrieves the ItemDiscount from the product based on the index.
     *
     * @param {number} idx - The index of the ItemDiscount to retrieve.
     * @return {ItemDiscount | null} The retrieved ItemDiscount or null if not found.
     */
    public getDiscount(idx: number): ItemDiscount | null {
        if (idx >= this.itemDiscounts.length) {
            throw new NotFoundError(ErrCode.DISCOUNT_NOT_ON_PRODUCT, idx, this.productId);
        }
        return this.itemDiscounts[idx];
    }

    public addItem(item: Item): void {
        if (this.items.has(item.getItemId())) throw new DuplicateError(ErrCode.DUPLICATE_ITEM_ID, item.getItemId())

        if (item.getItemId() > this.lastItemId) {
            this.lastItemId = item.getItemId();
        }
        this.items.set(item.getItemId(), item);
    }

    public updateItem(item: Item): void {
        if (!this.items.has(item.getItemId())) {
            throw new NotFoundError(ErrCode.ITEM_NOT_IN_PRODUCT, item.getFullId());

        }

        this.items.set(item.getItemId(), item);
    }

    public removeItem(itemId: number): boolean {
        if (!this.items.has(itemId)) {
            throw new NotFoundError(ErrCode.ITEM_NOT_IN_PRODUCT, createFullItemId(this.productId, itemId));
        }
        
        return this.items.delete(itemId);
    }

    public getItems(): Map<number, Item> {
        return this.items;
    }

    public isSingleVariant(): boolean {
        return this.items.size === 1;
    }

    public getDisplayInfo(): { displayId: string, displayName: string }{
        let name: string;
        let id: string;
        if (this.isSingleVariant()) {
            const item = this.items.values().next().value;
            name = item.getSubname();
            id = item.getFullId();
        } else {
            name = this.name ?? "";

            const itemIds = [];
            for (const item of this.items.values()) {
                itemIds.push(item.getItemId());
            }

            id = this.productId.toString() + Math.min(...itemIds).toString().padStart(3, '0') + " - " + Math.max(...itemIds).toString().padStart(3, '0');
        }

        return {
            displayId: id,
            displayName: name,
        }
    }

    public toJSON() {
        return {
            productId: this.productId,
            name: this.name,
            items: Array.from(this.items.values()).map(item => item.toJSON()),
            prices: this.prices.map(price => price.toJSON()),
            itemDiscounts: this.itemDiscounts,
            units: this.units
        }
    }
}
