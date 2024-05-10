/**
 * A base product class, encapsulates a non-zero amount of items (variants)
 * The product itself only carries the items common names
 * 
 * @author: Radek Sverak
 * @version: 1.0
 */

import type { Price } from "../prices/price";
import type { Item } from "./item";

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
    private name: string;
  
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
    private prices: Array<Price>;

    /**
     * Mapping of discounts to Item ids
     */
    private itemDiscounts: Array<ItemDiscount>;
    
    /**
     * Constructs a new Product instance with the given product ID, name, units, items, and prices
     * @param productid The ID of the product
     * @param name The name of the product
     * @param units The units of the product
     * @param items The items of the product, indexed by item ID
     * @param prices The prices of the product, either as a single Price object or a Map of Price objects indexed by item ID
     */
    public constructor(
        productid: number,
        name: string,
        units: Unit,
        items: Map<number, Item>, 
        prices: Price | Array<Price>
    ) {
        this.productId = productid;
        this.name = name;
        this.items = items;
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
    public getName(): string {
        return this.name;
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

    public getPrices(): Map<Price, Array<number>> {
        return this.prices;
    }

    /**
     * Gets the prices associated with the given ItemId.
     * 
     * @param itemId The ID of the item to get prices for.
     * @returns An array of Price objects associated with the given itemId, or an empty array if no prices are found.
     */
    public getItemPrices(itemId: number): Price[] {
        const prices: Price[] = [];

        this.prices.forEach((itemIds, price) => {
            if (itemIds.includes(itemId)) {
                prices.push(price);
            }
        });

        return prices;
    }
    
    /**
     * Adds a new item discount to the item
     * @param newItemDiscounts The discount or array of discounts to add
     */
    public addItemDiscount(newItemDiscounts: ItemDiscount | Array<ItemDiscount>): void {
        this.itemDiscounts.push(newItemDiscounts);
    }

    /**
     * Removes an item discount from the item
     * @param discount The discount to remove
     */
    public removeItemDiscount(discount: ItemDiscount): void {
        this.itemDiscounts = this.itemDiscounts.filter(itemDiscount => itemDiscount!== discount);
    }

    public addPrice(price: Price): void {
        this.prices.push(price);
    }

    // Remove a price from the prices array by index
    public removePrice(idx: number): void {
        if (idx < 0 || idx >= this.prices.length) {
            throw new Error("Price index out of bounds");
        }

        this.prices.splice(idx, 1);
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
        return this.itemDiscounts.find((itemDiscount) => itemDiscount.getIndex() === idx) || null;
    }
}