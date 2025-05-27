import { database } from '$lib/server/db/db';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { IMoneySum } from '$lib/shared/interfaces/money-sum';
import type { Transaction } from 'electron';
import type { TransactionReason, TransactionType } from '$lib/shared/interfaces/transaction';
import { fetchAndHasPermission, getUserAndOpenSession } from '$lib/server/utils/session-utils';

export const load: PageServerLoad = async () => {
    const res = await database.fetchTills();
    return {tills: res};
}

export const actions = {
    newTill: async ({request, cookies}) => {
        const { user, tillSession } = await getUserAndOpenSession(cookies);
        if (!user || await !fetchAndHasPermission(user, "tabs.tills.admin")) {
            return { success: false, error: 'Not logged in or no permission' };
        }

        const res = await database.newTill();
        return {success: res};
    },

    moneyTransfer: async ({request, cookies}) => {
        const { user, tillSession } = await getUserAndOpenSession(cookies);
        
        if (!user || !tillSession) {
            return { success: false, error: 'Not logged in or no open till session' };
        }
        
        const data = await request.formData();
        const tillId = Number(data.get('tillId') as string);

        if (tillId !== tillSession.tillId) {
            return { success: false, error: 'Invalid till ID' };
        }

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

        await database.updateBalanceTransaction(
            tillSession.tillSessionId,
            sum,
            reason, 
            type,
        );

        return {success: true};
    },

    startSession: async ({ request, cookies }) => {
        const { user, tillSession } = await getUserAndOpenSession(cookies);

        if (!user) {
            return { success: false, error: 'Not logged in' };
        }

        if (tillSession) {
            return { success: false, error: 'Till session already open' };
        }

        const data = await request.formData();
        const tillId = Number(data.get('tillId'));
        const userId = Number(cookies.get('userId')); 

        const tillSessionId = await database.newTillSession({
            tillId,
            cashierId: userId,
            type: 'OPEN'
        });

        cookies.set('tillSessionId', String(tillSessionId), { path: '/', httpOnly: true });

        return { success: true };
    },

    endSession: async ({ request, cookies }) => {
        const { user, tillSession } = await getUserAndOpenSession(cookies);
        if (!user || !tillSession) {
            return { success: false, error: 'Not logged in or no open till session' };
        }
        
        await database.newTillSession({tillId: tillSession.tillId, cashierId: tillSession.cashierId, type: 'CLOSED'});
        cookies.delete('tillSessionId', { path: '/' });

        return { success: true };
    }
} satisfies Actions;

