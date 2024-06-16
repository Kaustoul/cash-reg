import type { IItem } from "../interfaces/item";

export const fullItemId = (item: IItem): number => {
    return parseFullItemId(item.productId, item.itemId);
}

export const parseFullItemId = (productId: number, itemId: number): number => {
    return parseInt(productId.toString() + itemId.toString().padStart(3, '0'));
}


