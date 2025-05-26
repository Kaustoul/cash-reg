import type { IUser, INewUser } from "$lib/shared/interfaces/user";
import type { Databases, Transactions } from "./db";

export interface UserDataHandler {
    newUser(db: Databases | Transactions, user: INewUser): Promise<number>;
    fetchUserById(db: Databases | Transactions, userId: number): Promise<IUser | null>;
    updateUserGroup(db: Databases | Transactions, userId: number, groupId: number): Promise<void>;
    updateUserPassword(db: Databases | Transactions, userId: number, passwordHash: string, mustChangePassword: boolean): Promise<void>;
    fetchAllUsers(db: Databases | Transactions): Promise<IUser[]>;
}