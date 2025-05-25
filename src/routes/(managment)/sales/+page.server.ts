import { database } from '$lib/server/db/db';
import type { PageServerLoad, Actions } from './$types';
import { parse } from 'date-fns';

function parseDateParam(dateParam: string | null): Date {
    if (!dateParam) return new Date();
    // Try parsing with time first, then fallback to date only
    let parsed = parse(dateParam, 'd.M.yyyy H:mm', new Date());
    if (isNaN(parsed.getTime())) {
        parsed = parse(dateParam, 'd.M.yyyy', new Date());
    }
    return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export const load: PageServerLoad = async ({ url }) => {
    const dateParam = url.searchParams.get('date');
    const date = parseDateParam(dateParam);

    const orders = await database.fetchOrders(date);

    return {
        orders
    };
};

export const actions = {
    fetchOrders: async (event) => {
        const data = await event.request.formData();
        const dateStr = data.get('date') as string;
        const date = parseDateParam(dateStr);
        const orders = await database.fetchOrders(date);
        return {
            success: true,
            orders
        };
    }
} satisfies Actions;
