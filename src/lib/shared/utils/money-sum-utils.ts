import type { IMoneySum } from "../interfaces/money-sum";
import { CurrencyManager } from "$lib/shared/prices/currency-manager";
import Decimal from "decimal.js";

export const formatSum = (moneySum: IMoneySum): string => {
    return `${moneySum.value} ${CurrencyManager.getCurrency(moneySum.currency).getSymbol()}`;
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
