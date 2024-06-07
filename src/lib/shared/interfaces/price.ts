import type { ICondition } from "./condition";
import type { IMoneySum } from "./money-sum";

export interface IPrice { 
    value: IMoneySum;
    conditions: ICondition[];
} 
