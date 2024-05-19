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