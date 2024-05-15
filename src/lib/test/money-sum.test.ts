import { Currency } from '$lib/structs/prices/currency';
import { MoneySum } from '$lib/structs/prices/money-sum';
import Decimal from 'decimal.js';
import { test, expect } from 'vitest';
import { testCartWithItem } from './shopping-cart.test';
import { testItemFullId } from './item.test';

export function testCZKcurrency(): Currency {
    return new Currency("CZK", new Decimal(0.21), new Decimal(1));
}

/**
 * Returns a test MoneySum object with CZK currency and default value of 100 
 * @param value 
 * @returns 
 */
export function testMoneySum(value: Decimal = new Decimal(100)): MoneySum {
    return new MoneySum(testCZKcurrency(), value, true);
}

test('MoneySum getValue returns correct value', () => {
    const sum = testMoneySum();
    const cart = testCartWithItem()
    expect(sum.getValue().toString()).toBe("100");
});


test('MoneySum applies a discount and returns correct value', () => {
    // TODO
    const sum = testMoneySum();
    const cart = testCartWithItem()
    expect(sum.getValue().toString()).toBe("100");
});