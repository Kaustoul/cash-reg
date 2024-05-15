import Decimal from "decimal.js";
import type { Discount } from "./discount";

export class PercentDiscount implements Discount {
    private percentage: Decimal;

    public constructor(percentage: Decimal) {
        this.percentage = percentage;
    }

    public apply(value: Decimal): Decimal {
        return value.mul(new Decimal(1).sub(this.percentage));
    }

    public getDiscountAmount(value: Decimal): Decimal {
        return value.mul(this.percentage);
    }
}