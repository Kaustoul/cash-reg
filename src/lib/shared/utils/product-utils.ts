import type { IProduct } from "../interfaces/product";
import type { IProductVariant } from "../interfaces/product-variant";
import { fullItemId } from "./item-utils";
import Decimal from "decimal.js";
import { formatDecimal, formatPrice } from "../utils";

export const isSingleVariant = (product: IProduct): boolean => {
    return Object.keys(product.items).length === 1;
}

export const singleVariantFullId = (product: IProduct): number => {
    if (!isSingleVariant(product)) {
        throw new Error("Product is not a single variant");
    }

    return fullItemId(product.items[0]);
}

export const formatFullId = (product: IProduct): string => {
    if (isSingleVariant(product)) {
        return fullItemId(product.items[0]).toString();
    }

    return `${product.productId}${formatItemIds(Object.values(product.items))}`; 
}

export const formatProductName = (product: IProduct): string => {
    return isSingleVariant(product) ? product.items[0].subname : product.name!;
}

export const formatItemIds = (items: IProductVariant[]): string => {
    const itemIds = items.map(item => item.itemId);
    return Math.min(...itemIds).toString().padStart(3, '0') 
        + " - " + Math.max(...itemIds).toString().padStart(3, '0');
}

