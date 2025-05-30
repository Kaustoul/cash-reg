import type Decimal from "decimal.js";
import type { DecimalStr } from "./money-sum";

export type Denomination = DecimalStr;

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
    Keys extends keyof T
        ? Omit<T, Keys> & Required<Pick<T, Keys>>
        : never;

export type CashPayment = {
    incoming?:   Record<Denomination, number>;
    outgoing?: Record<Denomination, number>;
}

export type Payment = {
    incoming?: DecimalStr;
    outgoing?: DecimalStr;
}

export type FrontEndCashPayment = CashPayment & {
    total: Decimal;
}

export type FrontEndPayment = Payment & {
    total: Decimal;
}


// export interface PaymentTypes {
//     cash?: RequireAtLeastOne<CashPayment>;
//     card?: RequireAtLeastOne<CardPayment>;
//     qr?: RequireAtLeastOne<CardPayment>;
// }

export interface PaymentTypes {
    cash?: CashPayment;
    card?: Payment;
    qr?: Payment;
    account?: Payment
}

export interface FrontEndPaymentTypes {
    cash?: FrontEndCashPayment;
    card?: FrontEndPayment;
    qr?: FrontEndPayment;
    account?: FrontEndPayment
    total: Decimal;
}

// export interface IBalance {
//     [currency: string]: RequireAtLeastOne<PaymentTypes>;
// }

export interface IBalance {
    [currency: string]: PaymentTypes;
}

export interface IFrontEndBalance {
    [currency: string]: FrontEndPaymentTypes;
}

export type IFrontEndBalanceJson = string;