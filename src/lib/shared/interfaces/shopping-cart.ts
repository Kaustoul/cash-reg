import Decimal from 'decimal.js';
import type { IPrice } from './price';
import type { DecimalStr, IMoneySum } from './money-sum';
import type { IUnit } from './product';
import type { IDiscount } from './discount';

export type ShoppingCartState = "items" | "checkout" | "cash-payment" | "card-payment" | "qr-payment";

export interface IShoppingCart {
    items: IShoppingCartItem[];
    total: {[currency: string]: IMoneySum};
    state: ShoppingCartState;
    checkout: {
        payedAmount: Decimal;
    };
    discounts?: IDiscount[];
    subtotal: Decimal;
    tillId: number;
    note?: string
}

export interface IShoppingCartItem {
    productId: number;
    itemId: number;
    name: string;
    ean?: string;
    quantity: Decimal;
    total: Decimal;
    prices: IPrice[];
    discounts?: IDiscount[];
    subtotal: Decimal;
    priceIdx: number;
    unit: IUnit;
}
