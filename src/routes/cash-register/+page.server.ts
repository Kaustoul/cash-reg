import { database } from "$lib/server/db/db";
import type { IOrder } from "$lib/shared/interfaces/order";
import type { IShoppingCart } from "$lib/shared/interfaces/shopping-cart";
import { fullItemId, parseFullItemId } from "$lib/shared/utils/item-utils";
import type { PageServerLoad } from "./$types";
import type { Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    const products = await database.fetchProducts(true);

    return {
        products: products,
    }
} 

export const actions = {
    finalizeOrder: async (event) => {
        const data = await event.request.formData();
        const cart: IShoppingCart = JSON.parse(data.get('cart') as string);
        
        const items: IOrder["items"] = cart.items.map(item => {
            return {
                fullId: parseFullItemId(item.productId, item.itemId),
                quantity: item.quantity.toString(),
                price: item.prices[item.priceIdx],
            }
        });
        await database.newOrderTransaction({
            tillId: cart.tillId,
            items: items,
            total: cart.total["CZK"],
            paymentType: cart.state.split("-")[0] as IOrder["paymentType"],
            note: null,
        })
        

        return {
            success: true,
        }
    },
} satisfies Actions;
