import type { Unit } from "$lib/server/products/product";
import type { IItem } from "./item";
import type { IPrice } from "./price";

interface IItemDiscount {
}

export interface IProduct {
    productId: number;
    name: string | null;
    items: IItem[];
    prices: IPrice[];
    itemDiscounts: IItemDiscount[];
    units: IUnit;
    createdAt?: Date;
    modifiedAt?: Date;
}

export interface INewProduct {
    name: string | null;
    prices: IPrice[];
    itemDiscounts: IItemDiscount[];
    units: Unit;
}

export type IUnit = "ks" | "Kg" | "g"; 
