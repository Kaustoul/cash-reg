import { database } from '$lib/server/db/db';
import { getUserAndOpenSession } from '$lib/server/utils/session-utils';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { user } = await getUserAndOpenSession(cookies);
    if (!user) {
        return new Response(JSON.stringify({ error: 'Not logged in' }), { status: 401 });
    }

    const data = await request.json();

    data.balance = {"CZK": "0"}

    // Use your data handler to save the customer
    const id = await database.newCustomer(data);
    return new Response(JSON.stringify({ id }), { status: 201 });
};

export const GET: RequestHandler = async () => {
    const customers = await database.fetchCustomers();
    return new Response(JSON.stringify(customers), { status: 200 });
};