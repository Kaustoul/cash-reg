import { database } from '$lib/server/db/db';
import { getUserAndOpenSession, fetchAndHasPermission } from '$lib/server/utils/session-utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
    const { user } = await getUserAndOpenSession(cookies);
    if (!user) throw new Error("Unauthorized");
    if (!await fetchAndHasPermission(user, "tabs.catalog.view")) {
        throw new Error("Forbidden");
    }

    const variantId = Number(params.variantId);
    if (!variantId) throw new Error("Invalid variant ID");

    const variant = await database.fetchVariant(variantId);
    if (!variant) throw new Error("Variant not found");

    return { variant };
};