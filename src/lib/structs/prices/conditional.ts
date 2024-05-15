import { ErrCode } from "$lib/errors/cash-register-error";
import { NotFoundError } from "$lib/errors/not-found-error";
import type { ShoppingCart } from "../till/shopping-cart";
import type { Condition } from "./condition";

export class ConditionalMixin {
    /**
     * The list of conditions associated with this conditional
     */
    protected conditions: Array<Condition>;

    public constructor(conditions: Array<Condition> = []) {
        this.conditions = conditions;
    }
    
    /**
     * Checks whether all conditions are met for the given item ID and shopping cart
     * @param itemId The ID of the item to check
     * @param cart The shopping cart the item is in
     * @returns True if all conditions are met, false otherwise
     */
    public areConditionsMet(itemId: number, cart: ShoppingCart): boolean {
        for (const condition of this.conditions) {
            if (!condition.isMet(itemId, cart)) {
                return false;
            }
        }
        return true;
    }

    /**
    * Adds a new condition to the list of conditions
    * @param condition The condition to add
    */
    public addCondition(condition: Condition) {
        this.conditions.push(condition);
    }

    public removeCondition(condition: Condition) {
        const idx = this.conditions.indexOf(condition);
        if (idx == -1) {
            throw new NotFoundError(ErrCode.CONDITION_NOT_IN_CONDITIONAL);
        }
        this.conditions.splice(idx, 1);
    }
}