import type Decimal from "decimal.js";
import { MoneySum } from "./money-sum";
import type { Discount } from "./discount";

export class FlatDiscount implements Discount {
    private amount: MoneySum;

    public constructor(amount: MoneySum) {
        this.amount = amount;
    }

    public apply(value: Decimal): Decimal {
        return value.sub(this.amount.getValue());
    }
    
    public getDiscountAmount(value: Decimal): Decimal {
        return this.amount.getValue();
    }
}