import { database } from '$lib/server/db/db';
import { fetchAndHasPermission, getUserAndOpenSession } from '$lib/server/utils/session-utils';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { user } = await getUserAndOpenSession(cookies);

        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        if (!await fetchAndHasPermission(user, "tabs.catalog.create")) {
            return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
        }

        const productId = await database.newProduct({
            name: "Nový produkt",
            units: 'ks',
        });

        return new Response(JSON.stringify({ productId: productId }), { status: 201 });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: 'Failed to create product' }), { status: 500 });
    }
};