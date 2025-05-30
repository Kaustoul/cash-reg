import Decimal from "decimal.js";
import type { Payment, CashPayment, FrontEndPayment, FrontEndCashPayment, IBalance, IFrontEndBalance, Denomination } from "../interfaces/balance";
import type { IMoneySum } from "../interfaces/money-sum";
import type { PaymentType } from "../interfaces/transaction";



export function sumCashPayments(payments: CashPayment | FrontEndCashPayment): Decimal {
    let total = new Decimal(0);

    // Sum incoming cash
    if (payments?.incoming) {
        for (const [denom, count] of Object.entries(payments.incoming)) {
            total = total.add(new Decimal(denom).mul(Number(count)));
        }
    }

    // Sum outgoing cash
    if (payments?.outgoing) {
        for (const [denom, count] of Object.entries(payments.outgoing)) {
            total = total.sub(new Decimal(denom).mul(Number(count)));
        }
    }

    return total;
}

export function sumCardPayments(payments: Payment | FrontEndPayment): Decimal {
    let total = new Decimal(0);

    // Sum incoming card payments
    if (payments?.incoming) {
        total = total.add(new Decimal(payments.incoming));
    }

    // Sum outgoing card payments
    if (payments?.outgoing) {
        total = total.sub(new Decimal(payments.outgoing));
    }

    return total;

}
/**
 * Sums up all payment types in an IBalance and returns an IFrontEndBalance with a total for each currency.
 */
export function calculateBalanceTotal(balance: IBalance | IFrontEndBalance): IFrontEndBalance {
    const result: IFrontEndBalance = {};
    result["CZK"] = { total: new Decimal(0) };

    for (const [currency, payments] of Object.entries(balance)) {
        let cashTotal = new Decimal(0);
        let cardTotal = new Decimal(0);
        let qrTotal = new Decimal(0);
        
        let total = new Decimal(0);

        if (payments.cash) {
            cashTotal = sumCashPayments(payments.cash);
            total = total.add(cashTotal);

            result[currency].cash = {
                ...payments.cash,
                total: cashTotal
            };
        }

        if (payments.card) {
            cardTotal = sumCardPayments(payments.card);
            total = total.add(cardTotal);

            result[currency].card = {
                ...payments.card,
                total: cardTotal
            };
        }

        if (payments.qr) {
            qrTotal = sumCardPayments(payments.qr);
            total = total.add(qrTotal);

            result[currency].qr = {
                ...payments.qr,
                total: qrTotal
            };
        }

        result[currency].total = total;
    }

    return result;
}

/**
 * Adds multiple IBalance objects together and returns a new IBalance.
 */
export function sumBalances(...balances: IBalance[]): IBalance {
    const result: IBalance = {};

    for (const balance of balances) {
        for (const [currency, payments] of Object.entries(balance)) {
            if (!result[currency]) result[currency] = {};

            // Cash
            if (payments.cash) {
                if (!result[currency].cash) result[currency].cash = { };

                // Incoming
                for (const [denom, count] of Object.entries(payments.cash.incoming ?? {})) {
                    if (!result[currency].cash.incoming) {
                        result[currency].cash.incoming = {};
                    }
                    
                    result[currency].cash.incoming[denom] =
                        (result[currency].cash.incoming[denom] ?? 0) + Number(count);
                }

                // Outgoing
                for (const [denom, count] of Object.entries(payments.cash.outgoing ?? {})) {
                    if (!result[currency].cash.outgoing) {
                        result[currency].cash.outgoing = {};
                    }
                    
                    result[currency].cash.outgoing[denom] =
                        (result[currency].cash.outgoing[denom] ?? 0) + Number(count);
                }
            }

            // Card
            if (payments.card) {
                if (!result[currency].card) {
                    result[currency].card = {  };
                } 

                if (!result[currency].card.incoming) {
                    result[currency].card.incoming = 
                        new Decimal(result[currency].card.incoming ?? 0)
                        .add(new Decimal(payments.card.incoming ?? 0))
                        .toString()
                    ;
                }

                if (!result[currency].card.outgoing) {
                    result[currency].card.outgoing = 
                        new Decimal(result[currency].card.outgoing ?? 0)
                        .add(new Decimal(payments.card.outgoing ?? 0))
                        .toString()
                    ;
                }
            }

            // QR
            if (payments.qr) {
                if (!result[currency].qr) {
                    result[currency].qr = {  };
                } 

                if (!result[currency].qr.incoming) {
                    result[currency].qr.incoming = 
                        new Decimal(result[currency].qr.incoming ?? 0)
                        .add(new Decimal(payments.qr.incoming ?? 0))
                        .toString()
                    ;
                }

                if (!result[currency].qr.outgoing) {
                    result[currency].qr.outgoing = 
                        new Decimal(result[currency].qr.outgoing ?? 0)
                        .add(new Decimal(payments.qr.outgoing ?? 0))
                        .toString()
                    ;
                }
            }
        }
    }

    return result;
}

