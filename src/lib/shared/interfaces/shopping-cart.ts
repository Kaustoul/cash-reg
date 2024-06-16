import Decimal from 'decimal.js';
import type { IPrice } from './price';
import type { IMoneySum } from './money-sum';
import type { IUnit } from './product';

export interface IShoppingCart {
    items: IShoppingCartItem[];
    total: {[currency: string]: IMoneySum}; 
}

export interface IShoppingCartItem {
    productId: number;
    itemId: number;
    name: string;
    ean?: string;
    quantity: Decimal;
    total: Decimal;
    prices: IPrice[];
    priceIdx: number;
    unit: IUnit;
}
