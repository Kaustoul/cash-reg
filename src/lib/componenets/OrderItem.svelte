<script lang="ts">
    import ChevronDownIcon from 'svelte-material-icons/ChevronDown.svelte';
    import ChevronUpIcon from 'svelte-material-icons/ChevronUp.svelte';
    import CheckIcon from 'svelte-material-icons/Check.svelte';
    import CloseIcon from 'svelte-material-icons/Close.svelte';     
    import AccountIcon from 'svelte-material-icons/Account.svelte';
    import CashIcon from 'svelte-material-icons/Cash.svelte';       
    import QrcodeIcon from 'svelte-material-icons/Qrcode.svelte';    
    import CreditCardIcon from 'svelte-material-icons/CreditCard.svelte';
    import type { IOrder } from '$lib/shared/interfaces/order';
    import { formatSum } from '$lib/shared/utils/money-sum-utils';
    import { formatPrice, formatDecimal } from "$lib/shared/utils";
    import { formatDate } from "$lib/shared/utils/date-utils";

    export let order: IOrder;
    export let isOpen: boolean = false;
    export let orderIdParam: number = -1;
    console.log(order);

    // function formatTime(date: Date): string {
    //     const hours = date.getHours().toString(); 
    //     const minutes = date.getMinutes().toString().padStart(2, '0'); 
    //     return `${hours}:${minutes}`;
    // }

    function scrollIntoView(node, shouldScroll) {
        if (shouldScroll) {
            setTimeout(() => {
                node.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center',
                    inline: 'nearest'
                });
            }, 100); // Delay to ensure the DOM is updated
        }
    }
</script>

