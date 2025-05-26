import { database } from '$lib/server/db/db';
import { getUserAndOpenSession } from '$lib/server/utils/session-utils';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, cookies }) => {
    const { user } = await getUserAndOpenSession(cookies);
    
    if (!user) 
        throw redirect(302, '/login');

    const tillId = Number(params.tillId);
    if (!tillId) 
        throw redirect(302, '/tills');

    // Get all sessions for this till, sorted by createdAt ascending
    const sessions = await database.fetchTillSessionsForTill(tillId);
    sessions.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

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
};