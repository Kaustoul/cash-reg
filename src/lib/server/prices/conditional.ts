import { ErrCode } from "$lib/server/errors/cash-register-error";
import { NotFoundError } from "$lib/server/errors/not-found-error";
import type { Unit } from "../products/product";
import type { ShoppingCart } from "../till/shopping-cart";
import { ConditionFactory, MaxVolumeCondition, MinVolumeCondition, type Condition, type ConditionModel } from "./condition";

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

    public eraseConditions() {
        this.conditions = [];
    }

    public static fromJSON(json: ConditionalModel): Condition[] {
        const res = [];
        for (const condition of json) {
            const conditionObj = ConditionFactory.fromJSON(condition);

            res.push(conditionObj);
        }
        
        return res;
    }

    public toJSON() {
        return this.conditions.map(c => c.toJSON());
    }

    public toString(units: Unit): string {
        switch (this.conditions.length) {
            case 0:
                return "";

            case 1:
                return this.conditions[0].toString(units, "množství");

            case 2:
                if (this.conditions[0] instanceof MinVolumeCondition && this.conditions[1] instanceof MaxVolumeCondition) {
                    return `${this.conditions[0].toString(units, "množství")} ${this.conditions[1].toString(units)}`;
                } else if (this.conditions[0] instanceof MaxVolumeCondition && this.conditions[1] instanceof MinVolumeCondition) {
                    return `${this.conditions[1].toString(units, "množství")} ${this.conditions[0].toString(units)}`;
                }

            // if case 2 doesnt return fall through to default
            default:
                return this.conditions.map(c => c.toString(units, "množství")).join(" ");
            
        }
    }
}

export type ConditionalModel = ConditionModel[];
