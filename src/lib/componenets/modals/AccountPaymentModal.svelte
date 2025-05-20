<script lang="ts">
    import FullscreenModal from "./FullscreenModal.svelte";
    import { shoppingCartStore } from "$lib/shared/stores/shoppingCartStore";
    import { formatDecimal } from "$lib/shared/utils";
    import Decimal from "decimal.js";
    import { customerStore } from "$lib/shared/stores/customerStore";
    import { get } from "svelte/store";

    $: ({ carts, selectedCart } = $shoppingCartStore);
    $: cart = carts[selectedCart];

    // Find the customer info
    $: customer = cart.customerId
        ? get(customerStore).find(c => c.customerId === cart.customerId)
        : null;

    $: sum = cart?.total?.["CZK"] ? new Decimal(cart.total["CZK"].value) : new Decimal(0);

    function onConfirm() {
        shoppingCartStore.finalizeCart();
    }

    function onCancel() {
        shoppingCartStore.cancelPayment();
    }
</script>

<FullscreenModal showModal={true} onCancel={onCancel} onConfirm={onConfirm}>
    <div class="account-payment">
        <span class="title">Platba na účet zákazníka</span>
        <div class="content">
            {#if customer}
                <div class="customer-info">
                    <span class="customer-title">Zákazník:</span>
                    <span class="customer-name">{customer.name} {customer.surname}</span>
                    {#if customer.email}
                        <span class="customer-email">{customer.email}</span>
                    {/if}
                    <!-- <span class="customer-balance">
                        Aktuální dluh: 
                        {#if customer.balance && customer.balance.length > 0}
                            {customer.balance[0].value} {customer.balance[0].currency}
                        {:else}
                            0 CZK
                        {/if}
                    </span> -->
                </div>
            {:else}
                <div class="customer-info error">
                    <span>Žádný zákazník není vybrán!</span>
                </div>
            {/if}
            <div class="sum">
                <span class="sum-title">Přidat na účet: </span>
                <span class="sum-value">{formatDecimal(sum)} Kč</span>
            </div>
            <hr>
            <div class="info">
                Tato účtenka bude přidána na účet zákazníka jako neuhrazená.
            </div>
        </div>
    </div>
</FullscreenModal>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;

    .account-payment {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 3rem;
        padding: 3rem;
    }

    .content {
        place-self: center;
        flex-grow: 1;
        width: 100%;
        max-width: 50rem;
    }

    .title {
        font-size: 4rem;
        font-weight: bold;
    }

    .customer-info {
        margin-bottom: 2rem;
        font-size: x-large;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        .customer-title {
        }
        .customer-name {
            font-size: xx-large;
            font-weight: bold;
            color: vars.$accent-color;
        }
        .customer-balance {
            color: vars.$accent-color;
            font-weight: bold;
        }
        .customer-email {
            color: vars.$text2-color;
            font-size: large;
        }
        &.error {
            color: vars.$red;
            font-weight: bold;
        }
    }

    .sum {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        font-size: xx-large;
    }

    .sum-title {
        font-size: xx-large;
    }

    .sum-value {
        font-weight: bold;
        font-family: 'Roboto Mono', monospace;
    }

    .info {
        margin-top: 2rem;
        font-size: large;
        color: vars.$text2-color;
    }

    hr {
        border-color: vars.$second-accent-color;
    }
</style>