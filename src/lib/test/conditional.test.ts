import { MaxVolumeCondition, MinVolumeCondition } from '$lib/structs/prices/condition';
import { ConditionalMixin } from '$lib/structs/prices/conditional';
import Decimal from 'decimal.js';
import { test, expect } from 'vitest';
import { testCartWithItem } from './shopping-cart.test';

// Less then 1 and 6
function testConditionalMaxVolume(volume: Decimal = new Decimal(1)): ConditionalMixin {
    return new ConditionalMixin([
        new MaxVolumeCondition(volume),
    ]);
}

// Between 9 and 11
function testConditionalMaxAndMinVolume(minVolume: Decimal = new Decimal(9), maxVolume: Decimal = new Decimal(11)): ConditionalMixin {
    return new ConditionalMixin([
        new MaxVolumeCondition(maxVolume),
        new MinVolumeCondition(minVolume),
    ]);
}

test('ConditionalMixin adds a condition correctly', () => {
    const conditional = new ConditionalMixin();
    const condition = new MaxVolumeCondition(new Decimal(1));

    conditional.addCondition(condition);
});

test('ConditionalMixin returns true - max volume condition met', () => {
    const conditional = testConditionalMaxVolume(new Decimal(2));
    const cart = testCartWithItem();

    expect(conditional.areConditionsMet(11001, cart)).toBe(true);
})

test('ConditionalMixin returns true - max and min volume conditions met', () => {
    const conditional = testConditionalMaxAndMinVolume();
    const cart = testCartWithItem(new Decimal(10));

    expect(conditional.areConditionsMet(11001, cart)).toBe(true);
})

test('ConditionalMixin returns false - max and min volume conditions not met', () => {
    const conditional = testConditionalMaxAndMinVolume();
    const cart = testCartWithItem(new Decimal(8));
    expect(conditional.areConditionsMet(11001, cart)).toBe(false);

    const cart2 = testCartWithItem(new Decimal(12));
    expect(conditional.areConditionsMet(11001, cart2)).toBe(false);
})

test('ConditionalMixin returns false - condition not met', () => {
    const conditional = testConditionalMaxVolume();
    const cart = testCartWithItem(new Decimal(2));

    expect(conditional.areConditionsMet(11001, cart)).toBe(false);
})

test('ConditionalMixin returns false - one condition not met', () => {
    const conditional = testConditionalMaxVolume();
    conditional.addCondition(new MaxVolumeCondition(new Decimal(5)));
    const cart = testCartWithItem(new Decimal(4.9));

    expect(conditional.areConditionsMet(11001, cart)).toBe(false);
})