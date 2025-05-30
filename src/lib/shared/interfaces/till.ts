import type Decimal from 'decimal.js';
import { type DecimalStr, type IMoneySum } from './money-sum';
import type { TillSessionType } from './till-session';
import type { IBalance, IFrontEndBalance, IFrontEndBalanceJson } from './balance';

// export type TillStatus = 'open' | 'closed' | 'paused' | 'active';
export interface ITill {
    id: number;
    balance: IBalance;
    name: string | null;
    createdAt: Date;
    modifiedAt: Date;
}

export interface IFrontEndTill extends Omit<ITill, "createdAt" | "modifiedAt"> {
    cashierId: number | null;
    balance: IFrontEndBalance;
    state: TillSessionType;
    isUserLogggedIn: boolean;
}

export interface IFrontEndTillData extends Omit<ITill, "createdAt" | "modifiedAt" | "balance"> {
    cashierId: number | null;
    balance: IFrontEndBalanceJson;
    state: TillSessionType;
    isUserLogggedIn: boolean;
}
