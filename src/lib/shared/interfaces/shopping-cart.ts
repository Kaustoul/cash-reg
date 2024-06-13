import Decimal from 'decimal.js';
import type { IPrice } from './price';
import type { IMoneySum } from './money-sum';

export interface IShoppingCart {
    items: IShoppingCartItem[];
    total: {[currency: string]: IMoneySum}; 
}

export interface IShoppingCartItem {
    productId: number;
    itemId: number;
    name: string;
    ean?: string;
    quantity?: Decimal;
    prices: IPrice[];
    priceIdx: number;
}
