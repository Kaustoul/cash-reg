<script lang="ts">
    import type { IShoppingCartItem } from "$lib/shared/interfaces/shopping-cart";
    import { parseFullItemId } from "$lib/shared/utils/item-utils";
    import Decimal from "decimal.js";
    import CloseIcon from "svelte-material-icons/Close.svelte";
    import GrowableInput from "./interactables/GrowableInput.svelte";

    export let item: IShoppingCartItem;
    export let isSelected: boolean;
    export let onClick: (item: IShoppingCartItem) => void;
    export let onQuantityChange: (item: IShoppingCartItem, quantity: Decimal) => void;
    export let onRemove: (item: IShoppingCartItem) => void;

    function getPrice(item: IShoppingCartItem): string {
        const prices = item.prices
        const idx = item.priceIdx;
        return new Decimal(prices[idx].value.value).toFixed(2);
    }

    function onQunatityInput(item: IShoppingCartItem, event: any): void {
        if (event.target === null || event.target.value === "") {
            return;
        }

        const value = event.target.value;
        const quantity = new Decimal(value);
        onQuantityChange(item, quantity);
    }
</script>

<button type="button" class={"item" + (isSelected ? " selected" : "")}
    on:click={() => onClick(item)}
>
    <div class="quantity">
        {#if isSelected}
            <button type="button" class="remove-item"
                on:click|stopPropagation={() => onRemove(item)}
            >
                <CloseIcon size="3rem"/>
            </button>
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
</button>

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

    $item-height: 3rem;
    $item-vpadding: .3rem;
    .quantity {
        height: $item-height;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 9rem;
        padding: $item-vpadding 0;

        background-color: vars.$primary-color;
        border-radius: vars.$medium-radius;

        .quantity-input {
            @include inputs.number;
            margin: 0;
            width: 3rem;
            text-align: center;

            &.unit {
                padding: 0;
                text-align: right;
            }
        }
        
        .quantity-input-unit {
                font-size: x-large;
                font-family: 'Roboto Mono', monospace;
            }

        .minus, .plus {
            @include buttons.div-btn;
            cursor: pointer;
            font-size: 2rem;
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
        height: $item-height;
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

</style>
