import { Decimal } from "decimal.js";
import type { Discount } from "../prices/discount";
import type { Item } from "../products/item";
import { Catalog } from "./catalog";
import { CashRegisterError } from "$lib/errors/cash-register-error";

/**
 * Represents a shopping cart.
 */
export class ShoppingCart {
    /**
     * A map of items in the shopping cart, where the key is the full item ID and the value is the quantity of the item.
     */
    private items: Map<number, Decimal>;

    /**
     * The total value of the items in the shopping cart, excluding VAT.
     */
    private total: Decimal;

    /**
     * The total VAT of the items in the shopping cart.
     */
    private totalVat: Decimal;

    /**
     * Creates a new shopping cart.
     */
    constructor() {
        this.items = new Map<number, Decimal>();
        this.total = new Decimal(0);
        this.totalVat = new Decimal(0);
    }

    /**
     * Calculates the total value of the items in the shopping cart, excluding VAT.
     */
    public calculateTotal(): void {
        this.total = new Decimal(0);
        for (const [itemId, quantity] of this.items) {
            const item = Catalog.getInstance().getItemById(itemId);
            item.getPriceValue(this);
            this.total = this.total.plus(item.getPriceValue(this));
        }
    }

    /**
     * Applies a discount to the shopping cart.
     * @param discount The discount to apply.
     */
    public applyDiscount(discount: Discount): void {
        // TODO: Implement discount logic
    }

    /**
     * Gets the items in the shopping cart.
     * @returns A map of items in the shopping cart, where the key is the item ID and the value is the quantity of the item.
     */
    public getItems(): Map<number, Decimal> {
        return this.items;
    }

    /**
     * Adds an item to the shopping cart.
     * @param item The item to add.
     * @param quantity The quantity of the item to add.
     */
    public addItem(item: Item, quantity: Decimal = new Decimal(1)): Decimal {
        const fullId = item.getFullId();
        const currentQuantity: Decimal = this.items.get(fullId) ?? new Decimal(0);
        this.items.set(fullId, currentQuantity.add(quantity));
        // this.calculateTotal();

        return this.getQuantity(fullId);
    }

    /**
     * Updates the quantity of an item in the shopping cart.
     * @param item The item to update.
     * @param quantity The new quantity of the item.
     */
    public updateQuantity(itemId: number, amount: Decimal): void {
        if (!this.hasItem(itemId)) {
            throw new Error("Item not in cart!");
        }
        
        this.items.set(itemId, amount);
    }
    
    /**
     * Removes an item from the shopping cart.
     * @param item The item to remove.
     */
    public removeItem(itemId: number, amount: Decimal = new Decimal(1)): void {
        if (!this.hasItem(itemId)) {
            throw new Error("Item not in cart!");
        }
    
        const currentQuantity = this.items.get(itemId);
        if (!currentQuantity || currentQuantity.lte(0)) {
            throw new Error("Invalid quantity!");
        }
    
        this.items.set(itemId, currentQuantity.sub(amount));
    }
    
    public getQuantity(itemId: number): Decimal {
        if (!this.hasItem(itemId)) {
            throw new Error("Item not in cart!");
        }
    
        const quantity = this.items.get(itemId);
        if (!quantity) {
            throw new Error("Invalid quantity!");
        }
    
        return quantity;
    }

    public hasItem(itemId: number): boolean {
        return this.items.has(itemId);
    }
}