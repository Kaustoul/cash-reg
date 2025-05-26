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
        console.log("Finalize order action called");
        console.log("User:", user);
        console.log("Till Session:", tillSession);
        
        if (!user || !tillSession) {
            return { success: false, error: 'Not logged in or no open till session' };
        }

        const data = await request.formData();
        const cart: IShoppingCart = JSON.parse(data.get('cart') as string);
        
        console.log("Cart data:", cart);

        const items: IOrder["items"] = cart.items.map(item => {
            return {
                fullId: parseFullItemId(item.productId, item.itemId),
                quantity: item.quantity.toString(),
                price: item.prices[item.priceIdx],
                discounts: item.discounts,
                subtotal: item.subtotal.toString(),
                total: item.total.toString(),
                name: item.name
            }
        });

        console.log("Parsed items:", items);

        await database.newOrder({
            tillSessionId: tillSession.tillSessionId,
            items: items,
            subtotal: cart.subtotal["CZK"],
            total: cart.total["CZK"],
            discounts: cart.discounts ?? null,
            paymentType: cart.state.split("-")[0] as PaymentType,
            note: cart.note ?? null,
            customerId: cart.customerId ?? null
        });

        console.log("Order finalized successfully");

        return {
            success: true,
        }
    },
} satisfies Actions;
