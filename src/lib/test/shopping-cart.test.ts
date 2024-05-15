import { ShoppingCart } from '$lib/structs/till/shopping-cart';
import { test, expect } from 'vitest';
import { testItem, testItemConditionalPrices, testItemFullId } from './item.test';
import Decimal from 'decimal.js';
import type { Item } from '$lib/structs/products/item';

export function testCart(): ShoppingCart {
    return new ShoppingCart();
}

export function testCartWithItem(quantity: Decimal = new Decimal(1), item: Item = testItem()): ShoppingCart {
    const cart = new ShoppingCart();
    cart.addItem(item, quantity);
    return cart;
}

test('AddItem adds item to cart', () => {
    const cart = testCart();
    const item = testItem();

    expect(cart.addItem(item).toString()).toBe("1");
    expect(cart.addItem(item).toString()).toBe("2");

    expect(cart.addItem(item, new Decimal(10)).toString()).toBe("12");
});

test('testCart with items is constructed correctly', () => {
    const cart = testCartWithItem();
    expect(cart.getItems().size).toBe(1);

    const cart1 = testCartWithItem(new Decimal(10), testItemConditionalPrices());
    expect(cart1.getQuantity(testItemFullId()).toString()).toBe("10");
    expect(cart1.hasItem(testItemFullId())).toBe(true);
});


