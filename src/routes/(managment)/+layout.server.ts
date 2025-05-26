import { database } from '$lib/server/db/db';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
    const userId = cookies.get('userId') ?? null;
    const groupId = cookies.get('groupId') ?? null;
    const tillSessionId = cookies.get('tillSessionId') ?? null;
    const tillId = tillSessionId ? (await database.fetchTillSession(Number(tillSessionId)))?.tillId : null;

    return {
        userId,
        tillSessionId,
        groupId,
        tillId
    };
};