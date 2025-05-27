import { database } from '$lib/server/db/db';
import type { ITillSession } from '$lib/shared/interfaces/till-session';
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

export function pairSessionsStartToEnd(sessions: ITillSession[]) {

    // Pair open/close sessions
    const pairedSessions: { sessionStart: any, sessionEnd: any | null }[] = [];
    let i = 0;
    while (i < sessions.length) {
        const start = sessions[i];
        if (start.type === 'OPEN') {
            // Find the next CLOSED session for the same cashier
            let end: any | null = null;
            for (let j = i + 1; j < sessions.length; j++) {
                if (
                    sessions[j].type === 'CLOSED' &&
                    sessions[j].cashierId === start.cashierId &&
                    sessions[j].tillId === start.tillId
                ) {
                    end = sessions[j];
                    i = j; // Skip to after the closed session
                    break;
                }
            }
            pairedSessions.push({ sessionStart: start, sessionEnd: end });
        }
        i++;
    }

    return { sessions: pairedSessions };
}