<script lang="ts">
    import OrderItem from './OrderItem.svelte';
    import type { IOrder } from '$lib/shared/interfaces/order';

    export let orders: IOrder[] = [];
    export let orderIdParam: string | undefined = undefined;
    export let selectedOrderId: number | undefined = undefined;
</script>

    
<div class="orders-list">
    <div class="header">
        <span class="orderId">Objednávka</span>
        <span class="tillId">Pokladna</span>
        <span class="cashierId">Zákazník</span>
        <span class="itemsAmount">Položek</span>
        <span class="total">Suma</span>
        <span class="paymentType">Druh platby</span>
        <span class="isPaid">Uhrazeno</span>
        <span class="time">Čas</span>
        <span class="note">Poznámka</span>
        <div class="spacer" />
    </div>
    {#if orders && orders.length > 0}
        {#each orders as order}
            <OrderItem {order} isOpen={order.orderId === selectedOrderId} orderIdParam={Number(orderIdParam)}/>
        {/each}
    {:else}
        <p>Žádné objednávky pro tento den.</p>
    {/if}
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;
    @use '$lib/styles/text-styles' as textStyles;

    .controls {
        display: flex;
        justify-content: end;
        gap: 1rem;
        margin: 0 1rem 1rem 1rem;
        
        label {
            font-size: vars.$large;
        }

        input {
            margin-left: 1rem;
            font-size: vars.$larger;
        }
    }

    .date-input {
        @include inputs.number;
        cursor: pointer;
        width: 9rem;
        text-align: center;
    }

    .orders-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        font-size: larger;
        @include inputs.scrollable;

        .header {

            position: sticky;
            top: 0;
            background-color: vars.$accent-color;
            // font-weight: bold;
            padding: 1rem;
            text-align: center;
            font-size: vars.$normal;

            display: flex;
            justify-content: space-between;
            align-items: center;

            margin-right: 1rem;
            // gap: 1rem;
        }

        .orderId, .cashierId, .tillId, .itemsAmount, .paymentType, .isPaid, .note {
            flex: 0 1 8%;
        }

        .total, .time {
            flex: 1 0 12%;
            max-width: 10rem;
        }

        .spacer {
            flex: 1 0 10%;
            max-width: 11rem;
        }
    }
</style>