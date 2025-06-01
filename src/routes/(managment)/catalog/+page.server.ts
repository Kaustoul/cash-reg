import { csvImporter } from '$lib/server/data-handlers/item-importer.js';
import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    // const products = await database.fetchProducts(true);
    // const productsDisplayList = [];
    // for (const product of products) {
    //     productsDisplayList.push({
    //         fullId: formatFullId(product),
    //         subnames: product.items.map(i => i.subname),
    //         productId: product.productId,
    //         prices: formatSumsArray(product.prices.map(p => p.value)),
    //         name: formatProductName(product),
    //         stock: "N/A"
    //     });
    // }
    return {
        // products: products,
        // displayInfo: productsDisplayList,
    }
}

export const actions = {
    importCSV: async (event) => {
        const data = await event.request.formData();
        const file = data.get('csv') as File;

        if (!file) {
            return {
                success: false,
                status: 400,
                error: "No file uploaded"
            };
        }

        let count;
        try {
            count = await csvImporter(await file.text());
        } catch (e: any) {
            return {
                success: false,
                status: 400,
                error: e.message,
            };
        }
        
        return {
            success: true,   
            message: "Imported items and products from CSV file",
            count: count
        };
    },
} satisfies Actions;


