import type { IFrontEndUser, IUser } from "../interfaces/user";
import type { PermissionLeaf, PermissionTree } from "../permissions";

// Recursively flatten the permissions tree to dot-separated keys
export function flattenPermissions(tree: PermissionTree, prefix = ''): Record<string, PermissionLeaf> {
    let result: Record<string, PermissionLeaf> = {};
    for (const key in tree) {
        const value = tree[key];
        const newPrefix = prefix ? `${prefix}.${key}` : key;
        if (value && typeof value === 'object' && 'name' in value && 'description' in value) {
            result[newPrefix] = value as PermissionLeaf;
        } else if (typeof value === 'object') {
            Object.assign(result, flattenPermissions(value, newPrefix));
        }
    }
    return result;
}

// Parse a flattened key back to an array of its parts
export function parsePermissionKey(key: string): string[] {
    return key.split('.');
}

export function hasPermission(user: IFrontEndUser | null | undefined, key: string | null | undefined): boolean {
    if (!key)
        return true;
    if (!user) 
        return false;

    return user.isAdmin || user.permissions.includes(key);
}