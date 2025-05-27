import { database } from '$lib/server/db/db';
import { getUserAndOpenSession } from '$lib/server/utils/session-utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
    const {user} = await getUserAndOpenSession(cookies);
    if (!user) throw new Error('Unauthorized');

    const customerId = Number(params.customerId);
    if (!customerId) return { orders: [] };

    // Fetch all orders for this customer
    const orders = await database.fetchCustomerOrders(customerId);

    return { orders };
};