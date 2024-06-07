import type { Unit } from "$lib/server/products/product";
import type { IItem } from "./item";
import type { IPrice } from "./price";

interface IItemDiscount {
}

export interface IProduct {
    productId: number;
    name: string | null;
    items: {
        [itemId: number]: IItem;
    }
    prices: IPrice[];
    itemDiscounts: IItemDiscount[];
    units: Unit;
    createdAt: Date;
    modifiedAt: Date;
}
