import type { IMoneySum } from './money-sum';

export type TillCheckType = 'manual' | 'opening' | 'closing';

export interface ITillCheck {
    id: number;
    tillSessionId: number;
    actualBalance: IMoneySum[];
    expectedBalance: IMoneySum[];
    difference: IMoneySum[];
    type: TillCheckType;
    approvedBy?: number | null;
    createdAt: Date;
    note?: string | null;
}

export type INewTillCheck = Omit<ITillCheck, 'id' | 'createdAt'>;