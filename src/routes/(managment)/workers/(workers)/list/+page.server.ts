import { database } from '$lib/server/db/db';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { hasPermission } from '$lib/shared/utils/permission-utils';
import { fetchAndHasPermission, getUserAndOpenSession } from '$lib/server/utils/session-utils';

export const load: PageServerLoad = async ({cookies}) => {
    const { user } = await getUserAndOpenSession(cookies);
    if (!user) {
        throw redirect(302, '/login');
    }

    if (!(await fetchAndHasPermission(user, "tabs.workers.view"))) {
        throw redirect(302, '/catalog');
    }

    const users = await database.fetchAllUsers();
    return { users };
};