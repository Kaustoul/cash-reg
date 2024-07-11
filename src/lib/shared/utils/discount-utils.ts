import Decimal from "decimal.js";
import type { IDiscount } from "../interfaces/discount";


export function applyDiscounts(value: Decimal, discounts: IDiscount[]): Decimal {
    const zero = new Decimal(0)
    discounts.sort((a, b) => {
        if (a.type === "PRC" && b.type === "PRC")
            return 0;
        if (a.type === "PRC" && b.type !== "PRC")
            return -1;
        else return 1;
    })
    
    for (const discount of discounts) {
        value = applyDiscount(value, discount);

        if (value.lte(zero)) {
            return zero;
        }
    }

    return value;
}

export function applyDiscount(value: Decimal, discount: IDiscount): Decimal {
    const originalValue = value;
    if (discount.type === "PRC") {
        // value = value * (1 - discount.value) 
        value = value.mul(new Decimal(1).sub(new Decimal(discount.value).div(new Decimal(100)) ))
    } else {
        value = value.sub(new Decimal(discount.value))
    }

    discount.subtotal = originalValue.sub(value);
    return value;
}