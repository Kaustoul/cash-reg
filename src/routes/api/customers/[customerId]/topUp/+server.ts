import { database } from '$lib/server/db/db';
import { getUserAndOpenSession } from '$lib/server/utils/session-utils';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ params, request, cookies }) => {
    const { user, tillSession } = await getUserAndOpenSession(cookies);

    if (!user || !tillSession) {
        return new Response('Unauthorized', { status: 401 });
    }

    const customerId = Number(params.customerId);
    const { amount, type } = await request.json();

    await database.processCustomerDeposit(
        tillSession.tillSessionId,
        customerId,
        { value: amount.toString(), currency: 'CZK' },
        type
    );
    return new Response('OK', { status: 200 });
};