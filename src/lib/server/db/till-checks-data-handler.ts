import type { ITillCheck, INewTillCheck } from "$lib/shared/interfaces/till-check";
import type { Databases, Transactions } from "./db";

export interface TillChecksDataHandler {
    fetchCheck(db: Databases | Transactions, tillCheckId: number): Promise<ITillCheck | null>;
    fetchChecksForSession(db: Databases | Transactions, tillSessionId: number): Promise<ITillCheck[]>;
    newCheck(db: Databases | Transactions, check: INewTillCheck): Promise<number>;
    fetchChecksForTill(
        db: Databases | Transactions,
        tillSessionId: number,
        date?: Date
    ): Promise<ITillCheck[]>;
}