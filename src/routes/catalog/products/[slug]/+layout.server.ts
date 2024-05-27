import { Catalog } from "$lib/server/till/catalog";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ url, params }) => {
    const product = Catalog.getProduct(Number(params.slug));
    const json = product.toJSON();
    for (let i = 0; i < json.prices.length; i++) {
        console.log(i)
        const price = json.prices[i];
        json.prices[i] = {
            // @ts-ignore
            id: i,
            ...price,
        }

        if (price.conditions.length > 0) {
            json.prices[i] = {
                ...price,
                // @ts-ignore
                conditionStr: product.getPrice(i).conditionalToString(product.getUnits()),
            }
        }
    }

    return {
        ...product.getDisplayInfo(),
        ...json
    };
}
