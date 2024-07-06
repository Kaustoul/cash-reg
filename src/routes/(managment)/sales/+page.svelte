<script lang="ts">
    import type { PageData } from './$types';
    import ViewTitle from '$lib/ViewTitle.svelte';
    import { DatePicker } from '@svelte-plugins/datepicker';
    import { format } from 'date-fns';
    import { applyAction, deserialize } from '$app/forms';
    import type { ActionResult } from '@sveltejs/kit';
    import OrderItem from '$lib/componenets/OrderItem.svelte';

    export let data: PageData;
    let startDate = new Date();
    let dateFormat = 'd.M.yyyy';
    let isDatePickerOpen = false;

    let orders = data.orders;

    console.log(data);

    const toggleDatePicker = () => (isDatePickerOpen = !isDatePickerOpen);

    const formatDate = (date: Date): string => {
        return date && format(new Date(date), dateFormat) || '';
    };

    let formattedStartDate = formatDate(startDate);

    const onChange = async () => {
        const formData = new FormData();
        formData.set('date', startDate.toString());
        const res = await fetch('?/fetchOrders', {
            method: 'POST',
            body: formData
        })

        const result: ActionResult = deserialize(await res.text());
        if (result.type !== 'success' || !result.data || !result.data.orders) {
            console.error('Failed to fetch orders');
            return;
        }

        orders = result.data.orders;
        applyAction(result);
    };

    $: formattedStartDate = formatDate(startDate);
</script>

<ViewTitle title="Prodeje" />
<div class="controls">
    <DatePicker bind:isOpen={isDatePickerOpen} bind:startDate onDayClick={onChange}>
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

<div class="orders-list">
    <div class="header">
        <span>Číslo objednávky</span>
        <span>Číslo pokladny</span>
        <span>Počet položek</span>
        <span>Suma</span>
        <span>Druh platby</span>
        <span>Poznámka</span>
        <span>Čas</span>
        <div class="spacer" />
    </div>
    {#each orders as order}
        <OrderItem {order} />
    {/each}
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;

    .controls {
        display: flex;
        justify-content: end;
        gap: 1rem;
        margin: 1rem;
        
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
            font-weight: bold;
            padding: 1rem 1rem;

            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-right: 1rem;


            & > * {
                flex-basis: 12%;
                display: flex;
                justify-content: center;
            }
        }
    }
</style>
