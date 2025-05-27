import { database } from '$lib/server/db/db';
import { generatePassword, hashPassword } from '$lib/server/utils/password-utils';
import { fail, json } from '@sveltejs/kit';
import type { Actions } from './$types';
import { fetchAndHasPermission, getUserAndOpenSession } from '$lib/server/utils/session-utils';
import { cleanObject } from '$lib/shared/utils';

export const actions: Actions = {
    async resetPassword({ params, cookies }) {
        const {user} = await getUserAndOpenSession(cookies);

        if (!user || !(await fetchAndHasPermission(user, "tabs.workers.admin"))) {
            return fail(403, { error: 'Unauthorized' });
        }

        const workerId = Number(params.workerId);
        if (!workerId) return fail(400, { error: 'Invalid user ID' });

        const worker = await database.fetchUserById(workerId);
        if (!worker) return fail(404, { error: 'User not found' });

        const newPassword = generatePassword({ length: 10, lowercase: true, numbers: true });
        const passwordHash = await hashPassword(newPassword);

        await database.updateUserPassword(workerId, passwordHash, true);

        return { success: true };
    },

    async updateWorker({ params, cookies, request }) {
        const {user} = await getUserAndOpenSession(cookies);

        if (!user || !(await fetchAndHasPermission(user, "tabs.workers.admin"))) {
            return fail(403, { error: 'Unauthorized' });
        }

        const workerId = Number(params.workerId);
        if (!workerId) return fail(400, { error: 'Invalid user ID' });

        const worker = await database.fetchUserById(workerId);
        if (!worker) return fail(404, { error: 'User not found' });

        const formData = await request.formData();
        const name = formData.get('name')?.toString();
        const surname = formData.get('surname')?.toString();

        if (!name && !surname) {
            return fail(400, { error: 'Name or surname are required' });
        }

        try {
            await database.updateUserInfo(workerId, { name, surname });
            return { success: true };
        } catch (error) {
            console.error('Error updating worker:', error);
            return fail(500, { error: 'Failed to update worker' });
        }
    }
};