export type TillSessionType = 'OPEN' | 'CLOSED' | 'PAUSED' | 'UNPAUSED' | 'INACTIVE';

export interface ITillSession {
    id: number;
    cashierId: number;
    tillId: number;
    type: TillSessionType;
    createdAt: Date;
    note?: string | null;
}

export type INewTillSession = Omit<ITillSession, 'id' | 'createdAt'>