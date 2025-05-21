import { database } from '$lib/server/db/db';
import type { PageServerLoad, Actions} from './$types';

export const load: PageServerLoad = async () => {
    const orders = await database.fetchOrders(new Date());    
    return {
        orders: orders
    }
};

export const actions = {
    fetchOrders: async (event) => {
        const data = await event.request.formData();
        const date = new Date(Number(data.get('date') as string));
        const orders = await database.fetchOrders(date);
        return {
            success: true,
            orders: orders
        };
    }
} satisfies Actions;
