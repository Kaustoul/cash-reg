import type { IMoneySum } from "./money-sum";

export type CustomerPaymentDestination = 'balance' | 'order-payment';

export interface ICustomerPayment {
    customerPaymentId: number;
    customerId: number;
    transactionId: number;
    orderId?: number | null;
    amount: IMoneySum;
    destination: CustomerPaymentDestination;
    createdAt: Date;
}