import Decimal from 'decimal.js';
import type { IPrice } from './price';
import type { DecimalStr, IMoneySum } from './money-sum';
import type { IUnit } from './product';
import type { IDiscount } from './discount';
import type { IBalance } from './balance';

export type ShoppingCartState = "items" | "checkout" | "cash-payment" | "card-payment" | "qr-payment" | "account-payment";

export interface IShoppingCart {
    items: IShoppingCartItem[];
    total: IMoneySum;
    subtotal: IMoneySum;
    state: ShoppingCartState;
    checkout: IBalance;
    discounts?: IDiscount[];
    tillSessionId: number;
    note?: string;
    customerId?: number | null;
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
