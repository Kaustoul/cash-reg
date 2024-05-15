import type Decimal from "decimal.js";
import type { ShoppingCart } from "../till/shopping-cart";

export interface Condition {
    /**
     * Checks whether the condition is met for the given item ID and shopping cart
     * @param itemId The ID of the item to check
     * @param cart The shopping cart to check
     * @returns True if the condition is met, false otherwise
     */
    isMet(itemId: number, cart: ShoppingCart): boolean;
}
  
export class MaxVolumeCondition implements Condition {
    /**
     * The maximum volume required to meet the condition
     */
    private maxVolume: Decimal;
  
    /**
     * Constructs a new MaxVolumeCondition instance with the given maximum volume
     * @param maxVolume The maximum volume required to meet the condition
     */
    public constructor(maxVolume: Decimal) {
        this.maxVolume = maxVolume;
    }
  
    /**
     * Checks whether the condition is met for the given item ID and shopping cart
     * @param itemId The ID of the item to check
     * @param cart The shopping cart to check
     * @returns True if the condition is met, false otherwise
     */
    public isMet(itemId: number, cart: ShoppingCart): boolean {
        return cart.getQuantity(itemId).lt(this.maxVolume);  
    }
}
  
export class MinVolumeCondition implements Condition {
    /**
     * The minimum volume required to meet the condition
     */
    private minVolume: Decimal;
  
    /**
     * Constructs a new MinVolumeCondition instance with the given minimum volume
     * Condition is met if cart contains more or equal than minVolume of item
     * @param minVolume The minimum volume required to meet the condition
     */
    public constructor(minVolume: Decimal) {
        this.minVolume = minVolume;
    }
  
    /**
     * Checks whether the condition is met for the given item ID and shopping cart
     * @param fullItemId The ID of the item to check
     * @param cart The shopping cart to check
     * @returns True if the condition is met, false otherwise
     */
    public isMet(fullItemId: number, cart: ShoppingCart): boolean {
        return cart.getQuantity(fullItemId).gte(this.minVolume); 
    }
}