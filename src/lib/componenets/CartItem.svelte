<script lang="ts">
    import type { IShoppingCart, IShoppingCartItem } from "$lib/shared/interfaces/shopping-cart";
    import { parseFullItemId } from "$lib/shared/utils/item-utils";
    import Decimal from "decimal.js";
    import CloseIcon from "svelte-material-icons/Close.svelte";
    import GrowableInput from "./interactables/GrowableInput.svelte";
    import { formatDecimal, formatPrice } from "$lib/shared/utils";
    import { CurrencyManager } from '$lib/shared/prices/currency-manager'

    export let item: IShoppingCartItem;
    export let isSelected: boolean;
    export let state: IShoppingCart["state"];
    export let onClick: (item: IShoppingCartItem) => void;
    export let onQuantityChange: (item: IShoppingCartItem, quantity: Decimal) => void;
    export let onRemove: (item: IShoppingCartItem) => void;

    function onQunatityInput(item: IShoppingCartItem, event: any): void {
        if (event.target === null || event.target.value === "") {
            return;
        }

        const value = event.target.value;
        const quantity = new Decimal(value);
        onQuantityChange(item, quantity);
    }
</script>

<div class={"item" + (isSelected ? " selected" : "")}
    
>
    <div class="quantity">
        {#if isSelected}
            <button type="button" class="remove-item"
                on:click|stopPropagation={() => onRemove(item)}
            >
                <CloseIcon size="3rem"/>
            </button>
        {:else if state === "checkout"}
            <span class="quantity-value">{item.quantity.toString()}{item.unit !== "ks" ? item.unit : ""}</span>
        {:else if item.unit === 'ks'}
            <button type="button" class="minus" 
                on:click|stopPropagation={() => onQuantityChange(item, item.quantity.sub(1))}
            >-</button>
            <div class="vline"></div>
            <GrowableInput value={item.quantity.toString()} onChange={(e) => onQunatityInput(item, e)}
                minWidth="3rem"
            />  
            <div class="vline"></div>
            <button type="button" class="plus"
                on:click|stopPropagation={() => onQuantityChange(item, item.quantity.add(1))}
            >+</button>
        {:else}
            <GrowableInput value={item.quantity.toString()} onChange={(e) => onQunatityInput(item, e)}/> 
            <span class="quantity-input-unit">{item.unit}</span>
        {/if}
    </div>

    <button type="button" class="item-info"
        on:click={() => onClick(item)}
    >
        <span class="item-name">{item.name}</span>
    <div class="item-subtitle">
        <span class="item-id">{parseFullItemId(item.productId, item.itemId)}</span>
        <div class="item-discounts">
            {#if item.discounts !== undefined}
                {#each item.discounts as discount}
                    <span class="item-discount">
                        Sleva
                        {#if discount.type === "PRC"}
                            {formatDecimal(new Decimal(discount.value), true)}%
                        {/if}
                    </span>
                {/each}
            {/if}
        </div>
    </div>
    </button>

    <button type="button" class="item-price"
        on:click={() => onClick(item)}
    >
        
        {#if item.unit !== 'ks'}
            <span class="single-price">{formatPrice(item.prices[item.priceIdx])}/{item.unit}</span>
        {:else if item.quantity && item.quantity.gt(1) }
            <span class="single-price">{formatPrice(item.prices[item.priceIdx])}</span>
        {/if}
        {#if item.discounts !== undefined}
            <span class="subtotal-price">{formatDecimal(item.subtotal, true)}</span>
            {#each item.discounts as discount}
                <span class="item-discount-value">
                    { #if discount.subtotal !== undefined } 
                        -{formatDecimal(discount.subtotal, true)}
                    {/if}
                </span>
            {/each}
        {/if}
        <span class="total-price">{formatDecimal(item.total, true)}</span>
        
    </button>
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;

    .item {
        @include buttons.div-btn;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: .25rem;

        &.selected > * {
            background-color: vars.$second-accent-color;
        }
    }

    $item-height: 3.6rem;
    $item-vpadding: .3rem;
    .quantity {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 9rem;
        min-height: $item-height;
        font-size: vars.$larger;
        background-color: vars.$primary-color;
        border-radius: vars.$medium-radius;

        .quantity-input {
            @include inputs.number;
            margin: 0;
            width: 3rem;
            text-align: center;
            font-size: vars.$larger;

            &.unit {
                padding: 0;
                text-align: right;
            }
        }
        
        .quantity-input-unit, .quantity-value, & > .input {
                font-family: 'Roboto Mono', monospace;
            }

        .minus, .plus {
            @include buttons.div-btn;
            cursor: pointer;
            font-size: vars.$large;
            border-radius: vars.$large-radius;
            font-family: 'Roboto Mono', monospace;
            padding: 0 .7rem;

            &:hover {
                background-color: lighten(vars.$primary-color, 10%);
            }
        }

        .remove-item {
            @include buttons.div-btn;
            cursor: pointer;
            color: vars.$red;
    
        }
    }
    
    .item-info {
        @include buttons.div-btn;

        height: 100%;
        flex: 1 1 70%;
        padding: $item-vpadding 1rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;
        text-align: left;
        
        background-color: vars.$primary-color;
        border-radius: vars.$medium-radius;

        .item-name {
            font-size: vars.$normal;
        }

        .item-id {
            color: vars.$text2-color;
            font-size: vars.$smaller;
        }

        .item-subtitle {
            display: flex;
            width: 100%;
            justify-content: space-between;
            align-items: start;

            .item-discounts {
                display: flex;
                flex-direction: column;
                align-items: end;

                font-size: vars.$smaller;
                color: vars.$text2-color;
            }
        }
    }

    .item-price {
        @include buttons.div-btn();
        cursor: pointer;

        height: 100%;
        padding: $item-vpadding 1rem;
        
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: end;
        flex: 0 0 25%;

        background-color: vars.$primary-color;
        font-family: 'Roboto Mono', monospace;
        border-radius: vars.$medium-radius;

        .single-price {
            color: vars.$text2-color;
        }


        .total-price {
            font-size: vars.$larger;
        }

        .subtotal-price {
            font-size: vars.$normal;
            color: vars.$text2-color;
        }

        .item-discount-value {
            font-size: vars.$smaller;
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

</style>
