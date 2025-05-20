import type { IMoneySum } from "./money-sum";
import type { IDiscount } from "./discount";

export interface ICustomer {
    customerId: number;
    name: string;
    surname: string;
    email: string | null;
    balance: IMoneySum[];
    discount?: IDiscount | null;
    createdAt: Date;
    modifiedAt: Date;
    unpaidAmount: IMoneySum[] | null;
    unpaidOrders: number[] | null;
}