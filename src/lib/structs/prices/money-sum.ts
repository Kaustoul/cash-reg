import Decimal from "decimal.js";
import type { Currency } from "./currency";
import type { ShoppingCart } from "../till/shopping-cart";
import { ensureArray } from "$lib/utils";
import { FlatDiscount } from "./flat-discount";
import { PercentDiscount } from "./percent-discount";
import type { Discount } from "./discount";
import { CurrencyManager } from "../currency-manager";

export class MoneySum {
    /**
     * The currency of the money sum
     */
    private readonly currency: Currency;
  
    /**
     * The value of the money sum
     */
    private value: Decimal;
  
    /**
     * Whether the money sum includes VAT
     */
    private withVat: boolean;
  
    /**
     * Constructs a new MoneySum instance with the given currency, value, and VAT status
     * @param currency The currency of the money sum
     * @param value The value of the money sum
     * @param withVat Whether the money sum includes VAT
     */
    public constructor(value: Decimal, currency: Currency = CurrencyManager.getDefaultCurrency(), withVat: boolean = false) {
        this.currency = currency;
        this.value = value;
        this.withVat = withVat;
    }
  
    /**
     * Gets the value of the money sum, optionally applying discounts
     * Does not check discount conditions and they should be checked prior to calling this.
     * @param discount The discount to apply, if any
     * @returns The value of the money sum after applying the discount
     */
    public getValue(discounts?: Discount[], vat: Decimal = new Decimal(1)): Decimal {
        if (!discounts || discounts.length === 0) {
            return this.value;
        }
        
        let result = this.value;

        for (const discount of discounts) {
            if (result.lte(0)) {
                return new Decimal(0);
            }
            
            result = result.sub(discount.getDiscountAmount(this.value));
        }
    
        return result;
    }

    /**
     * Returns whether the money sum includes VAT
     * @returns True if the money sum includes VAT, false otherwise
     */
    public isWithVat(): boolean {
        return this.withVat;
    }

    public getCurrency(): Currency {
        return this.currency;
    }

    public toJSON() {
        return {
            currency: this.currency.getCode(),
            value: this.value.toString(),
        }
    }

    public static ZERO(currency: Currency = CurrencyManager.getDefaultCurrency()): MoneySum {
        return new MoneySum(new Decimal(0), currency);
    }
}