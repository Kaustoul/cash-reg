import type { DecimalStr, IMoneySum } from './money-sum';
import type { IPrice } from './price';

export interface IOrder {
    orderId: number;
    tillId: number;
    items: IOrderItem & { name: string }[];
    total: IMoneySum;
    paymentType: "qr" | "cash" | "card";
    note: string | null;
    createdAt: Date;
}

export interface INewOrder {
    tillId: IOrder["tillId"];
    items: IOrder["items"];
    total: IOrder["total"];
    paymentType: IOrder["paymentType"];
    note: IOrder["note"];
}

export interface IOrderItem {
    fullId: number;
    quantity: DecimalStr;
    price: IPrice;
}
