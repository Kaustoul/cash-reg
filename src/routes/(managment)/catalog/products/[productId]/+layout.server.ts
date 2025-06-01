import { database } from "$lib/server/db/db";
import { fetchAndHasPermission, getUserAndOpenSession } from "$lib/server/utils/session-utils";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ params, cookies }) => {
    const { user } = await getUserAndOpenSession(cookies);

    if (!user) {
        return { status: 401, error: new Error("Unauthorized") };
    }

    if (!await fetchAndHasPermission(user, "tabs.catalog.view")) {
        return { status: 403, error: new Error("Forbidden") };
    }

    const product = await database.fetchProduct(Number(params.productId), true);

    if (!product) {
        return { status: 404, error: new Error("Product not found") };
    }

    let prices = null;
    let variants = null;

    try {
        const prices = await database.fetchPricesForProduct(product.productId);
        const variants = await database.fetchProductItems(product.productId);
    } catch (error) {
        return { status: 404, error };
    }
    
    // const priceStrs = product.prices.map(p => formatSum(p.value));
    // const itemsDisplayData = [];

    // for (const item of Object.values(product.items)) {
    //     const prices: string[] = []
    //     for (const priceIdx of item.priceIdxs) {
    //         prices.splice(priceIdx, 0, priceStrs[priceIdx]);
    //     }

    //     itemsDisplayData.push({
    //         itemId: item.itemId,
    //         fullId: fullItemId(item),
    //         subname: item.subname,
    //         priceStrs: prices, 
    //         stock: "N/A",
    //     });
    // }

    return {
        product: product,
        prices: prices,
        variants: variants, 
    };
}
