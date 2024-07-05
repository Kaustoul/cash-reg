<script lang="ts">
    import ChevronDownIcon from 'svelte-material-icons/ChevronDown.svelte';
    import ChevronUpIcon from 'svelte-material-icons/ChevronUp.svelte';
    import type { IOrder } from '$lib/shared/interfaces/order';
    import { formatSum } from '$lib/shared/utils/money-sum-utils';
    import { fullItemId } from "$lib/shared/utils/item-utils";
    import { formatPrice } from "$lib/shared/utils";

    export let order: IOrder;
    let isOpen: boolean = false;
    console.log(order);

    async function fetchOrderDetail(): Promise<void> {

    }

    function formatTime(date: Date): string {
        const hours = date.getHours().toString(); 
        const minutes = date.getMinutes().toString().padStart(2, '0'); 
        return `${hours}:${minutes}`;
    }
</script>

<div class="order">
    <div class={`${isOpen ? 'open ' : ''}order-header`}>
        <span class="orderId">{order.orderId}</span>
        <span class="tillId">{order.tillId}</span>
        <span class="itemsAmount">{Object.keys(order.items).length}</span>
        <span class="total">{formatSum(order.total)}</span>
        <span class="paymentType">{order.paymentType}</span>
        <span class="note">{order.note ?? '-'}</span>
        <span class="time">{formatTime(order.createdAt)}</span>
        <div>
            {#if isOpen}
                <button class="show" on:click={() => isOpen = false}>
                    <ChevronUpIcon size={"3rem"}/>
                </button>
            {:else}
                <button class="show" on:click={() => isOpen = true}>
                    <ChevronDownIcon size={"3rem"}/>
                </button>
            {/if}
        </div>
    </div>
    {#if isOpen}
        <div class="order-detail">
            {#each order.items as item}
                    <div class="order-item">
                        <span class="item-id">{item.fullId}</span>
                        <span class="name">{item.name}</span>
                        <span class="price">{formatPrice(item.price)}</span>
                        <span class="quantity">{item.quantity}</span>
                    </div>
            {/each}
        </div>
    {/if}
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;

    .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        background-color: vars.$primary-color;
        padding: .5rem 1rem;
        border-radius: vars.$medium-radius;
        margin-right: 1rem;


        & > * {
            flex-basis: 12%;
            display: flex;
            justify-content: center;
        }

        &.open {
            background-color: vars.$second-accent-color;
            border-radius: vars.$medium-radius vars.$medium-radius 0 0;
        }
    }

    .order-detail {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        margin-right: 1rem;
        background-color: vars.$primary-color;

        & > * {
            display: flex;
            justify-content: space-between;
        }
    }

    .show {
        @include buttons.div-btn;
    }
</style>
