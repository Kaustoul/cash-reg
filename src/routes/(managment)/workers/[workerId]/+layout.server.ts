import { database } from '$lib/server/db/db';
import { fetchAndHasPermission, getUserAndOpenSession } from '$lib/server/utils/session-utils';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, cookies }) => {
    const { user } = await getUserAndOpenSession(cookies);

    if (!user) {
        throw redirect(302, '/login');
    }

    if (!(await fetchAndHasPermission(user, "tabs.workers.view"))) {
        throw redirect(302, '/catalog');
    }

    const userId = Number(params.workerId);
    if (!userId) throw redirect(302, '/workers');

    const worker = await database.fetchUserById(userId);
    if (!worker) {
        throw redirect(302, '/workers');
    }

    const workerData = await database.fetchFrontEndUserWithLogin(worker);
    if (!workerData) {
        throw redirect(302, '/workers');
    }

    return { worker: workerData };
};