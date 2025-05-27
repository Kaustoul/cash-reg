import { database } from '$lib/server/db/db';
import { getUserAndOpenSession } from '$lib/server/utils/session-utils';
import type { IDiscount } from '$lib/shared/interfaces/discount';
import type { PageServerLoad, Actions } from './$types';
import { fail, json } from '@sveltejs/kit';

export const actions: Actions = {
    async editCustomer({ params, request, cookies }) {
        console.log('Editing customer action started');
        const { user } = await getUserAndOpenSession(cookies);
        if (!user) {
            return fail(401, { error: 'Unauthorized' });
        }

        const customerId = Number(params.customerId);
        if (!customerId) return fail(400, { error: 'Invalid customer ID' });

        const form = await request.formData();
        const name = form.get('name')?.toString().trim();
        const surname = form.get('surname')?.toString().trim();
        const email = form.get('email')?.toString().trim();
        const discount = form.get('discount')?.toString().trim();

        // Prepare discount object if present
        let discountObj: IDiscount | null | undefined = undefined;
        if (discount) {
            if (isNaN(Number(discount))) {
                return fail(400, { error: 'Sleva musí být číslo.' });
            }
            
            if (discount.trim() === "")
                discountObj = null;

            discountObj = {
                value: discount,
                type: "PRC",
                source: "customer"
            };
        }

        console.log('Editing customer:', {
            customerId,
            data: { name, surname, email, discount: discountObj}
        });

        // Fetch current customer
        const customer = await database.fetchCustomer(customerId);
        if (!customer) return fail(404, { error: 'Zákazník nenalezen.' });

        // Update customer object
        const updatedCustomer = {
            name,
            surname,
            email,
            discount: discountObj
        };

        await database.updateCustomer(customerId, updatedCustomer);

        return { success: true };
    }
};
