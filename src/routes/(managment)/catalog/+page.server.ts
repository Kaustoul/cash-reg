import { csvImporter } from '$lib/server/data-handlers/item-importer.js';
import { database } from '$lib/server/db/db';
import { fetchAndHasPermission, getUserAndOpenSession } from '$lib/server/utils/session-utils';
import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
    const { user } = await getUserAndOpenSession(cookies);
    
    if (!user) {
        throw new Error("Unauthorized");
        // return { error: "Unauthorized", status: 401 };
    }

    if (!fetchAndHasPermission(user, "tabs.catalog.view")) {
        // return { error: "Forbidden", status: 403 };
        throw new Error("Forbidden");
    }

    const products = await database.fetchProducts();

    return {
        products: products,
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


