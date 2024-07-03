import type { IMoneySum } from "../interfaces/money-sum";
import { CurrencyManager } from "$lib/shared/prices/currency-manager";
import Decimal from "decimal.js";
import type { IPrice } from "../interfaces/price";
import { formatDecimal } from "../utils";

export const formatSum = (moneySum: IMoneySum): string => {
    return `${formatDecimal(new Decimal(moneySum.value))} ${CurrencyManager.getCurrency(moneySum.currency).getSymbol()}`;
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
