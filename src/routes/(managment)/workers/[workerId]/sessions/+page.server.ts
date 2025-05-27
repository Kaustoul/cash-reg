import { database } from '$lib/server/db/db';
import { getUserAndOpenSession, pairSessionsStartToEnd } from '$lib/server/utils/session-utils';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, cookies }) => {
    const { user } = await getUserAndOpenSession(cookies);
    if (!user) throw redirect(302, '/login');

    const workerId = Number(params.workerId);
    if (!workerId) throw redirect(302, '/workers');

    const worker = await database.fetchUserById(workerId);
    if (!worker) throw redirect(302, '/workers');
    
    // Fetch all sessions for this worker, sorted by createdAt ascending
    const sessions = await database.fetchSessionsForUser(workerId);

    return pairSessionsStartToEnd(sessions);
};