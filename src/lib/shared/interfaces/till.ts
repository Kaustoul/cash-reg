import { type IMoneySum } from './money-sum';
import type { TillSessionType } from './till-session';

export type TillStatus = 'open' | 'closed' | 'paused' | 'active';
export interface ITill {
    id: number;
    balance: IMoneySum[];
    note: string | null;
    createdAt: Date;
    modifiedAt: Date;
}

export interface IFrontEndTill extends ITill {
    cashierId: number | null;
    state: TillSessionType;
}