import Decimal from "decimal.js";
import type { IDiscount } from "../interfaces/discount";


/**
 * Applies a list of discounts to a value in order.
 * Percentage discounts ("PRC") are applied before fixed-amount discounts.
 * Each discount is applied to the running value, and if the value drops to zero or below, returns zero immediately.
 * 
 * @param value - The original value to apply discounts to.
 * @param discounts - Array of discounts to apply.
 * @returns The discounted value (never less than zero).
 */
export function applyDiscounts(value: Decimal, discounts: IDiscount[]): Decimal {
    const zero = new Decimal(0);

    // Sort: percentage discounts first (largest value first), then fixed-amount
    discounts.sort((a, b) => {
        if (a.type === "PRC" && b.type === "PRC") {
            // Sort by value descending
            return Number(b.value) - Number(a.value);
        }
        if (a.type === "PRC" && b.type !== "PRC")
            return -1;
        if (a.type !== "PRC" && b.type === "PRC")
            return 1;
        // For fixed-amount, keep original order
        return 0;
    });

    // Apply each discount in order
    for (const discount of discounts) {
        value = applyDiscount(value, discount);

        // Stop if value is zero or negative
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