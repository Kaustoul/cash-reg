import type Decimal from "decimal.js";
import type { Currency } from "../prices/currency";
import type { DecimalStr } from "./money-sum";

export interface IDiscount {
    value: DecimalStr;
    type: Currency['code'] | "PRC";
    source: "till" | "customer" | "item";
    subtotal?: Decimal;
    code?: string;
    note?: string;
}