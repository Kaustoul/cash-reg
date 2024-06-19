<script lang="ts">
    import type { IShoppingCart } from "$lib/shared/interfaces/shopping-cart";
    import Decimal from "decimal.js";
    import QrCode from "../QRCode.svelte";
    import FullscreenModal from "./FullscreenModal.svelte";
    import { formatDecimal } from "$lib/shared/utils";

    export let cart: IShoppingCart;
    export let onConfirm: () => void;

    function cancel() {
        cart.state = "checkout";
        cart.checkout.payedAmount = new Decimal(0);
    }
</script>

<FullscreenModal showModal={true} onCancel={cancel} onConfirm={onConfirm}>
    <div class="qr-payment">
        <div class="left">
            <div class="header">
                <span class="title">QR Platba</span>
                <span class="subtitle">Načtěte QR kód v aplikaci Vaší banky</span>
            </div>
            <div>
                <div class="sum">
                    <span class="sum-title">Částka: </span>
                    <span class="sum-value">{formatDecimal(new Decimal(cart.total["CZK"].value))} Kč</span>
                </div>
                <hr>
            </div>
            <div class="spacer" />
        </div>
        <QrCode sum={formatDecimal(new Decimal(cart.total["CZK"].value))}/>

    </div>
</FullscreenModal>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;

    .container {

    }

    .qr-payment {
    
        display: flex;

        justify-content: space-between;
        gap: 3rem;
        padding: 3rem;

    }

    .left {
        flex-grow: 1;
        max-width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 1rem;
    }

    .title {
        font-size: 5rem;
        font-weight: bold;
    }

    .subtitle {
        font-size: x-large;
        color: vars.$text2-color;
    }

    .header {
        display: flex;
        flex-direction: column;
    }

    .sum {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }

    .sum-title {
        font-size: xx-large;
        font-weight: bold;
    }

    .sum-value {
        font-size: 3rem;
        color: vars.$accent-color;
        font-weight: bold;
        font-family: 'Roboto Mono', monospace;
    }

    hr {
        border-color: vars.$second-accent-color;
    }
</style>

