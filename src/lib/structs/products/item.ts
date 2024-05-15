import Decimal from "decimal.js";
import type { Product } from "./product";
import { NotEnoughStockError } from "$lib/errors/not-enough-stock-error";
import type { Price } from "../prices/price";
import type { Discount } from "../prices/discount";
import { createFullItemId, ensureArray } from "$lib/utils";
import type { ShoppingCart } from "../till/shopping-cart";
import { CashRegisterError } from "$lib/errors/cash-register-error";
import type { ItemDiscount } from "../prices/item-discount";

/**
 * An `Item` represents a single variant of a product. It holds information specific to this variant, such as stock, price, and EAN code.
 * 
 * @author: Radek Sverak
 * @version: 1.0
 */
export class Item {
    /**
     * The product this item belongs to.
     */
    private readonly product: Product
    /**
     * Unique identifier for the products variant.
     * Together with item id uniquily identifies an item
     * Id format: '{productId}{itemId}'
     */
    private readonly itemId: number;
    private subname: string;
    private stock: Decimal;
    /**
     * European Article Number (EAN) of this item.
     */
    private ean?: string;
    private priceIndexes: Array<number>;
    private discountIndexes: Array<number>;
  
    /**
     * Constructs a new `Item` object with the given properties.
     * 
     * @param {Product} product - The product this item belongs to.
     * @param {number} itemId - The unique identifier for the product's variant.
     * @param {string} subname - The subname of this item.
     * @param {Array<number>} priceIdxs - The indexes of Price objects stored in the product active for this Item.
     * @param {Array<number>} discountIdxs - The indexes of ItemDiscount objects stored in the product active for this Item.
     * @param {string | undefined} eanCode - The European Article Number (EAN) of this item.
     * @param {Decimal} stock - The stock of this item.
     */
    public constructor(product: Product, itemId: number, subname: string, stock: Decimal, priceIdxs: Array<number>, discountIdxs?: Array<number>, eanCode?: string) {
        this.product = product;
        this.itemId = itemId;
        this.subname = subname;
        this.stock = stock;
        this.priceIndexes = priceIdxs;
        this.discountIndexes = discountIdxs || [];
        this.ean = eanCode;

        if (this.itemId > this.product.lastItemId) {
            this.product.lastItemId = this.itemId;
        }
    }

    /**
     * Calculates the final price of the item after applying any applicable discounts.
     *
     * @param {ShoppingCart} cart - The shopping cart containing the item.
     * @param {Discount | Array<Discount>} [discounts] - Optional discounts to apply to the item.
     * @return {number} The final price of the item.
     * @throws {Error} If no applicable price is found.
     */
    public getPriceValue(cart: ShoppingCart, discounts?: Discount | Array<Discount>): Decimal {
        if (cart.hasItem(this.itemId)) {
            throw new CashRegisterError("Trying to get value of item that is not in shopping cart");
        }
        
        const priceObj: Price | null = this.getApplicablePrice(cart);
        if (!priceObj) {
            throw new Error("No price applicable");
        }
        
        const allDiscounts = this.getApplicableDiscounts(cart, ensureArray(discounts));
        // TODO missing VAT
        return priceObj.getValue(allDiscounts);
    }

    /**
     * Retrieves the applicable price for the item based on given conditions.
     *
     * @param {ShoppingCart} cart - The shopping cart containing the item.
     * @return {Price | null} The applicable price or null if no price is found.
     */
    public getApplicablePrice(cart: ShoppingCart): Price | null {
        // TODO CHECK FOR MULTIPLE APPLICABLE PRICE OBJECTS
        
        for (const idx of this.priceIndexes) {
            const price = this.product.getPrice(idx);

            if (price && price.areConditionsMet(this.getFullId(), cart)) {
                return price;
            }
        }

        throw new CashRegisterError("No price applicable");
    }

    /**
     * Retrieves the applicable discounts from the provided array based on the conditions.
     *
     * @param {Discount[]} discounts - Array of Discount objects to check for applicability.
     * @param {ShoppingCart} cart - The shopping cart containing the item.
     * @return {Discount[]} The applicable discounts.
     */
    public getApplicableDiscounts(cart: ShoppingCart, discounts?: Discount[]): Discount[] {
        const allDiscounts: Discount[] = this.getItemDiscounts().filter(discount => discount.areConditionsMet(this.itemId, cart));
        if (discounts) {
            allDiscounts.push(...discounts);
        }
        return allDiscounts;
    }

    /**
     * Retrieves the item discounts from the product based on the discounts indexes.
     *
     * @return {ItemDiscount[]} The item discounts.
     */
    public getItemDiscounts(): ItemDiscount[] {
        const itemDiscounts: ItemDiscount[] = [];

        for (const idx of this.discountIndexes) {
            const itemDiscount = this.product.getDiscount(idx);

            if (itemDiscount) {
                itemDiscounts.push(itemDiscount);
            }
        }

        return itemDiscounts;
    }

    /**
     * Returns the parent item id of this item.
     * 
     * @returns {number} The parent item id.
     */
    public getProductId(): number {
        return this.product.getProductId();
    }

    public getItemId(): number {
        return this.itemId;
    }

    /**
     * Returns the parent item of this item.
     * 
     * @returns {Product} The parent item.
     */
    public getProduct(): Product {
        return this.product;
    }

   /**
     * Item id with product id uniquily identifies an item
     * 
     * @returns {number} full item id in format '{productId}{itemId:3}'
     */
    public getFullId(): number {
        return createFullItemId(this.getProductId(), this.itemId);
    }

    /**
     * Returns the subname of this item.
     * 
     * @returns {string} The subname.
     */
    public getSubname(): string {
        return this.subname;
    }

    /**
     * Returns the full name of this item.
     * 
     * @returns {string} The full name.
     */
    public getFullName(): string {
        return this.product.getName() + " - " + this.subname;
    }

    /**
     * Returns the stock of this item.
     * 
     * @returns {Decimal} The stock.
     */
    public getStock(): Decimal {
        return this.stock;
    }

    /**
     * Adds stock to this item.
     * 
     * @param {Decimal} amount The amount of stock to add.
     * @returns {Decimal} The new stock.
     */
    public addStock(amount: Decimal): Decimal {
        if (amount.lt(0)) {
            throw new CashRegisterError("Invalid stock amount");
        }

        this.stock = this.stock.add(amount);
        return this.stock;
    }

    /**
     * Updates the stock of this item.
     * 
     * @param {Decimal} newStock The new stock.
     */
    public setStock(newStock: Decimal): void {
        this.stock = newStock;
    }

    /**
     * Removes stock from this item.
     * 
     * @param {Decimal} amount The amount of stock to remove.
     * @returns {Decimal} The new stock.
     */
    public removeStock(amount: Decimal): Decimal {
        if (amount.lt(0)) {
            throw new CashRegisterError("Invalid stock amount");
        }
        
        let newStock: Decimal = this.stock.sub(amount);
        if (!this.hasStock(amount)) {
            throw new NotEnoughStockError(this.getFullId(), amount, this.stock);
        }

        this.stock = newStock;
        return this.stock;
    }

    /**
     * Checks if this item has stock.
     * 
     * @param {Decimal} amount The amount of stock to remove.
     * @returns {boolean} True if the item has stock, false otherwise.
     */
    public hasStock(amount: Decimal = new Decimal(1)): boolean {
        return this.stock.gte(amount)
    }
}
