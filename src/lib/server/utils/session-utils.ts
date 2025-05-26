import { database } from '$lib/server/db/db';
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