import Decimal from "decimal.js";
import { MoneySum } from "./money-sum";
import type { Currency } from "./currency";
import type { ShoppingCart } from "$lib/shared/till/shopping-cart";
import { ConditionalMixin, type ConditionalModel } from "./conditional";
import type { Condition } from "./condition";
import type { Unit } from "$lib/server/products/product";
import { CurrencyManager } from "./currency-manager";

export class Price extends MoneySum {
    /**
     * Any conditions associated with this price, like min and max volume.
     */
    private conditional: ConditionalMixin;
    
    /**
     * Constructs a new Price instance with the given currency, price type, and value
     * @param currency The currency of the price
     * @param priceType The type of price (e.g. net or gross)
     * @param value The value of the price
     */
    public constructor(value: Decimal, currency: Currency = CurrencyManager.getDefaultCurrency(), withVat: boolean = false, conditions: Condition[] = []) {
        super(value, currency, withVat);
        this.conditional = new ConditionalMixin(conditions);
    }
  
    public areConditionsMet(itemId: number, cart: ShoppingCart): boolean {
        return this.conditional.areConditionsMet(itemId, cart);
    }

    public addCondition(condition: Condition): void {
        this.conditional.addCondition(condition);
    }

    public static fromJSON(json: PriceModel): Price {
        return new Price(
            new Decimal(json.value),
            CurrencyManager.getCurrency(json.currency),
            false,
            ConditionalMixin.fromJSON(json.conditions),
        );
    }
    
    public toString(units?: Unit): string {
        return `${super.toString()}` + (units !== undefined ? ` / ${units}` : '');
    }

    public toJSON() {
        return {
            ...super.toJSON(),
            conditions: this.conditional.toJSON(),  
        };
    }

    public conditionalToString(units: Unit): string {
        return this.conditional.toString(units);
    }

    public eraseConditions() {
        this.conditional.eraseConditions();
    }
}

export type PriceModel = {
    currency: string,
    value: string,
    conditions: ConditionalModel,
};

