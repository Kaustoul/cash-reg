import Decimal from "decimal.js";
import type { Currency } from "./currency";
import { DiscountType, type Discount } from "./discount";

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
    public constructor(currency: Currency, value: Decimal, withVat: boolean) {
        this.currency = currency;
        this.value = value;
        this.withVat = withVat;
    }
  
    /**
     * Gets the value of the money sum, optionally applying a discount
     * @param discount The discount to apply, if any
     * @returns The value of the money sum after applying the discount
     */
    public getValue(itemId: number, cart: ShoppingCart, discounts?: Discount | Array<Discount>, vat: Decimal = new Decimal(1)): Decimal {
        let result = this.value;

        if (discounts) {
            if (!Array.isArray(discounts)) {
                discounts = [discounts];
            }
            
            discounts = discounts.sort((a, b) => a.getType() === DiscountType.FIXED? -1 : b.getType() === DiscountType.FIXED? 1 : 0);

            for (const discount of discounts) {
                if (result.eq(0))
                    break;

                if (discount.areConditionsMet(itemId,cart)) {
                    // Apply the discount to the value
                    result = result.sub(discount.getDiscountAmount(this.value));
                }
            }
        }
    
        return result.mul(vat);
    }

    /**
     * Returns whether the money sum includes VAT
     * @returns True if the money sum includes VAT, false otherwise
     */
    public isWithVat(): boolean {
        return this.withVat;
    }
}