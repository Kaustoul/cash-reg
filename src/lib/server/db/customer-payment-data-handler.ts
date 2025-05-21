import type { ICustomerPayment } from "$lib/shared/interfaces/customer-payment";
import type { Databases, Transactions } from "./db";
import type { IMoneySum } from "$lib/shared/interfaces/money-sum";
import type { TransactionType } from "$lib/shared/interfaces/transaction";

export interface CustomerPaymentDataHandler {
    fetchPaymentsForCustomer(
        db: Databases | Transactions,
        customerId: number
    ): Promise<ICustomerPayment[]>;

    newCustomerPayment(
        db: Databases | Transactions,
        payment: Omit<ICustomerPayment, "customerPaymentId" | "createdAt">
    ): Promise<number>;

    processCustomerDeposit(
        db: Databases | Transactions,
        customerId: number,
        amount: IMoneySum,
        paymentType: TransactionType
    ): Promise<void>;
}