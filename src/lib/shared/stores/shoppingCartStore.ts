import { writable, get } from 'svelte/store';
import Decimal from 'decimal.js';
import type { IShoppingCart, IShoppingCartItem, ShoppingCartState } from '$lib/shared/interfaces/shopping-cart';
import { addItemToCart, removeItemFromCart, updateItemQuantity, calculateCartTotal } from '../utils/shopping-cart-utils';
import type { ShoppingCart } from '../till/shopping-cart';
import type { ICustomer } from '../interfaces/customer';

function createShoppingCartStore() {
    const { subscribe, set, update } = writable<{ carts: IShoppingCart[], selectedCart: number }>({
        carts: [emptyCart()],
        selectedCart: 0,
    });

    function emptyCart(): IShoppingCart {
        return {
            items: [],
            total: {},
            state: "items",
            checkout: { payedAmount: new Decimal(0) },
            tillId: 1,
            customerId: null,
        };
    }

    return {
        subscribe,
        addItem: (item: IShoppingCartItem) => update(store => {
            if (store.carts[store.selectedCart].items.length === 0) {
                store.carts.push(emptyCart());
            }

            addItemToCart(store.carts[store.selectedCart], item);
            return store;
        }),
        removeItem: (item: IShoppingCartItem) => update(store => {
            let cart = store.carts[store.selectedCart]
            removeItemFromCart(cart, item);

            // Remove empty cart
            if (cart.items.length === 0) {
                store.carts.splice(store.selectedCart, 1);
                store.selectedCart = 0; 
            }

            return store;
        }),
        finalizeCart: async () => {
            const store = get(shoppingCartStore);
            const cart = store.carts[store.selectedCart];
            
            if (!cart || cart.items.length === 0) {
                return;
            }

            const data = new FormData();
            data.set('cart', JSON.stringify(cart));
            await fetch('?/finalizeOrder', {
                method: 'POST',
                body: data
            });

            update(store => {
                store.carts.splice(store.selectedCart, 1);
                store.selectedCart = 0;

                if (store.carts.length === 0) {
                    store.carts.push(emptyCart());
                }

                return store;
            });
        },
        reset: () => set({ carts: [emptyCart()], selectedCart: 0 }),
        resetCart: (cartIdx: number = get(shoppingCartStore).selectedCart) => update(store => {
            store.carts[cartIdx] = emptyCart();
            return store;
        }),
        removeCart: (cartIdx: number = get(shoppingCartStore).selectedCart) => update(store => {
            store.carts.splice(cartIdx, 1);
            store.selectedCart = 0;

            if (store.carts.length === 0) { 
                store.carts.push(emptyCart());
            }

            return store;
        }),
        selectCart: (index: number) => update(store => {
            store.selectedCart = index;
            
            return store;
        }),
        createCart: (select: boolean) => update(store => {
            store.carts.push(emptyCart());

            if (select) {
                store.selectedCart = store.carts.length - 1;
            }

            return store;
        }),
        cancelPayment: () => update(store => {
            let cart = store.carts[store.selectedCart]
            cart.state = "checkout";
            cart.checkout.payedAmount = new Decimal(0);
            return store;
        }),
        goToCheckout: () => update(store => {
            store.carts[store.selectedCart].state = "checkout";
            return store;
        }),
        changeItemQuantity: (item: IShoppingCartItem, newQuantity: Decimal) => update(store => {
            if (newQuantity.lessThanOrEqualTo(0)) {
                return store;
            }

            updateItemQuantity(store.carts[store.selectedCart], item, newQuantity);
            return store;
        }),
        setState: (state: ShoppingCartState) => update(store => {
            store.carts[store.selectedCart].state = state;
            return store;
        }),
        cashPayment: () => update(store => {
            store.carts[store.selectedCart].state = "cash-payment";
            return store;
        }),
        cardPayment: () => update(store => {
            store.carts[store.selectedCart].state = "card-payment";
            return store;
        }),
        qrPayment: () => update(store => {
            store.carts[store.selectedCart].state = "qr-payment";
            return store;
        }),
        setCustomer: (customer: ICustomer | null) => update(store => {
            const cart = store.carts[store.selectedCart];
            cart.customerId = customer ? customer.customerId : null;

            // Remove any previous customer discount
            cart.discounts = (cart.discounts ?? []).filter(d => d.source !== "customer");

            if (customer && customer.discount && customer.discount.type === "PRC") {
                cart.discounts.push({
                    ...customer.discount,
                    source: "customer"
                });
            }

            // Recalculate cart total after changing discounts
            calculateCartTotal(cart);

            return store;
        }),
    };
}

export const shoppingCartStore = createShoppingCartStore();