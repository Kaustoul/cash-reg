import { importItemsAndProductsFromCSV } from '$lib/item-importer.js';
import { CurrencyManager } from '$lib/structs/currency-manager.js';
import { ConditionFactory, MaxVolumeCondition, MinVolumeCondition } from '$lib/structs/prices/condition.js';
import type { Price } from '$lib/structs/prices/price.js';
import { Unit } from '$lib/structs/products/product.js';
import { Catalog } from '$lib/structs/till/catalog.js';
import Decimal from 'decimal.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    const product = Catalog.getProduct(Number(params.slug));
    const json = product.toJSON();
    for (let i = 0; i < json.prices.length; i++) {
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

/** @type {import('./$types').Actions} */
export const actions = {
    newCondition: async (event) => {
        const data = await event.request.formData();
        const priceIdx = Number(data.get('priceIdx'));
        const minValue = data.get('min') as string;
        const maxValue = data.get('max') as string;
        if (priceIdx === undefined) {
            return {success: false, message: 'Missing required fields', status: 400};
        }

        const slug = Number(event.params.slug);
        const product = Catalog.getProduct(slug);
        const price = product.getPrice(priceIdx);
        if (!price) {
            return {success: false, message: 'Did not find price on product', status: 400};
        }

        if (!minValue && !maxValue) {
            return {success: false, message: 'No value recieved', status: 400};
        }

        if (minValue) {
            const cond = new MinVolumeCondition(new Decimal(minValue));
            await product.addPriceCondition(priceIdx, cond);
        }

        if (maxValue) {
            const condition = new MaxVolumeCondition(new Decimal(maxValue));
            await product.addPriceCondition(priceIdx, condition);
        }

        return {success: true};
    },

    deleteAllPriceConditions: async (event) => {
        const data = await event.request.formData();
        const priceIdx = Number(data.get('id'));

        const slug = Number(event.params.slug);
        const product = Catalog.getProduct(slug);
        const price = product.getPrice(priceIdx);
        if (!price) {
            return {success: false, message: 'Did not find price on product', status: 400};
        }

        await product.removeAllPriceConditions(priceIdx);

        return {success: true};
    }

};