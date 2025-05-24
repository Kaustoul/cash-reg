import type { IMoneySum } from './money-sum';

export interface ITillCheck {
    id: number;
    tillSessionId: number;
    actualBalance: IMoneySum[];
    expectedBalance: IMoneySum[];
    difference: IMoneySum[];
    approvedBy?: number | null;
    createdAt: Date;
    note?: string | null;
}

export type INewTillCheck = Omit<ITillCheck, 'id' | 'createdAt'>;