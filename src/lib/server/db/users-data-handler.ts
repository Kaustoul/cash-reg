import type { IUser, INewUser } from "$lib/shared/interfaces/user";

export interface UserDataHandler {
    newUser(db: any, user: INewUser): Promise<number>;
    fetchUserById(db: any, userId: number): Promise<IUser | null>;
    updateUserGroup(db: any, userId: number, groupId: number): Promise<void>;
    updateUserPassword(db: any, userId: number, passwordHash: string): Promise<void>;
}