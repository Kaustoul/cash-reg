
import { Product, Unit } from '$lib/structs/products/product';
import Decimal from 'decimal.js';
import { test, expect } from 'vitest';
import { testItem } from './item.test';
import { testPrice } from './price.test';
import { FlatDiscount } from '$lib/structs/prices/flat-discount';
import { testMoneySum } from './money-sum.test';
import { PercentDiscount } from '$lib/structs/prices/percent-discount';
import { testFlatDiscount, testPercentDiscount } from './discount.test';
import { ItemFlatDiscount, ItemPercentDiscount } from '$lib/structs/prices/item-discount';
import { MaxVolumeCondition, MinVolumeCondition } from '$lib/structs/prices/condition';

export function testProduct(): Product {
    return new Product(11, "TestProduct1", Unit.UNIT, testPrice());
}

export function testProductMultiplePrices(): Product {
    return new Product(11, 
        "TestProduct2", 
        Unit.UNIT, 
        [testPrice(), testPrice(new Decimal(200)), testPrice(new Decimal(300))]
    );
}

export function testProductDiscounts(): Product {
    const product = new Product(11, 
        "TestProduct3", 
        Unit.UNIT, 
        testPrice()
    );

    product.addItemDiscount(new ItemFlatDiscount(testMoneySum(new Decimal(40))));
    product.addItemDiscount(new ItemPercentDiscount(new Decimal(0.1)));
    product.addItemDiscount(new ItemPercentDiscount(new Decimal(0.2)));

    return product;
}

export function testProductConditionalPrices(): Product {
    const product = testProductMultiplePrices();
    
    product.getPrice(0).addCondition(new MaxVolumeCondition(new Decimal(10)));
    product.getPrice(1).addCondition(new MinVolumeCondition(new Decimal(10)));
    product.getPrice(1).addCondition(new MaxVolumeCondition(new Decimal(20)));
    product.getPrice(2).addCondition(new MinVolumeCondition(new Decimal(30)));

    return product;
}

test('Product is correctly constructed and should return all correct initialized values', () => {
    const product = testProduct();
    expect(product.getProductId()).toBe(11);
    expect(product.getName()).toBe("TestProduct1");
    expect(product.getUnits()).toBe(Unit.UNIT);
});

test('Item can be added to a Product', () => {
    const product = testProduct();
    const item = testItem();

    product.addItem(item);
    expect(product.getItem(item.getItemId())).toStrictEqual(item);
    expect(product.getItemByFullId(item.getFullId())).toStrictEqual(item);
});