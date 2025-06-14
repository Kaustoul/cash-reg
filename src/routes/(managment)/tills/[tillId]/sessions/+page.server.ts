import { database } from '$lib/server/db/db';
import { getUserAndOpenSession, pairSessionsStartToEnd } from '$lib/server/utils/session-utils';
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
    return pairSessionsStartToEnd(sessions);
};