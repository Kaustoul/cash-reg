import { database } from '$lib/server/db/db';
import { getUserAndOpenSession } from '$lib/server/utils/session-utils';
import type { RequestHandler } from '@sveltejs/kit';

export const PATCH: RequestHandler = async ({ params, request, cookies }) => {
    const { user } = await getUserAndOpenSession(cookies);
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const variantId = Number(params.variantId);
    if (!variantId) {
        return new Response(JSON.stringify({ error: 'Invalid variant ID' }), { status: 400 });
    }

    const data = await request.json();

    // Prepare update object
    const update: Record<string, any> = {};
    if (typeof data.subname === 'string') update.subname = data.subname;
    if (typeof data.ean === 'string' || data.ean === null) update.ean = data.ean;
    if (typeof data.isArchived === 'boolean') update.status = data.isArchived ? 'archived' : 'active';

    try {
        await database.updateVariant(variantId, update);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Failed to update variant' }), { status: 500 });
    }
};