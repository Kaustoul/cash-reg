export type TillSessionType = 'OPEN' | 'CLOSED' | 'PAUSED' | 'UNPAUSED' | 'INACTIVE';

export interface ITillSession {
    tillSessionId: number;
    cashierId: number;
    tillId: number;
    type: TillSessionType;
    createdAt: Date;
    note?: string | null;
}

export type INewTillSession = Omit<ITillSession, 'tillSessionId' | 'createdAt'>