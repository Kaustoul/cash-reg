import { database } from "$lib/server/db/db";
import { fetchAndHasPermission, getUserAndOpenSession } from "$lib/server/utils/session-utils";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ params, cookies }) => {
    const { user } = await getUserAndOpenSession(cookies);

    if (!user) {
        throw new Error("Unauthorized");
        // return { status: 401, error: new Error("Unauthorized") };
    }

    if (!await fetchAndHasPermission(user, "tabs.catalog.view")) {
        throw new Error("Forbidden");
        // return { status: 403, error: new Error("Forbidden") };
    }

    const product = await database.fetchProduct(Number(params.productId));

    if (!product) {
        throw new Error("Product not found");
        // return { status: 404, error: new Error("Product not found") };
    }

    let prices = null;
    let variants = null;

    try {
        prices = await database.fetchPricesForProduct(product.productId) ?? null;
        variants = await database.fetchProductVariants(product.productId) ?? null;
    } catch (error) {
        throw new Error("Failed to fetch product prices and variants data");
        // return { status: 404, error };
    }

    return {
        product: product,
        prices: prices,
        variants: variants, 
    };
}
