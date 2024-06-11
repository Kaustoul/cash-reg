import { database } from "$lib/server/db/db";
import { fullItemId } from "$lib/shared/utils/item-utils";
import { formatSum } from "$lib/shared/utils/money-sum-utils";
import { formatFullId, formatProductName } from "$lib/shared/utils/product-utils";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ params }) => {
    const product = await database.fetchProduct(Number(params.slug), true);
    const priceStrs = product.prices.map(p => formatSum(p.value));
    const itemsDisplayData = [];



    for (const item of Object.values(product.items)) {
        const prices: string[] = []
        for (const priceIdx of item.priceIdxs) {
            prices.splice(priceIdx, 0, priceStrs[priceIdx]);
        }

        itemsDisplayData.push({
            itemId: item.itemId,
            fullId: fullItemId(item),
            subname: item.subname,
            priceStrs: prices, 
            stock: "N/A",
        });

    }

    return {
        product: product,
        displayData: {
            name: formatProductName(product),
            id: formatFullId(product),
        },

        itemsDisplayData: itemsDisplayData, 
    };
}
