import { importItemsAndProductsFromCSV } from '$lib/server/data-handlers/item-importer.js';
import { CurrencyManager } from '$lib/server/prices/currency-manager.js';
import type { Price } from '$lib/server/prices/price';
import { Unit } from '$lib/server/products/product';
import { Catalog } from '$lib/server/till/catalog';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    // await importItemsAndProductsFromCSV("src/lib/test/data/items.csv");
    await Catalog.fetchAll();
    const res = []
    for (const product of Catalog.getProducts()) {
        const unit = product.getUnits();
        let prices = parsePriceStr(product.getPrices());
        let id, name, stock;
        if (unit !== Unit.UNIT) {
            prices = prices + " / " + unit
        }

        const info = product.getDisplayInfo();
        id = info.displayId;
        name = info.displayName;

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