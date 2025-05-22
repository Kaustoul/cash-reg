import { database } from '$lib/server/db/db';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ params, request }) => {
    const customerId = Number(params.customerId);
    const { amount, type } = await request.json();
    await database.processCustomerDeposit(
        customerId,
        { value: amount.toString(), currency: 'CZK' },
        type
    );
    return new Response('OK', { status: 200 });
};