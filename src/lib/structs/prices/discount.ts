import Decimal from "decimal.js";
import { Conditional, type Condition } from "./condition";

export enum DiscountType {
    /**
     * A percentage discount
     */
    PERCENTAGE,
  
    /**
     * A fixed amount discount
     */
    FIXED,
}

export class Discount extends Conditional {
    /**
     * The type of discount (e.g. "percentage" or "fixed")
     */
    private type: DiscountType;
  
    /**
     * The value of the discount
     */
    private value: Decimal;
  
    /**
     * Constructs a new Discount instance with the given type, value, and conditions
     * @param type The type of discount
     * @param value The value of the discount
     * @param conditions Any conditions associated with this discount
     */
    public constructor(type: DiscountType, value: Decimal, conditions: Array<Condition>) {
        super();
        this.type = type;
        this.value = value;
        this.conditions = conditions;
    }

    public apply(value: Decimal) {
        switch (this.type) {
            case DiscountType.FIXED:
                return Decimal.max(0, value.sub(this.value));
            
            case DiscountType.PERCENTAGE:
                return value.mul(new Decimal(1).sub(this.value));
            }
        }
        
    public getDiscountAmount(value: Decimal) {
        switch (this.type) {
            case DiscountType.FIXED:
                return this.value;
                
            case DiscountType.PERCENTAGE:
                return value.mul(this.value);
        }
    }

    
    public getType(): DiscountType {
        return this.type;
    }
    
}
