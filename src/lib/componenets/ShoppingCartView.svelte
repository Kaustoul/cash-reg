<script lang="ts">
    import { onMount } from 'svelte';
    import { formatDate } from '$lib/shared/utils/date-utils';
    import type { IShoppingCart, IShoppingCartItem } from '$lib/shared/interfaces/shopping-cart';
    import Decimal from 'decimal.js';
    import { CurrencyManager } from '$lib/shared/prices/currency-manager';
    import CartItem from './CartItem.svelte';
    import { formatDecimal, formatPrice } from '$lib/shared/utils';
    import type { ISettings } from '$lib/shared/interfaces/settings';
    import type { IDiscount } from '$lib/shared/interfaces/discount';
    import { shoppingCartStore } from '$lib/shared/stores/shoppingCartStore';

    $: ({ carts, selectedCart } = $shoppingCartStore);
    $: cart = carts[selectedCart];

    export let appSettings: ISettings;
    export let onDiscountPressed: (
        type: IDiscount['type'], 
        targetType: "cart" | "item",
        target: IShoppingCartItem | IShoppingCart
    )=> void;
    export let onNote: () => void;
    let selectedItem: IShoppingCartItem | null = null;

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

    function selectItem(item: IShoppingCartItem): void {
        if (cart.state === 'items') {
            selectedItem = selectedItem === item ? null : item;
        }
    }

    function goToCheckout(): void {
        if (selectedItem !== null) {
            selectedItem = null;
        }

        shoppingCartStore.goToCheckout();
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
        {#if cart.state === "checkout" || cart.total[CurrencyManager.getDefaultCurrency().getCode()] !== undefined }
            <div class="total-bar">
                <div class="total-info">
                    {#if cart.state === "checkout" && cart.discounts !== undefined }
                    <span class="subtotal-title">Před slevou</span>
                    {#each cart.discounts as discount}
                    <span class="total-discount-title">
                        Sleva
                                {#if discount.type === "PRC"}
                                    {discount.value}%
                                {/if}
                            </span>
                            {/each}
                    <span class="total-title">Celkem</span>        
                    {:else}
                        <span class="total-title padded">Celkem</span>
                    {/if}
                </div>
                <div class="total-value">
                        {#if cart.state === "checkout"}
                            <span class="total-subtotal">{formatDecimal(cart.subtotal.round())}</span>
                            {#if cart.discounts !== undefined}
                                {#each cart.discounts as discount}
                                    <span class="total-discount-value">
                                        {#if discount.subtotal !== undefined}
                                            -{formatDecimal(discount.subtotal)}
                                        {/if}
                                    </span>
                                {/each}
                                <span class="total-total">{formatDecimal(new Decimal(cart.total['CZK'].value).round())}</span>
                            {/if}
                        {:else}
                            <span class="total-total">{formatDecimal(new Decimal(cart.total[CurrencyManager.getDefaultCurrency().getCode()].value))}</span>
                        {/if}
                </div>
            </div>
        {:else}
            <div class="empty-total-bar">
            </div>
        {/if}
        <div class="items">
            {#each cart.items as item}
                <CartItem 
                    {item}
                    state={cart.state}
                    isSelected={selectedItem === item} 
                    onClick={selectItem}
                    onRemove={shoppingCartStore.removeItem}
                    onQuantityChange={shoppingCartStore.changeItemQuantity}
                />
            {/each}
        </div>
    {#if cart.items.length !== 0}
        <div class="buttons">
            {#if selectedItem !== null}
                <div class="on-selected-buttons">
                    <button type="button" class="btn"
                        on:click={() => { if (!selectedItem) return; onDiscountPressed("PRC", "item", selectedItem)}}
                    >Sleva %</button>
                    <button type="button" class="btn"
                        on:click={() => { if (!selectedItem) return; onDiscountPressed("CZK", "item", selectedItem)}}
                    >
                        Sleva {CurrencyManager.getDefaultCurrency().getSymbol()}
                    </button>
                    <button type="button" 
                        class={`${selectedItem.prices.length <= 1 ? 'disabled' : ''} 
                            btn disabled`
                        }
                    >
                    Vybrat cenu</button>
                </div>
            {/if}

            {#if cart.state === 'checkout'}
                <div class="checkout-actions">
                    <button type="button" class="btn"
                        on:click={() => onDiscountPressed("PRC", "cart", cart)}
                    >Sleva %</button>
                    <button type="button" class="btn"
                        on:click={() => onDiscountPressed("CZK", "cart", cart)}
                    >
                        Sleva {CurrencyManager.getDefaultCurrency().getSymbol()}
                    </button>
                    <button type="button" 
                        class="btn"
                        on:click={onNote}
                    >
                    Přidat poznámku</button>
                </div>
                <div class="checkout-buttons">
                    <button type="button" class="accent-btn btn"
                        on:click={shoppingCartStore.cashPayment}
                    >Hotovost</button>
                    <button type="button" class="second-accent-btn btn disabled"
                        on:click={shoppingCartStore.cardPayment}
                    >Karta</button>
                    {#if appSettings.sepaSettings.enabled}
                        <button type="button" class="blue-btn btn"
                            on:click={shoppingCartStore.qrPayment}
                        >QR platba</button>
                    {/if}
                </div>
            {:else}
                <button type="button" class="accent-btn payment-btn"
                    on:click={goToCheckout}
                >Platba</button>   
            {/if}
        </div>
    {/if}
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;

    .container {
        display: flex;
        flex-direction: column;
        height: 100%;
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

    .total-bar {
        display: flex;
        justify-content: flex-end;
        align-items: stretch;
        gap: .3rem;
        background-color: vars.$bg-color;
        font-family: 'Roboto Mono', monospace;

        .total-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1 0 70%;

            padding-right: 1rem;
            text-align: right;
            background-color: vars.$accent-color;

            .total-title, .total-total {
                font-size: vars.$large;
                font-weight: bold;

                &.padded {
                    padding: 1.1rem 0;
                }
            }
        }

        .total-value {
            display: flex;
            flex-direction: column;
            flex: 0 0 25%;
            justify-content: center;
            align-items: end;

            font-family: 'Roboto Mono', monospace;
            padding-right: 1rem;
            background-color: vars.$accent-color;

            .total-total {
                font-size: vars.$large;
                font-weight: bold;    
            }
        }

        .total-subtotal, .subtotal-title {
            font-size: vars.$larger;
        }
        
        .total-discount-value, .total-discount-title {
            font-size: vars.$normal;
            color: vars.$second-accent-color;
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
        padding: .5rem;

        height: 100%;

        @include inputs.scrollable;
    }

    .buttons {
        $btn-height: 4.5rem;
        display: flex;
        flex-direction: column;
        justify-content: end;
        background-color: vars.$bg-color;
        padding: 0 .5rem;

        .checkout-buttons {
            display: flex;
            justify-content: space-between;
            gap: .5rem;

            button {
                margin: 1rem 0;
            }
        }
    
        .accent-btn, .blue-btn, .second-accent-btn {
            margin: 1rem;

            font-size: xx-large;
            font-weight: bold;
        }
        
        .btn {
            @include buttons.btn($btn-color: vars.$primary-color, $btn-height: $btn-height);

            flex: 1 0 30%;
        }

        .accent-btn {
            @include buttons.btn($btn-color: vars.$accent-color, $btn-height: $btn-height);
        }

        .blue-btn {
            @include buttons.btn($btn-color: vars.$blue, $btn-height: $btn-height);
        }

        .second-accent-btn {
            @include buttons.btn($btn-color: vars.$second-accent-color, $btn-height: $btn-height);
        }

        .on-selected-buttons {
            display: flex;
            justify-content: center;
            gap: .5rem;
            margin: 1rem 1rem 0 1rem;


            button {
                @include buttons.btn($btn-color: vars.$primary-color, $btn-height: 4.5rem);
                font-size: x-large;
                flex: 1 0 30%;
            }
        }
    }

    .checkout-actions, .checkout-actions {
        display: flex;
        justify-content: space-between;
        gap: .5rem;
        margin-top: 1rem;

        
    }
</style>
