import { database } from '$lib/server/db/db';
import type { RequestHandler } from '@sveltejs/kit';
import { compare } from 'bcryptjs'; // Make sure bcryptjs is installed
import { generatePassword, hashPassword } from '$lib/server/utils/password-utils';

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { userId, password } = await request.json();
    let res = {};

    const user = await database.fetchUserById(userId);
    if (!user) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    // If mustChangePassword is true, generate a new password and force the user to change it
    if (user.mustChangePassword) {
        const newPassword = generatePassword({ length: 10, lowercase: true, numbers: true });
        const passwordHash = await hashPassword(newPassword);

        // Update the user's password in the DB and set mustChangePassword to false
        await database.updateUserPassword(user.userId, passwordHash, false);
        res = {
            ...res,
            newPassword,
        }
    } else {   
        const valid = await compare(password, user.passwordHash);
        if (!valid) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
        }
    }
        
    cookies.set('userId', String(user.userId), { path: '/', httpOnly: true });

    const tillSession = await database.fetchLastOpenSessionForUser(user.userId);
    if (tillSession) {
        cookies.set('tillSessionId', String(tillSession.tillSessionId), { path: '/', httpOnly: true });
    }

    return new Response(JSON.stringify({...res, success: true, userId: user.userId }), { status: 200 });
};