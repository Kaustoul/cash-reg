import { database } from '$lib/server/db/db';
import { getUserAndOpenSession, fetchAndHasPermission } from '$lib/server/utils/session-utils';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
    const { user } = await getUserAndOpenSession(cookies);
    if (!user) throw redirect(302, '/login');
    if (!(await fetchAndHasPermission(user, "tabs.workers.admin"))) {
        throw redirect(302, '/workers/list');
    }

    
    const groups = await database.fetchGroups();
    return { groups };
};