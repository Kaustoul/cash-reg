import type { PermissionLeaf } from "$lib/shared/permissions";
import type { Databases, Transactions } from "./db";

export interface PermissionsDataHandler {
    newPermission(db: Databases | Transactions, key: string, data: PermissionLeaf): Promise<void>;
    fetchPermissionById(db: Databases | Transactions, key: string): Promise<PermissionLeaf | null>;
    fetchAllPermissions(db: Databases | Transactions): Promise<PermissionLeaf[]>;
    setupPermissions(db: Databases | Transactions): Promise<void>;
}