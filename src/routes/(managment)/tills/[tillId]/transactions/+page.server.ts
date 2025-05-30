import type { PageServerLoad } from './$types';
import { database } from '$lib/server/db/db';
import { format } from 'date-fns';
import type { ITransaction } from '$lib/shared/interfaces/transaction';

export const load: PageServerLoad = async ({ params }) => {
    const tillId = Number(params.tillId);
    const transactions = await database.fetchTillTransactions(tillId);

    // For each purchase transaction, try to find the orderId
    const withOrderId = await Promise.all(transactions.map(async tx => {
        let orderId: number | null = null;
        if (tx.reason === "purchase") {
            const order = await database.fetchOrderByTransactionId(tx.transactionId);
            orderId = order?.orderId ?? null;
        }
        return { ...tx, orderId };
    }));

    const formattedTransactions = []

    for (const tx of withOrderId) {
    
        const cashierId = await database.fetchUserIdByTillSessionId(tx.tillSessionId);
        
        formattedTransactions.push({
            id: tx.transactionId,
            createdAt: format(new Date(tx.createdAt), 'd.M.yyyy H:mm'),
            tillSessionId: tx.tillSessionId,
            cashierId,
            type: tx.paymentType,
            reason: tx.reason,
            amount: tx.amount,
            orderId: tx.orderId,
            orderDate: tx.createdAt // for deep-linking
        });
    }

    return {
        tillId,
        tillDisplayName: null,
        transactions: formattedTransactions
    };
};