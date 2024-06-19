<script lang="ts">
    import type { IShoppingCart } from "$lib/shared/interfaces/shopping-cart";
    import Decimal from "decimal.js";
    import FullscreenModal from "./FullscreenModal.svelte";
    import { formatDecimal } from "$lib/shared/utils";

    export let cart: IShoppingCart;

    const sum = new Decimal(cart.total["CZK"].value);
    const payed = cart.checkout.payedAmount;
    const returnAmount = payed.sub(sum);

    export let onConfirm: () => void;

    function cancel() {
        cart.state = "checkout";
        cart.checkout.payedAmount = new Decimal(0);
    }
</script>

<FullscreenModal showModal={true} onCancel={cancel} onConfirm={onConfirm}>
    <div class="cash-payment">
    <span class="title">Platba v hotovosti</span>
            <div class="content">
                <div class="sum">
                    <span class="sum-title">Celkem: </span>
                    <span class="sum-value">{formatDecimal(sum)} Kč</span>
                </div>
                <hr>
                {#if payed.gt(0)}
                    <div class="payed">
                        <span class="sum-title">Zaplaceno: </span>
                        <span class="sum-value">{formatDecimal(payed)} Kč</span>
                    </div>
                    <hr>
                    <div class="return">
                        <span class="sum-title">Vrátit: </span>
                        <span class="sum-value">{formatDecimal(returnAmount)} Kč</span>
                    </div>
                    <hr>
                {/if}
            </div>
    </div>
</FullscreenModal>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;

    .cash-payment {
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
        font-size: 5rem;
        font-weight: bold;
    }

    .sum, .payed, .return {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        font-size: xx-large;
    }

    .return {
        color: vars.$accent-color;
        font-size: 3rem;
        font-weight: bold;
    }

    .sum-title {
        font-size: xx-large;
    }

    .sum-value {
        font-weight: bold;
        font-family: 'Roboto Mono', monospace;
    }

    hr {
        border-color: vars.$second-accent-color;
    }
</style>
