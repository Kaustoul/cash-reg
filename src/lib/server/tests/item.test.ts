import { CashRegisterError } from '$lib/server/errors/cash-register-error';
import { NotEnoughStockError } from '$lib/server/errors/not-enough-stock-error';
import { Item } from '$lib/server/products/item';
import { Product, Unit } from '$lib/server/products/product';
import { ShoppingCart } from '$lib/server/till/shopping-cart';
import Decimal from 'decimal.js';
import { test, expect } from 'vitest';
import { testProduct, testProductConditionalPrices, testProductDiscounts, testProductMultiplePrices } from './product.test';
import { testCart, testCartWithItem } from './shopping-cart.test';
import { Price } from '$lib/server/prices/price';

export function testItem(product: Product = testProduct(), stock: Decimal = new Decimal(10)): Item {
    const item = new Item(product, 1, 'Subname', stock, [0]);
    return item;
}

export function testItemFullId(): number {
    return 11001;
}

export function testItemSinglePrice(stock: Decimal = new Decimal(10)): Item {
    const item = new Item(testProductMultiplePrices(), 1, 'Subname', stock, [1]);
    return item;
}

export function testItemSingleDiscount(stock: Decimal = new Decimal(10)): Item {
    const item = new Item(testProductDiscounts(), 1, 'Subname', stock, [0], [1]);
    return item;
}

export function testItemMultipleDiscounts(stock: Decimal = new Decimal(10)): Item {
    const item = new Item(testProductDiscounts(), 1, 'Subname', stock, [0], [0, 1, 2]);
    return item;
}

export function testItemConditionalPrices(stock: Decimal = new Decimal(10)): Item {
    const item = new Item(testProductConditionalPrices(), 1, 'Subname', stock, [0, 1, 2]);
    return item;
}

test('Item is correctly constructed and should return all correct initialized values', () => {
    const item = testItem();
    const cart = testCartWithItem(new Decimal(1), item);

    expect(item.getProductId()).toBe(11);
    expect(item.getItemId()).toBe(1);
    expect(item.getFullId()).toBe(11001);
    const res = item.getPriceValue(cart);

    expect(res.toString()).toBe("100");
    expect(item.getFullName()).toBe("TestProduct1 - Subname");
    expect(item.getStock().eq(new Decimal(10))).toBe(true);
});

test('Adding extra stock to item', () => {
    const item = testItem();
    item.addStock(new Decimal(10));
    
    expect(item.getStock().eq(new Decimal(20))).toBe(true);

    item.addStock(new Decimal(10.5));
    expect(item.getStock().eq(new Decimal(30.5))).toBe(true);

    item.addStock(new Decimal(0.5));
    expect(item.getStock().eq(new Decimal(31))).toBe(true);
});

test('Adding negative stock results in err.', () => {
    const item = testItem();
    expect(() => item.addStock(new Decimal(-1))).toThrow(CashRegisterError);    
});

test('Updating stock on an item', () => {
    const item = testItem();
    const val = new Decimal(120.1);
    item.setStock(val);
    
    expect(item.getStock().eq(val)).toBe(true);
});


test('Removing stock on an item', () => {
    const item = testItem();
    const val = new Decimal(5);
    const expected = item.getStock().sub(val);
    item.removeStock(val);
    
    expect(item.getStock().eq(expected)).toBe(true);
});

test('Checking if item has enough stock', () => {
    const item = testItem();
    expect(item.hasStock(new Decimal(9.5))).toBe(true);
    expect(item.hasStock(new Decimal(10.1))).toBe(false);
    expect(item.hasStock(new Decimal(0))).toBe(true);

    item.removeStock(new Decimal(0.5));
    expect(item.hasStock(new Decimal(9.5))).toBe(true);
    expect(item.hasStock(new Decimal(9.51))).toBe(false);
});

test('Removing decimal stock on an item', () => {
    const item = testItem();
    item.removeStock(new Decimal(.5));
    
    expect(item.getStock().eq(new Decimal(9.5))).toBe(true);
});

test('Removing decimal stock on an item', () => {
    const item = testItem();
    item.removeStock(new Decimal(.5));
    
    expect(item.getStock().eq(new Decimal(9.5))).toBe(true);
});

test('Removing negative stock results in err.', () => {
    const item = testItem();
    expect(() => item.removeStock(new Decimal(-1))).toThrow(CashRegisterError);
});

test('Removing more stock than there is results in err.', () => {
    const item = testItem();
    expect(() => item.removeStock(new Decimal(20))).toThrow(NotEnoughStockError);
})

test('Multiple prices product, single price item returns correct price', () => {
    const item = testItemSinglePrice();
    expect(item.getApplicablePrice(new ShoppingCart())).toBe(item.getProduct().getPrice(1));
})

test('Item get applicable discount on item with single discount', () => {
    const item = testItemSingleDiscount();
    const cart = testCart();
    const applicableDiscounts = item.getApplicableDiscounts(cart);

    expect(applicableDiscounts.length).toBe(1);
});

test('Item getValue with single ItemDiscounts returns corect value.', () => {
    const item = testItemSingleDiscount();
    const cart = testCart();

    expect(item.getPriceValue(cart).toString()).toBe("90");
});

test('Item get applicable discounts on item with multiple discount', () => {
    const item = testItemMultipleDiscounts();
    const cart = testCart();
    const applicableDiscounts = item.getApplicableDiscounts(cart);

    expect(applicableDiscounts.length).toBe(3);
});

test('Item getValue with multiple ItemDiscounts returns corect value.', () => {
    const item = testItemMultipleDiscounts();
    const cart = testCart();

    expect(item.getPriceValue(cart).toString()).toBe("30");
});

test('Item getApplicablePrice with multiple conditional prices returns correct price', () => {
    const item = testItemConditionalPrices();
    
    const cart0 = testCart();
    cart0.addItem(item, new Decimal(5));
    expect(item.getApplicablePrice(cart0)).toBe(item.getProduct().getPrice(0));

    const cart1 = testCartWithItem(new Decimal(15), testItemConditionalPrices());
    expect(item.getApplicablePrice(cart1)).toBe(item.getProduct().getPrice(1));

    const cart2 = testCartWithItem(new Decimal(25), testItemConditionalPrices());
    expect(() => item.getApplicablePrice(cart2)).toThrow(CashRegisterError);

    const cart3 = testCartWithItem(new Decimal(35), testItemConditionalPrices());
    expect(item.getApplicablePrice(cart3)).toBe(item.getProduct().getPrice(2));
});

// TODO:    Discounts
//          FinalPriceValue
//          Conditions
//          Tax         