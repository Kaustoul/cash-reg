import { sqliteGroups } from './sqlite-groups-data-handler';
import { sqliteUsers } from './sqlite-users-data-handler';
import { sqlitePermissions } from './sqlite-permissions-data-handler';
import { flattenPermissions } from '$lib/shared/utils/permission-utils';
import { PERMISSIONS } from '$lib/shared/permissions';
import { hash } from 'bcryptjs'; // or 'bcrypt' if you use native bcrypt
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import type { INewUser } from '$lib/shared/interfaces/user';

/**
 * Ensure "admin" and "default" groups exist.
 */
export async function setupDefaultGroups(db: BetterSQLite3Database) {
    const groups = await sqliteGroups.fetchGroups(db);
    const groupNames = groups.map(g => g.name);

    if (!groupNames.includes('admin')) {
        await sqliteGroups.newGroup(db, { name: 'admin', description: 'Administrators' });
    }
    if (!groupNames.includes('default')) {
        await sqliteGroups.newGroup(db, { name: 'default', description: 'Default group for new users' });
    }
}

/**
 * Ensure an admin user exists and is assigned to the admin group.
 * Default password is 'admin' (change in production!).
 */
export async function setupDefaultAdminUser(db: BetterSQLite3Database) {
    const users = await sqliteUsers.fetchAllUsers(db);
    const adminUser = users.find(u => u.name === 'admin');

    if (!adminUser) {
        const groups = await sqliteGroups.fetchGroups(db);
        const adminGroup = groups.find(g => g.name === 'admin');
        if (!adminGroup) throw new Error('Admin group not found');

        const passwordHash = await hash('admin', 10); // Change this in production!
        const newUser: INewUser = {
            name: 'admin',
            surname: 'admin',
            passwordHash,
            groupId: adminGroup.groupId,
            pinHash: null,
        };
        await sqliteUsers.newUser(db, newUser);
    }
}

/**
 * Insert all permissions from the shared permissions tree into the DB.
 */
export async function setupDefaultPermissions(db: BetterSQLite3Database) {
    const flat = flattenPermissions(PERMISSIONS);
    for (const [key, { name, description }] of Object.entries(flat)) {
        await sqlitePermissions.newPermission(db, key, {name, description });
    }
}