import { Unit } from "$lib/server/products/product";
import { Catalog } from "$lib/server/till/catalog";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { database } from "$lib/server/db/db";

export const actions = {
    removeItemPrice: async (event) => {
        const data = await event.request.formData();
       
        const productId = Number(event.params.slug);
        const priceIdx = Number(data.get('idx') as string)
        const itemId = Number(data.get('id') as string)

        await database.removeItemPriceIdxs(productId, itemId, [priceIdx]);
    },

    addNewItemPrice: async (event) => {
        const data = await event.request.formData();
    }

} satisfies Actions;
