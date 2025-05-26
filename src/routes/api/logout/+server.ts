import { redirect, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
    cookies.delete('userId', { path: '/' });
    cookies.delete('groupId', { path: '/' });
    cookies.delete('tillSessionId', { path: '/' });

    throw redirect(303, '/login');
    // return new Response(JSON.stringify({ success: true }), { status: 200 });
};