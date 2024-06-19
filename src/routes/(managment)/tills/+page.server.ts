import { database } from '$lib/server/db/db';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { IMoneySum } from '$lib/shared/interfaces/money-sum';

export const load: PageServerLoad = async () => {
    const res = await database.fetchTills();
    return {tills: res};
}

export const actions = {
    newTill: async (event) => {
        const res = await database.newTill();
        return {success: res};
    },

    moneyTransfer: async (event) => {
        const data = await event.request.formData();

        const type = data.get('type') as string;
        let amount = data.get('amount') as string;
        if (type === 'withdraw') {
            amount = '-' + amount;
        }

        const sum = {
            value: amount,
            currency: 'CZK',
        }
        const tillId = Number(data.get('tillId') as string);

        await database.updateBalanceTransaction(
            tillId,
            sum,
            type as 'cash-payment' | 'withdraw' | 'deposit', 
        );

        return {success: true};
    }
} satisfies Actions;

