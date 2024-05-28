export type DecimalStr = string;

export interface IMoneySum {
    value: DecimalStr;
    currency: string;
}

export interface ITill {
    id: number;
    balance: IMoneySum[];
    note: string | null;
    createdAt: Date;
    modifiedAt: Date;
}
