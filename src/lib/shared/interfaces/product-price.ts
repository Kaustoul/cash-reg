import type { ICondition } from "./condition";
import type { IMoneySum } from "./money-sum";

// export interface IPrice { 
//     value: IMoneySum;
//     conditions: ICondition[];
// } 

export type PriceType = 'base' | 'tiered'

export interface IPrice {
    priceId: number;
    productId?: number | null;
    variantId?: number | null;
    priceType: PriceType;
    amount: IMoneySum;
    minQuantity?: number | null;
    maxQuantity?: number | null;
    isActive: boolean;
    createdAt: Date;
    modifiedAt: Date;
}