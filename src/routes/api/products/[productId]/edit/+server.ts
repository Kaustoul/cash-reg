import { database } from '$lib/server/db/db';
import { getUserAndOpenSession } from '$lib/server/utils/session-utils';
import type { RequestHandler } from '@sveltejs/kit';

export const PATCH: RequestHandler = async ({ params, request, cookies }) => {
    const { user } = await getUserAndOpenSession(cookies);
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const productId = Number(params.productId);
    if (!productId) {
        return new Response(JSON.stringify({ error: 'Invalid product ID' }), { status: 400 });
    }

    const data = await request.json();

    const update: Record<string, any> = {};
    if (typeof data.name === 'string') update.name = data.name;
    if (typeof data.units === 'string') update.units = data.units;
    if (typeof data.isArchived === 'boolean') update.status = data.isArchived ? 'archived' : 'active';

    try {
        await database.updateProduct(productId, update);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Failed to update product' }), { status: 500 });
    }
};