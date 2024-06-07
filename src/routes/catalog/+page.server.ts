import { importItemsAndProductsFromCSV } from '$lib/server/data-handlers/item-importer.js';
import { CurrencyManager } from '$lib/shared/prices/currency-manager.js';
import type { Price } from '$lib/shared/prices/price';
import { Unit } from '$lib/server/products/product';
import { Catalog } from '$lib/server/till/catalog';
import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    // await importItemsAndProductsFromCSV("src/lib/test/data/items.csv");
    await Catalog.fetchAll();
    console.log(Catalog.getProducts());
    const res = []
    for (const product of Catalog.getProducts()) {
        const unit = product.getUnits();
        let prices = parsePriceStr(product.getPrices());
        if (unit !== Unit.UNIT) {
            prices = prices + " / " + unit
        }

        const info = product.getDisplayInfo();
        const id = info.displayId;
        const name = info.displayName;

        res.push({
            productId: product.getProductId(),
            id: id,
            name: name,
            status: "STATUS",
            prices: prices,
            stock: 'N/A',
            itemCnt: product.getItems().size,
        });
    }

    return {
        products: res
    };
}

function parsePriceStr(prices: Price[]): string {
    let maxPrice = prices[0];
    let minPrice = prices[0];
    for (const price of prices) {
        if (price.getCurrency() !== CurrencyManager.getDefaultCurrency()) {
            continue;
        }

        if (price.getValue().gt(maxPrice.getValue())) {
            maxPrice = price;
        }

        if (price.getValue().lt(minPrice.getValue())) {
            minPrice = price;
        }
    }
    let priceStr;
    if (maxPrice.getValue().eq(minPrice.getValue())) {
        priceStr = maxPrice.getValue().toString() + " " + maxPrice.getCurrency().getCode();
    } else {
        priceStr = minPrice.getValue().toString() + " - " + maxPrice.getValue().toString() + " " + maxPrice.getCurrency().getCode();
    }

    return priceStr;
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
            count = await importItemsAndProductsFromCSV(await file.text());
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


