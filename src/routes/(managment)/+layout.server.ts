import { database } from '$lib/server/db/db';
import { getUserAndOpenSession } from '$lib/server/utils/session-utils';
import type { IFrontEndUser } from '$lib/shared/interfaces/user';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
    const { user, tillSession, } = await getUserAndOpenSession(cookies);

    if (!user) {
        throw redirect(302, '/login');
    }

    const group = await database.fetchGroupById(user.groupId);
    const permissions = await database.fetchGroupPermissions(user.groupId);

    const frontEndUser = {
        userId: user.userId,
        name: user.name,
        surname: user.surname,
        groupId: user.groupId,
        permissions: permissions,
        isAdmin: group?.name === 'admin'
    };

    return {
        frontEndUser,
        tillSessionId: tillSession?.tillSessionId ?? null,
        tillId: tillSession?.tillId ?? null,
    };
};