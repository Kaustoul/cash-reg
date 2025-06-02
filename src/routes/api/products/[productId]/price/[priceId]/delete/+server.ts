import { database } from '$lib/server/db/db';
import { getUserAndOpenSession } from '$lib/server/utils/session-utils';
import type { RequestHandler } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ params, cookies }) => {
    const { user } = await getUserAndOpenSession(cookies);
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const priceId = Number(params.priceId);
    if (!priceId) return new Response(JSON.stringify({ error: 'Invalid price ID' }), { status: 400 });

    try {
        await database.removePrice(priceId);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Failed to delete price' }), { status: 500 });
    }
};