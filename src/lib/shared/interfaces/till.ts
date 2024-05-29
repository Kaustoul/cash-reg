export type DecimalStr = string;

export interface IMoneySum {
    value: DecimalStr;
    currency: string;
}

export type TillStatus = 'open' | 'closed' | 'paused' | 'active';
export interface ITill {
    id: number;
    balance: IMoneySum[];
    note: string | null;
    status: TillStatus;
    createdAt: Date;
    modifiedAt: Date;
}
