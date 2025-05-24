import type { IMoneySum } from "../interfaces/money-sum";
import { CurrencyManager } from "$lib/shared/prices/currency-manager";
import Decimal from "decimal.js";
import type { IPrice } from "../interfaces/price";
import { formatDecimal } from "../utils";

export const formatSum = (moneySum: IMoneySum, alwaysDecimal: boolean = false, includeCurrency: boolean = true): string => {
    if (!includeCurrency) {
        return formatDecimal(new Decimal(moneySum.value), alwaysDecimal);
    }
    
    return `${formatDecimal(new Decimal(moneySum.value,), alwaysDecimal)} ${CurrencyManager.getCurrency(moneySum.currency).getSymbol()}`;
}

export const formatSumsArray = (moneySums: IMoneySum[]): string => {
    if (moneySums.length === 0) {
        return 'N/A';
    }

    if (moneySums.length === 1) {
        return formatSum(moneySums[0]);
    }

    const defaultCurrency = CurrencyManager.getDefaultCurrency();
    // only consider prices in the default currency
    const prices = moneySums.filter(sum => 
        sum.currency === defaultCurrency.getCode()
    ).map(moneySum => new Decimal(moneySum.value));

    const maxPrice = Decimal.max(...prices);
    const minPrice = Decimal.min(...prices);

    const currency = defaultCurrency.getSymbol();

    return `${maxPrice} - ${minPrice} ${currency}`;
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

export function sumMoneySums(sums: IMoneySum[][]): IMoneySum[] {
    const totals: Record<string, Decimal> = {};

    for (const sum of sums) {
        for (const currency of sum) {
            if (!totals[currency.currency]) {
                totals[currency.currency] = new Decimal(0);
            }
            totals[currency.currency] = totals[currency.currency].add(currency.value);
        }
    }

    return Object.entries(totals).map(([currency, value]) => ({
        currency,
        value: value.toString()
    }));
}

export function combineSums(sums: IMoneySum[]): IMoneySum[] {
    const result: Record<string, number> = {};
    for (const sum of sums) {
        result[sum.currency] = (result[sum.currency] || 0) + Number(sum.value);
    }
    return Object.entries(result).map(([currency, value]) => ({
        currency,
        value: "-" + value.toString()
    }));
}
