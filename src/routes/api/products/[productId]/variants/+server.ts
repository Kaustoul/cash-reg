import { database } from '$lib/server/db/db';
import { fetchAndHasPermission, getUserAndOpenSession } from '$lib/server/utils/session-utils';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ params, request, cookies }) => {
    const { user } = await getUserAndOpenSession(cookies);
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    if (!await fetchAndHasPermission(user, "tabs.catalog.admin")) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    const productId = Number(params.productId);
    if (!productId) {
        return new Response(JSON.stringify({ error: 'Invalid product ID' }), { status: 400 });
    }

    try {
        const variantId = await database.newVariant(productId);
        return new Response(JSON.stringify({ variantId }), { status: 201 });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Failed to add variant' }), { status: 500 });
    }
};