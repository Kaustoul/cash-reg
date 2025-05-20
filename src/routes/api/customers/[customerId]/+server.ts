import { database } from '$lib/server/db/db';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
    const customerId = Number(params.customerId);
    if (isNaN(customerId)) {
        return new Response('Invalid customer ID', { status: 400 });
    }
    const customer = await database.fetchCustomer(customerId);
    if (!customer) {
        return new Response('Customer not found', { status: 404 });
    }
    return new Response(JSON.stringify(customer), { status: 200 });
};