import type { IMoneySum } from "./money-sum";
import type { PaymentType } from "./transaction";

export type CustomerPaymentDestination = 'balance' | 'order-payment';

export interface ICustomerPayment {
    customerPaymentId: number;
    customerId: number;
    transactionId: number;
    orderId?: number | null;
    amount: IMoneySum;
    // type: PaymentType;
    destination: CustomerPaymentDestination;
    createdAt: Date;
}