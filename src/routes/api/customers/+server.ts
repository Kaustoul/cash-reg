import { database } from '$lib/server/db/db';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    // Use your data handler to save the customer
    const id = await database.newCustomer(data);
    return new Response(JSON.stringify({ id }), { status: 201 });
};

export const GET: RequestHandler = async () => {
    console.log('Fetching customers');
    const customers = await database.fetchCustomers();
    console.log('Fetched customers:', customers);
    return new Response(JSON.stringify(customers), { status: 200 });
};