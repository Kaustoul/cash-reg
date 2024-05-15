import { FlatDiscount } from "$lib/structs/prices/flat-discount";
import Decimal from "decimal.js";
import { expect, test } from "vitest";
import { testMoneySum } from "./money-sum.test";
import { PercentDiscount } from "$lib/structs/prices/percent-discount";

/**
 * A test FlatDiscount object with default value of 40 CZK
 */
export function testFlatDiscount(value: Decimal = new Decimal(40)): FlatDiscount {
    return new FlatDiscount(testMoneySum(value));
}

/**
 * A test FlatDiscount object with default value of 10 CZK
 */
export function testPercentDiscount(value: Decimal = new Decimal(0.1)): PercentDiscount {
    return new PercentDiscount(value);
}

test('FlatDiscount applies a discount and returns correct value', () => {
    const discount = testFlatDiscount();
    const sum = testMoneySum();
    expect(discount.getDiscountAmount(sum.getValue()).toString()).toBe("40");
    expect(discount.apply(sum.getValue()).toString()).toBe("60"); 
});

test('PercentDiscount applies a discount and returns correct value', () => {
    const discount = testPercentDiscount();
    const sum = testMoneySum();
    expect(discount.getDiscountAmount(sum.getValue()).toString()).toBe("10");
    expect(discount.apply(sum.getValue()).toString()).toBe("90");
})