import type Decimal from "decimal.js";
import { MoneySum } from "./money-sum";
import { Conditional, type Condition } from "./condition";
import type { Currency } from "./currency";

export class Price extends MoneySum implements Conditional {
    /**
     * Any conditions associated with this price, like min and max volume.
     */
    private conditions: Array<Condition>;
    
    /**
     * Constructs a new Price instance with the given currency, price type, and value
     * @param currency The currency of the price
     * @param priceType The type of price (e.g. net or gross)
     * @param value The value of the price
     */
    public constructor(currency: Currency, value: Decimal, withVat: boolean = false, conditions: Condition[] = []) {
        super(currency, value, withVat);
        this.conditions = conditions;
    }
  
    public areConditionsMet(itemId: number, cart: ShoppingCart): boolean {
        for (const condition of this.conditions) {
            if (!condition.isMet(itemId, cart)) {
                return false;
            }
        }
        return true;
    }

    public addCondition: (condition: Condition) => void;

}
