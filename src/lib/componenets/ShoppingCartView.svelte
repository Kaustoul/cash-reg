<script lang="ts">
    import { onMount } from 'svelte';
    import { formatDate } from '$lib/shared/utils/date-utils';
    import type { IShoppingCart, IShoppingCartItem } from '$lib/shared/interfaces/shopping-cart';
    import { parseFullItemId } from '$lib/shared/utils/item-utils';
    import Decimal from 'decimal.js';
    import { CurrencyManager } from '$lib/shared/prices/currency-manager';
    import { updateItemQuantity } from '$lib/shared/utils/shopping-cart-utils';

    export let cart: IShoppingCart; 

    let time: string = "";
    let showDate: boolean = true; 

    onMount(() => {
        time = formatDate(new Date());

		const interval = setInterval(() => {
			time = formatDate(new Date());
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});

    $:console.log(cart);

   Decimal.set({ precision: 2, rounding: Decimal.ROUND_HALF_UP, defaults: true});
    
    function getPrice(item: IShoppingCartItem): string {
        const prices = item.prices
        const idx = item.priceIdx;
        return new Decimal(prices[idx].value.value).toFixed(2);
    }

    function newQuantity(item: IShoppingCartItem, quantity: Decimal): void {
        updateItemQuantity(cart, item, quantity);

        // force svelte to reload cart components
        cart = cart;
    }

    function onQunatityInput(item: IShoppingCartItem, event: any): void {
        if (event.target === null || event.target.value === "") {
            return;
        }

        const value = event.target.value;
        const quantity = new Decimal(value);
        newQuantity(item, quantity);
    }

    function handleFocus(event: any): void {
        event.target.select();
    }

</script>

<div class="container">
    <div class="header">
        {#if showDate}
            <span class="date">
                {time}
            </span>
        {/if}
        <input class="checkbox" type="checkbox" id="view-date" bind:checked={showDate}/>
    </div>
    <div class="cart">
    {#if cart.total[CurrencyManager.getDefaultCurrency().getCode()] !== undefined}
        <div class="total-bar">
            <span class="total-title">SUMA</span>
            <span class="total-price">
                {cart.total[CurrencyManager.getDefaultCurrency().getCode()].value}
            </span>
        </div>
    {:else}
        <div class="empty-total-bar">
        </div>
    {/if}

        <div class="items">
            {#each cart.items as item}
                <div class="item">
                    <div class="quantity">
                        <button type="button" class="minus" 
                            on:click={() => newQuantity(item, item.quantity.sub(1))}
                        >-</button>
                        <div class="vline"></div>
                        <input type="number" class="quantity-input" value={item.quantity} 
                            on:input={(e) => onQunatityInput(item, e)}
                            on:focus={handleFocus}
                        />
                        <div class="vline"></div>
                        <button type="button" class="plus"
                            on:click={() => newQuantity(item, item.quantity.add(1))}
                        >+</button>
                    </div>
                    <div class="item-info">
                        <span class="item-name">{item.name}</span>
                        <span class="item-id">{parseFullItemId(item.productId, item.itemId)}</span>
                    </div>
                    <div class="item-price">
                        {#if item.quantity && item.quantity.gt(1) }
                            <span class="single-price">{getPrice(item)}</span>
                        {:else if item.unit !== 'ks'}
                            <span class="single-price">{getPrice(item)}{item.unit}</span>
                        {/if}
                        <span class="total-price">{item.total.toFixed(2).toString()}</span>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;

    .container {
        display: flex;
        flex-direction: column;
    }

    .header {
        display: flex;
        justify-content: end;
        align-items: end;

        background-color: vars.$bg-color;
        flex-grow: 1;
        min-height: 2rem;

        input {
            margin-left: .5rem;
            margin-right: .5rem;
        }
    }

    .cart {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .total-bar {
        display: flex;
        justify-content: flex-end;
        align-items: stretch;
        gap: .25rem;
        background-color: vars.$bg-color;

        min-height: 4rem;

        .total-title, .total-price {
            display: flex;
            align-items: center;
            justify-content: end;

            background-color: vars.$accent-color;
            font-size: xx-large;
            font-weight: bold;
        }

        .total-title {
            flex: 1 0 70%;
            padding-right: 1rem;

            text-align: right;
        }

        .total-price {
            padding-right: 1rem;
            flex: 0 0 22%;
        }
    }

    .empty-total-bar {
        background-color: vars.$bg-color;
        min-height: 2rem;
        padding: 1rem;
    }

    .items {
        display: flex;
        flex-direction: column;
        gap: .3rem;
    }

    .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: .25rem;
    }

    $item-height: 3rem;
    $item-vpadding: .3rem;
    .quantity {
        height: $item-height;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 0 0 10%;
        padding: $item-vpadding;

        background-color: vars.$primary-color;
        border-radius: vars.$medium-radius;

        .quantity-input {
            @include inputs.number;
            margin: 0;
            width: 2rem;
            text-align: center;
        }

        .minus, .plus {
            @include buttons.div-btn;
            cursor: pointer;
            font-size: 2rem;
            border-radius: vars.$large-radius;
            font-family: 'Roboto Mono', monospace;
            padding: 0 .5rem;

            &:hover {
                background-color: lighten(vars.$primary-color, 10%);
            }
        }
    }
    
    .item-info {
        height: $item-height;
        flex: 1 1 70%;
        padding: $item-vpadding 1rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;
        
        background-color: vars.$primary-color;
        border-radius: vars.$medium-radius;

        .item-name {
            font-size: larger;
        }

        .item-id {
            color: vars.$text2-color;
        }
    }

    .item-price {
        height: $item-height;
        padding: $item-vpadding 1rem;
        
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: end;
        flex: 0 0 20%;

        background-color: vars.$primary-color;
        font-family: 'Roboto Mono', monospace;
        border-radius: vars.$medium-radius;

        .single-price {
            color: vars.$text2-color;
        }


        .total-price {
            font-size: x-large;
        }
    }


    .vline {
        height: 2.5rem;

        &::before {
            display: block;
            content: "";
            border-left: 2px solid vars.$accent-color;
            height: 100%;
        }
    }

    .checkbox {
    }


</style>