<div class="order {"order-" + order.orderId}" use:scrollIntoView={order.orderId === orderIdParam}>
    <div class={`${isOpen ? 'open ' : ''}order-header`}>
        <span class="orderId">{order.orderId}</span>
        <span class="tillId">{order.tillId}/{order.cashierId}</span>
        <span class="customerId">{order.customerId ?? "-"}</span>
        <span class="itemsAmount">{Object.keys(order.items).length}</span>
        <span class="total">{formatSum(order.total)}</span>
        <span class="paymentType">
            {#if order.paymentType === 'cash'}
                <CashIcon size={"2rem"}/>
            {:else if order.paymentType === 'card'}
                <CreditCardIcon size={"2rem"}/>
            {:else if order.paymentType === 'qr'}
                <QrcodeIcon size={"2rem"}/>
            {:else if order.paymentType === 'account'}
                <AccountIcon size={"2rem"}/>
            {/if}
            <!-- {order.paymentType} -->
        </span>
        <span class="paymentStatus">
            {#if order.transactionId}
                <CheckIcon size={"2rem"} color={"green"}/>
            {:else}
                <CloseIcon size={"2rem"} color={"red"}/>
            {/if}
        </span>
        <div class="time">
            <span class="date-date">
                {formatDate(order.createdAt, {date: true})}
            </span>
            <span class="date-time">
                {formatDate(order.createdAt, {time: true})}
            </span>
        </div>
        <span class="note">
                {#if order.note}
                    <CheckIcon size={"2rem"}/>
                {:else}
                    <CloseIcon size={"2rem"}/>
                {/if}
        </span>

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
            <div class="order-item-header">
                <span class="itemId-title">ID</span>
                <span class="name-title">Název</span>
                <span class="price-title">Cena</span>
                <span class="quantity-title">Množství</span>
                <span class="item-total-title">Suma</span>
            </div>
            <hr class="section-divider gray">

            {#each order.items as item}
            <div class="order-item">
                <span class="itemId gray">{item.fullId}</span>
                <span class="name">{item.name}</span>
                <span class="price">{formatPrice(item.price) + " Kč"}</span>
                <span class="quantity">{item.quantity}</span>
                <span class="item-total">{item.subtotal} Kč</span>
            </div>
            {/each}
            <hr class="section-divider gray">
            
            {#if order.discounts}
                <div class="order-item order-subtotal">
                    <span class="itemId spacer"></span>
                    <span class="name">Suma</span>
                    <span class="">{formatSum(order.subtotal)}</span>
                </div>
                    {#each order.discounts as discount}
                        <div class="order-item order-discount gray">
                            <span class="itemId spacer"></span>
                            <span class="name">Sleva 
                                {#if discount.source === "customer"}
                                    (Zákazník)
                                {:else if discount.source === "till"}
                                    (Pokladna)
                                {:else}
                                    {discount.source}
                                {/if}
                                {formatDecimal(discount.value) + (discount.type === "PRC" ? "%" : " Kč")}
                            </span>
                            <span class="order-discount-value">
                                - {formatDecimal(discount.subtotal ?? "NaN")} Kč
                            </span>
                        </div>
                    {/each}
                    <hr class="section-divider">
                {/if}    
                    <div class="order-item order-total">
                        <span class="itemId spacer"></span>
                        <span class="name">Celkem</span>
                        <span class="order-total">{formatSum(order.total)}</span>
                    </div>
                {#if order.note}
                    <hr class="section-divider gray">
                    <div class="order-note">
                        <span class="note-title">Poznámka:</span>
                        <span class="note-content">{order.note}</span>
                    </div>
                {/if}
            </div>
    {/if}
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;
    @use '$lib/styles/text-styles' as textStyles;

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

    .gray {
        color: vars.$text2-color;
    }
    
    .orderId, .customerId, .tillId, .itemsAmount, .paymentType, .isPaid, .note {
        @include textStyles.mono-font;

        flex: 0 1 8%;
    }

    .total {
        @include textStyles.mono-font;
    }

    .total, .time {
        flex: 1 0 12%;
    }

    .time {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        font-size: vars.$normal;
    }

    .itemsAmount {
        color: vars.$accent-color;
        font-weight: bold;
    }


    .show {
        @include buttons.div-btn;
    }

    .order-detail {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        margin-right: 1rem;
        background-color: vars.$primary-color;
        border-radius: 0 0 vars.$medium-radius vars.$medium-radius;
        padding: 1rem 2rem 2rem 2rem;

        text-align: left;
    }

    .order-item-header {
        display: flex;
        justify-content: space-between;
        // align-items: center;
        text-align: left;
        gap: 1rem;
        color: vars.$text2-color;
    }

    .order-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }

    .order-subtotal {
        font-size: vars.$larger;
        color: vars.$accent-color;

        @include textStyles.mono-font;
    }

    .order-total {
        color: vars.$accent-color;
        font-size: vars.$large;
        font-weight: bold;

        @include textStyles.mono-font;
    }

    .itemId, .price, .quantity, .itemId-title, .price-title, .quantity-title, .item-total, .item-total-title {
        flex: 0 1 10%;
        display: flex;
        justify-content: center;
    }

    .itemId-title, .name-title, .price-title, .quantity-title, .item-total-title {
        flex: 0 1 10%;
        font-weight: bold;
    }

    .item-total-title, .item-total {
        justify-content: flex-end;
    }

    .name, .name-title {
        flex: 1 0 30%;
        display: flex;
    }

    .price, .quantity, .itemId {
        @include textStyles.mono-font;
    }

    .name{
        justify-content: flex-start;
    }

    .itemId, .itemId-title {
        flex: 0 1 7%;

        justify-content: flex-end;
    }

    .itemId-title {
        justify-content: center;
    }

    .order-note {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        font-size: vars.$normal;
        margin-top: 1rem;
        
        .note-title {
            color: vars.$text2-color;
            font-weight: bold;
        }

        .note-content {
            font-style: italic;
        }
    }


    .section-divider {
        border: none;
        border-bottom: 2px solid vars.$second-accent-color;
        margin: .5rem 0;

        &.gray {
            border-color: vars.$text-disabled-color;
        }
    }
</style>
