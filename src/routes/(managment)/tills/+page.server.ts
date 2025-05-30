import { database } from '$lib/server/db/db';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { IMoneySum } from '$lib/shared/interfaces/money-sum';
import type { Transaction } from 'electron';
import type { TransactionReason, TransactionType } from '$lib/shared/interfaces/transaction';
import { fetchAndHasPermission, getUserAndOpenSession } from '$lib/server/utils/session-utils';
import { toBalance, toDefualtBalance, toJson } from '$lib/shared/utils/balance-utils';
import type { IFrontEndTill, IFrontEndTillData } from '$lib/shared/interfaces/till';

export const load: PageServerLoad = async ({ cookies }) => {
    const { user, tillSession } = await getUserAndOpenSession(cookies);
    if (!user ) {
        return { success: false, error: 'Not logged in or no open till session' };
    } 


    const res = await database.fetchTills();

    if (!res || res.length === 0) {
        return { tills: [], loggedIn: null };
    }

    const tills: IFrontEndTillData[] = []
    for (const till of res) {
        const session = await database.fetchLastSessionTill(till.id);
        const isOpen = session && session.type === 'OPEN';

        
        tills.push({
            id: till.id,
            name: till.name,
            balance: toJson(till.balance),
            cashierId: session?.cashierId ?? null,
            state: isOpen ? 'OPEN' : 'CLOSED',
            isUserLogggedIn: tillSession?.tillId === till.id,
        });
    }
    console.log('Loaded tills:', tills);

    return { tills: tills, loggedIn: tillSession?.tillId ?? null };
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
        const type = data.get('type') as TransactionType ?? 'cash';
        let amount = data.get('amount') as string;

        let balance = null;
        if (reason === 'withdraw') {
            balance = toDefualtBalance(amount, 'outgoing', type);
        } else if (reason === 'deposit') {
            balance = toDefualtBalance(amount, 'incoming', type);
        }

        if (!balance) {
            return { success: false, error: 'Invalid amount' };
        }

        await database.sumAndUpdateBalanceTransaction(
            tillSession.tillSessionId,
            toBalance(balance),
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

