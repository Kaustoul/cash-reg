<script lang="ts">
    import { onMount } from 'svelte';
    import { formatDate } from '$lib/shared/utils/date-utils';
    import type { IShoppingCart } from '$lib/shared/interfaces/shopping-cart';
    import { parseFullItemId } from '$lib/shared/utils/item-utils';

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
        <div class="total-bar">
    
        </div>

        <div class="items">
            {#each cart.items as item}
                <div class="item">
                    <div class="quantity">
                        <button type="button" class="plus">+</button>
                        <input type="number" bind:value={item.quantity} />
                        <button type="button" class="minus">-</button>
                    </div>
                    <div class="item-info">
                        <span class="item-name">{item.name}</span>
                        <span class="item-id">{parseFullItemId(item.productId, item.itemId)}</span>
                    </div>
                    <div class="item-price">

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
        background-color: vars.$accent-color;
        padding: 1rem;
        min-height: 2rem;
    }

    .checkbox {
    }
</style>
