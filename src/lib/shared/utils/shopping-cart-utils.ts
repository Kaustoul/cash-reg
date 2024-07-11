import Decimal from 'decimal.js';
import type { IShoppingCart, IShoppingCartItem } from '../interfaces/shopping-cart';
import { areConditionsMet } from './condition-utils';
import { CurrencyManager } from '../prices/currency-manager';
import { formatDecimal } from '../utils';
import { applyDiscounts } from './discount-utils';

export function addItemToCart(cart: IShoppingCart, item: IShoppingCartItem): void {
    if (item.quantity.eq(-1)) {
        item.quantity = new Decimal(1);
    }

    const existingItem = cart.items.find(i => 
        i.productId === item.productId && i.itemId === item.itemId
    );

    if (existingItem) {
        existingItem.quantity = existingItem.quantity.plus(item.quantity);
        updateCartItemPrice(existingItem);
    } else {
        cart.items.unshift(item);
        updateCartItemPrice(item);
    }
   
    calculateCartTotal(cart);
}

export function calculateCartTotal(cart: IShoppingCart): void {
    cart.subtotal = cart.items.reduce((acc, item) => acc.plus(item.total), new Decimal(0));
    
    let total = cart.subtotal;
    if (cart.discounts !== undefined) {
        total = applyDiscounts(total, cart.discounts);
    }    
    
    const currency = CurrencyManager.getDefaultCurrency().getCode();
    cart.total[currency] = {
            value: total.toString(),
            currency: currency,
    };    

    console.log("calculated cart", cart);
}

export function updateItemQuantity(
    cart: IShoppingCart,
    item: IShoppingCartItem,
    newQuantity: Decimal
): void {
    item.quantity = newQuantity;
    updateCartItemPrice(item);
    calculateItemTotal(item);
    calculateCartTotal(cart);
}

export function calculateItemTotal(item: IShoppingCartItem): void {
    item.subtotal = item.quantity.times(getItemPrice(item));

    if (item.discounts !== undefined) {
        item.total = applyDiscounts(item.subtotal, item.discounts)
    } else {
        item.total = item.subtotal;
    }

    console.log("item price", item);
}

export function updateCartItemPrice(item : IShoppingCartItem): void {
    for (let i = 0; i < item.prices.length; i++) {
        const price = item.prices[i];
        if (areConditionsMet(price.conditions, item)) {
            item.priceIdx = i;
            calculateItemTotal(item);
            return;
        }
    } 

    throw new Error(`No price found for item ${item.name}`);
}

export function getItemPrice(item: IShoppingCartItem): Decimal {
    return new Decimal(item.prices[item.priceIdx].value.value);
}

export function removeItemFromCart(cart: IShoppingCart, item: IShoppingCartItem): void {
    const index = cart.items.findIndex(i => 
        i.productId === item.productId && i.itemId === item.itemId
    );

    if (index !== -1) {
        cart.items.splice(index, 1);
        calculateCartTotal(cart);
    }
}


