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
    },

    startSession: async ({ request, cookies }) => {
        const data = await request.formData();
        const tillId = Number(data.get('tillId'));
        const userId = Number(cookies.get('userId')); 

        console.log('Starting session for till:', tillId, 'by user:', userId);
        // You may want to check if a session is already open for this till

        const tillSessionId = await database.newTillSession({
            tillId,
            cashierId: userId,
            type: 'OPEN'
        });

        console.log('New till session created with ID:', tillSessionId);

        cookies.set('tillSessionId', String(tillSessionId), { path: '/', httpOnly: true });
        
        return { success: true };
    },

    endSession: async ({ request, cookies }) => {
        const data = await request.formData();
        const userId = Number(cookies.get('userId'));
        const tillId = Number(data.get('tillId'));

        const tillSessionId = Number(cookies.get('tillSessionId'));

        const tillSession = await database.fetchTillSession(tillSessionId);
        if (!tillSession || tillSession.cashierId !== userId || tillSession.tillId !== tillId || tillSession.type !== 'OPEN') {
            return { success: false, error: 'Invalid session or user' };
        }

        // Close the till session
        await database.newTillSession({tillId, cashierId: userId, type: 'CLOSED'});
        
        cookies.delete('tillSessionId', { path: '/' });

        //set tillSessionId cookie
        return { success: true };
    }
} satisfies Actions;

