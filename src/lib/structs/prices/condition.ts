import Decimal from "decimal.js";
import type { ShoppingCart } from "../till/shopping-cart";
import { CashRegisterError } from "$lib/errors/cash-register-error";
import type { Unit } from "../products/product";

export interface Condition {
    /**
     * Checks whether the condition is met for the given item ID and shopping cart
     * @param itemId The ID of the item to check
     * @param cart The shopping cart to check
     * @returns True if the condition is met, false otherwise
     */
    isMet(itemId: number, cart: ShoppingCart): boolean;

    toJSON(): {condition: string, value: string};

    toString(units: Unit, placeholder?: string): string;
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

    public toJSON() {
        return {
            condition: 'MaxVolume',
            value: this.maxVolume.toString(),
        };
    }

    public toString(units: Unit, placeholder?: string): string {
        return (placeholder !== undefined ? `${placeholder} ` : '') + `< ${this.maxVolume} ${units}`;
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

    public toJSON() {
        return {
            condition: 'MinVolume',
            value: this.minVolume.toString(),
        };
    }

    public toString(units: Unit, placeholder?: string): string {
        console.log(this)
        return `${this.minVolume} ${units} ≤` + (placeholder !== undefined ? ` ${placeholder}` : '');
    }
}

export class ConditionFactory {
    public static fromJSON(json: ConditionModel): Condition {
        const value = new Decimal(json.value);
        switch (json.condition) {
            case 'MaxVolume':
                return new MaxVolumeCondition(value);
            case 'MinVolume':
                return new MinVolumeCondition(value);
            default:
                throw new CashRegisterError(`Unknown condition type: ${json.condition}`);
        }
    }
}

export type ConditionModel = {
    condition: string,
    value: string
};