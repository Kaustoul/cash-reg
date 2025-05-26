import type { IDiscount } from './discount';
import type { DecimalStr, IMoneySum } from './money-sum';
import type { IPrice } from './price';
import type { PaymentType } from './transaction';

export interface IOrder {
    orderId: number;
    tillSessionId: number;
    items: IOrderItem[];
    subtotal: IMoneySum;
    total: IMoneySum;
    discounts: IDiscount[] | null;
    paymentType: PaymentType;
    note: string | null;
    createdAt: Date;
    customerId?: number | null;
    transactionId?: number | null;
}

export type INewOrder = Omit<IOrder, 'orderId' | 'createdAt' | 'transactionId'>;

export interface IOrderItem {
    fullId: number;
    name: string;
    price: IPrice;
    quantity: DecimalStr;
    discounts?: IDiscount[];
    subtotal: DecimalStr;
    total: DecimalStr;
}
