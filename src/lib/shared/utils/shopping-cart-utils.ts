import type { IShoppingCart, IShoppingCartItem } from '../interfaces/shopping-cart';
import { areConditionsMet } from './condition-utils';

export function addItemToCart(cart: IShoppingCart, item: IShoppingCartItem): void {
    const existingItem = cart.items.find(i => i.productId === item.productId && i.itemId === item.itemId);
    if (existingItem) {
        existingItem.quantity = existingItem.quantity.plus(item.quantity);
        updateCartItemPrice(item);
    } else {
        cart.items.push(item);
        updateCartItemPrice(item);
    }
}

export function updateCartItemPrice(item : IShoppingCartItem): void {
    for (let i = 0; i < item.prices.length; i++) {
        const price = item.prices[i];
        if (areConditionsMet(price.conditions, item)) {
            item.priceIdx = i;
            return;
        }
    } 

    throw new Error(`No price found for item ${item.name}`);
}

