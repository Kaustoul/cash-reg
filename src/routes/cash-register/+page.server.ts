import { database } from "$lib/server/db/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const products = await database.fetchProducts(true);

    return {
        products: products,
    }
} 
