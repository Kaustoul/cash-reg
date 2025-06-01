import type { ICondition } from "../interfaces/condition";
import type { Unit } from "../interfaces/product";
import type { IShoppingCartItem } from "../interfaces/shopping-cart";
import { Decimal } from "decimal.js";

export function formatConditionStrs(
    conditions: ICondition[],
    units?: Unit
): string[] {
    const res = []

    for (const cond of conditions) {
        switch (cond.type) {
            case "MinVolume":
            case "MaxVolume": {
                const sign = cond.type === "MinVolume" ? "≥" : "≤";
                if (units === undefined || units === "ks") {
                    res.push(`množství ${sign} ${cond.value}` + (units === "ks" ? units : ""));
                    break;
                }

                if (units === "g" || units === "Kg") {
                    if (cond.type === "MinVolume")
                        res.push(`${cond.value}${units} ≤ váha`);
                    else
                        res.push(`váha ≤ ${cond.value}${units}`);
                    break;
                }
                res.push(`${cond.type}: ${cond.value}`);
                break;
            }
            case "CartTotal": {
                res.push(`CartTotal: ${cond.value} `);
                break;
            }

            default:
                res.push(`${cond.type}: ${cond.value}`);
        }
    }
    return res;
}

export function areConditionsMet(
    conditions: ICondition[],
    item?: IShoppingCartItem,
    total?: Decimal
): boolean {
    if (conditions.length === 0) {
        return true;
    }

    return conditions.every(cond => isConditionMet(cond, item, total));
}
    

export function isConditionMet(
    condition: ICondition,
    item?: IShoppingCartItem,
    total?: Decimal
): boolean {
    switch (condition.type) {
        case "MinVolume":
            if (item === undefined) {
                throw new Error("Item must be defined for MinVolume condition");
            }

            return item.quantity.gte(new Decimal(condition.value));
        case "MaxVolume":
            if (item === undefined) {
                throw new Error("Item must be defined for MaxVolume condition");
            }

            return item.quantity.lte(new Decimal(condition.value));
        case "CartTotal":
            if (total === undefined) {
                throw new Error("Total must be defined for CartTotal condition");
            }

            return total.gte(new Decimal(condition.value));
        default:
            throw new Error(`Unknown condition type: ${condition.type}`);
    }
}

