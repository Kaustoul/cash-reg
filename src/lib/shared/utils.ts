import Decimal from "decimal.js";
import type { IPrice } from "./interfaces/price";
import { CurrencyManager } from "./prices/currency-manager";
import type { DecimalStr } from "./interfaces/money-sum";

export function ensureArray<T>(value: Array<T> | T | undefined): Array<T>{
    if (value === undefined) {
        return []
    }

    if (Array.isArray(value)) {
        return value;
    }

    return [value];
}

export function ensureArrayOrUndefined<T>(value: Array<T> | T | undefined): Array<T> | undefined {
    if (value === undefined) {
        return undefined;
    }

    return ensureArray(value);
}

export function createFullItemId(productId: number, itemId: number): number {
    const fullId = parseInt(productId.toString() + itemId.toString().padStart(3, '0'));
    return fullId;
}

/**
 * Extracts the item ID from the full item ID.
 *
 * @param {number} fullItemId - The full item ID.
 * @returns {number} The item ID.
 */
export function itemIdFromFullId(fullItemId: number): number {
    return fullItemId % 1000;
}

/**
 * Extracts the product ID from the full item ID.
 *
 * @param {number} fullItemId - The full item ID.
 * @returns {number} The product ID.
 */
export function productIdFromFullId(fullItemId: number): number {
    return Math.floor(fullItemId / 1000);
}

export function formatDecimal(value: Decimal | DecimalStr, alwaysDecimal: boolean = false, roundToWhole: boolean = false): string {
    if (!(value instanceof Decimal)) {
        value = new Decimal(value);
    }

    let isNegative = value.isNegative();
    if (isNegative) {
        value = value.abs();
    }
    
    if (value.isNaN()) {
        return 'NaN';
    }

    if (roundToWhole) {
        value = value.round();
    }

    let [integerPart, decimalPart] = value.toFixed(2).split('.');

    // Add thousand separators to the integer part
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (alwaysDecimal) {
        return decimalPart ? `${isNegative ? "- " : ""}${integerPart}.${decimalPart}` : `${isNegative ? "- " : ""}${integerPart}.00`;
    }

    return decimalPart && decimalPart !== '00' ? `${isNegative ? "- " : ""}${integerPart}.${decimalPart}` : `${isNegative ? "- " : ""}${integerPart}`;
}

export function formatPrice(price: IPrice, includeCurrency: boolean = false): string {
    let res = formatDecimal(new Decimal(price.value.value))

    if (includeCurrency) {
        res += ' ' + CurrencyManager.getCurrency(price.value.currency).getSymbol();
    }

    return res;
}

export function cleanObject<T extends {}>(obj: T): T {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== undefined)
    ) as T;
}
