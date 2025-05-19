import { writable } from 'svelte/store';
import type { ICustomer } from '../interfaces/customer';

function createCustomerStore() {
    const { subscribe, set, update } = writable<ICustomer[]>([]);

    return {
        subscribe,
        set,
        update,
        load: async () => {
            const res = await fetch('/api/customers');
            if (res.ok) {
                set(await res.json());
            }
        },
        add: (customer: ICustomer) => update(customers => [...customers, customer]),
        updateCustomer: (updated: ICustomer) => update(customers =>
            customers.map(c => c.customerId === updated.customerId ? updated : c)
        ),
        getById: (id: number) => {
            let customer: ICustomer | undefined;
            const unsubscribe = subscribe(customers => {
                customer = customers.find(c => c.customerId === id);
            });
            unsubscribe();
            return customer;
        }
    };
}

export const customerStore = createCustomerStore();