import type { IItem } from "../interfaces/item";

export const fullItemId = (item: IItem): number => {
    return parseInt(item.productId.toString() + item.itemId.toString().padStart(3, '0'));
}


