import type { ITillCheck, INewTillCheck } from "$lib/shared/interfaces/till-check";
import type { Databases, Transactions } from "./db";

export interface TillChecksDataHandler {
    fetchCheck(db: Databases | Transactions, id: number): Promise<ITillCheck | null>;
    fetchChecksForSession(db: Databases | Transactions, tillSessionId: number): Promise<ITillCheck[]>;
    newCheck(db: Databases | Transactions, check: INewTillCheck): Promise<number>;
    fetchChecksForTill(
        db: Databases | Transactions,
        tillId: number,
        date?: Date
    ): Promise<ITillCheck[]>;
}