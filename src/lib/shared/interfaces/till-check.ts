import type { IBalance } from './balance';
import type { IMoneySum } from './money-sum';

export type TillCheckType = 'manual' | 'opening' | 'closing';

export interface ITillCheck {
    tillCheckId: number;
    tillSessionId: number;
    actualBalance: IBalance;
    expectedBalance: IBalance;
    difference: IBalance;
    type: TillCheckType;
    approvedBy?: number | null;
    createdAt: Date;
    note?: string | null;
}

export type INewTillCheck = Omit<ITillCheck, 'id' | 'createdAt'>;