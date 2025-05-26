import { database } from '$lib/server/db/db';
import type { RequestHandler } from '@sveltejs/kit';
import { compare } from 'bcryptjs'; // Make sure bcryptjs is installed

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { userId, password } = await request.json();

    const user = await database.fetchUserById(userId);
    if (!user) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    const valid = await compare(password, user.passwordHash);
    if (!valid) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    cookies.set('userId', String(user.userId), { path: '/', httpOnly: true });
    cookies.set('groupId', String(user.groupId), { path: '/', httpOnly: true });

    const tillSession = await database.fetchLastOpenSessionForUser(user.userId);
    if (tillSession) {
        cookies.set('tillSessionId', String(tillSession.tillSessionId), { path: '/', httpOnly: true });
    }

    return new Response(JSON.stringify({ success: true, userId: user.userId, groupId: user.groupId }), { status: 200 });
};