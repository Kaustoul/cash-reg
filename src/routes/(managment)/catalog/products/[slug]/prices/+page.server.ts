import { MaxVolumeCondition, MinVolumeCondition } from "$lib/shared/prices/condition";
import { CurrencyManager } from "$lib/shared/prices/currency-manager";
import { Price } from "$lib/shared/prices/price";
import { Catalog } from "$lib/server/till/catalog";
import type { Actions } from "@sveltejs/kit";
import Decimal from "decimal.js";
import { database } from "$lib/server/db/db";
import type { ICondition } from "$lib/shared/interfaces/condition";

export const actions = {
    newCondition: async (event) => {
        const data = await event.request.formData();
        const priceIdx = Number(data.get('priceIdx') as string);
        const minValue = data.get('min') as string;
        const maxValue = data.get('max') as string;
        if (priceIdx === undefined) {
            return {success: false, message: 'Missing required fields', status: 400};
        }

        const productId = Number(event.params.slug);

        if (!minValue && !maxValue) {
            return {success: false, message: 'No value recieved', status: 400};
        }

        if (minValue) {
            await database.newPriceCondition(productId, priceIdx, {
                type: 'MinVolume',
                value: minValue,
            });
        }

        if (maxValue) {
            await database.newPriceCondition(productId, priceIdx, {
                type: 'MaxVolume',
                value: maxValue,
            });
        }

        return {success: true};
    },

    removeAllPriceConditions: async (event) => {
        const data = await event.request.formData();
        const priceIdx = Number(data.get('idx') as string);
        const productId = Number(event.params.slug);
       
        await database.removeAllPriceConditions(productId, priceIdx);

        return {success: true};
    },

    removePriceCondition: async (event) => {
        const data = await event.request.formData();
        const priceIdx = Number(data.get('priceIdx'));
        const conditionIdx = Number(data.get('conditionIdx'));
        const productId = Number(event.params.slug);

        await database.removePriceCondition(productId, priceIdx, conditionIdx);

        return {success: true};
    },

    newPrice: async (event) => {
        const data = await event.request.formData();

        const value = data.get('value') as string;
        if (new Decimal(value).isNaN()) {
            return {success: false, message: 'Invalid value', status: 400}; 
        }

        const conditions: ICondition[] = []
        const min = data.get("min") as string;
        const max = data.get("max") as string;
        if (min && min !== "") {
            conditions.push({type: "MinVolume", value: min}); 
        }

        if (max && max !== "") {
            conditions.push({type: "MaxVolume", value: max});
        }

        const productId = Number(event.params.slug);
        const applyToItems = data.get('applyAll') as string === 'on';
        await database.newPrice(
            productId,
            {
                value: {
                    value: value,
                    currency: CurrencyManager.getDefaultCurrency().getCode(),
                },
                conditions: conditions,
            },
            applyToItems 
        );

        return {success: true};
    },

    removePrice: async (event) => {
        const data = await event.request.formData();
        const idxsStr = data.get('idxs') as string;
        const idxs = idxsStr.split(',').map(Number);

        const productId = Number(event.params.slug);
       
        await database.removePrices(productId, idxs)

        return {success: true};

    },

} satisfies Actions;
