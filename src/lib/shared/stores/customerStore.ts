import { writable } from 'svelte/store';
import type { ICustomer } from '../interfaces/customer';
import type { IMoneySum } from '../interfaces/money-sum';
import { sumMoneySums } from '../utils/money-sum-utils';

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
        reloadCustomer: async (customerId: number) => {
            const res = await fetch(`/api/customers/${customerId}`);
            if (res.ok) {
                const updatedCustomer: ICustomer = await res.json();
                update(customers =>
                    customers.map(c =>
                        c.customerId === updatedCustomer.customerId ? updatedCustomer : c
                    )
                );
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
        },
        calculateTotalBalance: (customer: ICustomer): IMoneySum[] => {
            // Sum balance and unpaidAmount by currency
            if (customer.balance !== null && customer.unpaidAmount === null) {
                return customer.balance;
            }

            if (customer.balance === null && customer.unpaidAmount !== null) {
                return customer.unpaidAmount;
            }

            if (customer.balance === null || customer.unpaidAmount === null) {
                return [];
            }

            let amounts: IMoneySum[][] = []
            amounts.push(customer.balance);
            amounts.push(customer.unpaidAmount);
            return sumMoneySums(amounts);
        },
    };
}

export const customerStore = createCustomerStore();