import { database } from "$lib/server/db/db";
import { getUserAndOpenSession } from "$lib/server/utils/session-utils";
import type { IOrder } from "$lib/shared/interfaces/order";
import type { IShoppingCart } from "$lib/shared/interfaces/shopping-cart";
import type { PaymentType } from "$lib/shared/interfaces/transaction";
import { fullItemId, parseFullItemId } from "$lib/shared/utils/item-utils";
import type { PageServerLoad } from "./$types";
import { redirect, type Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async ({cookies}) => {
    const { user, tillSession } = await getUserAndOpenSession(cookies);

    if (!user) {
        throw redirect(302, '/login');
    }
    
    if (!tillSession) {
        throw redirect(302, '/tills');
    }

    const products = await database.fetchProducts(true);

    return {
        products: products,
    }
} 

export const actions = {
    finalizeOrder: async ({request, cookies}) => {
        const { user, tillSession } = await getUserAndOpenSession(cookies);
        
        if (!user || !tillSession) {
            return { success: false, error: 'Not logged in or no open till session' };
        }

        const data = await request.formData();
        const cart: IShoppingCart = JSON.parse(data.get('cart') as string);

        await database.newOrder(cart);

        return {
            success: true,
        }
    },
} satisfies Actions;
