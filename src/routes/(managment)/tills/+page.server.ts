import { database } from '$lib/server/db/db';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { IMoneySum } from '$lib/shared/interfaces/money-sum';
import type { Transaction } from 'electron';
import type { TransactionReason, TransactionType } from '$lib/shared/interfaces/transaction';

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

        const reason = data.get('reason') as TransactionReason;
        const type = data.get('type') as TransactionType;
        let amount = data.get('amount') as string;
        if (reason === 'withdraw') {
            amount = '-' + amount;
        }

        const sum = {
            value: amount,
            currency: 'CZK',
        }
        const tillId = Number(data.get('tillId') as string);

        await database.updateBalanceTransaction(
            tillId,
            0,
            sum,
            reason, 
            type,
        );

        return {success: true};
    }
} satisfies Actions;

