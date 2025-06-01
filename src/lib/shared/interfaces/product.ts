import type { Unit } from "$lib/server/products/product";
import type { IProductVariant } from "./product-variant";
import type { IPrice } from "./price";

interface IItemDiscount {
}

export interface IProduct {
    productId: number;
    name: string | null;
    items: IProductVariant[];
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
