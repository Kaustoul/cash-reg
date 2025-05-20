import type { IDiscount } from './discount';
import type { DecimalStr, IMoneySum } from './money-sum';
import type { IPrice } from './price';

export interface IOrder {
    orderId: number;
    tillId: number;
    items: IOrderItem & { name: string }[];
    total: IMoneySum;
    discounts: IDiscount[] | null;
    paymentType: "qr" | "cash" | "card" | "account";
    note: string | null;
    createdAt: Date;
    customerId?: number | null;
}

export interface INewOrder {
    tillId: IOrder["tillId"];
    items: IOrder["items"];
    total: IOrder["total"];
    discounts: IDiscount[] | null;
    paymentType: IOrder["paymentType"];
    note: IOrder["note"];
    customerId?: number | null;
}

export interface IOrderItem {
    fullId: number;
    quantity: DecimalStr;
    price: IPrice;
    discounts?: IDiscount[];
}