export function balanceToMoneySum(balance: IBalance | IFrontEndBalance): IMoneySum {
    const result: Record<string, string> = {};

    for (const [currency, payments] of Object.entries(balance)) {
        let total = new Decimal(0);

        if (payments.cash) {
            total = total.add(sumCashPayments(payments.cash));
        }

        if (payments.card) {
            total = total.add(sumCardPayments(payments.card));
        }

        if (payments.qr) {
            total = total.add(sumCardPayments(payments.qr));
        }

        result[currency] = total.toString();
    }

    return result;
}

export function getBalancePaymentTypes(balance: IBalance | IFrontEndBalance): {
    isQr: boolean;
    isCard: boolean;
    isCash: boolean;
    isAccount: boolean;
    type: PaymentType;
} {
    let isQr = false;
    let isCard = false; 
    let isCash = false;
    let isAccount = false;

    let type: PaymentType = "unknown";

    let typeInt = 0
    for (const payments of Object.values(balance)) {
        if (payments.qr) {
            isQr = true;
            type = "qr";
            typeInt++;
        }
        if (payments.card) {
            isCard = true;
            type = "card";
            typeInt++;
        }
        if (payments.cash) {
            isCash = true;
            type = "cash";
            typeInt++;
        }
        if (payments.account) {
            isAccount = true;
            type = "account";
            typeInt++;
        }
    }

    if (typeInt > 1) {
        type = "mixed";
    } else if (typeInt === 0) {
        type = "unknown";
    }

    return {
        isQr,
        isCard,
        isCash,
        isAccount,
        type
    };
}

export function parseToDenominations(
    amount: number | string | Decimal,
    denominations: (number | string | Decimal)[]
): Record<Denomination, number> {
    let remaining = new Decimal(amount);
    // Sort denominations descending
    const sorted = denominations
        .map(d => new Decimal(d))
        .sort((a, b) => b.comparedTo(a));

    const result: Record<string, number> = {};

    for (const denom of sorted) {
        const denomStr = denom.toString();
        if (denom.lte(0)) continue;
        const count = Decimal.floor(remaining.div(denom)).toNumber();
        if (count > 0) {
            result[denomStr] = count;
            remaining = remaining.minus(denom.mul(count));
        }
    }
    return result;
}

export function toDefualtBalance(value: Decimal | string, type: "incoming" | "outgoing", method: Omit<PaymentType, "mixed" | "unknown">): IFrontEndBalance {
    const amount = new Decimal(value);
    const result: IFrontEndBalance = {"CZK": { total: amount}};

    function parsePayment(value: Decimal, type: "incoming" | "outgoing"): FrontEndPayment {
        if (type === "incoming") {
            return { incoming: value.toString(), total: value };
        } else {
            return { outgoing: value.toString(), total: value.negated() };
        }
    }

    function parseCashPayment(value: Decimal, type: "incoming" | "outgoing"): FrontEndCashPayment {
        const cashPayment = parseToDenominations(amount, defaultDenominations);

        if (type === "incoming") {
            return { incoming: cashPayment, total: amount };
        } else {
            return { outgoing: cashPayment, total: amount.negated() };
        }
    }

    if (method === "cash") {
        result["CZK"].cash = parseCashPayment(amount, type);
    }

    if (method === "card" ) {
        result["CZK"].card = parsePayment(amount, type);
    }

    if (method === "qr") {
        result["CZK"].qr = parsePayment(amount, type);
    }

    if (method === "account") {
        result["CZK"].account = parsePayment(amount, type);
    }

    return result;
}

export function toJson(balance: IBalance | IFrontEndBalance): string {
    return JSON.stringify(balance, (key, value) => {
        if (value instanceof Decimal) {
            return value.toString();
        }
        return value;
    });
}

export function fromJson(json: string): IFrontEndBalance {
    return JSON.parse(json, (key, value) => {
        if (typeof value === "string" && !isNaN(Number(value))) {
            return new Decimal(value);
        }
        return value;
    });
}

export function isNegativeBalance(balance: IFrontEndBalance): boolean {
    if (!balance || !balance["CZK"]) {
        return false;
    }

    if (!balance["CZK"].total) {
        balance = calculateBalanceTotal(balance);
    }

    console.log("negative" , balance["CZK"].total)
    return new Decimal(balance["CZK"].total).isNegative();
}

export function toBalance (balance: IFrontEndBalance): IBalance {
    const result: IBalance = {};

    for (const [currency, payments] of Object.entries(balance)) {
        result[currency] = {};

        if (payments.cash) {
            result[currency].cash = {
                incoming: payments.cash.incoming ?? undefined,
                outgoing: payments.cash.outgoing ?? undefined
            };
        }

        if (payments.card) {
            result[currency].card = {
                incoming: payments.card.incoming ?? undefined,
                outgoing: payments.card.outgoing ?? undefined
            };
        }

        if (payments.qr) {
            result[currency].qr = {
                incoming: payments.qr.incoming ?? undefined,
                outgoing: payments.qr.outgoing ?? undefined
            };
        }

        if (payments.account) {
            result[currency].account = {
                incoming: payments.account.incoming ?? undefined,
                outgoing: payments.account.outgoing ?? undefined
            };
        }
    }

    return result;
}

export const defaultDenominations: Denomination[] = [
    "2000", "1000", "500", "200", "100", "50", "20", "10", "5", "2", "1"
];