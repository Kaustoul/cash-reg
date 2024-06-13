import { database } from '$lib/server/db/db';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const res = await database.fetchTills();
    return {tills: res};
}

export const actions = {
    newTill: async (event) => {
        const res = await database.newTill();
        return {success: res};
    },
} satisfies Actions;

