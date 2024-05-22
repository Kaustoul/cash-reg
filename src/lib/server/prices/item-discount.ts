import type Decimal from "decimal.js";
import type { ShoppingCart } from "../till/shopping-cart";
import type { Condition } from "./condition";
import { ConditionalMixin } from "./conditional";
import type { Discount } from "./discount";
import { FlatDiscount } from "./flat-discount";
import type { MoneySum } from "./money-sum";
import { PercentDiscount } from "./percent-discount";

export interface ItemDiscount extends Discount {
    readonly conditional: ConditionalMixin;

    areConditionsMet(itemId: number, cart: ShoppingCart): boolean;
}

export class ItemFlatDiscount extends FlatDiscount implements ItemDiscount {
    // TS will not allow this to be private :]
    public readonly conditional: ConditionalMixin;
    
    public constructor(amount: MoneySum, conditions?: Condition[]) {
        super(amount);
        this.conditional = new ConditionalMixin(conditions);
    }

    public areConditionsMet(itemId: number, cart: ShoppingCart): boolean {
        return this.conditional.areConditionsMet(itemId, cart);
    }
    
}

export class ItemPercentDiscount extends PercentDiscount implements ItemDiscount {
    // TS will not allow this to be private :]
    public readonly conditional: ConditionalMixin;

    public constructor(amount: Decimal, conditions?: Condition[]) {
        super(amount);
        this.conditional = new ConditionalMixin(conditions);
    }

    public areConditionsMet(itemId: number, cart: ShoppingCart): boolean {
        return this.conditional.areConditionsMet(itemId, cart);
    }  
}