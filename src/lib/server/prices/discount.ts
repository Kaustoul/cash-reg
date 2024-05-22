import Decimal from "decimal.js";
import { ConditionalMixin } from "./conditional";
import type { ShoppingCart } from "../till/shopping-cart";
import { MoneySum } from "./money-sum";
import type { Condition } from "./condition";

export interface Discount {  
    apply(value: Decimal): Decimal;
    getDiscountAmount(value: Decimal): Decimal;
}
