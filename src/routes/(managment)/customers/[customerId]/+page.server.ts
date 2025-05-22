import { database } from '$lib/server/db/db';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const customerId = Number(params.customerId);
    const customer = await database.fetchCustomer(customerId);
    if (!customer) {
        throw new Error('Customer not found');
    }
    return { customer };
};

// Payment action for customer debt/topup
// export const actions: Actions = {
//     topUp: async ({ params, request }) => {
//         const customerId = Number(params.customerId);
//         const { amount, type } = await request.json();

//         if (isNaN(customerId) || !amount) {
//             return new Response('Invalid input', { status: 400 });
//         }

//         // Call your DB handler to process the payment
//         await database.processCustomerDeposit(
//             customerId,
//             { value: amount.toString(), currency: 'CZK' },
//             type // TransactionType, e.g. 'cash' or 'qr'
//         );

//         return new Response('OK', { status: 200 });
//     }
// };