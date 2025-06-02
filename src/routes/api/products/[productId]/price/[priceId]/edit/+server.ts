import { database } from '$lib/server/db/db';
import { getUserAndOpenSession } from '$lib/server/utils/session-utils';
import type { RequestHandler } from '@sveltejs/kit';

export const PATCH: RequestHandler = async ({ params, request, cookies }) => {
    const { user } = await getUserAndOpenSession(cookies);
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const priceId = Number(params.priceId);
    if (!priceId) return new Response(JSON.stringify({ error: 'Invalid price ID' }), { status: 400 });

    const data = await request.json();

    try {
        await database.updatePrice(priceId, data);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Failed to update price' }), { status: 500 });
    }
};