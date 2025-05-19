import { database } from '$lib/server/db/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const customers = await database.fetchCustomers();
    return { customers };
};