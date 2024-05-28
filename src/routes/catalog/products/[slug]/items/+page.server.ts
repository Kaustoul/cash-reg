import { Unit } from "$lib/server/products/product";
import { Catalog } from "$lib/server/till/catalog";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ url, params }) => {
    const res: { itemPriceStrs: {
        [itemId: number]: string[], 
        // {
        //     id: number;
        //     value: string;
        // }[]
    }} = {itemPriceStrs: {}};

    const product = Catalog.getProduct(Number(params.slug));
    for (const item of product.getItems().values()) {
        for (const priceIdx of item.getPriceIdxs()) {
            res["itemPriceStrs"][item.getItemId()] = res["itemPriceStrs"][item.getItemId()] || [];
            const price = product.getPrice(priceIdx);
            let priceStr = `${price.getValue().toString()} ${price.getCurrency().getSymbol()}`;
            
            if (product.getUnits() !== Unit.UNIT) {
                priceStr += ` / ${product.getUnits()}`
            }

            res["itemPriceStrs"][item.getItemId()].push(priceStr);
        }
    }

    return res;
}

export const actions = {
    removeItemPrice: async (event) => {
        const data = await event.request.formData();

    },

    addNewItemPrice: async (event) => {
        const data = await event.request.formData();
    }

} satisfies Actions;
