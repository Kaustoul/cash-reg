import { database } from '$lib/server/db/db';
import type { IFrontEndUser } from '$lib/shared/interfaces/user';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
    const userId = cookies.get('userId') ?? null;
    const tillSessionId = Number(cookies.get('tillSessionId')) ?? null;
    const tillId = tillSessionId ? (await database.fetchTillSession(tillSessionId))?.tillId : null;

    let frontEndUser: IFrontEndUser | null = null;

    if (userId) {
        const user = await database.fetchUserById(Number(userId));

        if (user) {
            const group = await database.fetchGroupById(user.groupId);
            const permissions = await database.fetchGroupPermissions(user.groupId);
            frontEndUser = {
                userId: user.userId,
                name: user.name,
                surname: user.surname,
                groupId: user.groupId,
                permissions: permissions,
                isAdmin: group?.name === 'admin'
            };
        }
    }

    return {
        frontEndUser,
        tillSessionId,
        tillId,
    };
};