import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
    cookies.delete('userId', { path: '/' });
    cookies.delete('groupId', { path: '/' });
    // Add any other session cookies you use

    return new Response(JSON.stringify({ success: true }), { status: 200 });
};