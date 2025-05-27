import { int } from "drizzle-orm/mysql-core";

export interface IUser {
    userId: number;
    name: string;
    surname: string;
    passwordHash: string;
    pinHash?: string | null;
    groupId: number;
    createdAt: Date;
    mustChangePassword: boolean;
    lastLogin?: Date | null;
    lastIp?: string | null;
}

export interface IFrontEndUser {
    userId: number;
    group: IGroup;
    name: string;
    surname: string;
    permissions: string[];
    isAdmin: boolean;
    createdAt: Date;
}

export interface IFrontEndUserWithLogin extends IFrontEndUser {
    lastLogin?: Date | null;
    lastIp?: string | null;
    mustChangePassword: boolean;
}

// export type FrontEndUser = Omit<IUser, 'passwordHash' | 'pinHash'>;

export interface INewUser extends Omit<IUser, 'userId' | 'createdAt'> {
    mustChangePassword: boolean;
}

export interface IGroup {
    groupId: number;
    name: string;
    description?: string | null;
}

export type INewGroup = Omit<IGroup, 'groupId'>; 

export interface IPermission {
    permissionId: string;
    name: string;
    description?: string;
}