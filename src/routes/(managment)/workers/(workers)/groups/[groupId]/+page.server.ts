import { database } from '$lib/server/db/db';
import { getUserAndOpenSession, fetchAndHasPermission } from '$lib/server/utils/session-utils';
import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
    const { user } = await getUserAndOpenSession(cookies);
    if (!user) throw redirect(302, '/login');
    if (!(await fetchAndHasPermission(user, "tabs.workers.admin"))) {
        throw redirect(302, '/workers/groups');
    }

    const groupId = Number(params.groupId);
    if (!groupId) throw redirect(302, '/workers/groups');

    const group = await database.fetchGroupById(groupId);
    if (!group) throw redirect(302, '/workers/groups');

    return { group };
};

// Optionally, add actions for editing group info here
export const actions: Actions = {
    async updateGroup({ params, request, cookies }) {
        const { user } = await getUserAndOpenSession(cookies);
        if (!user) return fail(401, { error: 'Unauthorized' });
        if (!(await fetchAndHasPermission(user, "tabs.workers.admin"))) {
            return fail(403, { error: 'Forbidden' });
        }

        const groupId = Number(params.groupId);
        if (!groupId) return fail(400, { error: 'Invalid group ID' });

        const form = await request.formData();
        const name = form.get('name')?.toString().trim();
        const description = form.get('description')?.toString().trim();

        if (!name) return fail(400, { error: 'Název nesmí být prázdný.' });

        await database.updateGroup(groupId, { name, description });

        return { success: true };
    }
};