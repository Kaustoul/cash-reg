import { database } from '$lib/server/db/db';
import { getUserAndOpenSession } from '$lib/server/utils/session-utils';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ params, request, cookies }) => {
    const { user } = await getUserAndOpenSession(cookies);
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const productId = Number(params.productId);
    if (!productId) return new Response(JSON.stringify({ error: 'Invalid product ID' }), { status: 400 });

    const data = await request.json();

    // Validate and prepare price object
    const price = {
        productId,
        amount: data.amount,
        currency: data.currency,
        priceType: data.priceType,
        minQuantity: data.minQuantity ?? null,
        maxQuantity: data.maxQuantity ?? null,
        isActive: data.isActive ?? true,
    };

    try {
        const priceId = await database.newPrice(price);
        return new Response(JSON.stringify({ priceId }), { status: 201 });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Failed to add price' }), { status: 500 });
    }
};