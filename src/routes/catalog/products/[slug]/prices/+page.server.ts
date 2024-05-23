import { MaxVolumeCondition, MinVolumeCondition } from "$lib/server/prices/condition";
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

} satisfies Actions;