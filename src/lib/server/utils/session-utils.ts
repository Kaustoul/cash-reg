import { database } from '$lib/server/db/db';
import type { IUser } from '$lib/shared/interfaces/user';
import type { Cookies } from '@sveltejs/kit';

export async function getUserAndOpenSession(cookies: Cookies) {
    const userId = Number(cookies.get('userId'));
    if (!userId) return { user: null, tillSession: null };

    const user = await database.fetchUserById(userId);
    if (!user) return { user: null, tillSession: null };

    const tillSessionId = Number(cookies.get('tillSessionId'));
    let tillSession = null;

    if (tillSessionId) {
        tillSession = await database.fetchTillSession(tillSessionId);

        if (!tillSession || tillSession.cashierId !== userId || tillSession.type === 'CLOSED') {
            tillSession = null;
        }
    }

    return { user, tillSession };
}

export async function fetchAndHasPermission(user: IUser, permission: string) {
    if (!user || !user.groupId) return false;

    const group = await database.fetchGroupById(user.groupId);
    if (!group) return false;
    if (group.name === 'admin') return true;

    return await database.groupHasPermission(user.groupId, permission);    
}