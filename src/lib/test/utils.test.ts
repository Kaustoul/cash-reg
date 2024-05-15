import { test, expect } from 'vitest';

import { createFullItemId, ensureArray, itemIdFromFullId, productIdFromFullId } from '$lib/utils';

test('ensureArray should return an empty array if value is undefined', () => {
    expect(ensureArray(undefined, true)).toStrictEqual([]);
});

test('ensureArray should return an empty array if value is undefined', () => {
    expect(ensureArray(undefined)).toBe(undefined);
});

test('ensureArray should return an array from any value', () => {
    expect(ensureArray(1)).toStrictEqual([1]);
});

test('ensureArray should return an array from any value', () => {
    expect(ensureArray([1, 2, 3])).toStrictEqual([1, 2, 3]);
});

test('createFullItemId should return correct value', () => {
    expect(createFullItemId(11, 1)).toBe(11001);
});

test('productIdFromFullId should return correct value', () => {
    expect(productIdFromFullId(11001)).toBe(11);
});

test('itemIdFromFullId should return correct value', () => {
    expect(itemIdFromFullId(11001)).toBe(1);
});