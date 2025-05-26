export interface IUser {
    userId: number;
    name: string;
    surname: string;
    passwordHash: string;
    pinHash?: string | null;
    groupId: number;
    createdAt: Date;
    mustChangePassword: boolean;
}

export interface IFrontEndUser {
    userId: number;
    name: string;
    surname: string;
    groupId: number;
    permissions: string[];
    isAdmin: boolean;
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