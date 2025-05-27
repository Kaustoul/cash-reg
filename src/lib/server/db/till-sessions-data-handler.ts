import type { ITillSession, INewTillSession } from "$lib/shared/interfaces/till-session";
import type { Databases, Transactions } from "./db";

export interface TillSessionsDataHandler {
    fetchSession(db: Databases | Transactions, id: number): Promise<ITillSession | null>;
    fetchSessionsForTill(db: Databases | Transactions, tillId: number): Promise<ITillSession[]>;
    newSession(db: Databases | Transactions, session: INewTillSession): Promise<number>;
    fetchLastOpenSessionForUser(db: Databases | Transactions, userId: number): Promise<ITillSession | null>;
    fetchLastSessionTill(db: Databases | Transactions, tillId: number): Promise<ITillSession | null>;
    fetchSessionsForUser(db: Databases | Transactions, userId: number): Promise<ITillSession[]>;
}