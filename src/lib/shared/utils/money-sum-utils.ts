import type { IFrontEndMoneySum, IMoneySum } from "../interfaces/money-sum";
import { CurrencyManager } from "$lib/shared/prices/currency-manager";
import Decimal from "decimal.js";
import type { IPrice } from "../interfaces/product-price";
import { formatDecimal } from "../utils";
import { MoneySum } from "../prices/money-sum";


export interface FormatSumOptions {
    alwaysDecimal?: boolean;
    includeCurrency?: boolean;
    currency?: string;
}

export const formatSum = (moneySum: IMoneySum | IFrontEndMoneySum | null, options?: FormatSumOptions): string => {
    console.log("formatSum", moneySum, options);
    
    if (!moneySum || Object.keys(moneySum).length === 0) {
        return "0";
    }

    let defaultOtions = {alwaysDecimal: false, includeCurrency: true, currency: "CZK"}
    if (options) {
        defaultOtions = {...defaultOtions, ...options};
    }

    const currency = defaultOtions.currency || "CZK";
    const value = moneySum["CZK"] instanceof String ? new Decimal(moneySum["CZK"]) : moneySum["CZK"];

    if (!defaultOtions.includeCurrency) {
        return formatDecimal(value, defaultOtions.alwaysDecimal);
    }
    
    return `${formatDecimal(value, defaultOtions.alwaysDecimal)} ${CurrencyManager.getCurrency(currency).getSymbol()}`;
}

export const formatPricesArray = (prices: IPrice[]): string => {
    let maxPrice = new Decimal(prices[0].value.value);
    let minPrice = new Decimal(prices[0].value.value);

    for (const price of prices) {
        const decimal = new Decimal(price.value.value);
        if (decimal.gt(maxPrice)) {
            maxPrice = decimal;
        }

        if (decimal.lt(minPrice)) {
            minPrice = decimal;
        }
    }

    if (minPrice.eq(maxPrice)) {
        return formatDecimal(maxPrice) + " " +prices[0].value.currency;
    }

    return formatDecimal(minPrice) + " - " + formatDecimal(maxPrice) + " " + prices[0].value.currency;
}

// export function sumFrontEndMoneySums(...sums: (IFrontEndMoneySum | null)[]): IFrontEndMoneySum {
//     const totals: IFrontEndMoneySum = {};

//     if (sums.length === 0)
//         return totals;

//     for (const sum of sums) {
//         if (!sum) continue;

//         for (const [currency, value] of Object.entries(sum)) {
//             if (!totals[currency]) {
//                 totals[currency] = new Decimal(0);
//             }

//             totals[currency] = totals[currency].add(value);
//         }
//     }

//     return totals;
// }

export function sumMoneySums(...sums: (IMoneySum | IFrontEndMoneySum | null)[]): IFrontEndMoneySum | null {
    const totals: IFrontEndMoneySum = {};

    for (const sum of sums) {
        if (!sum) continue;

        for (let [currency, value] of Object.entries(sum)) {
            if (typeof value === "string") {
                value = new Decimal(value);
            }

            if (!totals[currency]) {
                totals[currency] = new Decimal(0);
            }

            totals[currency] = totals[currency].add(value);
        }
    }

    return Object.keys(totals).length > 0 ? totals : null;
}

// export function combineSums(sums: IMoneySum[]): IMoneySum[] {
//     const result: Record<string, number> = {};
//     for (const sum of sums) {
//         result[sum.currency] = (result[sum.currency] || 0) + Number(sum.value);
//     }
//     return Object.entries(result).map(([currency, value]) => ({
//         currency,
//         value: "-" + value.toString()
//     }));
// }

export function asMoneySum(value: IFrontEndMoneySum | null): IMoneySum | null {
    if (!value || Object.keys(value).length === 0)
        return null;

    const result: IMoneySum = {};

    for (const [currency, decimal] of Object.entries(value)) {
        result[currency] = decimal.toString();
    }

    return result;
}

export function asFrontEndMoneySum(value: IMoneySum): IFrontEndMoneySum {
    if (!value || Object.keys(value).length === 0)
        return {};
    
    const result: IFrontEndMoneySum = {};

    for (const [currency, decimalStr] of Object.entries(value)) {
        result[currency] = new Decimal(decimalStr);
    }

    return result;
}

export function isZero(moneySum: IMoneySum | IFrontEndMoneySum | null): boolean {
    if (!moneySum || Object.keys(moneySum).length === 0) {
        return true;
    }

    for (const value of Object.values(moneySum)) {
        if (typeof value === "string") {
            if (!new Decimal(value).eq(0)) {
                return false;
            }
        } else if (!value.eq(0)) {
            return false;
        }
    }

    return true;
}

export function toNegative<T extends IMoneySum | IFrontEndMoneySum>(moneySum: T): T {
    const result: any = {};

    for (const [currency, value] of Object.entries(moneySum)) {
        if (typeof value === "string") {
            result[currency] = new Decimal(value).negated().toString();
        } else {
            result[currency] = value.negated();
        }
    }

    return result as T;
}

export function toPositive<T extends IMoneySum | IFrontEndMoneySum>(moneySum: T): T {
    const result: any = {};

    for (const [currency, value] of Object.entries(moneySum)) {
        if (typeof value === "string") {
            result[currency] = new Decimal(value).abs().toString();
        } else {
            result[currency] = value.abs();
        }
    }

    return result as T;
}
