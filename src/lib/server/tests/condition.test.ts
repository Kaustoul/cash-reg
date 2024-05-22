import { Item } from '$lib/server/products/item';
import { ShoppingCart } from '$lib/server/till/shopping-cart';
import { test, expect } from 'vitest';
import { testItem } from './item.test';
import { MaxVolumeCondition, MinVolumeCondition } from '$lib/server/prices/condition';
import Decimal from 'decimal.js';
import { testCart, testCartWithItem } from './shopping-cart.test';

test('MinVolumeCondition returns true for higher quantity of item in cart', () => {
    const condition = new MinVolumeCondition(new Decimal(9));
    const condition2 = new MinVolumeCondition(new Decimal(9.9));

    const cart = testCartWithItem(new Decimal(10));

    expect(condition.isMet(11001, cart)).toBe(true);
    expect(condition2.isMet(11001, cart)).toBe(true);
});

test('MinVolumeCondition returns true for the same quantity of item in cart', () => {
    const condition = new MinVolumeCondition(new Decimal(10));

    const cart = testCartWithItem(new Decimal(10));

    expect(condition.isMet(11001, cart)).toBe(true);
});

test('MaxVolumeCondition returns true for lower quantity of item in cart', () => {
    const condition = new MaxVolumeCondition(new Decimal(11));
    const condition2 = new MaxVolumeCondition(new Decimal(10.1));

    const cart = testCartWithItem(new Decimal(10));

    expect(condition.isMet(11001, cart)).toBe(true);
    expect(condition2.isMet(11001, cart)).toBe(true);
});

test('MaxVolumeCondition returns false for same quantity of item in cart', () => {
    const condition = new MaxVolumeCondition(new Decimal(10));

    const cart = testCartWithItem(new Decimal(10));

    expect(condition.isMet(11001, cart)).toBe(false);
});