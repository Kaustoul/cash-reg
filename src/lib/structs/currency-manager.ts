import Decimal from "decimal.js";
import { Currency } from "./prices/currency";
import { CashRegisterError } from "$lib/errors/cash-register-error";

export class CurrencyManager {
    private static instance: CurrencyManager;

    private defaultCurrency: string = "CZK";
    private currencies: Map<string, Currency> = new Map();

    private constructor() {
        this.currencies.set("CZK", new Currency("CZK", new Decimal(1)));
        this.currencies.set("EUR", new Currency("EUR", new Decimal(0.01)));
        this.currencies.set("USD", new Currency("USD", new Decimal(0.01)));
    }

    public static getInstance(): CurrencyManager {
        if (!CurrencyManager.instance) {
            CurrencyManager.instance = new CurrencyManager();
        }
        return CurrencyManager.instance;
    }

    public static getDefaultCurrency(): Currency {
        return this.getCurrency(CurrencyManager.getInstance().defaultCurrency);
    }

    public static getCurrency(code: string): Currency {
        const currency = CurrencyManager.getInstance().currencies.get(code);
        if (currency === undefined) {
            throw new CashRegisterError("Invalid currency code: " + code);
        }

        return currency;
    }
}