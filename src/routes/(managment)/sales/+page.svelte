<script lang="ts">
    import type { PageData } from './$types';
    import ViewTitle from '$lib/ViewTitle.svelte';
    import { DatePicker } from '@svelte-plugins/datepicker';
    import { format, parse } from 'date-fns';
    import { applyAction, deserialize } from '$app/forms';
    import type { ActionResult } from '@sveltejs/kit';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import OrderList from '$lib/componenets/OrderList.svelte';
    import { viewTitleStore } from '$lib/shared/stores/workerStore';

    export let data: PageData;

    viewTitleStore.set({ title: "Prodeje" });

    let startDate: Date;
    let dateFormat = 'd.M.yyyy';
    let isDatePickerOpen = false;

    let orders = data.orders;

    const toggleDatePicker = () => (isDatePickerOpen = !isDatePickerOpen);

    const formatDate = (date: Date): string => {
        return date && format(new Date(date), dateFormat) || '';
    };

    let formattedStartDate: string;

    const onChange = async () => {
        // Format the date as 'd.M.yyyy'
        const formatted = format(startDate, 'd.M.yyyy');
        // Update the URL to only have the date param
        goto(`?date=${encodeURIComponent(formatted)}`, { replaceState: true, keepfocus: true, noscroll: true });

        // Fetch orders for the new date
        const formData = new FormData();
        formData.set('date', formatted);
        const res = await fetch('?/fetchOrders', {
            method: 'POST',
            body: formData
        });

        const result: ActionResult = deserialize(await res.text());
        if (result.type !== 'success' || !result.data || !result.data.orders) {
            console.error('Failed to fetch orders');
            return;
        }
        orders = result.data.orders;
        applyAction(result);
    };

    $: formattedStartDate = formatDate(startDate);

    let selectedOrderId: number | null = null;

    $: orderIdParam = $page.url.searchParams.get('orderId');
    $: dateParam = $page.url.searchParams.get('date');
    $: backArrowParam = $page.url.searchParams.get('backArrow');

    onMount(() => {
        if (orderIdParam) {
            selectedOrderId = Number(orderIdParam);
        }
        if (dateParam) {
            startDate = parse(dateParam, 'd.M.yyyy H:mm', new Date());
        } else {
            startDate = new Date();
        }
        formattedStartDate = formatDate(startDate)
        const showBackArrow = backArrowParam === "1";

        viewTitleStore.set({ title: "Prodeje", showBackArrow: showBackArrow });;
    });
</script>

<div class="controls">
    <DatePicker bind:isOpen={isDatePickerOpen} bind:startDate onDayClick={onChange} align={"right"}>
        <label for="date">Datum:
            <input type="text"
                class="date-input"
                placeholder="Select date" 
                bind:value={formattedStartDate} 
                on:click={toggleDatePicker} 
            />
        </label>

    </DatePicker>
</div>

<OrderList 
    orders={orders} 
    orderIdParam={orderIdParam} 
    selectedOrderId={selectedOrderId}
/>

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
