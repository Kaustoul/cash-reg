import { MaxVolumeCondition, MinVolumeCondition } from "$lib/server/prices/condition";
import { CurrencyManager } from "$lib/server/prices/currency-manager";
import { Price } from "$lib/server/prices/price";
import { Catalog } from "$lib/server/till/catalog";
import type { Actions } from "@sveltejs/kit";
import Decimal from "decimal.js";

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
        const priceIdx = Number(data.get('idx'));

        const slug = Number(event.params.slug);
        const product = Catalog.getProduct(slug);
        const price = product.getPrice(priceIdx);

        if (!price) {
            return {success: false, message: 'Did not find price on product', status: 400};
        }
        await product.removeAllPriceConditions(priceIdx);

        return {success: true};
    },

    newPrice: async (event) => {
        const data = await event.request.formData();

        const value = new Decimal(data.get('value') as string);
        if (value.isNaN()) {
            return {success: false, message: 'Invalid value', status: 400}; 
        }

        const conditions = []
        if (data.get('min') !== "") {
            const min = new Decimal(data.get('min') as string);
            if (min.isNaN()) {
                return {success: false, message: 'Invalid min value', status: 400};
            }

            conditions.push(new MinVolumeCondition(min));
        }

        if (data.get('max') !== "") {
            const max = new Decimal(data.get('max') as string);
            if (max.isNaN()) {
                return {success: false, message: 'Invalid max value', status: 400};
            }

            conditions.push(new MaxVolumeCondition(max));
        }

        const slug = Number(event.params.slug);
        const product = Catalog.getProduct(slug);
        const price = new Price(value, CurrencyManager.getDefaultCurrency(), false, conditions);
        const applyToItems = data.get('applyAll') as string === 'on';
        console.log(applyToItems, data.get('applyAll') as string);
        await product.addPrice(price, applyToItems);

        return {success: true};
    },

    deletePrice: async (event) => {
        const data = await event.request.formData();
        const idxsStr = data.get('idxs') as string;
        const idxs = idxsStr.split(',').map(Number);

        const slug = Number(event.params.slug);
        const product = Catalog.getProduct(slug);

        for (const idx of idxs) {   
            await product.removePrice(idx);
        }

        return {success: true};

    },

} satisfies Actions;
