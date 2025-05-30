import type Decimal from "decimal.js";

export type DecimalStr = string;

export interface IMoneySum {
    [currency: string]: DecimalStr;
}

export interface IFrontEndMoneySum {
    [currency: string]: Decimal;
}
