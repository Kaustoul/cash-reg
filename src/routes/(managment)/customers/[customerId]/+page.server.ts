import { database } from '$lib/server/db/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const customerId = Number(params.customerId);
    const customer = await database.fetchCustomer(customerId);
    if (!customer) {
        throw new Error('Customer not found');
    }
    return { customer };
};