import Decimal from "decimal.js";

export class Currency {
    /**
     * The currency code (e.g. "USD" or "EUR")
     */
    private readonly code: string;
  
    /**
     * The VAT rate for this currency
     */
    private readonly vat: Decimal;
  
    /**
     * The number of decimal places to round to
     */
    private readonly roundTo: Decimal;
  
    /**
     * Constructs a new Currency instance with the given currency code, VAT rate, and number of decimal places to round to
     * @param code The currency code
     * @param vat The VAT rate for this currency
     * @param roundTo The number of decimal places to round to
     */
    public constructor(code: string, vat: Decimal, roundTo: Decimal = new Decimal(0.01)) {
        this.code = code;
        this.vat = vat;
        this.roundTo = roundTo;
    }
  
    /**
     * Gets the VAT rate for this currency
     * @returns The VAT rate for this currency
     */
    public getVat(): Decimal {
        return this.vat;
    }
  
    /**
     * Applies the VAT rate to the given amount
     * @param amount The amount to apply the VAT rate to
     * @returns The amount with the VAT rate applied
     */
    public applyVat(amount: Decimal): Decimal {
        return amount.mul(this.vat);
    }

    public getCode(): string {
        return this.code;
    }
}