import type { IItem } from "../interfaces/item";

export const fullItemId = (item: IItem): number => {
    return parseFullItemId(item.productId, item.itemId);
}

export const parseFullItemId = (productId: number, itemId: number): number => {
    return parseInt(productId.toString() + itemId.toString().padStart(3, '0'));
}

export const reduceFullItemId = (fullItemId: number | string): [number, number] => {
    const fullItemIdStr = fullItemId.toString();

    const productId = parseInt(fullItemIdStr.slice(0, -3));
    const itemId = parseInt(fullItemIdStr.slice(-3));

    return [productId, itemId];
}

export const parseItemName = (productName: string | null, itemSubname: string): string => {
    if (productName === null) {
        return itemSubname;
    }

    return `${productName} - ${itemSubname}`;
}

