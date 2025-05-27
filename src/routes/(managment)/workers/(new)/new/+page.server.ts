import { database } from '$lib/server/db/db';
import { getUserAndOpenSession, fetchAndHasPermission } from '$lib/server/utils/session-utils';
import { fail, json, redirect, type Actions } from '@sveltejs/kit';
import { generatePassword, hashPassword } from '$lib/server/utils/password-utils';
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

export const actions: Actions = {
    async createWorker({ request, cookies }) {
        const { user } = await getUserAndOpenSession(cookies);
        if (!user) return fail(401, { error: 'Neautorizováno.' });
        if (!(await fetchAndHasPermission(user, "tabs.workers.admin"))) {
            return fail(403, { error: 'Nemáte oprávnění.' });
        }

        const form = await request.formData();
        const name = form.get('name')?.toString().trim();
        const surname = form.get('surname')?.toString().trim();
        const groupId = Number(form.get('groupId'));

        if (!name || !surname || !groupId) {
            return fail(400, { error: 'Vyplňte všechna pole.' });
        }

        // Generate a random password for the new worker
        const password = generatePassword({ length: 10, lowercase: true, numbers: true });
        const passwordHash = await hashPassword(password);

        const newUser = await database.newUser({
            name,
            surname,
            groupId,
            passwordHash,
            mustChangePassword: true
        });

        if (!newUser) {
            return fail(500, { error: 'Nepodařilo se vytvořit zaměstnance.' });
        }

        // Optionally, you can return the generated password if you want to show it to the admin
        return { success: true, userId: newUser };
    }
};